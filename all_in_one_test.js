require('dotenv').config();
const supabase = require('./src/database/supabaseClient');
const config = require('./src/config');

// Test wallet address from config
const testWallet = config.TEST_WALLETS[0];

// Implementation of fetching data using GraphQL directly
// This is a simplified version for the test
async function getUserPositions(walletAddress) {
  const query = `
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
  
  // URL for GraphQL API
  const url = 'https://programs.shyft.to/v0/graphql';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.SHYFT_API_KEY
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { owner: walletAddress }
      })
    });
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return { success: false, error: data.errors[0] };
    }
    
    // Combine V1 and V2 positions
    const positionsV1 = data.data.meteora_dlmm_Position || [];
    const positionsV2 = data.data.meteora_dlmm_PositionV2 || [];
    const positions = [...positionsV1, ...positionsV2];
    
    return { success: true, positions };
  } catch (error) {
    console.error('Error fetching positions:', error);
    return { success: false, error };
  }
}

// Create synthetic data for deposits, withdrawals, and claims
function createSyntheticData(positions) {
  // Create synthetic deposits for each position
  const deposits = positions.map(position => ({
    wallet_address: position.owner,
    pool_address: position.lbPair,
    position_id: position.pubkey,
    tx_hash: `synthetic-deposit-${position.pubkey.substring(0, 8)}`,
    token_x_amount: '0',
    token_y_amount: '0',
    liquidity_amount: position.liquidityShares?.toString() || '0',
    timestamp: new Date().toISOString()
  }));
  
  // Create synthetic fee claims for positions with claimed fees
  const claims = positions
    .filter(p => p.totalClaimedFeeXAmount > 0 || p.totalClaimedFeeYAmount > 0)
    .map(position => ({
      wallet_address: position.owner,
      pool_address: position.lbPair,
      position_id: position.pubkey,
      tx_hash: `synthetic-fee-claim-${position.pubkey.substring(0, 8)}`,
      token_x_amount: position.totalClaimedFeeXAmount?.toString() || '0',
      token_y_amount: position.totalClaimedFeeYAmount?.toString() || '0',
      timestamp: new Date().toISOString()
    }));
  
  // No synthetic withdrawals for this test
  const withdrawals = [];
  
  return { deposits, withdrawals, claims };
}

// Run the test with consolidated approach
async function testConsolidatedApproach() {
  console.log('===== TESTING CONSOLIDATED DATA STORAGE =====');
  console.log(`Using wallet address: ${testWallet}`);
  
  try {
    // Step 1: Fetch positions
    console.log('\n----- STEP 1: Fetching Positions -----');
    const positionResult = await getUserPositions(testWallet);
    
    if (!positionResult.success) {
      console.error('Error fetching positions:', positionResult.error);
      return;
    }
    
    const positions = positionResult.positions;
    console.log(`Retrieved ${positions.length} positions`);
    
    // Step 2: Create synthetic data
    console.log('\n----- STEP 2: Creating Synthetic Data -----');
    const { deposits, withdrawals, claims } = createSyntheticData(positions);
    console.log(`Created synthetic data: ${deposits.length} deposits, ${withdrawals.length} withdrawals, ${claims.length} fee claims`);
    
    // Step 3: Consolidate all data
    console.log('\n----- STEP 3: Storing All Data in Wallet -----');
    
    // First check if wallet exists
    const { data: existingWallet, error: queryError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (queryError) {
      console.error('Error querying wallet:', queryError);
      return;
    }
    
    // Create wallet data with all fields combined
    const walletData = {
      wallet_address: testWallet,
      sol_balance: existingWallet?.[0]?.sol_balance || 0,
      token_balances: existingWallet?.[0]?.token_balances || [],
      liquidity_positions: positions,
      lp_positions: {
        data: positions,
        deposits: deposits,
        withdrawals: withdrawals,
        fee_claims: claims,
        reward_claims: []
      },
      updated_at: new Date().toISOString()
    };
    
    // Store the wallet data using a single operation
    let result;
    
    if (existingWallet && existingWallet.length > 0) {
      console.log('Updating existing wallet with consolidated data');
      const { data, error } = await supabase
        .from('wallets')
        .update(walletData)
        .eq('wallet_address', testWallet)
        .select();
        
      result = { data, error };
    } else {
      console.log('Creating new wallet with consolidated data');
      const { data, error } = await supabase
        .from('wallets')
        .insert([{ ...walletData, created_at: new Date().toISOString() }])
        .select();
        
      result = { data, error };
    }
    
    if (result.error) {
      console.error('Error storing wallet data:', result.error);
      return;
    }
    
    console.log('Successfully stored all data in wallet record');
    
    // Step 4: Verify the stored data
    console.log('\n----- STEP 4: Verifying Stored Data -----');
    const { data: updatedWallet, error: getError } = await supabase
      .from('wallets')
      .select('*')
      .eq('wallet_address', testWallet)
      .limit(1);
      
    if (getError) {
      console.error('Error retrieving wallet data:', getError);
      return;
    }
    
    const wallet = updatedWallet[0];
    
    console.log('Wallet data verification:');
    console.log('- Wallet address:', wallet.wallet_address);
    console.log('- SOL balance:', wallet.sol_balance);
    console.log('- Liquidity positions count:', (wallet.liquidity_positions || []).length);
    console.log('- LP Positions data available:', wallet.lp_positions !== null);
    
    if (wallet.lp_positions) {
      console.log('- Positions in lp_positions.data:', (wallet.lp_positions.data || []).length);
      console.log('- Deposits in lp_positions.deposits:', (wallet.lp_positions.deposits || []).length);
      console.log('- Fee claims in lp_positions.fee_claims:', (wallet.lp_positions.fee_claims || []).length);
    } else {
      console.log('WARNING: lp_positions is null');
    }
    
    console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testConsolidatedApproach();