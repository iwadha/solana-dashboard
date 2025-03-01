require('dotenv').config();
const dataService = require('./src/services/dataService');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function testDashboardData() {
  console.log('===== TESTING DASHBOARD DATA =====');
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
    console.log('Wallet data:');
    console.log('- Address:', dashboardResult.data.wallet.wallet_address);
    console.log('- SOL balance:', dashboardResult.data.wallet.sol_balance);
    
    // Output position information
    console.log('\nPosition data:');
    console.log('- Total positions:', dashboardResult.data.positions.length);
    
    // Output transaction information
    console.log('\nTransaction data:');
    
    console.log('- Deposits:', dashboardResult.data.transactions.deposits.length);
    if (dashboardResult.data.transactions.deposits.length > 0) {
      console.log('  First deposit:', {
        pool: dashboardResult.data.transactions.deposits[0].pool_address.substring(0, 8) + '...',
        position_id: dashboardResult.data.transactions.deposits[0].position_id.substring(0, 8) + '...',
        tx_hash: dashboardResult.data.transactions.deposits[0].tx_hash
      });
    }
    
    console.log('- Withdrawals:', dashboardResult.data.transactions.withdrawals.length);
    if (dashboardResult.data.transactions.withdrawals.length > 0) {
      console.log('  First withdrawal:', {
        pool: dashboardResult.data.transactions.withdrawals[0].pool_address.substring(0, 8) + '...',
        position_id: dashboardResult.data.transactions.withdrawals[0].position_id.substring(0, 8) + '...',
        tx_hash: dashboardResult.data.transactions.withdrawals[0].tx_hash
      });
    }
    
    console.log('- Fee claims:', dashboardResult.data.transactions.feeClaims.length);
    if (dashboardResult.data.transactions.feeClaims.length > 0) {
      console.log('  First fee claim:', {
        pool: dashboardResult.data.transactions.feeClaims[0].pool_address.substring(0, 8) + '...',
        position_id: dashboardResult.data.transactions.feeClaims[0].position_id.substring(0, 8) + '...',
        token_x: dashboardResult.data.transactions.feeClaims[0].token_x_amount,
        token_y: dashboardResult.data.transactions.feeClaims[0].token_y_amount,
        tx_hash: dashboardResult.data.transactions.feeClaims[0].tx_hash
      });
    }
    
    console.log('- Reward claims:', dashboardResult.data.transactions.rewardClaims.length);
    if (dashboardResult.data.transactions.rewardClaims.length > 0) {
      console.log('  First reward claim:', {
        pool: dashboardResult.data.transactions.rewardClaims[0].pool_address.substring(0, 8) + '...',
        position_id: dashboardResult.data.transactions.rewardClaims[0].position_id.substring(0, 8) + '...',
        tx_hash: dashboardResult.data.transactions.rewardClaims[0].tx_hash
      });
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testDashboardData();