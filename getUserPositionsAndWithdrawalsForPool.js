const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function getUserPositionsAndWithdrawalsForPool(poolAddress) {
    const url = `https://api.shyft.to/sol/v1/lb/positions_and_withdrawals?network=mainnet-beta&pool=${poolAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('User Positions and Withdrawals for Pool:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user positions and withdrawals for pool:', error);
    }
}

// Export the function
module.exports = getUserPositionsAndWithdrawalsForPool;

// Example usage
getUserPositionsAndWithdrawalsForPool('Pool_Address_Here');