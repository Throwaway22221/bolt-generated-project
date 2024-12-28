import React, { useState, useEffect } from 'react';
import { startBackgroundSync, stopBackgroundSync } from './scheduler';
import AccountTab from './AccountTab';
import AccountButtons from './components/AccountButtons';
import TabButtons from './components/TabButtons';
import EmailSection from './components/EmailSection';
import useAuth from './hooks/useAuth';
import useEmail from './hooks/useEmail';
import useSettings from './hooks/useSettings';
import './App.css';

/**
 * Main application component.
 */
function App() {
  const [activeTab, setActiveTab] = useState('emails');
  const [syncIntervalId, setSyncIntervalId] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { isAuthenticated, user, accounts, handleSignIn, handleSignOut, handleAccountChange } = useAuth();
  const { theme, toggleTheme } = useSettings();
  const {
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
  } = useEmail(user, isOnline);

  useEffect(() => {
    document.body.style.fontSize = `${getSettings().fontSize}px`;
    document.documentElement.style.setProperty('--primary-color', getSettings().primaryColor);
    document.documentElement.style.setProperty('--secondary-color', getSettings().secondaryColor);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && isOnline) {
      const intervalId = startBackgroundSync(user, setEmails, setFilteredEmails, setLoading, setError);
      setSyncIntervalId(intervalId);
    }
    return () => {
      if (syncIntervalId) {
        stopBackgroundSync(syncIntervalId);
      }
    };
  }, [isAuthenticated, user, isOnline]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
            onRetry={handleRetry}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'accounts' && <AccountTab accounts={accounts} onSignIn={handleSignIn} />}
      </div>
    </div>
  );
}

export default App;
