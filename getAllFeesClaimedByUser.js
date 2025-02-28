const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getAllFeesClaimedByUser(walletAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/fees_claimed?network=mainnet-beta&wallet=${walletAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('All Fees Claimed by User:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching fees claimed by user:', error);
    }
}

// Export the function
module.exports = getAllFeesClaimedByUser;

// Example usage
getAllFeesClaimedByUser('6p17v3VSLbamua7honnUCJcW9YoppvAU6SgsYRG4D2q8');