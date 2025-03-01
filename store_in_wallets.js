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

async function storeInWalletsTable() {
  console.log('===== STORING POSITION DATA IN EXISTING WALLETS TABLE =====');
  console.log(`Testing with wallet address: ${testWallet}`);
  
  try {
    // Step 1: Verify the wallets table exists and has the right columns
    console.log('\n----- STEP 1: Checking wallets table -----');
    
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (walletError) {
      console.error('Error accessing wallets table:', walletError.message);
      return;
    }
    
    if (!walletData || walletData.length === 0) {
      console.log('No wallet record found for address:', testWallet);
      console.log('Creating a new wallet record...');
      
      const { error: insertError } = await supabase
        .from('wallets')
        .insert([{
          wallet_address: testWallet,
          sol_balance: 0,
          token_balances: [],
          liquidity_positions: []
        }]);
        
      if (insertError) {
        console.error('Error creating wallet record:', insertError.message);
        return;
      }
      
      console.log('Successfully created wallet record');
    } else {
      console.log('Found existing wallet record:');
      console.log(walletData[0]);
    }
    
    // Step 2: Fetch positions data
    console.log('\n----- STEP 2: Fetching positions data -----');
    
    const positionsResult = await liquidityService.getUserPositions(testWallet);
    
    if (!positionsResult.success) {
      console.error('Failed to fetch positions:', positionsResult.error);
      return;
    }
    
    const positions = positionsResult.data.positions || [];
    console.log(`Fetched ${positions.length} positions`);
    
    // Step 3: Update wallet record with positions data
    console.log('\n----- STEP 3: Updating wallet record with positions data -----');
    
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        liquidity_positions: positions,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', testWallet);
      
    if (updateError) {
      console.error('Error updating wallet record:', updateError.message);
    } else {
      console.log('Successfully updated wallet record with positions data');
    }
    
    // Step 4: Verify the updated record
    console.log('\n----- STEP 4: Verifying updated record -----');
    
    const { data: updatedData, error: queryError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (queryError) {
      console.error('Error querying updated wallet record:', queryError.message);
    } else if (updatedData && updatedData.length > 0) {
      console.log('Successfully verified updated wallet record:');
      console.log(`Wallet address: ${updatedData[0].wallet_address}`);
      console.log(`Positions count: ${(updatedData[0].liquidity_positions || []).length}`);
      
      if ((updatedData[0].liquidity_positions || []).length > 0) {
        console.log('First position:');
        console.log(updatedData[0].liquidity_positions[0]);
      }
    } else {
      console.log('No updated wallet record found');
    }
    
    console.log('\n===== TEST COMPLETED =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

storeInWalletsTable();