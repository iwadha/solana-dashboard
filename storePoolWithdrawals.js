const supabase = require('./supabaseClient');
const getAllWithdrawsForUser = require('./getAllWithdrawsForUser');

async function storePoolWithdrawals(walletAddress) {
    // Fetch withdrawal data
    const withdrawals = await getAllWithdrawsForUser(walletAddress);

    // Prepare data for the `pool_withdrawals` table
    const withdrawalRecord = {
        pool_address: withdrawals.result.poolAddress,
        token_x: withdrawals.result.tokenXMint,
        token_y: withdrawals.result.tokenYMint,
        all_positions: withdrawals.result.positions, // Withdrawals in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `pool_withdrawals` table
    const { data, error } = await supabase
        .from('pool_withdrawals')
        .insert([withdrawalRecord]);

    if (error) {
        console.error('Error storing pool withdrawals:', error);
    } else {
        console.log('Pool withdrawals stored successfully:', data);
    }
}

// Example usage
storePoolWithdrawals('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');