const supabase = require('./supabaseClient');
const getUserWalletPositions = require('./getUserWalletPositions');

async function storeUserPositions(walletAddress) {
    // Fetch user positions data
    const positions = await getUserWalletPositions(walletAddress);

    // Prepare data for the `user_positions` table
    const positionRecord = {
        wallet_address: walletAddress,
        positions: positions.result, // Positions in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `user_positions` table
    const { data, error } = await supabase
        .from('user_positions')
        .insert([positionRecord]);

    if (error) {
        console.error('Error storing user positions:', error);
    } else {
        console.log('User positions stored successfully:', data);
    }
}

// Example usage
storeUserPositions('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');