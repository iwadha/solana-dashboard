const axios = require('axios');
const config = require('../../config');
const { handleError } = require('../../utils/errorHandler');

/**
 * Base Shyft API client with common functionality
 */
class ShyftClient {
    constructor() {
        this.baseUrl = 'https://api.shyft.to/sol/v1';
        this.network = config.NETWORK;
        this.headers = {
            'x-api-key': config.SHYFT_API_KEY
        };
        console.log('Using Shyft API key:', config.SHYFT_API_KEY);
    }

    /**
     * Make a GET request to the Shyft API
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response data or error
     */
    async get(endpoint, params = {}) {
        try {
            // Add network parameter if not explicitly provided
            if (!params.network) {
                params.network = this.network;
            }
            
            const queryString = Object.entries(params)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
                
            const url = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
            
            const response = await axios.get(url, { headers: this.headers });
            
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('ShyftClient.get', error)
            };
        }
    }
}

module.exports = new ShyftClient();