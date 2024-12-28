import { useState, useEffect } from 'react';
import { fetchEmails, fetchEmailContent, deleteEmail } from '../api';
import { invalidateCache, getCachedEmails } from '../cache';
import { getToken } from '../auth';
import log from '../logger';

/**
 * Custom hook to handle email fetching and management logic.
 * @param {object} user - The current user.
 * @param {boolean} isOnline - Whether the application is online.
 * @returns {object} - An object containing email state and functions.
 */
const useEmail = (user, isOnline) => {
  const [emails, setEmails] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState({});

  const fetchEmailData = async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken(user.username);
        if (token) {
          let fetchedEmails;
          if (isOnline) {
            fetchedEmails = await fetchEmails(token, user.username);
          } else {
            fetchedEmails = getCachedEmails(user.username) || [];
          }
          setEmails((prevEmails) => ({
            ...prevEmails,
            [user.username]: fetchedEmails,
          }));
          setFilteredEmails((prevFilteredEmails) => ({
            ...prevFilteredEmails,
            [user.username]: fetchedEmails,
          }));
        }
      } catch (err) {
        log(`Error fetching emails:`, err);
        setError(err.message || 'Failed to fetch emails');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, [user, isOnline]);

  const handleSelectEmail = async (messageId) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken(user.username);
      if (token) {
        const emailContent = await fetchEmailContent(token, messageId);
        setSelectedEmail(emailContent);
      }
    } catch (err) {
      log(`Error fetching email content:`, err);
      setError(err.message || 'Failed to fetch email content');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = Object.entries(emails).reduce((acc, [username, userEmails]) => {
        const filteredUserEmails = userEmails.filter(email =>
          email.subject.toLowerCase().includes(query.toLowerCase()) ||
          email.from.emailAddress.name.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredUserEmails.length > 0) {
          acc[username] = filteredUserEmails;
        }
        return acc;
      }, {});
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emails);
    }
  };

  const handleDeleteEmail = async (username, messageId) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken(username);
      if (token) {
        await deleteEmail(token, messageId);
        setEmails((prevEmails) => {
          const updatedEmails = { ...prevEmails };
          if (updatedEmails[username]) {
            updatedEmails[username] = updatedEmails[username].filter(email => email.id !== messageId);
          }
          return updatedEmails;
        });
        setFilteredEmails((prevFilteredEmails) => {
          const updatedFilteredEmails = { ...prevFilteredEmails };
           if (updatedFilteredEmails[username]) {
            updatedFilteredEmails[username] = updatedFilteredEmails[username].filter(email => email.id !== messageId);
          }
          return updatedFilteredEmails;
        });
        invalidateCache(username);
      }
    } catch (err) {
      log(`Error deleting email:`, err);
      setError(err.message || 'Failed to delete email');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchEmailData();
  };

  return {
    emails,
    selectedEmail,
    loading,
    error,
    searchQuery,
    filteredEmails,
    handleSelectEmail,
    handleSearch,
    handleDeleteEmail,
    handleRetry,
  };
};

export default useEmail;
