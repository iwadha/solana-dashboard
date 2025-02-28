const walletService = require('../api/shyft/walletService');
const config = require('../config');

async function testWalletFetch() {
    const testWallet = config.TEST_WALLETS[0];
    console.log(`Testing wallet fetch for: ${testWallet}`);
    
    try {
        // Test balance fetch
        console.log('\nTesting getBalance()...');
        const balanceResult = await walletService.getBalance(testWallet);
        
        if (balanceResult.success) {
            console.log('✅ Successfully fetched balance:');
            console.log(JSON.stringify(balanceResult.data.result, null, 2));
        } else {
            console.error('❌ Failed to fetch balance:', balanceResult.error);
        }
        
        // Test tokens fetch
        console.log('\nTesting getTokens()...');
        const tokensResult = await walletService.getTokens(testWallet);
        
        if (tokensResult.success) {
            console.log('✅ Successfully fetched tokens:');
            console.log(`Found ${tokensResult.data.result.length} tokens`);
            
            // Show first 3 tokens as example
            const sampleTokens = tokensResult.data.result.slice(0, 3);
            console.log(JSON.stringify(sampleTokens, null, 2));
        } else {
            console.error('❌ Failed to fetch tokens:', tokensResult.error);
        }
        
        // Test complete wallet data fetch
        console.log('\nTesting getWalletData()...');
        const walletResult = await walletService.getWalletData(testWallet);
        
        if (walletResult.success) {
            console.log('✅ Successfully fetched wallet data:');
            console.log(`SOL Balance: ${walletResult.data.sol_balance}`);
            console.log(`Token Count: ${walletResult.data.token_balances.length}`);
        } else {
            console.error('❌ Failed to fetch wallet data:', walletResult.error);
        }
        
    } catch (error) {
        console.error('Error in test:', error);
    }
}

// Run the test
testWalletFetch().catch(console.error);