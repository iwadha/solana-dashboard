const supabase = require('./supabaseClient');
const getAllDepositsForUser = require('./getAllDepositsForUser');

async function storeUserDeposits(walletAddress) {
    // Fetch deposit data
    const deposits = await getAllDepositsForUser(walletAddress);

    // Prepare data for the `user_deposits` table
    const depositRecord = {
        wallet_address: walletAddress,
        deposits: deposits.result, // Deposits in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `user_deposits` table
    const { data, error } = await supabase
        .from('user_deposits')
        .insert([depositRecord]);

    if (error) {
        console.error('Error storing deposits:', error);
    } else {
        console.log('Deposits stored successfully:', data);
    }
}

// Example usage
storeUserDeposits('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');