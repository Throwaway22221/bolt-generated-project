import React from 'react';
    import Logs from './Logs';

    const LogSection = ({ logs }) => {
      return (
        <div className="log-section">
          <Logs logs={logs} />
        </div>
      );
    };

    export default LogSection;
