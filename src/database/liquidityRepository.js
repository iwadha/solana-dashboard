const supabase = require('./supabaseClient');
const { handleError } = require('../utils/errorHandler');

/**
 * Repository for liquidity-related database operations
 */
class LiquidityRepository {
    /**
     * Store pool data in the database
     * @param {Object} poolData - Pool data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storePoolData(poolData) {
        try {
            const { data, error } = await supabase
                .from('pools')
                .insert([{
                    pool_address: poolData.pool_address,
                    token_x: poolData.token_x,
                    token_y: poolData.token_y,
                    token_x_symbol: poolData.token_x_symbol,
                    token_y_symbol: poolData.token_y_symbol,
                    bin_step: poolData.bin_step,
                    created_at: poolData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePoolData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storePoolData', error)
            };
        }
    }
    
    /**
     * Store user position data
     * @param {Object} positionData - Position data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storePositionData(positionData) {
        try {
            const { data, error } = await supabase
                .from('user_positions')
                .insert([{
                    wallet_address: positionData.wallet_address,
                    pool_address: positionData.pool_address,
                    position_id: positionData.position_id,
                    lower_bin: positionData.lower_bin,
                    upper_bin: positionData.upper_bin,
                    liquidity: positionData.liquidity,
                    token_x_amount: positionData.token_x_amount,
                    token_y_amount: positionData.token_y_amount,
                    created_at: positionData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePositionData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storePositionData', error)
            };
        }
    }
    
    /**
     * Store user deposit data
     * @param {Object} depositData - Deposit data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storeDepositData(depositData) {
        try {
            const { data, error } = await supabase
                .from('user_deposits')
                .insert([{
                    wallet_address: depositData.wallet_address,
                    pool_address: depositData.pool_address,
                    position_id: depositData.position_id,
                    transaction_hash: depositData.transaction_hash,
                    token_x_amount: depositData.token_x_amount,
                    token_y_amount: depositData.token_y_amount,
                    timestamp: depositData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storeDepositData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storeDepositData', error)
            };
        }
    }
    
    /**
     * Store user withdrawal data
     * @param {Object} withdrawalData - Withdrawal data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storeWithdrawalData(withdrawalData) {
        try {
            const { data, error } = await supabase
                .from('user_withdrawals')
                .insert([{
                    wallet_address: withdrawalData.wallet_address,
                    pool_address: withdrawalData.pool_address,
                    position_id: withdrawalData.position_id,
                    transaction_hash: withdrawalData.transaction_hash,
                    token_x_amount: withdrawalData.token_x_amount,
                    token_y_amount: withdrawalData.token_y_amount,
                    timestamp: withdrawalData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storeWithdrawalData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storeWithdrawalData', error)
            };
        }
    }
    
    /**
     * Store user claim data
     * @param {Object} claimData - Claim data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storeClaimData(claimData) {
        try {
            const { data, error } = await supabase
                .from('user_claims')
                .insert([{
                    wallet_address: claimData.wallet_address,
                    pool_address: claimData.pool_address,
                    position_id: claimData.position_id,
                    transaction_hash: claimData.transaction_hash,
                    token_x_amount: claimData.token_x_amount,
                    token_y_amount: claimData.token_y_amount,
                    timestamp: claimData.timestamp || new Date().toISOString()
                }]);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storeClaimData', error, false)
                };
            }
            
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storeClaimData', error)
            };
        }
    }
    
    /**
     * Get pool data
     * @param {string} poolAddress - Pool address to query
     * @returns {Promise<Object>} Pool data
     */
    async getPoolData(poolAddress) {
        try {
            const { data, error } = await supabase
                .from('pools')
                .select('*')
                .eq('pool_address', poolAddress)
                .limit(1);
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.getPoolData', error, false)
                };
            }
            
            return {
                success: true,
                data: data && data.length > 0 ? data[0] : null
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.getPoolData', error)
            };
        }
    }
    
    /**
     * Get user positions for a specific wallet
     * @param {string} walletAddress - Wallet address to query
     * @returns {Promise<Object>} User positions
     */
    async getUserPositions(walletAddress) {
        try {
            const { data, error } = await supabase
                .from('user_positions')
                .select('*')
                .eq('wallet_address', walletAddress)
                .order('created_at', { ascending: false });
                
            if (error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.getUserPositions', error, false)
                };
            }
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.getUserPositions', error)
            };
        }
    }
}

module.exports = new LiquidityRepository();