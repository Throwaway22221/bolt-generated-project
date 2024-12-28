import * as msal from "@azure/msal-browser";
import log from './logger';

// Function to get the redirect URI
const getRedirectUri = () => {
  const port = import.meta.env.DEV ? 5173 : window.location.port;
  return `http://localhost:${port}`;
};

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "a09751ac-c466-4c5e-a8d4-607bf546e016",
    authority: "https://login.microsoftonline.com/7ed02e8c-c093-4776-8da4-00ddccc16372",
    redirectUri: getRedirectUri(),
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Create a new MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Login request scopes
const loginRequest = {
  scopes: ["Mail.Read", "User.Read"],
};

// Key for storing accounts in localStorage
const ACCOUNTS_STORAGE_KEY = 'msal_accounts';

/**
 * Saves account information to localStorage.
 * @param {object} account - The account object.
 * @param {string} accessToken - The access token.
 * @param {string} refreshToken - The refresh token.
 * @param {number} expiresOn - The expiration timestamp.
 * @param {number} lastSync - The last sync timestamp.
 */
const saveAccount = (account, accessToken, refreshToken, expiresOn, lastSync) => {
  const accounts = getStoredAccounts() || {};
  accounts[account.username] = {
    account,
    accessToken,
    refreshToken,
    expiresOn: expiresOn.getTime(),
    lastSync,
  };
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  log(`Saved account: ${account.username}`);
};

/**
 * Retrieves stored accounts from localStorage.
 * @returns {object|null} - The stored accounts or null if not found.
 */
const getStoredAccounts = () => {
  const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  try {
    const accounts = storedAccounts ? JSON.parse(storedAccounts) : null;
    log(`Retrieved stored accounts:`, accounts);
    return accounts;
  } catch (error) {
    log(`Error parsing stored accounts:`, error);
    return null;
  }
};

/**
 * Clears stored accounts from localStorage.
 */
const clearStoredAccounts = () => {
  localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  log(`Cleared stored accounts`);
};

/**
 * Initiates the sign-in process.
 */
export const signIn = async () => {
  log(`Initiating sign in`);
  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    log(`Error during sign in:`, error);
    console.error("Error during login:", error);
  }
};

/**
 * Handles the redirect after sign-in.
 * @returns {Promise<object|null>} - A promise that resolves with the account object or null if not found.
 */
export const handleRedirect = async () => {
  log(`Handling redirect`);
  try {
    const response = await msalInstance.handleRedirectPromise();
    if (response && response.account) {
      const { accessToken, refreshToken, expiresOn } = response;
      saveAccount(response.account, accessToken, refreshToken, expiresOn, null);
      log(`Sign in successful for user: ${response.account.username}`);
      return response.account;
    }
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      log(`Redirect handled, existing accounts found`);
      return accounts[0];
    }
  } catch (error) {
    log(`Error handling redirect:`, error);
    console.error("Error handling redirect:", error);
  }
  return null;
};

/**
 * Gets a token for a user.
 * @param {string} username - The username of the account.
 * @returns {Promise<string|null>} - A promise that resolves with the access token or null if not found.
 */
export const getToken = async (username) => {
  log(`Getting token for user: ${username}`);
  const storedAccounts = getStoredAccounts();
  if (!storedAccounts || !storedAccounts[username]) {
    log(`No stored account found for user: ${username}`);
    return null;
  }
  const { account, accessToken, expiresOn } = storedAccounts[username];
  if (accessToken && expiresOn > Date.now()) {
    log(`Using cached token for user: ${username}`);
    return accessToken;
  }

  const tokenRequest = {
    scopes: ["Mail.Read", "User.Read"],
    account,
  };

  try {
    log(`Acquiring token silently for user: ${username}`);
    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    saveAccount(account, response.accessToken, response.refreshToken, response.expiresOn, storedAccounts[username].lastSync);
    log(`Token acquired silently for user: ${username}`);
    return response.accessToken;
  } catch (error) {
    if (error instanceof msal.InteractionRequiredAuthError) {
      log(`Silent token acquisition failed for user: ${username}`);
      return null;
    } else {
      log(`Error during token acquisition for user: ${username}`, error);
      console.error("Error during token acquisition:", error);
      return null;
    }
  }
};

/**
 * Signs out a user.
 * @param {string} username - The username of the account to sign out.
 */
export const signOut = async (username) => {
  log(`Signing out user: ${username}`);
  try {
    await msalInstance.logoutRedirect();
    const accounts = getStoredAccounts();
    if (accounts && accounts[username]) {
      delete accounts[username];
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      log(`Signed out user: ${username}`);
    }
  } catch (error) {
    log(`Error during sign out for user: ${username}`, error);
    console.error("Error during logout:", error);
  }
};

/**
 * Gets all stored accounts.
 * @returns {object} - An object containing all stored accounts.
 */
export const getAllAccounts = () => {
  const accounts = getStoredAccounts();
  log(`Retrieved all accounts:`, accounts);
  return accounts || {};
};
