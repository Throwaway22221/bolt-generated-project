import React from 'react';

function EmailPreview({ email }) {
  if (!email) {
    return <p>Select an email to view its content.</p>;
  }

  return (
    <div>
      <h2>{email.subject}</h2>
      <p>
        <strong>From:</strong> {email.from.emailAddress.name}
      </p>
      <p>
        <strong>To:</strong> {email.toRecipients.map(recipient => recipient.emailAddress.name).join(', ')}
      </p>
      <div dangerouslySetInnerHTML={{ __html: email.body.content }} />
    </div>
  );
}

export default EmailPreview;
