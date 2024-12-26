import React from 'react';

        const AccountList = ({ accounts, handleAccountSelect, removeAccount }) => {
        return (
            <div className="account-section">
            <h3>Accounts:</h3>
            <ul>
                {accounts.map(account => (
                <li key={account.id}>
                    {account.name} ({account.username})
                    <button onClick={() => handleAccountSelect(account)}>Select</button>
                    <button onClick={() => removeAccount(account.id)}>Remove</button>
                </li>
                ))}
            </ul>
            </div>
        );
        };

        export default AccountList;
