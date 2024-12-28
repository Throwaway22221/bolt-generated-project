import log from './logger';

// Key for storing settings in localStorage
const SETTINGS_STORAGE_KEY = 'app_settings';

// Default settings
const defaultSettings = {
  theme: 'light',
  minInterval: 300,
  maxInterval: 600,
  maxConnections: 1,
  syncInterval: 300,
  maxRetries: 3,
  retryDelay: 1,
};

/**
 * Gets the stored settings from localStorage.
 * @returns {object} - The stored settings or default settings if not found.
 */
export const getSettings = () => {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  try {
    const settings = storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings;
    log(`Retrieved settings:`, settings);
    return settings;
  } catch (error) {
    log(`Error parsing stored settings:`, error);
    return defaultSettings;
  }
};

/**
 * Saves settings to localStorage.
 * @param {object} settings - The settings object to save.
 */
export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  log(`Saved settings:`, settings);
};

/**
 * Clears settings from localStorage.
 */
export const clearSettings = () => {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  log(`Cleared settings`);
};
