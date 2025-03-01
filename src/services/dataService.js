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
                
                // Store position data in user_positions table
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
            
            // Store positions in wallet liquidity_positions field
            await this.updateWalletLiquidityPositions(walletAddress, positions);
            
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
     * Update wallet record with liquidity positions
     * @param {string} walletAddress - Wallet address
     * @param {Array} positions - Position data to store
     * @returns {Promise<Object>} Operation result
     */
    async updateWalletLiquidityPositions(walletAddress, positions) {
        try {
            // First get the current wallet data
            const walletResult = await walletRepository.getWalletData(walletAddress);
            
            // If wallet doesn't exist, create it
            if (!walletResult.success || !walletResult.data) {
                // Create a basic wallet record with positions
                return await walletRepository.storeWalletData({
                    wallet_address: walletAddress,
                    sol_balance: 0,
                    token_balances: [],
                    liquidity_positions: positions,
                    lp_positions: { data: positions },
                    timestamp: new Date().toISOString()
                });
            }
            
            // Update existing wallet with positions
            const updatedWalletData = {
                ...walletResult.data,
                liquidity_positions: positions,
                lp_positions: { ...(walletResult.data.lp_positions || {}), data: positions },
                updated_at: new Date().toISOString()
            };
            
            return await walletRepository.storeWalletData(updatedWalletData);
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.updateWalletLiquidityPositions', error)
            };
        }
    }
    
    /**
     * Update wallet record with transaction data (deposits, withdrawals, claims, etc.)
     * @param {string} walletAddress - Wallet address
     * @param {string} transactionType - Type of transaction data (deposits, withdrawals, fee_claims, reward_claims)
     * @param {Array} transactions - Transaction data to store
     * @returns {Promise<Object>} Operation result
     */
    async updateWalletTransactionData(walletAddress, transactionType, transactions) {
        try {
            console.log(`Updating wallet ${walletAddress} with ${transactions.length} ${transactionType}`);
            
            // First get the current wallet data
            const walletResult = await walletRepository.getWalletData(walletAddress);
            
            // If wallet doesn't exist, create it with the transaction data
            if (!walletResult.success || !walletResult.data) {
                console.log(`Creating new wallet record for ${walletAddress} with ${transactionType}`);
                
                // Create a basic wallet record with lp_positions as a JSON object
                const walletData = {
                    wallet_address: walletAddress,
                    sol_balance: 0,
                    token_balances: [],
                    liquidity_positions: [],
                    lp_positions: { [transactionType]: transactions },
                    timestamp: new Date().toISOString()
                };
                
                console.log(`Added ${transactions.length} ${transactionType} to new wallet record in lp_positions.${transactionType}`);
                
                return await walletRepository.storeWalletData(walletData);
            }
            
            // Update existing wallet with the new transaction data
            const lpPositions = walletResult.data.lp_positions || {};
            const updatedLpPositions = {
                ...lpPositions,
                [transactionType]: transactions
            };
            
            const updatedWalletData = {
                ...walletResult.data,
                lp_positions: updatedLpPositions,
                updated_at: new Date().toISOString()
            };
            
            console.log(`Added ${transactions.length} ${transactionType} to existing wallet record in lp_positions.${transactionType}`);
            console.log(`Wallet record now has lp_positions fields: ${Object.keys(updatedLpPositions).join(', ')}`);
            
            return await walletRepository.storeWalletData(updatedWalletData);
        } catch (error) {
            console.error(`Error updating wallet transaction data for ${transactionType}:`, error);
            return {
                success: false,
                error: handleError(`DataService.updateWalletTransactionData.${transactionType}`, error)
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
            
            // Store each deposit in the deposits table
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
            
            // Store deposits in wallet record too
            await this.updateWalletTransactionData(walletAddress, 'deposits', deposits);
            
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
            
            // Store each withdrawal in the withdrawals table
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
            
            // Store withdrawals in wallet record too
            await this.updateWalletTransactionData(walletAddress, 'withdrawals', withdrawals);
            
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
            
            // Store each claim in the claims table
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
            
            // Store claims in wallet record too
            await this.updateWalletTransactionData(walletAddress, 'fee_claims', claims);
            
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
     * Fetch reward claims for a user
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Operation result
     */
    async fetchAndStoreUserRewardClaims(walletAddress) {
        try {
            const rewardsResult = await liquidityService.getAllUserRewardClaims(walletAddress);
            
            if (!rewardsResult.success) {
                return rewardsResult;
            }
            
            const rewards = rewardsResult.data.result || [];
            
            // Store each reward claim in the rewards table
            for (const reward of rewards) {
                await liquidityRepository.storeRewardClaimData({
                    wallet_address: walletAddress,
                    pool_address: reward.pool_address,
                    position_id: reward.position_id,
                    transaction_hash: reward.tx_hash,
                    amounts: reward.amounts,
                    timestamp: reward.timestamp
                });
            }
            
            // Store rewards in wallet record too
            await this.updateWalletTransactionData(walletAddress, 'reward_claims', rewards);
            
            return {
                success: true,
                data: {
                    rewards
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('DataService.fetchAndStoreUserRewardClaims', error)
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
            
            // Get positions from the user_positions table
            const positionsResult = await liquidityRepository.getUserPositions(walletAddress);
            
            // Get the updated wallet data again (might have been updated above)
            const updatedWalletResult = await walletRepository.getWalletData(walletAddress);
            const wallet = updatedWalletResult.success ? updatedWalletResult.data : null;
            
            // Use positions from wallets.liquidity_positions if available, otherwise fall back to user_positions table
            let positions = [];
            
            if (wallet && wallet.liquidity_positions && wallet.liquidity_positions.length > 0) {
                console.log(`Using ${wallet.liquidity_positions.length} positions from wallet.liquidity_positions`);
                positions = wallet.liquidity_positions;
            } else if (wallet && wallet.lp_positions && wallet.lp_positions.positions && wallet.lp_positions.positions.length > 0) {
                console.log(`Using ${wallet.lp_positions.positions.length} positions from wallet.lp_positions.positions`);
                positions = wallet.lp_positions.positions;
            } else if (positionsResult.success && positionsResult.data.length > 0) {
                console.log(`Using ${positionsResult.data.length} positions from user_positions table`);
                positions = positionsResult.data;
            }
            
            // Extract transaction data from wallet.lp_positions
            const lpPositions = wallet && wallet.lp_positions ? wallet.lp_positions : {};
            const deposits = lpPositions.deposits || [];
            const withdrawals = lpPositions.withdrawals || [];
            const feeClaims = lpPositions.fee_claims || [];
            const rewardClaims = lpPositions.reward_claims || [];
            
            // Combine data for dashboard
            return {
                success: true,
                data: {
                    wallet: wallet,
                    positions: positions,
                    transactions: {
                        deposits: deposits,
                        withdrawals: withdrawals,
                        feeClaims: feeClaims,
                        rewardClaims: rewardClaims
                    }
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