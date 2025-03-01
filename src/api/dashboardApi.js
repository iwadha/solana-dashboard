const dataService = require('../services/dataService');
const { isValidSolanaAddress } = require('../utils/validator');

/**
 * API functions for the dashboard UI
 */
const dashboardApi = {
    /**
     * Get wallet overview data
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Wallet overview data
     */
    async getWalletOverview(walletAddress) {
        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: { message: 'Invalid wallet address' }
            };
        }
        
        return await dataService.getWalletDashboardData(walletAddress);
    },
    
    /**
     * Refresh wallet data
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Refresh operation result
     */
    async refreshWalletData(walletAddress) {
        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: { message: 'Invalid wallet address' }
            };
        }
        
        // Refresh all data points
        const walletResult = await dataService.fetchAndStoreWalletData(walletAddress);
        const positionResult = await dataService.fetchAndStorePositionData(walletAddress);
        const depositResult = await dataService.fetchAndStoreUserDeposits(walletAddress);
        const withdrawalResult = await dataService.fetchAndStoreUserWithdrawals(walletAddress);
        const claimResult = await dataService.fetchAndStoreUserClaims(walletAddress);
        
        // Return combined result
        return {
            success: true,
            data: {
                wallet: walletResult.success,
                positions: positionResult.success,
                deposits: depositResult.success,
                withdrawals: withdrawalResult.success,
                claims: claimResult.success,
                refreshedAt: new Date().toISOString()
            }
        };
    },
    
    /**
     * Get liquidity positions for a wallet
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Wallet liquidity positions
     */
    async getLiquidityPositions(walletAddress) {
        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: { message: 'Invalid wallet address' }
            };
        }
        
        // First, make sure we have the latest position data
        await dataService.fetchAndStorePositionData(walletAddress);
        
        // Then get positions from the database
        const result = await dataService.getWalletDashboardData(walletAddress);
        
        if (!result.success) {
            return result;
        }
        
        return {
            success: true,
            data: {
                positions: result.data.positions || []
            }
        };
    },
    
    /**
     * Get transaction history for a wallet
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Wallet transaction history
     */
    async getTransactionHistory(walletAddress) {
        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: { message: 'Invalid wallet address' }
            };
        }
        
        // Make sure we have the latest data
        await dataService.fetchAndStoreUserDeposits(walletAddress);
        await dataService.fetchAndStoreUserWithdrawals(walletAddress);
        await dataService.fetchAndStoreUserClaims(walletAddress);
        await dataService.fetchAndStoreUserRewardClaims(walletAddress);
        
        // Get wallet data which includes transaction history
        const walletResult = await dataService.getWalletDashboardData(walletAddress);
        
        if (!walletResult.success) {
            return walletResult;
        }
        
        // Extract and return just the transactions portion of the dashboard data
        return {
            success: true,
            data: {
                transactions: walletResult.data.transactions || {
                    deposits: [],
                    withdrawals: [],
                    feeClaims: [],
                    rewardClaims: []
                }
            }
        };
    }
};

module.exports = dashboardApi;