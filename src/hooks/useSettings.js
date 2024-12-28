import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../settings';

/**
 * Custom hook to handle settings logic.
 * @returns {object} - An object containing settings state and functions.
 */
const useSettings = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedSettings = getSettings();
    setTheme(storedSettings.theme);
    document.body.classList.toggle('dark-theme', storedSettings.theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    saveSettings({ ...getSettings(), theme: newTheme });
  };

  return {
    theme,
    toggleTheme,
  };
};

export default useSettings;
