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
        
        // For a real implementation, we would fetch this from the database
        // This is just a placeholder
        return {
            success: true,
            data: {
                transactions: [] // We would get this from the database
            }
        };
    }
};

module.exports = dashboardApi;