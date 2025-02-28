const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getAllWithdrawsForUser(walletAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/withdraws?network=mainnet-beta&wallet=${walletAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('All Withdraws for User:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching withdraws for user:', error);
    }
}

// Export the function
module.exports = getAllWithdrawsForUser;

// Example usage
getAllWithdrawsForUser('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');