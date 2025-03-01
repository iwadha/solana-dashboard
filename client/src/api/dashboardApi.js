/**
 * API client for connecting to the Solana Dashboard backend
 */

// Mock base URL - in real app, this would come from environment variables
const API_BASE_URL = '/api';

/**
 * Handles API responses consistently
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Parsed response data
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Generic request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response
 */
const request = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

// API Methods
const dashboardApi = {
  /**
   * Get wallet dashboard data
   * @param {string} walletAddress - Solana wallet address
   * @returns {Promise<Object>} - Dashboard data
   */
  getWalletDashboard: (walletAddress) => {
    return request(`/wallet/${walletAddress}/dashboard`);
  },
  
  /**
   * Get wallet positions
   * @param {string} walletAddress - Solana wallet address
   * @returns {Promise<Array>} - List of positions
   */
  getWalletPositions: (walletAddress) => {
    return request(`/wallet/${walletAddress}/positions`);
  },
  
  /**
   * Get wallet transactions
   * @param {string} walletAddress - Solana wallet address
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of transactions
   */
  getWalletTransactions: (walletAddress, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.pool) queryParams.append('pool', filters.pool);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);
    
    const queryString = queryParams.toString() 
      ? `?${queryParams.toString()}` 
      : '';
      
    return request(`/wallet/${walletAddress}/transactions${queryString}`);
  },
  
  /**
   * Get detailed transaction data
   * @param {string} walletAddress - Solana wallet address
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} - Transaction details
   */
  getTransactionDetails: (walletAddress, transactionId) => {
    return request(`/wallet/${walletAddress}/transactions/${transactionId}`);
  }
};

export default dashboardApi;