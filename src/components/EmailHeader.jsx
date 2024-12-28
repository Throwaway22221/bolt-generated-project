import React from 'react';

/**
 * Renders the email header.
 * @param {object} props - The component props.
 * @param {object} props.user - The current user.
 * @param {function} props.onSignOut - The function to handle sign out.
 * @param {function} props.toggleTheme - The function to toggle the theme.
 */
function EmailHeader({ user, onSignOut, toggleTheme }) {
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={() => onSignOut(user.username)}>Sign Out</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default EmailHeader;
