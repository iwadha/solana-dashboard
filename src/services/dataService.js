const walletService = require('../api/shyft/walletService');
const liquidityService = require('../api/shyft/liquidityService');
const walletRepository = require('../database/walletRepository');
const liquidityRepository = require('../database/liquidityRepository');
const { handleError } = require('../utils/errorHandler');

/**
 * Service that orchestrates data flow between API and database
 */
class DataService {
    /**
     * Fetch wallet data and store it
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStoreWalletData(walletAddress) {
        try {
            // Fetch wallet data from Shyft API
            const walletResult = await walletService.getWalletData(walletAddress);
            
            if (!walletResult.success) {
                return walletResult; // Return error from API
            }
            
            // Store wallet data in Supabase
            const storeResult = await walletRepository.storeWalletData(walletResult.data);
            
            return storeResult;
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStoreWalletData', error)
            };
        }
    }
    
    /**
     * Fetch pool and position data, and store it
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStorePositionData(walletAddress) {
        try {
            // First get all liquidity pairs
            const pairsResult = await liquidityService.getAllPairs();
            
            if (!pairsResult.success) {
                return pairsResult; // Return error from API
            }
            
            const pairs = pairsResult.data.result || [];
            const positions = [];
            
            // For each pair, get and store pool data
            for (const pair of pairs) {
                const poolAddress = pair.pool_address;
                
                // Store pool data
                await liquidityRepository.storePoolData({
                    pool_address: poolAddress,
                    token_x: pair.token_addresses?.token_x,
                    token_y: pair.token_addresses?.token_y,
                    token_x_symbol: pair.token_names?.token_x,
                    token_y_symbol: pair.token_names?.token_y,
                    bin_step: pair.bin_step
                });
                
                // Get positions for this pool
                const positionsResult = await liquidityService.getPositionsAndDeposits(poolAddress);
                
                if (!positionsResult.success) {
                    console.error(`Error getting positions for pool ${poolAddress}:`, positionsResult.error);
                    continue; // Skip to next pair
                }
                
                // Filter positions for this wallet
                const userPositions = positionsResult.data.result?.filter(
                    pos => pos.owner_address === walletAddress
                ) || [];
                
                // Store positions and collect for return
                for (const pos of userPositions) {
                    positions.push(pos);
                    
                    await liquidityRepository.storePositionData({
                        wallet_address: walletAddress,
                        pool_address: poolAddress,
                        position_id: pos.position_id,
                        lower_bin: pos.lower_bin,
                        upper_bin: pos.upper_bin,
                        liquidity: pos.liquidity,
                        token_x_amount: pos.token_x_amount,
                        token_y_amount: pos.token_y_amount
                    });
                }
            }
            
            return {
                success: true,
                data: {
                    positions: positions,
                    pools: pairs
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStorePositionData', error)
            };
        }
    }
    
    /**
     * Fetch deposits for a user
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStoreUserDeposits(walletAddress) {
        try {
            const depositsResult = await liquidityService.getAllUserDeposits(walletAddress);
            
            if (!depositsResult.success) {
                return depositsResult;
            }
            
            const deposits = depositsResult.data.result || [];
            
            // Store each deposit
            for (const deposit of deposits) {
                await liquidityRepository.storeDepositData({
                    wallet_address: walletAddress,
                    pool_address: deposit.pool_address,
                    position_id: deposit.position_id,
                    transaction_hash: deposit.tx_hash,
                    token_x_amount: deposit.token_x_amount,
                    token_y_amount: deposit.token_y_amount,
                    timestamp: deposit.timestamp
                });
            }
            
            return {
                success: true,
                data: {
                    deposits
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStoreUserDeposits', error)
            };
        }
    }
    
    /**
     * Fetch withdrawals for a user
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStoreUserWithdrawals(walletAddress) {
        try {
            const withdrawalsResult = await liquidityService.getAllUserWithdrawals(walletAddress);
            
            if (!withdrawalsResult.success) {
                return withdrawalsResult;
            }
            
            const withdrawals = withdrawalsResult.data.result || [];
            
            // Store each withdrawal
            for (const withdrawal of withdrawals) {
                await liquidityRepository.storeWithdrawalData({
                    wallet_address: walletAddress,
                    pool_address: withdrawal.pool_address,
                    position_id: withdrawal.position_id,
                    transaction_hash: withdrawal.tx_hash,
                    token_x_amount: withdrawal.token_x_amount,
                    token_y_amount: withdrawal.token_y_amount,
                    timestamp: withdrawal.timestamp
                });
            }
            
            return {
                success: true,
                data: {
                    withdrawals
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStoreUserWithdrawals', error)
            };
        }
    }
    
    /**
     * Fetch fee claims for a user
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStoreUserClaims(walletAddress) {
        try {
            const claimsResult = await liquidityService.getAllUserClaims(walletAddress);
            
            if (!claimsResult.success) {
                return claimsResult;
            }
            
            const claims = claimsResult.data.result || [];
            
            // Store each claim
            for (const claim of claims) {
                await liquidityRepository.storeClaimData({
                    wallet_address: walletAddress,
                    pool_address: claim.pool_address,
                    position_id: claim.position_id,
                    transaction_hash: claim.tx_hash,
                    token_x_amount: claim.token_x_amount,
                    token_y_amount: claim.token_y_amount,
                    timestamp: claim.timestamp
                });
            }
            
            return {
                success: true,
                data: {
                    claims
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStoreUserClaims', error)
            };
        }
    }
    
    /**
     * Get wallet dashboard data
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Dashboard data
     */
    async getWalletDashboardData(walletAddress) {
        try {
            // Get latest wallet data
            const walletResult = await walletRepository.getWalletData(walletAddress);
            
            if (!walletResult.success || !walletResult.data) {
                // If no stored data, fetch fresh data
                const freshWalletResult = await this.fetchAndStoreWalletData(walletAddress);
                if (!freshWalletResult.success) {
                    return freshWalletResult;
                }
            }
            
            // Get positions
            const positionsResult = await liquidityRepository.getUserPositions(walletAddress);
            
            // Combine data for dashboard
            return {
                success: true,
                data: {
                    wallet: walletResult.data,
                    positions: positionsResult.success ? positionsResult.data : []
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.getWalletDashboardData', error)
            };
        }
    }
}

module.exports = new DataService();