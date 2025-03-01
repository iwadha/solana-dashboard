require('dotenv').config();
const dataService = require('./src/services/dataService');
const walletRepository = require('./src/database/walletRepository');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function updateWalletWithTransactions() {
  console.log('===== UPDATING WALLET WITH ALL TRANSACTION DATA =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch all data
    console.log('\n----- STEP 1: Fetching All Data -----');
    
    // Fetch positions data
    const positionResult = await dataService.fetchAndStorePositionData(testWallet);
    if (!positionResult.success) {
      console.error('Error fetching position data:', positionResult.error);
      return;
    }
    const positions = positionResult.data.positions;
    console.log(`Retrieved ${positions.length} positions`);
    
    // Fetch deposit data
    const depositResult = await dataService.fetchAndStoreUserDeposits(testWallet);
    if (!depositResult.success) {
      console.error('Error fetching deposit data:', depositResult.error);
      return;
    }
    const deposits = depositResult.data.deposits;
    console.log(`Retrieved ${deposits.length} deposits`);
    
    // Fetch withdrawal data
    const withdrawalResult = await dataService.fetchAndStoreUserWithdrawals(testWallet);
    if (!withdrawalResult.success) {
      console.error('Error fetching withdrawal data:', withdrawalResult.error);
      return;
    }
    const withdrawals = withdrawalResult.data.withdrawals;
    console.log(`Retrieved ${withdrawals.length} withdrawals`);
    
    // Fetch fee claim data
    const claimResult = await dataService.fetchAndStoreUserClaims(testWallet);
    if (!claimResult.success) {
      console.error('Error fetching fee claim data:', claimResult.error);
      return;
    }
    const claims = claimResult.data.claims;
    console.log(`Retrieved ${claims.length} fee claims`);
    
    // Fetch reward claim data
    const rewardResult = await dataService.fetchAndStoreUserRewardClaims(testWallet);
    if (!rewardResult.success) {
      console.error('Error fetching reward claim data:', rewardResult.error);
      return;
    }
    const rewards = rewardResult.data.rewards;
    console.log(`Retrieved ${rewards.length} reward claims`);
    
    // Step 2: Store consolidated data
    console.log('\n----- STEP 2: Storing Consolidated Data in Wallet -----');
    
    // Get current wallet data
    const currentWalletResult = await walletRepository.getWalletData(testWallet);
    const currentWallet = currentWalletResult.success ? currentWalletResult.data : null;
    
    // Create wallet data object with all transaction data
    const walletData = {
      wallet_address: testWallet,
      sol_balance: currentWallet?.sol_balance || 0,
      token_balances: currentWallet?.token_balances || [],
      liquidity_positions: positions,
      lp_positions: {
        positions: positions,
        deposits: deposits,
        withdrawals: withdrawals,
        fee_claims: claims,
        reward_claims: rewards
      },
      updated_at: new Date().toISOString()
    };
    
    // Store the wallet data
    const storeResult = await walletRepository.storeWalletData(walletData);
    if (!storeResult.success) {
      console.error('Error storing wallet data:', storeResult.error);
      return;
    }
    
    console.log('Successfully stored all transaction data in wallet record');
    
    // Step 3: Verify the stored data
    console.log('\n----- STEP 3: Verifying Updated Wallet Data -----');
    const updatedWalletResult = await walletRepository.getWalletData(testWallet);
    if (!updatedWalletResult.success || !updatedWalletResult.data) {
      console.error('Error retrieving updated wallet data');
      return;
    }
    
    const updatedWallet = updatedWalletResult.data;
    
    console.log('Updated wallet data:');
    console.log('- Wallet address:', updatedWallet.wallet_address);
    console.log('- SOL balance:', updatedWallet.sol_balance);
    console.log('- Liquidity positions count:', (updatedWallet.liquidity_positions || []).length);
    
    // Check lp_positions data
    if (updatedWallet.lp_positions) {
      console.log('- lp_positions data present:', Object.keys(updatedWallet.lp_positions).join(', '));
      console.log('  - Positions:', (updatedWallet.lp_positions.positions || []).length);
      console.log('  - Deposits:', (updatedWallet.lp_positions.deposits || []).length);
      console.log('  - Withdrawals:', (updatedWallet.lp_positions.withdrawals || []).length);
      console.log('  - Fee claims:', (updatedWallet.lp_positions.fee_claims || []).length);
      console.log('  - Reward claims:', (updatedWallet.lp_positions.reward_claims || []).length);
    } else {
      console.log('WARNING: lp_positions data not present in updated wallet');
    }
    
    // Step 4: Test dashboard data integration
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
    
    console.log('\n===== WALLET UPDATE COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateWalletWithTransactions();