require('dotenv').config();
const dataService = require('./src/services/dataService');
const walletRepository = require('./src/database/walletRepository');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function testAllData() {
  console.log('===== TESTING COMPLETE DATA FLOW WITH UPDATED SCHEMA =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch wallet and position data
    console.log('\n----- STEP 1: Fetching Basic Wallet and Position Data -----');
    const walletResult = await dataService.fetchAndStoreWalletData(testWallet);
    if (!walletResult.success) {
      console.error('Error fetching wallet data:', walletResult.error);
      return;
    }
    
    const positionResult = await dataService.fetchAndStorePositionData(testWallet);
    if (!positionResult.success) {
      console.error('Error fetching position data:', positionResult.error);
      return;
    }
    
    console.log('Successfully fetched wallet and position data');
    console.log('Positions count:', positionResult.data.positions.length);
    
    // Step 2: Fetch transaction data
    console.log('\n----- STEP 2: Fetching Transaction Data -----');
    
    // Fetch deposits
    const depositResult = await dataService.fetchAndStoreUserDeposits(testWallet);
    if (!depositResult.success) {
      console.error('Error fetching deposit data:', depositResult.error);
      return;
    }
    console.log('Deposits:', depositResult.data.deposits.length);
    
    // Fetch withdrawals
    const withdrawalResult = await dataService.fetchAndStoreUserWithdrawals(testWallet);
    if (!withdrawalResult.success) {
      console.error('Error fetching withdrawal data:', withdrawalResult.error);
      return;
    }
    console.log('Withdrawals:', withdrawalResult.data.withdrawals.length);
    
    // Fetch fee claims
    const claimResult = await dataService.fetchAndStoreUserClaims(testWallet);
    if (!claimResult.success) {
      console.error('Error fetching fee claim data:', claimResult.error);
      return;
    }
    console.log('Fee claims:', claimResult.data.claims.length);
    
    // Fetch reward claims
    const rewardResult = await dataService.fetchAndStoreUserRewardClaims(testWallet);
    if (!rewardResult.success) {
      console.error('Error fetching reward claim data:', rewardResult.error);
      return;
    }
    console.log('Reward claims:', rewardResult.data.rewards.length);
    
    // Step 3: Verify data in wallet record
    console.log('\n----- STEP 3: Verifying Wallet Record -----');
    const walletData = await walletRepository.getWalletData(testWallet);
    if (!walletData.success || !walletData.data) {
      console.error('Error fetching wallet data from repository');
      return;
    }
    
    const wallet = walletData.data;
    console.log('Wallet record contains:');
    console.log('- Liquidity positions:', (wallet.liquidity_positions || []).length);
    
    // Check lp_positions
    console.log('- lp_positions fields:', Object.keys(wallet.lp_positions || {}).join(', '));
    console.log('  - Positions in lp_positions.data:', (wallet.lp_positions?.data || []).length);
    console.log('  - Deposits in lp_positions.deposits:', (wallet.lp_positions?.deposits || []).length);
    console.log('  - Withdrawals in lp_positions.withdrawals:', (wallet.lp_positions?.withdrawals || []).length);
    console.log('  - Fee claims in lp_positions.fee_claims:', (wallet.lp_positions?.fee_claims || []).length);
    console.log('  - Reward claims in lp_positions.reward_claims:', (wallet.lp_positions?.reward_claims || []).length);
    
    // Step 4: Test dashboard data
    console.log('\n----- STEP 4: Testing Dashboard Data -----');
    const dashboardResult = await dataService.getWalletDashboardData(testWallet);
    
    if (!dashboardResult.success) {
      console.error('Error fetching dashboard data:', dashboardResult.error);
      return;
    }
    
    console.log('Dashboard data contains:');
    console.log('- Wallet address:', dashboardResult.data.wallet.wallet_address);
    console.log('- SOL balance:', dashboardResult.data.wallet.sol_balance);
    console.log('- Positions:', dashboardResult.data.positions.length);
    console.log('- Deposits:', dashboardResult.data.transactions.deposits.length);
    console.log('- Withdrawals:', dashboardResult.data.transactions.withdrawals.length);
    console.log('- Fee claims:', dashboardResult.data.transactions.feeClaims.length);
    console.log('- Reward claims:', dashboardResult.data.transactions.rewardClaims.length);
    
    // Display sample transaction data if available
    if (dashboardResult.data.transactions.deposits.length > 0) {
      console.log('\nSample deposit:');
      const sampleDeposit = dashboardResult.data.transactions.deposits[0];
      console.log(`- Pool: ${sampleDeposit.pool_address.substring(0, 10)}...`);
      console.log(`- Position ID: ${sampleDeposit.position_id.substring(0, 10)}...`);
      console.log(`- Transaction hash: ${sampleDeposit.tx_hash}`);
    }
    
    if (dashboardResult.data.transactions.feeClaims.length > 0) {
      console.log('\nSample fee claim:');
      const sampleClaim = dashboardResult.data.transactions.feeClaims[0];
      console.log(`- Pool: ${sampleClaim.pool_address.substring(0, 10)}...`);
      console.log(`- Position ID: ${sampleClaim.position_id.substring(0, 10)}...`);
      console.log(`- Token X amount: ${sampleClaim.token_x_amount}`);
      console.log(`- Token Y amount: ${sampleClaim.token_y_amount}`);
      console.log(`- Transaction hash: ${sampleClaim.tx_hash}`);
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testAllData();