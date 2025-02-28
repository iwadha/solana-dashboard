const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function fetchLiquidityData(walletAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/positions?network=mainnet-beta&wallet=${walletAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('Liquidity Pool Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching liquidity data:', error);
    }
}

module.exports = fetchLiquidityData;