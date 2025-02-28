require('dotenv').config();

module.exports = {
    // API Keys
    SHYFT_API_KEY: process.env.SHYFT_API_KEY,
    
    // Network settings
    NETWORK: 'mainnet-beta',
    
    // Test wallet addresses
    TEST_WALLETS: [
        '6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8'
    ],
    
    // Test pool addresses
    TEST_POOLS: [
        'LbVRzDTvBY87rAr6WyBnMWUv8VJZpk8YaANCMSGRB3b'
    ],
    
    // Database settings
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY
};