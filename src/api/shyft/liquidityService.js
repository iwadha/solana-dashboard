const shyftClient = require('./shyftClient');
const { handleError } = require('../../utils/errorHandler');

/**
 * Service for fetching liquidity-related data
 */
class LiquidityService {
    /**
     * Get all liquidity pool pairs
     * @returns {Promise<Object>} List of all liquidity pairs
     */
    async getAllPairs() {
        try {
            const result = await shyftClient.get('/lb/pairs');
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllPairs', error)
            };
        }
    }

    /**
     * Get positions and deposits for a specific pool
     * @param {string} poolAddress - Pool address
     * @returns {Promise<Object>} Pool positions and deposits
     */
    async getPositionsAndDeposits(poolAddress) {
        try {
            const result = await shyftClient.get('/lb/positions_and_deposits', { pool: poolAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getPositionsAndDeposits', error)
            };
        }
    }

    /**
     * Get positions and withdrawals for a specific pool
     * @param {string} poolAddress - Pool address
     * @returns {Promise<Object>} Pool positions and withdrawals
     */
    async getPositionsAndWithdrawals(poolAddress) {
        try {
            const result = await shyftClient.get('/lb/positions_and_withdrawals', { pool: poolAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getPositionsAndWithdrawals', error)
            };
        }
    }
    
    /**
     * Get all deposits for a user
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User deposits
     */
    async getAllUserDeposits(walletAddress) {
        try {
            const result = await shyftClient.get('/lb/deposits', { wallet: walletAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserDeposits', error)
            };
        }
    }
    
    /**
     * Get all withdrawals for a user
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User withdrawals
     */
    async getAllUserWithdrawals(walletAddress) {
        try {
            const result = await shyftClient.get('/lb/withdrawals', { wallet: walletAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserWithdrawals', error)
            };
        }
    }
    
    /**
     * Get all fees claimed by a user
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User fee claims
     */
    async getAllUserClaims(walletAddress) {
        try {
            const result = await shyftClient.get('/lb/fees_claimed', { wallet: walletAddress });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserClaims', error)
            };
        }
    }
    
    /**
     * Get pool by token addresses
     * @param {string} tokenX - First token address
     * @param {string} tokenY - Second token address
     * @returns {Promise<Object>} Pool details
     */
    async getPoolByTokens(tokenX, tokenY) {
        try {
            const result = await shyftClient.get('/lb/pool_by_tokens', { tokenX, tokenY });
            return result;
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getPoolByTokens', error)
            };
        }
    }
}

module.exports = new LiquidityService();