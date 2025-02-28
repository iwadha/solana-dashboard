const supabase = require('./supabaseClient');
const getAllWithdrawsForUser = require('./getAllWithdrawsForUser');

async function storeUserWithdrawals(walletAddress) {
    // Fetch withdrawal data
    const withdrawals = await getAllWithdrawsForUser(walletAddress);

    // Prepare data for the `user_withdrawals` table
    const withdrawalRecord = {
        wallet_address: walletAddress,
        withdrawals: withdrawals.result, // Withdrawals in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `user_withdrawals` table
    const { data, error } = await supabase
        .from('user_withdrawals')
        .insert([withdrawalRecord]);

    if (error) {
        console.error('Error storing withdrawals:', error);
    } else {
        console.log('Withdrawals stored successfully:', data);
    }
}

// Example usage
storeUserWithdrawals('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');