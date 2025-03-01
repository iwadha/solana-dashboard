require('dotenv').config();
const dataService = require('./src/services/dataService');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function testUpdatedAPI() {
  console.log('===== TESTING UPDATED API =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch and store wallet data
    console.log('\n----- STEP 1: Fetching and storing wallet data -----');
    const walletResult = await dataService.fetchAndStoreWalletData(testWallet);
    
    if (!walletResult.success) {
      console.error('Error fetching wallet data:', walletResult.error);
      return;
    }
    
    console.log('Successfully stored wallet data:');
    console.log('Wallet address:', walletResult.data[0].wallet_address);
    console.log('SOL balance:', walletResult.data[0].sol_balance);
    console.log('Token balances count:', (walletResult.data[0].token_balances || []).length);
    
    // Step 2: Fetch and store position data
    console.log('\n----- STEP 2: Fetching and storing position data -----');
    const positionResult = await dataService.fetchAndStorePositionData(testWallet);
    
    if (!positionResult.success) {
      console.error('Error fetching position data:', positionResult.error);
      return;
    }
    
    console.log('Successfully stored position data:');
    console.log('Positions count:', positionResult.data.positions.length);
    
    if (positionResult.data.positions.length > 0) {
      console.log('First position:');
      console.log('- Lower bin:', positionResult.data.positions[0].lowerBinId);
      console.log('- Upper bin:', positionResult.data.positions[0].upperBinId);
      console.log('- LB pair:', positionResult.data.positions[0].lbPair);
    }
    
    // Step 3: Get dashboard data to verify storage
    console.log('\n----- STEP 3: Verifying dashboard data -----');
    const dashboardResult = await dataService.getWalletDashboardData(testWallet);
    
    if (!dashboardResult.success) {
      console.error('Error getting dashboard data:', dashboardResult.error);
      return;
    }
    
    console.log('Dashboard data retrieved successfully:');
    console.log('Wallet SOL balance:', dashboardResult.data.wallet.sol_balance);
    console.log('Positions count:', dashboardResult.data.positions.length);
    
    if (dashboardResult.data.wallet.liquidity_positions) {
      console.log('Liquidity positions in wallet table:', dashboardResult.data.wallet.liquidity_positions.length);
    } else {
      console.log('No liquidity positions found in wallet table');
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testUpdatedAPI();