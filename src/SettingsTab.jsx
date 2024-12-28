import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from './settings';

function SettingsTab() {
  const [minInterval, setMinInterval] = useState(300);
  const [maxInterval, setMaxInterval] = useState(600);
  const [maxConnections, setMaxConnections] = useState(1);
  const [syncInterval, setSyncInterval] = useState(300);
  const [maxRetries, setMaxRetries] = useState(3);
  const [retryDelay, setRetryDelay] = useState(1);

  useEffect(() => {
    const settings = getSettings();
    setMinInterval(settings.minInterval || 300);
    setMaxInterval(settings.maxInterval || 600);
    setMaxConnections(settings.maxConnections || 1);
    setSyncInterval(settings.syncInterval || 300);
    setMaxRetries(settings.maxRetries || 3);
    setRetryDelay(settings.retryDelay || 1);
  }, []);

  const handleSaveSettings = () => {
    saveSettings({
      ...getSettings(),
      minInterval: parseInt(minInterval, 10),
      maxInterval: parseInt(maxInterval, 10),
      maxConnections: parseInt(maxConnections, 10),
      syncInterval: parseInt(syncInterval, 10),
      maxRetries: parseInt(maxRetries, 10),
      retryDelay: parseInt(retryDelay, 10),
    });
    alert('Settings saved!');
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          Min Interval (seconds):
          <input
            type="number"
            value={minInterval}
            onChange={(e) => setMinInterval(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Max Interval (seconds):
          <input
            type="number"
            value={maxInterval}
            onChange={(e) => setMaxInterval(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Max Connections:
          <input
            type="number"
            value={maxConnections}
            onChange={(e) => setMaxConnections(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Sync Interval (seconds):
          <input
            type="number"
            value={syncInterval}
            onChange={(e) => setSyncInterval(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Max Retries:
          <input
            type="number"
            value={maxRetries}
            onChange={(e) => setMaxRetries(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Retry Delay (seconds):
          <input
            type="number"
            value={retryDelay}
            onChange={(e) => setRetryDelay(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
}

export default SettingsTab;
