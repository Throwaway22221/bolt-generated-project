import React from 'react';

function EmailList({ emails, onSelectEmail, onDeleteEmail }) {
  return (
    <div>
      {Object.entries(emails).map(([username, userEmails]) => (
        <div key={username}>
          <h3>{username}</h3>
          <ul>
            {userEmails.map((email) => (
              <li key={email.id}>
                <div onClick={() => onSelectEmail(email.id)}>
                  <p>
                    <strong>From:</strong> {email.from.emailAddress.name}
                  </p>
                  <p>
                    <strong>Subject:</strong> {email.subject}
                  </p>
                </div>
                <button onClick={() => onDeleteEmail(username, email.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default EmailList;
