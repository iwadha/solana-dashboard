const supabase = require('./supabaseClient');
const getAllFeesClaimedByUser = require('./getAllFeesClaimedByUser');

async function storeUserClaims(walletAddress) {
    // Fetch claimed fees data
    const claimedFees = await getAllFeesClaimedByUser(walletAddress);

    // Check if the response is valid
    if (!claimedFees || !claimedFees.success) {
        console.error('Failed to fetch claimed fees.');
        return;
    }

    // Prepare data for the `user_claimed_fees` table
    const claimRecord = {
        wallet_address: walletAddress,
        claimed_fees: claimedFees.result || [], // Use `result` if it exists, else default to an empty array
        created_at: new Date().toISOString()
    };

    // Insert data into the `user_claimed_fees` table
    const { data, error } = await supabase
        .from('user_claimed_fees')
        .insert([claimRecord]);

    if (error) {
        console.error('Error storing claimed fees:', error);
    } else {
        console.log('Claimed fees stored successfully:', data);
    }
}

// Example usage
storeUserClaims('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');