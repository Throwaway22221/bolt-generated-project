import React, { useState, useEffect } from 'react';
import { signIn, signOut, handleRedirect, getToken, getAllAccounts } from './auth';
import { fetchEmails, fetchEmailContent, deleteEmail } from './api';
import { getSettings, saveSettings } from './settings';
import SettingsTab from './SettingsTab';
import scheduleEmailCheck, { startBackgroundSync, stopBackgroundSync } from './scheduler';
import AccountTab from './AccountTab';
import { invalidateCache, getCachedEmails } from './cache';
import AccountButtons from './components/AccountButtons';
import TabButtons from './components/TabButtons';
import EmailSection from './components/EmailSection';
import './App.css';

/**
 * Main application component.
 */
function App() {
  // State variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState({});
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('emails');
  const [accounts, setAccounts] = useState({});
  const [syncIntervalId, setSyncIntervalId] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load settings and set theme on mount
  useEffect(() => {
    const storedSettings = getSettings();
    setTheme(storedSettings.theme);
    document.body.classList.toggle('dark-theme', storedSettings.theme === 'dark');

    // Event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const account = await handleRedirect();
      if (account) {
        setIsAuthenticated(true);
        setUser(account);
      }
    };
    checkAuthentication();
  }, []);

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = () => {
      const storedAccounts = getAllAccounts();
      setAccounts(storedAccounts);
    };
    fetchAccounts();
  }, []);

  // Sign in handler
  const handleSignIn = async () => {
    await signIn();
  };

  // Sign out handler
  const handleSignOut = async (username) => {
    await signOut(username);
    setIsAuthenticated(false);
    setUser(null);
    setEmails({});
    setSelectedEmail(null);
    const storedAccounts = getAllAccounts();
    setAccounts(storedAccounts);
    if (syncIntervalId) {
      stopBackgroundSync(syncIntervalId);
      setSyncIntervalId(null);
    }
  };

  // Fetch emails on authentication and user change
  useEffect(() => {
    const fetchEmailData = async () => {
      if (isAuthenticated && user) {
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
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEmailData();
  }, [isAuthenticated, user, isOnline]);

  // Start background sync on authentication, user change, and online status
  useEffect(() => {
    if (isAuthenticated && user && isOnline) {
      scheduleEmailCheck(user, setEmails, setFilteredEmails, setLoading, setError);
      const intervalId = startBackgroundSync(user, setEmails, setFilteredEmails, setLoading, setError);
      setSyncIntervalId(intervalId);
    }
    return () => {
      if (syncIntervalId) {
        stopBackgroundSync(syncIntervalId);
      }
    };
  }, [isAuthenticated, user, isOnline]);

  // Handle email selection
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
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

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    saveSettings({ ...getSettings(), theme: newTheme });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle account change
  const handleAccountChange = (account) => {
    setUser(account);
    setIsAuthenticated(true);
  };

  // Handle email deletion
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="header">
        <h1>Email Client</h1>
        <AccountButtons
          accounts={accounts}
          onAccountChange={handleAccountChange}
          onSignIn={handleSignIn}
          isAuthenticated={isAuthenticated}
        />
        <div style={{ color: isOnline ? 'green' : 'red' }}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <TabButtons activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="content-area">
        {activeTab === 'emails' && isAuthenticated && user && (
          <EmailSection
            user={user}
            onSignOut={handleSignOut}
            toggleTheme={toggleTheme}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            loading={loading}
            error={error}
            filteredEmails={filteredEmails}
            onSelectEmail={handleSelectEmail}
            selectedEmail={selectedEmail}
            onDeleteEmail={handleDeleteEmail}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'accounts' && <AccountTab accounts={accounts} onSignIn={handleSignIn} />}
      </div>
    </div>
  );
}

export default App;
