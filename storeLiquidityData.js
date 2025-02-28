const supabase = require('./supabaseClient');
const fetchLiquidityData = require('./fetchLiquidityData');

async function storeLiquidityData(walletAddress) {
    // Fetch liquidity pool data
    const liquidityData = await fetchLiquidityData(walletAddress);

    // Prepare data for the `pools` table
    const poolRecord = {
        pool_address: liquidityData.result.poolAddress,
        tokenXMint: liquidityData.result.tokenXMint,
        tokenYMint: liquidityData.result.tokenYMint,
        all_positions: liquidityData.result.positions, // All positions in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `pools` table
    const { data, error } = await supabase
        .from('pools')
        .insert([poolRecord]);

    if (error) {
        console.error('Error storing liquidity data:', error);
    } else {
        console.log('Liquidity data stored successfully:', data);
    }
}

// Example usage
storeLiquidityData('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');