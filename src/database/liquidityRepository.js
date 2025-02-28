const supabase = require('./supabaseClient');
const { handleError } = require('../utils/errorHandler');

/**
 * Repository for liquidity-related database operations
 */
class LiquidityRepository {
    /**
     * Store pool data in the database using upsert
     * @param {Object} poolData - Pool data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storePoolData(poolData) {
        try {
            // Create record data
            const recordData = {
                pool_address: poolData.pool_address,
                token_x: poolData.token_x,
                token_y: poolData.token_y,
                token_x_symbol: poolData.token_x_symbol,
                token_y_symbol: poolData.token_y_symbol,
                bin_step: poolData.bin_step,
                created_at: poolData.timestamp || new Date().toISOString()
            };

            // Check if pool already exists
            const { data: existingData, error: queryError } = await supabase
                .from('pools')
                .select('id')
                .eq('pool_address', poolData.pool_address)
                .limit(1);

            if (queryError) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePoolData.query', queryError, false)
                };
            }

            let result;
            
            // If pool already exists, update the existing record
            if (existingData && existingData.length > 0) {
                const { data, error } = await supabase
                    .from('pools')
                    .update(recordData)
                    .eq('pool_address', poolData.pool_address)
                    .select();
                    
                result = { data, error };
            } else {
                // If pool doesn't exist, insert a new record
                const { data, error } = await supabase
                    .from('pools')
                    .insert([recordData])
                    .select();
                    
                result = { data, error };
            }
                
            if (result.error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePoolData', result.error, false)
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityRepository.storePoolData', error)
            };
        }
    }
    
    /**
     * Store user position data using upsert
     * @param {Object} positionData - Position data to store
     * @returns {Promise<Object>} Result of the storage operation
     */
    async storePositionData(positionData) {
        try {
            // Create record data
            const recordData = {
                wallet_address: positionData.wallet_address,
                pool_address: positionData.pool_address,
                position_id: positionData.position_id,
                lower_bin: positionData.lower_bin,
                upper_bin: positionData.upper_bin,
                liquidity: positionData.liquidity,
                token_x_amount: positionData.token_x_amount,
                token_y_amount: positionData.token_y_amount,
                created_at: positionData.timestamp || new Date().toISOString()
            };

            // Check if position already exists
            const { data: existingData, error: queryError } = await supabase
                .from('user_positions')
                .select('id')
                .eq('position_id', positionData.position_id)
                .limit(1);

            if (queryError) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePositionData.query', queryError, false)
                };
            }

            let result;
            
            // If position already exists, update it
            if (existingData && existingData.length > 0) {
                const { data, error } = await supabase
                    .from('user_positions')
                    .update(recordData)
                    .eq('position_id', positionData.position_id)
                    .select();
                    
                result = { data, error };
            } else {
                // If position doesn't exist, insert it
                const { data, error } = await supabase
                    .from('user_positions')
                    .insert([recordData])
                    .select();
                    
                result = { data, error };
            }
                
            if (result.error) {
                return {
                    success: false,
                    error: handleError('LiquidityRepository.storePositionData', result.error, false)
                };
            }
            
            return {
                success: true,
                data: result.data
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