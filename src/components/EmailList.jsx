import React from 'react';

        const EmailList = ({ emails, selectedAccount }) => {
        return (
            selectedAccount && (
            <>
                <h3>Emails for {selectedAccount.name}:</h3>
                <ul>
                {emails.map(email => (
                    <li key={email.id}>
                    {email.subject} - From: {email.from.emailAddress.address}
                    </li>
                ))}
                </ul>
            </>
            )
        );
        };

        export default EmailList;
