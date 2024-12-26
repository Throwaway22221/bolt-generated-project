import React from 'react';

    const LoadingIndicator = ({ isLoading, message }) => {
      if (!isLoading) {
        return null;
      }

      return (
        <div className="loading-indicator">
          <div className="spinner"></div>
          {message && <p>{message}</p>}
        </div>
      );
    };

    export default LoadingIndicator;
