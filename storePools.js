const supabase = require('./supabaseClient');
const getPoolByTokenAddresses = require('./getPoolByTokenAddresses');

async function storePools(tokenA, tokenB) {
    // Fetch pool data
    const poolData = await getPoolByTokenAddresses(tokenA, tokenB);

    // Prepare data for the `pools` table
    const poolRecord = {
        token_x: tokenA,
        token_y: tokenB,
        pool_data: poolData.result, // Pool data in JSONB format
        created_at: new Date().toISOString() // Current timestamp
    };

    // Insert data into the `pools` table
    const { data, error } = await supabase
        .from('pools')
        .insert([poolRecord]);

    if (error) {
        console.error('Error storing pool data:', error);
    } else {
        console.log('Pool data stored successfully:', data);
    }
}

// Example usage
storePools('TokenA_Address', 'TokenB_Address');