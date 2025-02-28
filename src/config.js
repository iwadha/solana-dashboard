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
    SUPABASE_URL: 'https://ggjkqmdwctovbblgzgyg.supabase.co',
    SUPABASE_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnamtxbWR3Y3RvdmJibGd6Z3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMDE4NjQsImV4cCI6MjA1Mzg3Nzg2NH0.9WqKxkLRwQJ7io9v45xnzaOSH1fg2k-RHkmSIce9KnE'
};