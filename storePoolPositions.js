const supabase = require('./supabaseClient');
const fetchLiquidityData = require('./fetchLiquidityData');

async function storePoolPositions(walletAddress) {
    // Fetch liquidity pool data
    const liquidityData = await fetchLiquidityData(walletAddress);

    // Check if liquidityData exists and has positions
    if (!liquidityData || !liquidityData.positions) {
        console.error('No liquidity data found.');
        return;
    }

    // Prepare data for the `pool_positions` table
    const poolPositionRecord = {
        pool_address: liquidityData.poolAddress, // Adjust based on actual response keys
        tokenXMint: liquidityData.tokenXMint,
        tokenYMint: liquidityData.tokenYMint,
        all_positions: liquidityData.positions,
        created_at: new Date().toISOString()
    };

    // Insert data into the `pool_positions` table
    const { data, error } = await supabase
        .from('pool_positions')
        .insert([poolPositionRecord]);

    if (error) {
        console.error('Error storing pool positions:', error);
    } else {
        console.log('Pool positions stored successfully:', data);
    }
}

// Example usage
storePoolPositions('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');