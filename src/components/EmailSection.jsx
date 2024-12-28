import React from 'react';
import SearchBar from '../SearchBar';
import EmailHeader from './EmailHeader';
import EmailContent from './EmailContent';

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
 * @param {function} props.onRetry - The function to handle retry.
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
  onRetry,
}) {
  return (
    <div>
      <EmailHeader user={user} onSignOut={onSignOut} toggleTheme={toggleTheme} />
      <div className="search-bar-container">
        <SearchBar onSearch={onSearch} />
      </div>
      {loading && <div className="loading-indicator"></div>}
      {error && (
        <div>
          <p>Error: {error}</p>
          {onRetry && <button onClick={onRetry}>Retry</button>}
        </div>
      )}
      <EmailContent
        filteredEmails={filteredEmails}
        onSelectEmail={onSelectEmail}
        selectedEmail={selectedEmail}
        onDeleteEmail={onDeleteEmail}
      />
    </div>
  );
}

export default EmailSection;
