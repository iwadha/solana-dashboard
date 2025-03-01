require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const config = require('./src/config');
const liquidityService = require('./src/api/shyft/liquidityService');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test address from config
const testWallet = config.TEST_WALLETS[0];

async function runSimpleTest() {
  console.log('===== TESTING WITH SIMPLE TABLE STRUCTURE =====');
  console.log(`Testing with wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch positions data
    console.log('\n----- STEP 1: Fetching positions using GraphQL -----');
    const positionsResult = await liquidityService.getUserPositions(testWallet);
    
    if (!positionsResult.success) {
      console.error('Failed to fetch positions:', positionsResult.error);
      return;
    }
    
    const positions = positionsResult.data.positions || [];
    console.log(`Fetched ${positions.length} positions`);
    
    // Step 2: Create a very simple table for positions JSON data
    console.log('\n----- STEP 2: Creating simple position_data table -----');
    
    // First check if simple_positions table exists
    const { error: tableCheckError } = await supabase
      .from('simple_positions')
      .select('count(*)', { count: 'exact', head: true });
      
    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      console.log('simple_positions table does not exist, creating it...');
      
      // Create a minimal record for our first insert
      const initialRecord = {
        wallet_address: 'test_wallet',
        data: { test: true }
      };
      
      const { error: createError } = await supabase
        .from('simple_positions')
        .insert([initialRecord]);
        
      if (createError) {
        console.error('Failed to create simple_positions table:', createError.message);
        return;
      }
      
      console.log('Successfully created simple_positions table');
    } else {
      console.log('simple_positions table already exists');
    }
    
    // Step 3: Store positions as JSON
    console.log('\n----- STEP 3: Storing positions as JSON data -----');
    
    // First clear existing data for this wallet
    const { error: deleteError } = await supabase
      .from('simple_positions')
      .delete()
      .eq('wallet_address', testWallet);
      
    if (deleteError) {
      console.error('Error clearing existing positions:', deleteError.message);
    } else {
      console.log(`Cleared existing positions for ${testWallet}`);
    }
    
    // Store all positions in a single record
    const record = {
      wallet_address: testWallet,
      data: {
        positions: positions,
        count: positions.length,
        timestamp: new Date().toISOString()
      }
    };
    
    const { error: insertError } = await supabase
      .from('simple_positions')
      .insert([record]);
      
    if (insertError) {
      console.error('Error storing positions data:', insertError.message);
    } else {
      console.log(`Successfully stored ${positions.length} positions for ${testWallet}`);
    }
    
    // Step 4: Verify stored data
    console.log('\n----- STEP 4: Verifying stored data -----');
    
    const { data: storedData, error: queryError } = await supabase
      .from('simple_positions')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (queryError) {
      console.error('Error querying stored data:', queryError.message);
    } else if (storedData && storedData.length > 0) {
      console.log('Successfully retrieved stored data:');
      console.log(`Positions count: ${storedData[0].data.count}`);
      console.log(`First position ID: ${storedData[0].data.positions[0].pubkey}`);
    } else {
      console.log('No data found for wallet:', testWallet);
    }
    
    console.log('\n===== TEST COMPLETED =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runSimpleTest();