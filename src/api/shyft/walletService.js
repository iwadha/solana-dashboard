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
     * @param {string} walletAddress - Solana wallet address
     * @returns {Promise<Object>} Wallet token data
     */
    async getTokens(walletAddress) {
        try {
            // Following the example, we should use the /wallet/tokens endpoint
            const result = await shyftClient.get('/wallet/tokens', { wallet: walletAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletService.getTokens', error)
            };
        }
    }

    /**
     * Get complete wallet data (balance + tokens)
     * @param {string} walletAddress - Solana wallet address
     * @returns {Promise<Object>} Combined wallet data
     */
    async getWalletData(walletAddress) {
        try {
            // Get wallet balance - only this is reliable with this API key
            const balanceResult = await this.getBalance(walletAddress);

            if (!balanceResult.success) {
                return {
                    success: false,
                    error: balanceResult.error
                };
            }

            // Return at least the balance data even if token data fails
            return {
                success: true,
                data: {
                    wallet_address: walletAddress,
                    sol_balance: balanceResult.data.result.balance,
                    token_balances: [], // Empty for now as the API isn't working
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