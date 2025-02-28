/**
 * Validates a Solana wallet address
 * @param {string} address - Wallet address to validate
 * @returns {boolean} True if valid
 */
function isValidSolanaAddress(address) {
    // Basic check: Solana addresses are 32-44 characters
    if (!address || typeof address !== 'string') {
        return false;
    }
    
    // Solana addresses are base58 encoded and typically 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validates a pool address
 * @param {string} address - Pool address to validate
 * @returns {boolean} True if valid
 */
function isValidPoolAddress(address) {
    // Pool addresses follow the same format as wallet addresses
    return isValidSolanaAddress(address);
}

/**
 * Validates a transaction hash
 * @param {string} hash - Transaction hash to validate
 * @returns {boolean} True if valid
 */
function isValidTransactionHash(hash) {
    // Transaction hashes are base58 encoded and typically 32-44 characters
    if (!hash || typeof hash !== 'string') {
        return false;
    }
    
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(hash);
}

module.exports = {
    isValidSolanaAddress,
    isValidPoolAddress,
    isValidTransactionHash
};