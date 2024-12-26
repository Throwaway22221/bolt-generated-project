import React from 'react';

    const SyncSection = ({ selectedAccount, startBackgroundSync, syncing }) => {
      return (
        <div className="sync-section">
          {selectedAccount && (
            <button onClick={startBackgroundSync} disabled={syncing}>
              {syncing ? 'Syncing...' : 'Start Sync'}
            </button>
          )}
        </div>
      );
    };

    export default SyncSection;
