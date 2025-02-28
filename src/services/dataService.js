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
            
            // Get positions directly using GraphQL
            const positionsResult = await liquidityService.getUserPositions(walletAddress);
            
            if (!positionsResult.success) {
                return positionsResult;
            }
            
            const positions = positionsResult.data.positions || [];
            const pairs = pairsResult.data.result || [];
            
            // Store positions and related pools
            for (const position of positions) {
                const lbPairAddress = position.lbPair;
                
                // Try to get details about this LB pair
                const lbPairResult = await liquidityService.getLbPairDetails(lbPairAddress);
                let tokenX = null, tokenY = null, binStep = null;
                
                // If we got LB pair details, use them
                if (lbPairResult.success && lbPairResult.data.lbPair) {
                    const lbPair = lbPairResult.data.lbPair;
                    tokenX = lbPair.tokenXMint;
                    tokenY = lbPair.tokenYMint;
                    binStep = lbPair.binStep;
                    
                    // Store pool data
                    await liquidityRepository.storePoolData({
                        pool_address: lbPairAddress,
                        token_x: tokenX,
                        token_y: tokenY,
                        token_x_symbol: '', // Would need to fetch token metadata
                        token_y_symbol: '', // Would need to fetch token metadata
                        bin_step: binStep
                    });
                } else {
                    // Fallback to find matching pair in the pairs result
                    const matchingPair = pairs.find(pair => pair.pool_address === lbPairAddress);
                    
                    if (matchingPair) {
                        // Store pool data from pairs result
                        await liquidityRepository.storePoolData({
                            pool_address: lbPairAddress,
                            token_x: matchingPair.token_addresses?.token_x,
                            token_y: matchingPair.token_addresses?.token_y,
                            token_x_symbol: matchingPair.token_names?.token_x,
                            token_y_symbol: matchingPair.token_names?.token_y,
                            bin_step: matchingPair.bin_step
                        });
                    }
                }
                
                // Store position data
                await liquidityRepository.storePositionData({
                    wallet_address: walletAddress,
                    pool_address: lbPairAddress,
                    position_id: position.pubkey || position.id || `${lbPairAddress}-${position.lowerBinId}-${position.upperBinId}`,
                    lower_bin: position.lowerBinId,
                    upper_bin: position.upperBinId,
                    liquidity: position.liquidityShares || 0,
                    token_x_amount: 0, // These may not be directly available in GraphQL response
                    token_y_amount: 0  // These may not be directly available in GraphQL response
                });
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