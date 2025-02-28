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
     * Note: This endpoint requires a premium API key and is currently not available
     * @returns {Promise<Object>} List of all liquidity pairs
     */
    async getAllPairs() {
        console.log('Warning: The lb/pairs endpoint requires a premium API key');
        
        // Return a placeholder response since this endpoint is not available
        return {
            success: true,
            data: {
                result: [],
                message: 'Liquidity pairs endpoint requires premium API key'
            }
        };
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
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} poolAddress - Pool address
     * @returns {Promise<Object>} Pool positions and deposits
     */
    async getPositionsAndDeposits(poolAddress) {
        console.log('Warning: The positions_and_deposits endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Positions and deposits endpoint requires premium API key'
            }
        };
    }

    /**
     * Get positions and withdrawals for a specific pool
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} poolAddress - Pool address
     * @returns {Promise<Object>} Pool positions and withdrawals
     */
    async getPositionsAndWithdrawals(poolAddress) {
        console.log('Warning: The positions_and_withdrawals endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Positions and withdrawals endpoint requires premium API key'
            }
        };
    }
    
    /**
     * Get all deposits for a user
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User deposits
     */
    async getAllUserDeposits(walletAddress) {
        console.log('Warning: The deposits endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Deposits endpoint requires premium API key'
            }
        };
    }
    
    /**
     * Get all withdrawals for a user
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User withdrawals
     */
    async getAllUserWithdrawals(walletAddress) {
        console.log('Warning: The withdrawals endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Withdrawals endpoint requires premium API key'
            }
        };
    }
    
    /**
     * Get all fees claimed by a user
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User fee claims
     */
    async getAllUserClaims(walletAddress) {
        console.log('Warning: The fees_claimed endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Fees claimed endpoint requires premium API key'
            }
        };
    }
    
    /**
     * Get pool by token addresses
     * Note: This endpoint requires a premium API key and is currently not available
     * @param {string} tokenX - First token address
     * @param {string} tokenY - Second token address
     * @returns {Promise<Object>} Pool details
     */
    async getPoolByTokens(tokenX, tokenY) {
        console.log('Warning: The pool_by_tokens endpoint requires a premium API key');
        
        // Return a placeholder response
        return {
            success: true,
            data: {
                result: [],
                message: 'Pool by tokens endpoint requires premium API key'
            }
        };
    }
}

module.exports = new LiquidityService();