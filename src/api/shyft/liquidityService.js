const shyftClient = require('./shyftClient');
const { handleError } = require('../../utils/errorHandler');

/**
 * Service for fetching liquidity-related data
 */
class LiquidityService {
    constructor() {
        // GraphQL queries for positions
        this.positionQuery = `
            query GetPosition($owner: String!) {
                meteora_dlmm_Position(where: { owner: { _eq: $owner } }) {
                    _lamports
                    _updatedAt
                    lastUpdatedAt
                    lbPair
                    lowerBinId
                    owner
                    totalClaimedFeeXAmount
                    totalClaimedFeeYAmount
                    upperBinId
                    feeInfos
                    liquidityShares
                    pubkey
                    reserved
                    rewardInfos
                    totalClaimedRewards
                }
            }
        `;

        this.positionV2Query = `
            query GetPositionV2($owner: String!) {
                meteora_dlmm_PositionV2(where: { owner: { _eq: $owner } }) {
                    _lamports
                    _updatedAt
                    feeOwner
                    lastUpdatedAt
                    lbPair
                    lockReleasePoint
                    lowerBinId
                    operator
                    owner
                    subjectedToBootstrapLiquidityLocking
                    totalClaimedFeeXAmount
                    totalClaimedFeeYAmount
                    upperBinId
                }
            }
        `;

        this.lbPairQuery = `
            query GetLbPair($lbpair: String!) {
                meteora_dlmm_LbPair(
                    where: { pubkey: { _eq: $lbpair } }
                ) {
                    _lamports
                    _updatedAt
                    activationPoint
                    activationType
                    activeId
                    baseKey
                    binStep
                    creator
                    lastUpdatedAt
                    lockDuration
                    oracle
                    pairType
                    parameters
                    preActivationDuration
                    preActivationSwapAddress
                    protocolFee
                    requireBaseFactorSeed
                    reserveX
                    reserveY
                    status
                    tokenXMint
                    tokenYMint
                    whitelistedWallet
                    binStepSeed
                    bumpSeed
                    rewardInfos
                    pubkey
                }
            }
        `;
    }

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
     * Get positions for a specific user using GraphQL
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User positions
     */
    async getUserPositions(walletAddress) {
        try {
            // Fetch both V1 and V2 positions
            const positionsV1Result = await shyftClient.graphql(this.positionQuery, { owner: walletAddress });
            const positionsV2Result = await shyftClient.graphql(this.positionV2Query, { owner: walletAddress });
            
            if (!positionsV1Result.success || !positionsV2Result.success) {
                return {
                    success: false,
                    error: positionsV1Result.error || positionsV2Result.error
                };
            }
            
            // Combine both position types
            const positionsV1 = positionsV1Result.data.data.meteora_dlmm_Position || [];
            const positionsV2 = positionsV2Result.data.data.meteora_dlmm_PositionV2 || [];
            const combinedPositions = [...positionsV1, ...positionsV2];
            
            return {
                success: true,
                data: {
                    positions: combinedPositions
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getUserPositions', error)
            };
        }
    }

    /**
     * Get details for a specific LB pair using GraphQL
     * @param {string} lbPairAddress - LB pair address 
     * @returns {Promise<Object>} LB pair details
     */
    async getLbPairDetails(lbPairAddress) {
        try {
            const result = await shyftClient.graphql(this.lbPairQuery, { lbpair: lbPairAddress });
            
            if (!result.success) {
                return result;
            }
            
            return {
                success: true,
                data: {
                    lbPair: result.data.data.meteora_dlmm_LbPair[0] || null
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getLbPairDetails', error)
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