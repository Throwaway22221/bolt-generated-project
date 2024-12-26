import React from 'react';
    import AccountList from './AccountList';

    const AccountTab = ({ accounts, handleAccountSelect, removeAccount }) => {
      return (
        <div className="account-tab">
          <AccountList accounts={accounts} handleAccountSelect={handleAccountSelect} removeAccount={removeAccount} />
        </div>
      );
    };

    export default AccountTab;
