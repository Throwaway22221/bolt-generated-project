import React from 'react';

    const ProxySettings = ({ proxySettings, handleProxySettingsChange }) => {
      return (
        <div className="proxy-section">
          <h3>Proxy Settings:</h3>
          <label>
            Host:
            <input type="text" name="host" value={proxySettings.host} onChange={handleProxySettingsChange} />
          </label>
          <label>
            Port:
            <input type="number" name="port" value={proxySettings.port} onChange={handleProxySettingsChange} />
          </label>
          <label>
            Username:
            <input type="text" name="username" value={proxySettings.username} onChange={handleProxySettingsChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={proxySettings.password} onChange={handleProxySettingsChange} />
          </label>
        </div>
      );
    };

    export default ProxySettings;
