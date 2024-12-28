import { setCachedEmails, getCachedEmails } from './cache';
import log from './logger';
import handleRetry from './utils/retry';

// Microsoft Graph API endpoint
const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";

/**
 * Fetches emails from all folders for a user.
 * @param {string} token - The access token.
 * @param {string} username - The username of the account.
 * @returns {Promise<Array>} - A promise that resolves with an array of emails.
 */
export const fetchEmails = async (token, username) => {
  log(`Fetching emails for user: ${username}`);
  const cachedEmails = getCachedEmails(username);
  if (cachedEmails) {
    log(`Using cached emails for user: ${username}`);
    return cachedEmails;
  }
  const apiCall = async () => {
    log(`Fetching emails from API for user: ${username}`);
    const response = await fetch(`${graphApiEndpoint}/mailFolders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const folders = data.value;

    let allEmails = [];
    for (const folder of folders) {
      const messagesResponse = await fetch(`${graphApiEndpoint}/mailFolders/${folder.id}/messages?$top=50&$select=id,subject,from,toRecipients,isRead`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!messagesResponse.ok) {
        throw new Error(`HTTP error! status: ${messagesResponse.status}`);
      }
      const messagesData = await messagesResponse.json();
      const messages = messagesData.value;

      for (const message of messages) {
        if (!message.isRead) {
          await fetch(`${graphApiEndpoint}/messages/${message.id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isRead: true }),
          });
        }
      }
      allEmails = allEmails.concat(messages);
    }
    setCachedEmails(username, allEmails);
    log(`Fetched ${allEmails.length} emails from API for user: ${username}`);
    return allEmails;
  };
  try {
    return await handleRetry(apiCall);
  } catch (error) {
    log(`Error fetching emails for user: ${username}`, error);
    throw error;
  }
};

/**
 * Fetches the content of a specific email.
 * @param {string} token - The access token.
 * @param {string} messageId - The ID of the email.
 * @returns {Promise<object>} - A promise that resolves with the email content.
 */
export const fetchEmailContent = async (token, messageId) => {
  log(`Fetching email content for message ID: ${messageId}`);
  const apiCall = async () => {
    const response = await fetch(`${graphApiEndpoint}/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    log(`Fetched email content for message ID: ${messageId}`);
    return data;
  };
  try {
    return await handleRetry(apiCall);
  } catch (error) {
    log(`Error fetching email content for message ID: ${messageId}`, error);
    throw error;
  }
};

/**
 * Deletes a specific email.
 * @param {string} token - The access token.
 * @param {string} messageId - The ID of the email to delete.
 * @returns {Promise<void>} - A promise that resolves when the email is deleted.
 */
export const deleteEmail = async (token, messageId) => {
  log(`Deleting email with message ID: ${messageId}`);
  const apiCall = async () => {
    const response = await fetch(`${graphApiEndpoint}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    log(`Deleted email with message ID: ${messageId}`);
  };
  try {
    return await handleRetry(apiCall);
  } catch (error) {
    log(`Error deleting email with message ID: ${messageId}`, error);
    throw error;
  }
};
