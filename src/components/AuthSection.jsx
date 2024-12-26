import React from 'react';

    const AuthSection = ({ handleLogin, handleLogout, loading, accounts }) => {
      return (
        <div className="auth-section">
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Loading...' : 'Add Account'}
          </button>
          {accounts.length > 0 && (
            <button onClick={handleLogout} disabled={loading}>
              Logout
            </button>
          )}
        </div>
      );
    };

    export default AuthSection;
