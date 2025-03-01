require('dotenv').config();
const dataService = require('./src/services/dataService');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function testTransactionsData() {
  console.log('===== TESTING TRANSACTIONS DATA =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch and store positions first (needed for context)
    console.log('\n----- STEP 1: Fetching and storing positions -----');
    const positionResult = await dataService.fetchAndStorePositionData(testWallet);
    
    if (!positionResult.success) {
      console.error('Error fetching position data:', positionResult.error);
      return;
    }
    
    console.log('Successfully stored position data:');
    console.log('Positions count:', positionResult.data.positions.length);
    
    // Step 2: Fetch and store deposit data
    console.log('\n----- STEP 2: Fetching and storing deposit data -----');
    const depositResult = await dataService.fetchAndStoreUserDeposits(testWallet);
    
    if (!depositResult.success) {
      console.error('Error fetching deposit data:', depositResult.error);
      return;
    }
    
    console.log('Successfully stored deposit data:');
    console.log('Deposits count:', depositResult.data.deposits.length);
    
    if (depositResult.data.deposits.length > 0) {
      const firstDeposit = depositResult.data.deposits[0];
      console.log('First deposit:');
      console.log('- Pool:', firstDeposit.pool_address);
      console.log('- Position ID:', firstDeposit.position_id);
      console.log('- Token X amount:', firstDeposit.token_x_amount);
      console.log('- Token Y amount:', firstDeposit.token_y_amount);
      console.log('- Transaction hash:', firstDeposit.tx_hash);
    }
    
    // Step 3: Fetch and store withdrawal data
    console.log('\n----- STEP 3: Fetching and storing withdrawal data -----');
    const withdrawalResult = await dataService.fetchAndStoreUserWithdrawals(testWallet);
    
    if (!withdrawalResult.success) {
      console.error('Error fetching withdrawal data:', withdrawalResult.error);
      return;
    }
    
    console.log('Successfully stored withdrawal data:');
    console.log('Withdrawals count:', withdrawalResult.data.withdrawals.length);
    
    if (withdrawalResult.data.withdrawals.length > 0) {
      const firstWithdrawal = withdrawalResult.data.withdrawals[0];
      console.log('First withdrawal:');
      console.log('- Pool:', firstWithdrawal.pool_address);
      console.log('- Position ID:', firstWithdrawal.position_id);
      console.log('- Token X amount:', firstWithdrawal.token_x_amount);
      console.log('- Token Y amount:', firstWithdrawal.token_y_amount);
      console.log('- Transaction hash:', firstWithdrawal.tx_hash);
    }
    
    // Step 4: Fetch and store fee claim data
    console.log('\n----- STEP 4: Fetching and storing fee claim data -----');
    const claimResult = await dataService.fetchAndStoreUserClaims(testWallet);
    
    if (!claimResult.success) {
      console.error('Error fetching fee claim data:', claimResult.error);
      return;
    }
    
    console.log('Successfully stored fee claim data:');
    console.log('Fee claims count:', claimResult.data.claims.length);
    
    if (claimResult.data.claims.length > 0) {
      const firstClaim = claimResult.data.claims[0];
      console.log('First fee claim:');
      console.log('- Pool:', firstClaim.pool_address);
      console.log('- Position ID:', firstClaim.position_id);
      console.log('- Token X amount:', firstClaim.token_x_amount);
      console.log('- Token Y amount:', firstClaim.token_y_amount);
      console.log('- Transaction hash:', firstClaim.tx_hash);
    }
    
    // Step 5: Fetch and store reward claim data
    console.log('\n----- STEP 5: Fetching and storing reward claim data -----');
    const rewardResult = await dataService.fetchAndStoreUserRewardClaims(testWallet);
    
    if (!rewardResult.success) {
      console.error('Error fetching reward claim data:', rewardResult.error);
      return;
    }
    
    console.log('Successfully stored reward claim data:');
    console.log('Reward claims count:', rewardResult.data.rewards.length);
    
    if (rewardResult.data.rewards.length > 0) {
      const firstReward = rewardResult.data.rewards[0];
      console.log('First reward claim:');
      console.log('- Pool:', firstReward.pool_address);
      console.log('- Position ID:', firstReward.position_id);
      console.log('- Amounts:', JSON.stringify(firstReward.amounts));
      console.log('- Transaction hash:', firstReward.tx_hash);
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testTransactionsData();