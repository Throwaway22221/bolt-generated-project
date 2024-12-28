import React from 'react';
import EmailList from '../EmailList';
import EmailPreview from '../EmailPreview';
import SearchBar from '../SearchBar';

/**
 * Renders the email section.
 * @param {object} props - The component props.
 * @param {object} props.user - The current user.
 * @param {function} props.onSignOut - The function to handle sign out.
 * @param {function} props.toggleTheme - The function to toggle the theme.
 * @param {string} props.searchQuery - The current search query.
 * @param {function} props.onSearch - The function to handle search.
 * @param {boolean} props.loading - Whether the application is loading.
 * @param {string} props.error - The current error message.
 * @param {object} props.filteredEmails - The filtered emails.
 * @param {function} props.onSelectEmail - The function to handle email selection.
 * @param {object} props.selectedEmail - The selected email.
 * @param {function} props.onDeleteEmail - The function to handle email deletion.
 */
function EmailSection({
  user,
  onSignOut,
  toggleTheme,
  searchQuery,
  onSearch,
  loading,
  error,
  filteredEmails,
  onSelectEmail,
  selectedEmail,
  onDeleteEmail,
}) {
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={() => onSignOut(user.username)}>Sign Out</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <div className="search-bar-container">
        <SearchBar onSearch={onSearch} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <div className="email-list-container">
            <EmailList emails={filteredEmails} onSelectEmail={onSelectEmail} onDeleteEmail={onDeleteEmail} />
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div className="email-preview-container">
            <EmailPreview email={selectedEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSection;
