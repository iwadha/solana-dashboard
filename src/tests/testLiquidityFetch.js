const liquidityService = require('../api/shyft/liquidityService');
const config = require('../config');

async function testLiquidityFetch() {
    const testWallet = config.TEST_WALLETS[0];
    const testPool = config.TEST_POOLS[0];
    console.log(`Testing liquidity fetch for wallet: ${testWallet}`);
    console.log(`Testing pool: ${testPool}`);
    
    try {
        // Test all pairs fetch
        console.log('\nTesting getAllPairs()...');
        const pairsResult = await liquidityService.getAllPairs();
        
        if (pairsResult.success) {
            console.log('✅ Successfully fetched all pairs:');
            console.log(`Found ${pairsResult.data.result.length} pairs`);
            
            // Show first 2 pairs as example
            const samplePairs = pairsResult.data.result.slice(0, 2);
            console.log(JSON.stringify(samplePairs, null, 2));
        } else {
            console.error('❌ Failed to fetch pairs:', pairsResult.error);
        }
        
        // Test positions and deposits fetch
        console.log('\nTesting getPositionsAndDeposits()...');
        const positionsResult = await liquidityService.getPositionsAndDeposits(testPool);
        
        if (positionsResult.success) {
            console.log('✅ Successfully fetched positions and deposits:');
            console.log(`Found ${positionsResult.data.result?.length || 0} positions`);
            
            // Show first position if available
            if (positionsResult.data.result && positionsResult.data.result.length > 0) {
                console.log('Sample position:');
                console.log(JSON.stringify(positionsResult.data.result[0], null, 2));
            }
        } else {
            console.error('❌ Failed to fetch positions and deposits:', positionsResult.error);
        }
        
        // Test user deposits fetch
        console.log('\nTesting getAllUserDeposits()...');
        const depositsResult = await liquidityService.getAllUserDeposits(testWallet);
        
        if (depositsResult.success) {
            console.log('✅ Successfully fetched user deposits:');
            console.log(`Found ${depositsResult.data.result?.length || 0} deposits`);
            
            // Show first deposit if available
            if (depositsResult.data.result && depositsResult.data.result.length > 0) {
                console.log('Sample deposit:');
                console.log(JSON.stringify(depositsResult.data.result[0], null, 2));
            }
        } else {
            console.error('❌ Failed to fetch user deposits:', depositsResult.error);
        }
        
        // Test user withdrawals fetch
        console.log('\nTesting getAllUserWithdrawals()...');
        const withdrawalsResult = await liquidityService.getAllUserWithdrawals(testWallet);
        
        if (withdrawalsResult.success) {
            console.log('✅ Successfully fetched user withdrawals:');
            console.log(`Found ${withdrawalsResult.data.result?.length || 0} withdrawals`);
            
            // Show first withdrawal if available
            if (withdrawalsResult.data.result && withdrawalsResult.data.result.length > 0) {
                console.log('Sample withdrawal:');
                console.log(JSON.stringify(withdrawalsResult.data.result[0], null, 2));
            }
        } else {
            console.error('❌ Failed to fetch user withdrawals:', withdrawalsResult.error);
        }
        
        // Test fee claims fetch
        console.log('\nTesting getAllUserClaims()...');
        const claimsResult = await liquidityService.getAllUserClaims(testWallet);
        
        if (claimsResult.success) {
            console.log('✅ Successfully fetched user fee claims:');
            console.log(`Found ${claimsResult.data.result?.length || 0} fee claims`);
            
            // Show first claim if available
            if (claimsResult.data.result && claimsResult.data.result.length > 0) {
                console.log('Sample fee claim:');
                console.log(JSON.stringify(claimsResult.data.result[0], null, 2));
            }
        } else {
            console.error('❌ Failed to fetch user fee claims:', claimsResult.error);
        }
        
        // Test reward claims fetch
        console.log('\nTesting getAllUserRewardClaims()...');
        const rewardsResult = await liquidityService.getAllUserRewardClaims(testWallet);
        
        if (rewardsResult.success) {
            console.log('✅ Successfully fetched user reward claims:');
            console.log(`Found ${rewardsResult.data.result?.length || 0} reward claims`);
            
            // Show first reward claim if available
            if (rewardsResult.data.result && rewardsResult.data.result.length > 0) {
                console.log('Sample reward claim:');
                console.log(JSON.stringify(rewardsResult.data.result[0], null, 2));
            }
        } else {
            console.error('❌ Failed to fetch user reward claims:', rewardsResult.error);
        }
        
    } catch (error) {
        console.error('Error in test:', error);
    }
}

// Run the test
testLiquidityFetch().catch(console.error);