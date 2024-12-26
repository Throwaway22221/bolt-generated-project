import React, { useState } from 'react';
    import Settings from './Settings';
    import ProxySettings from './ProxySettings';

    const SettingsTab = ({ settings, handleSettingsChange, handleResetSettings, proxySettings, handleProxySettingsChange }) => {
      const [showProxySettings, setShowProxySettings] = useState(false);

      const handleToggleProxySettings = () => {
        setShowProxySettings(!showProxySettings);
      };

      return (
        <div className="settings-tab">
          <Settings settings={settings} handleSettingsChange={handleSettingsChange} />
          <button onClick={handleResetSettings}>Reset to Default</button>
          <button onClick={handleToggleProxySettings}>
            {showProxySettings ? 'Hide Proxy Settings' : 'Show Proxy Settings'}
          </button>
          {showProxySettings && (
            <ProxySettings proxySettings={proxySettings} handleProxySettingsChange={handleProxySettingsChange} />
          )}
        </div>
      );
    };

    export default SettingsTab;
