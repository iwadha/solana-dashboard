const shyftClient = require('./shyftClient');
const { handleError } = require('../../utils/errorHandler');

/**
 * Service for fetching wallet-related data
 */
class WalletService {
    /**
     * Get wallet balance information
     * @param {string} walletAddress - Solana wallet address
     * @returns {Promise<Object>} Wallet balance data
     */
    async getBalance(walletAddress) {
        try {
            const result = await shyftClient.get('/wallet/balance', { wallet: walletAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletService.getBalance', error)
            };
        }
    }

    /**
     * Get wallet token accounts
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} walletAddress - Solana wallet address
     * @returns {Promise<Object>} Wallet token data
     */
    async getTokens(walletAddress) {
        console.log('Warning: The tokens endpoint requires a premium API key');
        
        // Return a placeholder response since this endpoint is not available
        return {
            success: true,
            data: {
                result: [],
                message: 'Tokens endpoint requires premium API key'
            }
        };
    }

    /**
     * Get complete wallet data (balance + tokens)
     * @param {string} walletAddress - Solana wallet address
     * @returns {Promise<Object>} Combined wallet data
     */
    async getWalletData(walletAddress) {
        try {
            // Get wallet balance - this works with the free API key
            const balanceResult = await this.getBalance(walletAddress);

            if (!balanceResult.success) {
                return {
                    success: false,
                    error: balanceResult.error
                };
            }

            // Return the balance data - token data requires premium key
            return {
                success: true,
                data: {
                    wallet_address: walletAddress,
                    sol_balance: balanceResult.data.result.balance,
                    token_balances: [], // Empty since we can't get token data with this key
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletService.getWalletData', error)
            };
        }
    }
}

module.exports = new WalletService();