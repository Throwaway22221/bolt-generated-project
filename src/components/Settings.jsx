import React from 'react';

    const Settings = ({ settings, handleSettingsChange }) => {
      return (
        <div className="settings-section">
          <h3>Settings:</h3>
          <div className="settings-container">
            <label>
              Min Wait Time (s):
              <input
                type="number"
                name="minWaitTime"
                value={settings.minWaitTime / 1000}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Max Wait Time (s):
              <input
                type="number"
                name="maxWaitTime"
                value={settings.maxWaitTime / 1000}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              API Call Limit:
              <input
                type="number"
                name="apiCallLimit"
                value={settings.apiCallLimit}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Sync Interval (s):
              <input
                type="number"
                name="syncInterval"
                value={settings.syncInterval / 1000}
                onChange={handleSettingsChange}
              />
            </label>
            <label>
              Concurrent Connections:
              <input
                type="number"
                name="concurrentConnections"
                value={settings.concurrentConnections}
                onChange={handleSettingsChange}
              />
            </label>
          </div>
        </div>
      );
    };

    export default Settings;
