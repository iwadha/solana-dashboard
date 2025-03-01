require('dotenv').config();
const dataService = require('./src/services/dataService');
const config = require('./src/config');

/**
 * This is a test file that simulates how the transaction history would be displayed
 * in a React frontend. In a real React app, this would be rendered with 
 * the components we created in src/components/transactions/.
 */

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

async function displayTransactionHistory() {
  console.log('===== TRANSACTION HISTORY DISPLAY SIMULATION =====');
  console.log(`Wallet address: ${testWallet}`);
  
  try {
    // Get dashboard data
    const dashboardResult = await dataService.getWalletDashboardData(testWallet);
    
    if (!dashboardResult.success) {
      console.error('Error fetching dashboard data:', dashboardResult.error);
      return;
    }
    
    const transactions = dashboardResult.data.transactions;
    
    // Display transaction summary (similar to TransactionStats component)
    console.log('\n----- TRANSACTION STATISTICS -----');
    console.log(`Deposits: ${transactions.deposits.length}`);
    console.log(`Withdrawals: ${transactions.withdrawals.length}`);
    console.log(`Fee Claims: ${transactions.feeClaims.length}`);
    console.log(`Reward Claims: ${transactions.rewardClaims.length}`);
    
    // Display transaction list (similar to TransactionHistory component)
    console.log('\n----- TRANSACTION HISTORY -----');
    
    // Combine and sort all transactions
    const allTransactions = [
      ...transactions.deposits.map(tx => ({ ...tx, type: 'deposit' })),
      ...transactions.withdrawals.map(tx => ({ ...tx, type: 'withdrawal' })),
      ...transactions.feeClaims.map(tx => ({ ...tx, type: 'fee claim' })),
      ...transactions.rewardClaims.map(tx => ({ ...tx, type: 'reward claim' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display transactions in a table format
    console.log('Type\t\tPool (first 8 chars)\tAmount\t\tTimestamp');
    console.log('----\t\t-------------------\t------\t\t---------');
    
    allTransactions.forEach(tx => {
      const poolShort = tx.pool_address ? `${tx.pool_address.substring(0, 8)}...` : 'N/A';
      
      let amount = '';
      if (tx.type === 'deposit' || tx.type === 'withdrawal' || tx.type === 'fee claim') {
        if (tx.token_x_amount) amount += `${parseFloat(tx.token_x_amount).toFixed(4)} X`;
        if (tx.token_y_amount) amount += amount ? ` + ${parseFloat(tx.token_y_amount).toFixed(4)} Y` : `${parseFloat(tx.token_y_amount).toFixed(4)} Y`;
      } else if (tx.type === 'reward claim' && tx.amounts && tx.amounts.length > 0) {
        amount = `${parseFloat(tx.amounts[0]).toFixed(4)} Reward`;
      }
      
      const date = tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'N/A';
      
      console.log(`${tx.type}\t${poolShort}\t\t${amount}\t${date}`);
    });
    
    // Display sample transaction details (similar to TransactionDetails component)
    if (allTransactions.length > 0) {
      const sampleTx = allTransactions[0];
      console.log('\n----- SAMPLE TRANSACTION DETAILS -----');
      console.log('Type:', sampleTx.type);
      console.log('Pool Address:', sampleTx.pool_address);
      console.log('Position ID:', sampleTx.position_id);
      console.log('Transaction Hash:', sampleTx.tx_hash);
      
      if (sampleTx.type === 'deposit' || sampleTx.type === 'withdrawal' || sampleTx.type === 'fee claim') {
        console.log('Token X Amount:', sampleTx.token_x_amount);
        console.log('Token Y Amount:', sampleTx.token_y_amount);
      } else if (sampleTx.type === 'reward claim' && sampleTx.amounts) {
        console.log('Reward Amounts:', sampleTx.amounts.join(', '));
      }
      
      console.log('Timestamp:', sampleTx.timestamp);
    }
    
    console.log('\n===== DISPLAY SIMULATION COMPLETED =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

displayTransactionHistory();