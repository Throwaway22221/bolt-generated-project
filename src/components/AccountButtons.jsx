import React from 'react';

/**
 * Renders the account buttons.
 * @param {object} props - The component props.
 * @param {object} props.accounts - The accounts object.
 * @param {function} props.onAccountChange - The function to handle account changes.
 * @param {function} props.onSignIn - The function to handle sign in.
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated.
 */
function AccountButtons({ accounts, onAccountChange, onSignIn, isAuthenticated }) {
  return (
    <div className="account-buttons">
      {Object.values(accounts).map((account) => (
        <button key={account.account.username} onClick={() => onAccountChange(account.account)}>
          {account.account.username}
        </button>
      ))}
      {!isAuthenticated && <button onClick={onSignIn}>Add Account</button>}
    </div>
  );
}

export default AccountButtons;
