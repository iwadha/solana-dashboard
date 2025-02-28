const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getAllLBPositionPairs() {
    const url = 'https://api.shyft.to/sol/v1/lb/pairs?network=mainnet-beta';
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('All LB Position Pairs:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching LB position pairs:', error);
    }
}

// Export the function
module.exports = getAllLBPositionPairs;

// Example usage
getAllLBPositionPairs();