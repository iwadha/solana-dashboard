const supabase = require('./supabaseClient');
const { handleError } = require('../utils/errorHandler');

/**
 * Repository for wallet-related database operations
 */
class WalletRepository {
    /**
     * Store wallet data in the database using upsert
     * @param {Object} walletData - Wallet data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storeWalletData(walletData) {
        try {
            // Create record data
            const recordData = {
                wallet_address: walletData.wallet_address,
                sol_balance: walletData.sol_balance,
                token_balances: walletData.token_balances || [],
                liquidity_positions: walletData.liquidity_positions || [],
                created_at: walletData.timestamp || new Date().toISOString()
            };

            // First check if this wallet address already exists
            const { data: existingData, error: queryError } = await supabase
                .from('wallets')
                .select('id')
                .eq('wallet_address', walletData.wallet_address)
                .limit(1);

            if (queryError) {
                return {
                    success: false,
                    error: handleError('WalletRepository.storeWalletData.query', queryError, false)
                };
            }

            let result;
            
            // If wallet already exists, update the existing record
            if (existingData && existingData.length > 0) {
                const { data, error } = await supabase
                    .from('wallets')
                    .update(recordData)
                    .eq('wallet_address', walletData.wallet_address)
                    .select();
                    
                result = { data, error };
                console.log(`Updated existing wallet record for ${walletData.wallet_address}`);
            } else {
                // If wallet doesn't exist, insert a new record
                const { data, error } = await supabase
                    .from('wallets')
                    .insert([recordData])
                    .select();
                    
                result = { data, error };
                console.log(`Created new wallet record for ${walletData.wallet_address}`);
            }
                
            if (result.error) {
                return {
                    success: false,
                    error: handleError('WalletRepository.storeWalletData', result.error, false)
                };
            }
            
            return {
                success: true,
                data: result.data
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