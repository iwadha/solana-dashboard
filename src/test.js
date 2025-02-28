const walletService = require('./api/shyft/walletService');
const liquidityService = require('./api/shyft/liquidityService');
const config = require('./config');

async function test() {
    const testWallet = config.TEST_WALLETS[0];
    console.log(`Testing with wallet: ${testWallet}`);
    
    // Test wallet balance
    console.log('\n--- Testing wallet balance ---');
    const balanceResult = await walletService.getBalance(testWallet);
    if (balanceResult.success) {
        console.log('✅ Wallet balance:', balanceResult.data.result.balance, 'SOL');
    } else {
        console.error('❌ Error fetching wallet balance:', balanceResult.error);
    }
    
    // Test wallet tokens
    console.log('\n--- Testing wallet tokens ---');
    const tokensResult = await walletService.getTokens(testWallet);
    if (tokensResult.success) {
        console.log(`✅ Found ${tokensResult.data.result?.length || 0} tokens`);
        if (tokensResult.data.result?.length > 0) {
            console.log('Sample token:', tokensResult.data.result[0]);
        }
    } else {
        console.error('❌ Error fetching wallet tokens:', tokensResult.error);
    }
    
    // Test wallet data
    console.log('\n--- Testing wallet data ---');
    const walletResult = await walletService.getWalletData(testWallet);
    if (walletResult.success) {
        console.log('✅ Wallet data retrieved successfully');
        console.log('SOL Balance:', walletResult.data.sol_balance);
    } else {
        console.error('❌ Error fetching wallet data:', walletResult.error);
    }
    
    // Test liquidity pairs
    console.log('\n--- Testing liquidity pairs ---');
    const pairsResult = await liquidityService.getAllPairs();
    if (pairsResult.success) {
        console.log(`✅ Found ${pairsResult.data.result?.length || 0} liquidity pairs`);
        if (pairsResult.data.result?.length > 0) {
            console.log('Sample pair:', pairsResult.data.result[0]);
        }
    } else {
        console.error('❌ Error fetching liquidity pairs:', pairsResult.error);
    }
    
    // Test user positions with GraphQL
    console.log('\n--- Testing user positions (GraphQL) ---');
    const positionsResult = await liquidityService.getUserPositions(testWallet);
    if (positionsResult.success) {
        console.log(`✅ Found ${positionsResult.data.positions?.length || 0} positions`);
        if (positionsResult.data.positions?.length > 0) {
            console.log('Sample position:', JSON.stringify(positionsResult.data.positions[0], null, 2));
        }
    } else {
        console.error('❌ Error fetching user positions:', positionsResult.error);
    }
    
    // Test LB pair details
    if (pairsResult.success && pairsResult.data.result?.length > 0) {
        const testPair = pairsResult.data.result[0].pool_address;
        console.log(`\n--- Testing LB pair details for ${testPair} ---`);
        const lbPairResult = await liquidityService.getLbPairDetails(testPair);
        if (lbPairResult.success) {
            console.log('✅ LB pair details retrieved successfully');
            console.log('LB pair details:', JSON.stringify(lbPairResult.data.lbPair, null, 2));
        } else {
            console.error('❌ Error fetching LB pair details:', lbPairResult.error);
        }
    }
}

// Run the test
test().catch(console.error);