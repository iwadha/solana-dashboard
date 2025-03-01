require('dotenv').config();
const dataService = require('./src/services/dataService');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function testDashboardData() {
  console.log('===== TESTING DASHBOARD DATA WITH TRANSACTIONS =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Get dashboard data
    console.log('\n----- Fetching Dashboard Data -----');
    const dashboardResult = await dataService.getWalletDashboardData(testWallet);
    
    if (!dashboardResult.success) {
      console.error('Error fetching dashboard data:', dashboardResult.error);
      return;
    }
    
    // Output wallet information
    console.log('\nWallet data:');
    console.log('- Address:', dashboardResult.data.wallet.wallet_address);
    console.log('- SOL balance:', dashboardResult.data.wallet.sol_balance);
    
    // Output position information
    console.log('\nPosition data:');
    console.log('- Total positions:', dashboardResult.data.positions.length);
    
    if (dashboardResult.data.positions.length > 0) {
      const samplePosition = dashboardResult.data.positions[0];
      console.log('\nSample position:');
      console.log('- Pool address:', samplePosition.lbPair);
      console.log('- Position ID:', samplePosition.pubkey);
      console.log('- Lower bin:', samplePosition.lowerBinId);
      console.log('- Upper bin:', samplePosition.upperBinId);
      if (samplePosition.totalClaimedFeeXAmount > 0 || samplePosition.totalClaimedFeeYAmount > 0) {
        console.log('- Claimed fees X:', samplePosition.totalClaimedFeeXAmount);
        console.log('- Claimed fees Y:', samplePosition.totalClaimedFeeYAmount);
      }
    }
    
    // Output transaction information
    console.log('\nTransaction data:');
    
    // Deposits
    console.log('\nDeposits:', dashboardResult.data.transactions.deposits.length);
    if (dashboardResult.data.transactions.deposits.length > 0) {
      const sampleDeposit = dashboardResult.data.transactions.deposits[0];
      console.log('Sample deposit:');
      console.log('- Pool:', sampleDeposit.pool_address);
      console.log('- Position ID:', sampleDeposit.position_id);
      console.log('- Transaction hash:', sampleDeposit.tx_hash);
      console.log('- Token X amount:', sampleDeposit.token_x_amount);
      console.log('- Token Y amount:', sampleDeposit.token_y_amount);
    }
    
    // Fee claims
    console.log('\nFee claims:', dashboardResult.data.transactions.feeClaims.length);
    if (dashboardResult.data.transactions.feeClaims.length > 0) {
      const sampleClaim = dashboardResult.data.transactions.feeClaims[0];
      console.log('Sample fee claim:');
      console.log('- Pool:', sampleClaim.pool_address);
      console.log('- Position ID:', sampleClaim.position_id);
      console.log('- Transaction hash:', sampleClaim.tx_hash);
      console.log('- Token X amount:', sampleClaim.token_x_amount);
      console.log('- Token Y amount:', sampleClaim.token_y_amount);
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testDashboardData();