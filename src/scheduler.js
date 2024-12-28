import { fetchEmails } from './api';
import { getToken } from './auth';
import globalQueue from './queue';
import { getSettings, saveSettings } from './settings';
import log from './logger';
import getRandomInterval from './utils/randomInterval';

/**
 * Schedules email checks for a user.
 * @param {object} account - The account object.
 * @param {function} setEmails - The function to set the emails state.
 * @param {function} setFilteredEmails - The function to set the filtered emails state.
 * @param {function} setLoading - The function to set the loading state.
 * @param {function} setError - The function to set the error state.
 */
const scheduleEmailCheck = async (account, setEmails, setFilteredEmails, setLoading, setError) => {
  const settings = getSettings();
  const minInterval = settings.minInterval || 300;
  const maxInterval = settings.maxInterval || 600;

  /**
   * Checks emails for a user.
   */
  const checkEmails = async () => {
    log(`Checking emails for user: ${account.username}`);
    setLoading(true);
    setError(null);
    try {
      const token = await getToken(account.username);
      if (token) {
        const fetchedEmails = await fetchEmails(token, account.username);
        setEmails(fetchedEmails);
        setFilteredEmails(fetchedEmails);
        saveSettings({ ...getSettings(), lastSync: Date.now() });
        log(`Successfully checked emails for user: ${account.username}`);
      }
    } catch (err) {
      log(`Error checking emails for user: ${account.username}`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a task to check emails and schedule the next check.
   */
  const task = async () => {
    await checkEmails();
    const interval = getRandomInterval(minInterval, maxInterval);
    setTimeout(() => {
      globalQueue.enqueue(task);
    }, interval);
  };

  globalQueue.enqueue(task);
};

/**
 * Starts background sync for a user.
 * @param {object} account - The account object.
 * @param {function} setEmails - The function to set the emails state.
 * @param {function} setFilteredEmails - The function to set the filtered emails state.
 * @param {function} setLoading - The function to set the loading state.
 * @param {function} setError - The function to set the error state.
 * @returns {number} - The interval ID.
 */
export const startBackgroundSync = (account, setEmails, setFilteredEmails, setLoading, setError) => {
  const settings = getSettings();
  const syncInterval = settings.syncInterval || 300;

  /**
   * Syncs emails for a user.
   */
  const syncEmails = async () => {
    log(`Starting background sync for user: ${account.username}`);
    try {
      const token = await getToken(account.username);
      if (token) {
        const fetchedEmails = await fetchEmails(token, account.username);
        setEmails(fetchedEmails);
        setFilteredEmails(fetchedEmails);
        log(`Background sync successful for user: ${account.username}`);
      }
    } catch (error) {
      log(`Error during background sync for user: ${account.username}`, error);
      console.error("Error during background sync:", error);
    }
  };

  const intervalId = setInterval(() => {
    globalQueue.enqueue(syncEmails);
  }, syncInterval * 1000);

  log(`Background sync started for user: ${account.username} with interval: ${syncInterval} seconds`);
  return intervalId;
};

/**
 * Stops background sync.
 * @param {number} intervalId - The interval ID to clear.
 */
export const stopBackgroundSync = (intervalId) => {
  clearInterval(intervalId);
  log(`Background sync stopped`);
};

export default scheduleEmailCheck;
