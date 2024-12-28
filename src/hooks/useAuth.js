import { useState, useEffect } from 'react';
import { signIn, signOut, handleRedirect, getToken, getAllAccounts } from '../auth';

/**
 * Custom hook to handle authentication logic.
 * @returns {object} - An object containing authentication state and functions.
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    const checkAuthentication = async () => {
      const account = await handleRedirect();
      if (account) {
        setIsAuthenticated(true);
        setUser(account);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchAccounts = () => {
      const storedAccounts = getAllAccounts();
      setAccounts(storedAccounts);
    };
    fetchAccounts();
  }, []);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async (username) => {
    await signOut(username);
    setIsAuthenticated(false);
    setUser(null);
    setAccounts(getAllAccounts());
  };

  const handleAccountChange = (account) => {
    setUser(account);
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    user,
    accounts,
    handleSignIn,
    handleSignOut,
    handleAccountChange,
  };
};

export default useAuth;
