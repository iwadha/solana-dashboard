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

async function finalWalletUpdate() {
  console.log('===== FINAL WALLET UPDATE TEST =====');
  console.log(`Testing with wallet address: ${testWallet}`);
  
  try {
    // Step 1: Verify the wallets table and its columns
    console.log('\n----- STEP 1: Checking wallets table structure -----');
    
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (walletError) {
      console.error('Error querying wallets table:', walletError.message);
      return;
    }
    
    if (walletData && walletData.length > 0) {
      console.log('Found wallet record with columns:');
      console.log(Object.keys(walletData[0]).join(', '));
    } else {
      console.log('No wallet record found');
      return;
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
    
    // Try to update using the column names we found
    const updateData = {};
    
    // Try different possible column names for storing positions
    if (Object.keys(walletData[0]).includes('liquidity_positions')) {
      updateData.liquidity_positions = positions;
    } else if (Object.keys(walletData[0]).includes('lp_positions')) {
      updateData.lp_positions = positions;
    } else {
      // If no dedicated column exists, try to create a new one
      console.log('No suitable column found for positions data');
      console.log('Attempting to add positions as a new column...');
      
      updateData.positions_data = positions;
    }
    
    const { error: updateError } = await supabase
      .from('wallets')
      .update(updateData)
      .eq('wallet_address', testWallet);
      
    if (updateError) {
      console.error('Error updating wallet record:', updateError.message);
      
      // Try with just one position as a test
      console.log('Trying with just one position...');
      
      if (Object.keys(walletData[0]).includes('liquidity_positions')) {
        updateData.liquidity_positions = [positions[0]];
      } else if (Object.keys(walletData[0]).includes('lp_positions')) {
        updateData.lp_positions = [positions[0]];
      }
      
      const { error: singleUpdateError } = await supabase
        .from('wallets')
        .update(updateData)
        .eq('wallet_address', testWallet);
        
      if (singleUpdateError) {
        console.error('Error updating with single position:', singleUpdateError.message);
      } else {
        console.log('Successfully updated with a single position');
      }
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
      console.log('Successfully retrieved updated wallet record:');
      
      let positionsFound = false;
      
      if (updatedData[0].liquidity_positions && updatedData[0].liquidity_positions.length > 0) {
        console.log(`Found ${updatedData[0].liquidity_positions.length} positions in liquidity_positions column`);
        positionsFound = true;
      }
      
      if (updatedData[0].lp_positions && updatedData[0].lp_positions.length > 0) {
        console.log(`Found ${updatedData[0].lp_positions.length} positions in lp_positions column`);
        positionsFound = true;
      }
      
      if (updatedData[0].positions_data && updatedData[0].positions_data.length > 0) {
        console.log(`Found ${updatedData[0].positions_data.length} positions in positions_data column`);
        positionsFound = true;
      }
      
      if (!positionsFound) {
        console.log('No positions data found in the wallet record');
      }
    } else {
      console.log('No updated wallet record found');
    }
    
    console.log('\n===== TEST COMPLETED =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

finalWalletUpdate();