const axios = require('axios');
const config = require('../../config');
const { handleError } = require('../../utils/errorHandler');

/**
 * Base Shyft API client with common functionality
 */
class ShyftClient {
    constructor() {
        // REST API endpoint
        this.restBaseUrl = 'https://api.shyft.to/sol/v1';
        // GraphQL API endpoint
        this.graphqlUrl = 'https://programs.shyft.to/v0/graphql/?api_key=' + config.SHYFT_API_KEY + '&network=' + config.NETWORK;
        
        this.network = config.NETWORK;
        this.headers = {
            'x-api-key': config.SHYFT_API_KEY
        };
        console.log('Using Shyft API key:', config.SHYFT_API_KEY);
    }

    /**
     * Make a GET request to the Shyft REST API
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
                
            const url = `${this.restBaseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
            
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
    
    /**
     * Execute a GraphQL query against the Shyft GraphQL API
     * @param {string} query - GraphQL query
     * @param {Object} variables - Query variables
     * @returns {Promise<Object>} GraphQL response data or error
     */
    async graphql(query, variables = {}) {
        try {
            const response = await axios.post(
                this.graphqlUrl,
                { query, variables },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (response.data.errors) {
                return {
                    success: false,
                    error: handleError('ShyftClient.graphql', new Error(response.data.errors[0].message))
                };
            }
            
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: handleError('ShyftClient.graphql', error)
            };
        }
    }
}

module.exports = new ShyftClient();