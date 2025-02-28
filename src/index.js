const dataService = require('./services/dataService');
const config = require('./config');
const { isValidSolanaAddress } = require('./utils/validator');

// Main function to fetch and store data for a test wallet
async function main() {
    // Use test wallet from config
    const walletAddress = config.TEST_WALLETS[0];
    
    if (!isValidSolanaAddress(walletAddress)) {
        console.error(`Invalid wallet address: ${walletAddress}`);
        return;
    }
    
    console.log(`\n====== Processing wallet: ${walletAddress} ======\n`);
    
    try {
        // Step 1: Fetch and store wallet data
        console.log('Fetching wallet data...');
        const walletResult = await dataService.fetchAndStoreWalletData(walletAddress);
        
        if (!walletResult.success) {
            console.error('Failed to fetch wallet data:', walletResult.error);
        } else {
            console.log('✅ Wallet data stored successfully');
        }
        
        // Step 2: Fetch and store position data
        console.log('\nFetching position data...');
        const positionResult = await dataService.fetchAndStorePositionData(walletAddress);
        
        if (!positionResult.success) {
            console.error('Failed to fetch position data:', positionResult.error);
        } else {
            console.log(`✅ Position data stored successfully (${positionResult.data.positions.length} positions)`);
        }
        
        // Step 3: Fetch and store user deposits
        console.log('\nFetching deposit data...');
        const depositResult = await dataService.fetchAndStoreUserDeposits(walletAddress);
        
        if (!depositResult.success) {
            console.error('Failed to fetch deposit data:', depositResult.error);
        } else {
            console.log(`✅ Deposit data stored successfully (${depositResult.data.deposits.length} deposits)`);
        }
        
        // Step 4: Fetch and store user withdrawals
        console.log('\nFetching withdrawal data...');
        const withdrawalResult = await dataService.fetchAndStoreUserWithdrawals(walletAddress);
        
        if (!withdrawalResult.success) {
            console.error('Failed to fetch withdrawal data:', withdrawalResult.error);
        } else {
            console.log(`✅ Withdrawal data stored successfully (${withdrawalResult.data.withdrawals.length} withdrawals)`);
        }
        
        // Step 5: Fetch and store user fee claims
        console.log('\nFetching fee claim data...');
        const claimResult = await dataService.fetchAndStoreUserClaims(walletAddress);
        
        if (!claimResult.success) {
            console.error('Failed to fetch fee claim data:', claimResult.error);
        } else {
            console.log(`✅ Fee claim data stored successfully (${claimResult.data.claims.length} fee claims)`);
        }
        
        // Step 6: Fetch and store user reward claims
        console.log('\nFetching reward claim data...');
        const rewardResult = await dataService.fetchAndStoreUserRewardClaims(walletAddress);
        
        if (!rewardResult.success) {
            console.error('Failed to fetch reward claim data:', rewardResult.error);
        } else {
            console.log(`✅ Reward claim data stored successfully (${rewardResult.data.rewards.length} reward claims)`);
        }
        
        // Step 7: Get dashboard data
        console.log('\nFetching dashboard data...');
        const dashboardResult = await dataService.getWalletDashboardData(walletAddress);
        
        if (!dashboardResult.success) {
            console.error('Failed to fetch dashboard data:', dashboardResult.error);
        } else {
            console.log('✅ Dashboard data retrieved successfully');
            console.log(`  - SOL Balance: ${dashboardResult.data.wallet?.sol_balance || 'N/A'}`);
            console.log(`  - Tokens: ${dashboardResult.data.wallet?.token_balances?.length || 0}`);
            console.log(`  - Positions: ${dashboardResult.data.positions?.length || 0}`);
        }
        
        console.log('\n====== Processing complete ======\n');
    } catch (error) {
        console.error('Error in main process:', error);
    }
}

// Run the main function
main().catch(console.error);