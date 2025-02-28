const supabase = require('./supabaseClient');
const { handleError } = require('../utils/errorHandler');

/**
 * Repository for wallet-related database operations
 */
class WalletRepository {
    /**
     * Store wallet data in the database
     * @param {Object} walletData - Wallet data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storeWalletData(walletData) {
        try {
            const { data, error } = await supabase
                .from('wallets')
                .insert([{
                    wallet_address: walletData.wallet_address,
                    sol_balance: walletData.sol_balance,
                    token_balances: walletData.token_balances || [],
                    liquidity_positions: walletData.liquidity_positions || [],
                    created_at: walletData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('WalletRepository.storeWalletData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletRepository.storeWalletData', error)
            };
        }
    }
    
    /**
     * Get wallet data for a specific address
     * @param {string} walletAddress - Wallet address to query
     * @returns {Promise<Object>} Wallet data from the database
     */
    async getWalletData(walletAddress) {
        try {
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('wallet_address', walletAddress)
                .order('created_at', { ascending: false })
                .limit(1);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('WalletRepository.getWalletData', error, false)
                };
            }
            
            return {
                success: true,
                data: data && data.length > 0 ? data[0] : null
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletRepository.getWalletData', error)
            };
        }
    }
    
    /**
     * Get historical wallet data for a specific address
     * @param {string} walletAddress - Wallet address to query
     * @param {number} limit - Number of records to return
     * @returns {Promise<Object>} Historical wallet data
     */
    async getWalletHistory(walletAddress, limit = 30) {
        try {
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('wallet_address', walletAddress)
                .order('created_at', { ascending: false })
                .limit(limit);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('WalletRepository.getWalletHistory', error, false)
                };
            }
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('WalletRepository.getWalletHistory', error)
            };
        }
    }
}

module.exports = new WalletRepository();