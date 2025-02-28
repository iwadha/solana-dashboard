const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getUserWalletPositions(walletAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/positions?network=mainnet-beta&wallet=${walletAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('User Wallet Positions:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user wallet positions:', error);
    }
}

// Export the function
module.exports = getUserWalletPositions;

// Example usage
getUserWalletPositions('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');