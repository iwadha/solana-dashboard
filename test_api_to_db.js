const dataService = require('./src/services/dataService');
const config = require('./src/config');
const supabase = require('./src/database/supabaseClient');

// Set environment to development for more detailed error logs
process.env.NODE_ENV = 'development';

// Test address from config
const testWallet = config.TEST_WALLETS[0];

// Helper function to log detailed errors
function logDetailedError(operation, result) {
    console.error(`❌ Failed to ${operation}:`, JSON.stringify(result.error, null, 2));
}

async function runTest() {
    console.log('===== TESTING SHYFT DATA FETCH AND SUPABASE STORAGE =====');
    console.log(`Testing with wallet address: ${testWallet}`);
    
    try {
        // Step 1: Fetch and store wallet data
        console.log('\n----- STEP 1: Fetching and storing wallet data -----');
        const walletResult = await dataService.fetchAndStoreWalletData(testWallet);
        
        if (walletResult.success) {
            console.log('✅ Successfully fetched and stored wallet data');
        } else {
            logDetailedError('fetch and store wallet data', walletResult);
        }
        
        // Step 2: Fetch and store position data
        console.log('\n----- STEP 2: Fetching and storing position data -----');
        const positionResult = await dataService.fetchAndStorePositionData(testWallet);
        
        if (positionResult.success) {
            console.log('✅ Successfully fetched and stored position data');
            console.log(`Positions found: ${positionResult.data.positions.length}`);
        } else {
            logDetailedError('fetch and store position data', positionResult);
        }
        
        // Step 3: Fetch and store deposits
        console.log('\n----- STEP 3: Fetching and storing deposits -----');
        const depositsResult = await dataService.fetchAndStoreUserDeposits(testWallet);
        
        if (depositsResult.success) {
            console.log('✅ Successfully fetched and stored deposits');
            console.log(`Deposits found: ${depositsResult.data.deposits.length}`);
        } else {
            logDetailedError('fetch and store deposits', depositsResult);
        }
        
        // Step 4: Fetch and store withdrawals
        console.log('\n----- STEP 4: Fetching and storing withdrawals -----');
        const withdrawalsResult = await dataService.fetchAndStoreUserWithdrawals(testWallet);
        
        if (withdrawalsResult.success) {
            console.log('✅ Successfully fetched and stored withdrawals');
            console.log(`Withdrawals found: ${withdrawalsResult.data?.withdrawals?.length || 0}`);
        } else {
            logDetailedError('fetch and store withdrawals', withdrawalsResult);
        }
        
        // Step 5: Fetch and store fee claims
        console.log('\n----- STEP 5: Fetching and storing fee claims -----');
        const claimsResult = await dataService.fetchAndStoreUserClaims(testWallet);
        
        if (claimsResult.success) {
            console.log('✅ Successfully fetched and stored fee claims');
            console.log(`Fee claims found: ${claimsResult.data?.claims?.length || 0}`);
        } else {
            logDetailedError('fetch and store fee claims', claimsResult);
        }
        
        // Step 6: Verify data in database
        console.log('\n----- STEP 6: Verifying stored data in Supabase -----');
        
        // Check wallets table
        const { data: walletsData, error: walletsError } = await supabase
            .from('wallets')
            .select('*')
            .eq('wallet_address', testWallet);
            
        if (walletsError) {
            console.error('Error querying wallets table:', walletsError);
        } else {
            console.log(`Wallets table records for test address: ${walletsData?.length || 0}`);
            if (walletsData && walletsData.length > 0) {
                console.log('Sample wallet record:', JSON.stringify(walletsData[0], null, 2));
            }
        }
        
        // Check pools table
        const { data: poolsData, error: poolsError } = await supabase
            .from('pools')
            .select('*')
            .limit(5);
            
        if (poolsError) {
            console.error('Error querying pools table:', poolsError);
        } else {
            console.log(`Pools table records: ${poolsData?.length || 0}`);
            if (poolsData && poolsData.length > 0) {
                console.log('Sample pool record:', JSON.stringify(poolsData[0], null, 2));
            }
        }
        
        // Check user_positions table
        const { data: positionsData, error: positionsError } = await supabase
            .from('user_positions')
            .select('*')
            .eq('wallet_address', testWallet);
            
        if (positionsError) {
            console.error('Error querying user_positions table:', positionsError);
        } else {
            console.log(`User positions table records for test address: ${positionsData?.length || 0}`);
            if (positionsData && positionsData.length > 0) {
                console.log('Sample position record:', JSON.stringify(positionsData[0], null, 2));
            }
        }
        
        // Check user_deposits table
        const { data: depositsData, error: depositsError } = await supabase
            .from('user_deposits')
            .select('*')
            .eq('wallet_address', testWallet);
            
        if (depositsError) {
            console.error('Error querying user_deposits table:', depositsError);
        } else {
            console.log(`User deposits table records for test address: ${depositsData?.length || 0}`);
            if (depositsData && depositsData.length > 0) {
                console.log('Sample deposit record:', JSON.stringify(depositsData[0], null, 2));
            }
        }
        
        // Check user_withdrawals table
        const { data: withdrawalsData, error: withdrawalsError } = await supabase
            .from('user_withdrawals')
            .select('*')
            .eq('wallet_address', testWallet);
            
        if (withdrawalsError) {
            console.error('Error querying user_withdrawals table:', withdrawalsError);
        } else {
            console.log(`User withdrawals table records for test address: ${withdrawalsData?.length || 0}`);
            if (withdrawalsData && withdrawalsData.length > 0) {
                console.log('Sample withdrawal record:', JSON.stringify(withdrawalsData[0], null, 2));
            }
        }
        
        // Check user_claims table
        const { data: claimsData, error: claimsError } = await supabase
            .from('user_claims')
            .select('*')
            .eq('wallet_address', testWallet);
            
        if (claimsError) {
            console.error('Error querying user_claims table:', claimsError);
        } else {
            console.log(`User claims table records for test address: ${claimsData?.length || 0}`);
            if (claimsData && claimsData.length > 0) {
                console.log('Sample claim record:', JSON.stringify(claimsData[0], null, 2));
            }
        }
        
    } catch (error) {
        console.error('Error running test:', error);
    }
}

// Run test
runTest()
    .then(() => {
        console.log('\n===== TEST COMPLETED =====');
        process.exit(0);
    })
    .catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });