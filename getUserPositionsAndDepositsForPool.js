const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getUserPositionsAndDepositsForPool(poolAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/positions_and_deposits?network=mainnet-beta&pool=${poolAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('User Positions and Deposits for Pool:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user positions and deposits for pool:', error);
    }
}

// Export the function
module.exports = getUserPositionsAndDepositsForPool;

// Example usage
getUserPositionsAndDepositsForPool('Pool_Address_Here');