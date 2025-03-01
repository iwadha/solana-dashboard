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

async function runFinalTest() {
  console.log('===== FINAL TEST: STORING FETCHED DATA IN SUPABASE =====');
  console.log(`Testing with wallet address: ${testWallet}`);
  
  try {
    // Step 1: Get position data using GraphQL
    console.log('\n----- STEP 1: Fetching position data using GraphQL -----');
    const positionsResult = await liquidityService.getUserPositions(testWallet);
    
    if (!positionsResult.success) {
      console.error('Failed to fetch position data:', positionsResult.error);
      return;
    }
    
    const positions = positionsResult.data.positions || [];
    console.log(`Fetched ${positions.length} positions for wallet ${testWallet}`);
    
    if (positions.length > 0) {
      console.log('Sample position data:');
      console.log(JSON.stringify(positions[0], null, 2));
    }
    
    // Step 2: Store positions in Supabase with custom schema mapping
    console.log('\n----- STEP 2: Storing positions with schema mapping -----');
    
    // Get unique pools from positions
    const uniquePools = [...new Set(positions.map(p => p.lbPair))];
    console.log(`Found ${uniquePools.length} unique pools`);
    
    // Store each pool
    for (const poolAddress of uniquePools) {
      const poolData = {
        pool_address: poolAddress,
        token_x: 'unknown', // We don't have this info in the position data
        token_y: 'unknown', // We don't have this info in the position data
        token_x_symbol: '', 
        token_y_symbol: '',
        bin_step: 0
      };
      
      // Try to get more details about this pool
      const lbPairResult = await liquidityService.getLbPairDetails(poolAddress);
      if (lbPairResult.success && lbPairResult.data.lbPair) {
        const lbPair = lbPairResult.data.lbPair;
        poolData.token_x = lbPair.tokenXMint;
        poolData.token_y = lbPair.tokenYMint;
        poolData.bin_step = lbPair.binStep || 0;
      }
      
      console.log(`Storing pool: ${poolAddress}`);
      const { error: poolError } = await supabase
        .from('pools')
        .upsert([poolData], { onConflict: 'pool_address' });
        
      if (poolError) {
        console.error(`Error storing pool ${poolAddress}:`, poolError.message);
      }
    }
    
    // Now let's create a simple custom table to store position data
    console.log('\n----- STEP 3: Creating and using a custom table for positions -----');
    
    // First check if the table exists
    const { data: existingTable, error: tableError } = await supabase
      .from('positions_custom')
      .select('*')
      .limit(1);
      
    let tableExists = !tableError;
    
    if (!tableExists) {
      console.log('Creating new positions_custom table...');
      
      // Try to create the table with an initial row
      const initialPosition = {
        id: 1,
        wallet: testWallet,
        pool: positions[0]?.lbPair || 'unknown',
        position_data: positions[0] || {},
        created_at: new Date().toISOString()
      };
      
      const { error: createError } = await supabase
        .from('positions_custom')
        .insert([initialPosition]);
        
      if (createError) {
        console.error('Failed to create positions_custom table:', createError.message);
        return;
      }
      
      console.log('Successfully created positions_custom table');
    } else {
      console.log('positions_custom table already exists');
    }
    
    // Now store all positions in the custom table
    let successCount = 0;
    
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      
      const positionRecord = {
        wallet: testWallet,
        pool: position.lbPair,
        position_data: position,
        created_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('positions_custom')
        .insert([positionRecord]);
        
      if (insertError) {
        console.error(`Error storing position ${i}:`, insertError.message);
      } else {
        successCount++;
      }
    }
    
    console.log(`Successfully stored ${successCount} of ${positions.length} positions in positions_custom table`);
    
    // Step 4: Verify the data
    console.log('\n----- STEP 4: Verifying stored data -----');
    
    const { data: storedPositions, error: queryError } = await supabase
      .from('positions_custom')
      .select('*')
      .eq('wallet', testWallet);
      
    if (queryError) {
      console.error('Error querying positions_custom table:', queryError.message);
    } else {
      console.log(`Found ${storedPositions.length} positions in the database for wallet ${testWallet}`);
      
      if (storedPositions.length > 0) {
        console.log('Sample stored position:');
        console.log(JSON.stringify(storedPositions[0], null, 2));
      }
    }
    
    console.log('\n===== TEST COMPLETED =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runFinalTest();