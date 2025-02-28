const supabase = require('./supabaseClient');
const fetchWalletData = require('./fetchWalletData');

async function storeWalletData(walletAddress) {
    // Fetch wallet data
    const walletData = await fetchWalletData(walletAddress);

    // Prepare data for the `wallets` table
    const walletRecord = {
        wallet_address: walletAddress,
        sol_balance: walletData.result.balance, // SOL balance
        token_balances: [], // Populate this with token balances if available
        liquidity_positions: [], // Populate this with liquidity positions if available
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `wallets` table
    const { data, error } = await supabase
        .from('wallets')
        .insert([walletRecord]);

    if (error) {
        console.error('Error storing wallet data:', error);
    } else {
        console.log('Wallet data stored successfully:', data);
    }
}

// Example usage
storeWalletData('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');