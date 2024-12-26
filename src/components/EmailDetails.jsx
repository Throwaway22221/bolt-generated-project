import React from 'react';

    const EmailDetails = ({ email, onClose }) => {
      if (!email) {
        return null;
      }

      return (
        <div className="email-details">
          <div className="email-details-header">
            <h3>{email.subject}</h3>
            <button onClick={onClose}>Close</button>
          </div>
          <div className="email-details-body">
            <p><strong>From:</strong> {email.from}</p>
            <p><strong>Received:</strong> {email.received}</p>
            <div className="email-body-content">
              {email.body}
            </div>
          </div>
        </div>
      );
    };

    export default EmailDetails;
