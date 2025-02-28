const { SHYFT_API_KEY } = require('./config');
const axios = require('axios');

async function fetchWalletData(walletAddress) {
    const url = `https://api.shyft.to/sol/v1/wallet/balance?network=mainnet-beta&wallet=${walletAddress}`;
    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': SHYFT_API_KEY }
        });
        console.log('Wallet Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
}

module.exports = fetchWalletData;