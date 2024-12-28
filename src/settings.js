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
  fontSize: 16,
  primaryColor: '#3498db',
  secondaryColor: '#2ecc71',
};

/**
 * Validates settings values.
 * @param {object} settings - The settings object to validate.
 * @returns {object} - The validated settings object.
 */
const validateSettings = (settings) => {
  const validatedSettings = { ...settings };

  if (typeof settings.theme !== 'string' || !['light', 'dark'].includes(settings.theme)) {
    log(`Invalid theme value: ${settings.theme}. Using default value: light`);
    validatedSettings.theme = defaultSettings.theme;
  }

  if (typeof settings.minInterval !== 'number' || settings.minInterval < 1) {
    log(`Invalid minInterval value: ${settings.minInterval}. Using default value: ${defaultSettings.minInterval}`);
    validatedSettings.minInterval = defaultSettings.minInterval;
  }

  if (typeof settings.maxInterval !== 'number' || settings.maxInterval < 1 || settings.maxInterval < settings.minInterval) {
    log(`Invalid maxInterval value: ${settings.maxInterval}. Using default value: ${defaultSettings.maxInterval}`);
    validatedSettings.maxInterval = defaultSettings.maxInterval;
  }

  if (typeof settings.maxConnections !== 'number' || settings.maxConnections < 1) {
    log(`Invalid maxConnections value: ${settings.maxConnections}. Using default value: ${defaultSettings.maxConnections}`);
    validatedSettings.maxConnections = defaultSettings.maxConnections;
  }

  if (typeof settings.syncInterval !== 'number' || settings.syncInterval < 1) {
    log(`Invalid syncInterval value: ${settings.syncInterval}. Using default value: ${defaultSettings.syncInterval}`);
    validatedSettings.syncInterval = defaultSettings.syncInterval;
  }

  if (typeof settings.maxRetries !== 'number' || settings.maxRetries < 0) {
    log(`Invalid maxRetries value: ${settings.maxRetries}. Using default value: ${defaultSettings.maxRetries}`);
    validatedSettings.maxRetries = defaultSettings.maxRetries;
  }

  if (typeof settings.retryDelay !== 'number' || settings.retryDelay < 1) {
    log(`Invalid retryDelay value: ${settings.retryDelay}. Using default value: ${defaultSettings.retryDelay}`);
    validatedSettings.retryDelay = defaultSettings.retryDelay;
  }

  if (typeof settings.fontSize !== 'number' || settings.fontSize < 10 || settings.fontSize > 24) {
    log(`Invalid fontSize value: ${settings.fontSize}. Using default value: ${defaultSettings.fontSize}`);
    validatedSettings.fontSize = defaultSettings.fontSize;
  }

  if (typeof settings.primaryColor !== 'string' || !/^#([0-9a-f]{3}){1,2}$/i.test(settings.primaryColor)) {
    log(`Invalid primaryColor value: ${settings.primaryColor}. Using default value: ${defaultSettings.primaryColor}`);
    validatedSettings.primaryColor = defaultSettings.primaryColor;
  }

  if (typeof settings.secondaryColor !== 'string' || !/^#([0-9a-f]{3}){1,2}$/i.test(settings.secondaryColor)) {
    log(`Invalid secondaryColor value: ${settings.secondaryColor}. Using default value: ${defaultSettings.secondaryColor}`);
    validatedSettings.secondaryColor = defaultSettings.secondaryColor;
  }

  return validatedSettings;
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
  const validatedSettings = validateSettings(settings);
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validatedSettings));
  log(`Saved settings:`, validatedSettings);
};

/**
 * Clears settings from localStorage.
 */
export const clearSettings = () => {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  log(`Cleared settings`);
};
