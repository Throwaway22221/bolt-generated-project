import React from 'react';
    import EmailList from './EmailList';
    import EmailViewer from './EmailViewer';

    const EmailTab = ({ emails, selectedAccount }) => {
      return (
        <div className="email-tab">
          {selectedAccount ? (
            <>
              <EmailList emails={emails} selectedAccount={selectedAccount} />
              <EmailViewer selectedAccount={selectedAccount} />
            </>
          ) : (
            <p>No account selected.</p>
          )}
        </div>
      );
    };

    export default EmailTab;
