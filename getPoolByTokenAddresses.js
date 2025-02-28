const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getPoolByTokenAddresses(tokenA, tokenB) {
    const url = `https://api.shyft.to/sol/v1/lb/pool?network=mainnet-beta&tokenA=${tokenA}&tokenB=${tokenB}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('Pool Details:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching pool by token addresses:', error);
    }
}

// Export the function
module.exports = getPoolByTokenAddresses;

// Example usage
getPoolByTokenAddresses('TokenA_Address', 'TokenB_Address');