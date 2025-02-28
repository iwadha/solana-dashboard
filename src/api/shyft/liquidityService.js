const shyftClient = require('./shyftClient');
const { handleError } = require('../../utils/errorHandler');

/**
 * Service for fetching liquidity-related data from Meteora via Shyft
 * Uses GraphQL for most operations as it provides better access with the free tier API key
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
                    pubkey
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

        // GraphQL query for position events (deposits, withdrawals, claims)
        // Since the specific LiquidityProvision isn't available, 
        // we'll use position data and process events client-side
        this.positionEventsQuery = `
            query GetPositionEvents($owner: String!) {
                meteora_dlmm_Position(
                    where: { owner: { _eq: $owner } }
                ) {
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
                meteora_dlmm_PositionV2(
                    where: { owner: { _eq: $owner } }
                ) {
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
     * Get position data with claims, fees, and rewards
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} Position data with additional information
     */
    async getPositionDataWithEvents(walletAddress) {
        try {
            const result = await shyftClient.graphql(this.positionEventsQuery, { owner: walletAddress });
            
            if (!result.success) {
                return result;
            }
            
            const positionsV1 = result.data.data.meteora_dlmm_Position || [];
            const positionsV2 = result.data.data.meteora_dlmm_PositionV2 || [];
            
            return {
                success: true,
                data: {
                    positionsV1,
                    positionsV2
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getPositionDataWithEvents', error)
            };
        }
    }
    
    /**
     * Get all deposits for a user using position data
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User deposits
     */
    async getAllUserDeposits(walletAddress) {
        try {
            // First, get position data
            const positionResult = await this.getPositionDataWithEvents(walletAddress);
            
            if (!positionResult.success) {
                return positionResult;
            }
            
            // Use position data to create synthetic deposit records
            // In a real implementation, we would use historical data to get actual deposits
            // But for this demo, we'll create placeholder deposits based on positions
            const { positionsV1, positionsV2 } = positionResult.data;
            
            // Create synthetic deposits for each position
            const deposits = [
                ...positionsV1.map(position => ({
                    wallet_address: position.owner,
                    pool_address: position.lbPair,
                    position_id: position.pubkey,
                    tx_hash: `synthetic-deposit-${position.pubkey.substring(0, 8)}`,
                    token_x_amount: '0', // Would need historical data for actual values
                    token_y_amount: '0', // Would need historical data for actual values
                    liquidity_amount: position.liquidityShares?.toString() || '0',
                    timestamp: new Date().toISOString()
                })),
                ...positionsV2.map(position => ({
                    wallet_address: position.owner,
                    pool_address: position.lbPair,
                    position_id: position.pubkey,
                    tx_hash: `synthetic-deposit-${position.pubkey.substring(0, 8)}`,
                    token_x_amount: '0', // Would need historical data for actual values
                    token_y_amount: '0', // Would need historical data for actual values
                    liquidity_amount: '0', // V2 doesn't expose liquidity shares in the same way
                    timestamp: new Date().toISOString()
                }))
            ];
            
            return {
                success: true,
                data: {
                    result: deposits
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserDeposits', error)
            };
        }
    }
    
    /**
     * Get all withdrawals for a user
     * Not available without historical data, using synthetic data from positions
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User withdrawals
     */
    async getAllUserWithdrawals(walletAddress) {
        try {
            // First, get position data
            const positionResult = await this.getPositionDataWithEvents(walletAddress);
            
            if (!positionResult.success) {
                return positionResult;
            }
            
            // For this demo, we'll return empty withdrawals since
            // we don't have historical withdrawal data
            return {
                success: true,
                data: {
                    result: []
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserWithdrawals', error)
            };
        }
    }
    
    /**
     * Get all fees claimed by a user using position data
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User fee claims
     */
    async getAllUserClaims(walletAddress) {
        try {
            // First, get position data which contains fees claimed
            const positionResult = await this.getPositionDataWithEvents(walletAddress);
            
            if (!positionResult.success) {
                return positionResult;
            }
            
            const { positionsV1, positionsV2 } = positionResult.data;
            
            // Create fee claim records based on totalClaimedFeeAmount fields
            const claims = [
                ...positionsV1.filter(p => p.totalClaimedFeeXAmount > 0 || p.totalClaimedFeeYAmount > 0)
                    .map(position => ({
                        wallet_address: position.owner,
                        pool_address: position.lbPair,
                        position_id: position.pubkey,
                        tx_hash: `synthetic-fee-claim-${position.pubkey.substring(0, 8)}`,
                        token_x_amount: position.totalClaimedFeeXAmount?.toString() || '0',
                        token_y_amount: position.totalClaimedFeeYAmount?.toString() || '0',
                        timestamp: new Date().toISOString()
                    })),
                ...positionsV2.filter(p => p.totalClaimedFeeXAmount > 0 || p.totalClaimedFeeYAmount > 0)
                    .map(position => ({
                        wallet_address: position.owner,
                        pool_address: position.lbPair,
                        position_id: position.pubkey,
                        tx_hash: `synthetic-fee-claim-${position.pubkey.substring(0, 8)}`,
                        token_x_amount: position.totalClaimedFeeXAmount?.toString() || '0',
                        token_y_amount: position.totalClaimedFeeYAmount?.toString() || '0',
                        timestamp: new Date().toISOString()
                    }))
            ];
            
            return {
                success: true,
                data: {
                    result: claims
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserClaims', error)
            };
        }
    }
    
    /**
     * Get all rewards claimed by a user using position data
     * @param {string} walletAddress - User wallet address
     * @returns {Promise<Object>} User reward claims
     */
    async getAllUserRewardClaims(walletAddress) {
        try {
            // First, get position data which contains rewards claimed
            const positionResult = await this.getPositionDataWithEvents(walletAddress);
            
            if (!positionResult.success) {
                return positionResult;
            }
            
            const { positionsV1 } = positionResult.data;
            
            // Create reward claim records based on totalClaimedRewards field
            // Note: V2 positions may not have this field or it might be structured differently
            const rewards = positionsV1
                .filter(p => p.totalClaimedRewards && p.totalClaimedRewards.length > 0)
                .map(position => ({
                    wallet_address: position.owner,
                    pool_address: position.lbPair,
                    position_id: position.pubkey,
                    tx_hash: `synthetic-reward-claim-${position.pubkey.substring(0, 8)}`,
                    amounts: position.totalClaimedRewards,
                    timestamp: new Date().toISOString()
                }));
            
            return {
                success: true,
                data: {
                    result: rewards
                }
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('LiquidityService.getAllUserRewardClaims', error)
            };
        }
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