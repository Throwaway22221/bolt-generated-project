import React from 'react';

function AccountTab({ accounts, onSignIn }) {
  const getAccountStatus = (account) => {
    if (!account.accessToken) {
      return 'Needs Login';
    }
    if (account.expiresOn <= Date.now()) {
      return 'Needs New Token';
    }
    return 'Logged In';
  };

  return (
    <div>
      <h2>Accounts</h2>
      {Object.values(accounts).map((account) => (
        <div key={account.account.username}>
          <p>
            <strong>Username:</strong> {account.account.username}
          </p>
          <p>
            <strong>Status:</strong> {getAccountStatus(account)}
          </p>
          <p>
            <strong>Last Sync:</strong> {account.lastSync ? new Date(account.lastSync).toLocaleString() : 'Never'}
          </p>
          {getAccountStatus(account) === 'Needs Login' && (
            <button onClick={onSignIn}>Sign In</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AccountTab;
