const dataService = require('./src/services/dataService');
const config = require('./src/config');
const supabase = require('./src/database/supabaseClient');

// Test address from config
const testWallet = config.TEST_WALLETS[0];

// Custom function to store positions in the new table
async function storePositionData(position) {
  try {
    // Create a properly formatted record for the new table structure
    const record = {
      wallet_address: position.wallet_address,
      pool_address: position.pool_address,
      position_id: position.position_id,
      lower_bin: position.lower_bin,
      upper_bin: position.upper_bin,
      liquidity: position.liquidity,
      token_x_amount: position.token_x_amount,
      token_y_amount: position.token_y_amount,
      created_at: new Date().toISOString()
    };
    
    // Insert into the new table
    const { data, error } = await supabase
      .from('user_positions_new')
      .insert([record])
      .select();
      
    if (error) {
      console.error('Error storing position data:', error);
      return false;
    }
    
    console.log('Successfully stored position:', position.position_id);
    return true;
  } catch (error) {
    console.error('Error in storePositionData:', error);
    return false;
  }
}

// Custom function to store deposits in the new table
async function storeDepositData(deposit) {
  try {
    // Create a properly formatted record for the new table structure
    const record = {
      wallet_address: deposit.wallet_address,
      pool_address: deposit.pool_address,
      position_id: deposit.position_id,
      transaction_hash: deposit.transaction_hash,
      token_x_amount: deposit.token_x_amount,
      token_y_amount: deposit.token_y_amount,
      timestamp: deposit.timestamp || new Date().toISOString()
    };
    
    // Insert into the new table
    const { data, error } = await supabase
      .from('user_deposits_new')
      .insert([record])
      .select();
      
    if (error) {
      console.error('Error storing deposit data:', error);
      return false;
    }
    
    console.log('Successfully stored deposit:', deposit.transaction_hash);
    return true;
  } catch (error) {
    console.error('Error in storeDepositData:', error);
    return false;
  }
}

async function runTest() {
  console.log('===== TESTING SHYFT DATA FETCH AND SUPABASE STORAGE =====');
  console.log(`Testing with wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch wallet data
    console.log('\n----- STEP 1: Fetching wallet data -----');
    const walletResult = await dataService.fetchAndStoreWalletData(testWallet);
    
    if (walletResult.success) {
      console.log('✅ Successfully fetched and stored wallet data');
    } else {
      console.error('❌ Failed to fetch and store wallet data:', walletResult.error);
    }
    
    // Step 2: Fetch position data
    console.log('\n----- STEP 2: Fetching position data -----');
    const positionResult = await dataService.fetchAndStorePositionData(testWallet);
    
    if (positionResult.success) {
      console.log('✅ Successfully fetched position data');
      console.log(`Positions found: ${positionResult.data.positions.length}`);
      
      // Store positions in the new table
      console.log('Storing positions in new table format...');
      let successCount = 0;
      
      for (const position of positionResult.data.positions) {
        // Format position data for our new table
        const formattedPosition = {
          wallet_address: testWallet,
          pool_address: position.lbPair,
          position_id: position.pubkey || position.id || `${position.lbPair}-${position.lowerBinId}-${position.upperBinId}`,
          lower_bin: position.lowerBinId,
          upper_bin: position.upperBinId,
          liquidity: position.liquidityShares || "0",
          token_x_amount: "0", // May not be available directly
          token_y_amount: "0"  // May not be available directly
        };
        
        const success = await storePositionData(formattedPosition);
        if (success) successCount++;
      }
      
      console.log(`Successfully stored ${successCount} of ${positionResult.data.positions.length} positions`);
    } else {
      console.error('❌ Failed to fetch position data:', positionResult.error);
    }
    
    // Step 3: Fetch deposits
    console.log('\n----- STEP 3: Fetching deposits -----');
    const depositsResult = await dataService.fetchAndStoreUserDeposits(testWallet);
    
    if (depositsResult.success) {
      console.log('✅ Successfully fetched deposits');
      console.log(`Deposits found: ${depositsResult.data.deposits.length}`);
      
      // Store deposits in the new table
      console.log('Storing deposits in new table format...');
      let successCount = 0;
      
      for (const deposit of depositsResult.data.deposits) {
        const success = await storeDepositData({
          wallet_address: testWallet,
          pool_address: deposit.pool_address,
          position_id: deposit.position_id,
          transaction_hash: deposit.tx_hash,
          token_x_amount: deposit.token_x_amount,
          token_y_amount: deposit.token_y_amount,
          timestamp: deposit.timestamp || new Date().toISOString()
        });
        
        if (success) successCount++;
      }
      
      console.log(`Successfully stored ${successCount} of ${depositsResult.data.deposits.length} deposits`);
    } else {
      console.error('❌ Failed to fetch deposits:', depositsResult.error);
    }
    
    // Step 4: Verify data in database
    console.log('\n----- STEP 4: Verifying stored data in Supabase -----');
    
    // Check wallets table
    const { data: walletsData, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet);
      
    if (walletsError) {
      console.error('Error querying wallets table:', walletsError);
    } else {
      console.log(`Wallets table records for test address: ${walletsData?.length || 0}`);
    }
    
    // Check positions table
    const { data: positionsData, error: positionsError } = await supabase
      .from('user_positions_new')
      .select('*')
      .eq('wallet_address', testWallet);
      
    if (positionsError) {
      console.error('Error querying user_positions_new table:', positionsError);
    } else {
      console.log(`User positions table records for test address: ${positionsData?.length || 0}`);
      
      if (positionsData && positionsData.length > 0) {
        console.log('Sample position:', JSON.stringify(positionsData[0], null, 2));
      }
    }
    
    // Check deposits table
    const { data: depositsData, error: depositsError } = await supabase
      .from('user_deposits_new')
      .select('*')
      .eq('wallet_address', testWallet);
      
    if (depositsError) {
      console.error('Error querying user_deposits_new table:', depositsError);
    } else {
      console.log(`User deposits table records for test address: ${depositsData?.length || 0}`);
      
      if (depositsData && depositsData.length > 0) {
        console.log('Sample deposit:', JSON.stringify(depositsData[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run test
runTest()
  .then(() => {
    console.log('\n===== TEST COMPLETED =====');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });