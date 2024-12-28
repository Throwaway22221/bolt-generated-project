import { setCachedEmails, getCachedEmails } from './cache';
import log from './logger';
import handleRetry from './utils/retry';
import globalQueue from './queue';

const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";

const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const fetchAllMessages = async (token, folderId) => {
  let allMessages = [];
  let nextLink = `${graphApiEndpoint}/mailFolders/${folderId}/messages?$top=50&$select=id,subject,from,toRecipients,isRead,receivedDateTime`;

  while (nextLink) {
    const response = await fetchWithTimeout(nextLink, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allMessages = allMessages.concat(data.value);
    nextLink = data['@odata.nextLink'];
  }
  return allMessages;
};

const markAsRead = async (token, messages) => {
  if (messages.length === 0) return;
  const unreadMessages = messages.filter(message => !message.isRead);
  if (unreadMessages.length === 0) return;

  const batchPayload = {
    requests: unreadMessages.map(message => ({
      id: message.id,
      method: 'PATCH',
      url: `/me/messages/${message.id}`,
      body: { isRead: true },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  };

  const response = await fetchWithTimeout(`${graphApiEndpoint}/$batch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchPayload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const batchData = await response.json();
  if (batchData.responses) {
    batchData.responses.forEach(res => {
      if (res.status >= 400) {
        log(`Error marking message as read: ${res.id}, status: ${res.status}, body: ${JSON.stringify(res.body)}`);
      }
    });
  }
};

export const fetchEmails = async (token, username) => {
  log(`Fetching emails for user: ${username}`);
  const cachedEmails = getCachedEmails(username);
  if (cachedEmails) {
    log(`Using cached emails for user: ${username}`);
    return cachedEmails;
  }

  const apiCall = async () => {
    log(`Fetching emails from API for user: ${username}`);
    const response = await fetchWithTimeout(`${graphApiEndpoint}/mailFolders`, {
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
      const messages = await fetchAllMessages(token, folder.id);
      allEmails = allEmails.concat(messages);
    }

    await markAsRead(token, allEmails);

    allEmails.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

    setCachedEmails(username, allEmails);
    log(`Fetched ${allEmails.length} emails from API for user: ${username}`);
    return allEmails;
  };

  try {
    return await handleRetry(() => globalQueue.enqueue(apiCall));
  } catch (error) {
    log(`Error fetching emails for user: ${username}`, error);
    throw error;
  }
};

export const fetchEmailContent = async (token, messageId) => {
  log(`Fetching email content for message ID: ${messageId}`);
  const apiCall = async () => {
    const response = await fetchWithTimeout(`${graphApiEndpoint}/messages/${messageId}`, {
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

export const deleteEmail = async (token, messageId) => {
  log(`Deleting email with message ID: ${messageId}`);
  const apiCall = async () => {
    const response = await fetchWithTimeout(`${graphApiEndpoint}/messages/${messageId}`, {
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
