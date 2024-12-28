import React from 'react';
import EmailList from '../EmailList';
import EmailPreview from '../EmailPreview';

/**
 * Renders the email content.
 * @param {object} props - The component props.
 * @param {object} props.filteredEmails - The filtered emails.
 * @param {function} props.onSelectEmail - The function to handle email selection.
 * @param {object} props.selectedEmail - The selected email.
 * @param {function} props.onDeleteEmail - The function to handle email deletion.
 */
function EmailContent({ filteredEmails, onSelectEmail, selectedEmail, onDeleteEmail }) {
  return (
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
  );
}

export default EmailContent;
