import log from '../logger';

/**
 * Handles API call retries with exponential backoff.
 * @param {Function} apiCall - The API call function to retry.
 * @param {number} maxRetries - The maximum number of retries.
 * @param {number} delay - The initial delay in milliseconds.
 * @param {number} retryCount - The current retry count.
 * @returns {Promise} - A promise that resolves with the result of the API call or rejects with an error.
 */
const handleRetry = async (apiCall, maxRetries = 3, delay = 1000, retryCount = 0) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message && error.message.includes('HTTP error! status:')) {
      const status = parseInt(error.message.split('HTTP error! status: ')[1], 10);
      if (status === 429 && retryCount < maxRetries) {
        const nextDelay = delay * Math.pow(2, retryCount);
        log(`Rate limit hit. Retrying in ${nextDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, nextDelay));
        return handleRetry(apiCall, maxRetries, delay, retryCount + 1);
      }
    }
    throw error;
  }
};

export default handleRetry;
