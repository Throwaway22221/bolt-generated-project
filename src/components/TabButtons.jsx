import React from 'react';

/**
 * Renders the tab buttons.
 * @param {object} props - The component props.
 * @param {string} props.activeTab - The currently active tab.
 * @param {function} props.onTabChange - The function to handle tab changes.
 */
function TabButtons({ activeTab, onTabChange }) {
  return (
    <div className="tab-buttons">
      <button onClick={() => onTabChange('emails')} className={activeTab === 'emails' ? 'active' : ''}>Emails</button>
      <button onClick={() => onTabChange('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</button>
      <button onClick={() => onTabChange('accounts')} className={activeTab === 'accounts' ? 'active' : ''}>Accounts</button>
    </div>
  );
}

export default TabButtons;
