/**
 * Format and handle errors consistently
 * @param {string} source - The function or file where the error occurred
 * @param {Error} error - The error object
 * @param {boolean} logError - Whether to log the error
 * @returns {Object} Formatted error object
 */
function handleError(source, error, logError = true) {
    const formattedError = {
        source,
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    if (logError) {
        console.error(`Error in ${source}:`, error);
    }
    
    return formattedError;
}

module.exports = { handleError };