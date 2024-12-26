import React, { useState, useEffect } from 'react';
    import { PublicClientApplication } from '@azure/msal-browser';
    import { Client } from '@microsoft/microsoft-graph-client';
    import 'isomorphic-fetch';
    import Tabs from './components/Tabs';
    import AccountTab from './components/AccountTab';
    import SettingsTab from './components/SettingsTab';
    import EmailTab from './components/EmailTab';
    import LoadingIndicator from './components/LoadingIndicator';
    import AuthSection from './components/AuthSection';
    import SyncSection from './components/SyncSection';
    import LogSection from './components/LogSection';
    import { HttpsProxyAgent } from 'https-proxy-agent';
    import fetch from 'node-fetch';

    const msalConfig = {
      auth: {
        clientId: 'YOUR_CLIENT_ID', // Replace with your client ID
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:5173'
      }
    };

    const msalInstance = new PublicClientApplication(msalConfig);

    const defaultSettings = {
      minWaitTime: 3000,
      maxWaitTime: 10000,
      apiCallLimit: 5,
      syncInterval: 600000,
      concurrentConnections: 1,
    };

    function App() {
      const [accounts, setAccounts] = useState([]);
      const [selectedAccount, setSelectedAccount] = useState(null);
      const [emails, setEmails] = useState([]);
      const [settings, setSettings] = useState(defaultSettings);
      const [syncing, setSyncing] = useState(false);
      const [logs, setLogs] = useState([]);
      const [loading, setLoading] = useState(false);
      const [proxySettings, setProxySettings] = useState({
        host: '',
        port: '',
        username: '',
        password: '',
      });

      useEffect(() => {
        setLoading(true);
        msalInstance.handleRedirectPromise().then((response) => {
          if (response) {
            addAccount(response.account);
            logMessage('Authentication successful.');
          }
        }).catch((error) => {
          console.error('Authentication error:', error);
          logMessage(`Authentication error: ${error.message}`);
        }).finally(() => {
          setLoading(false);
        });
        loadAccounts();
        loadSettings();
        loadProxySettings();
      }, []);

      useEffect(() => {
        if (selectedAccount && !syncing) {
          startBackgroundSync();
        }
      }, [selectedAccount, syncing, settings]);

      const logMessage = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
      };

      const loadAccounts = () => {
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        setAccounts(storedAccounts);
      };

      const loadSettings = () => {
        const storedSettings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;
        setSettings({
          ...storedSettings,
          minWaitTime: storedSettings.minWaitTime,
          maxWaitTime: storedSettings.maxWaitTime,
          syncInterval: storedSettings.syncInterval,
        });
      };

      const loadProxySettings = () => {
        const storedProxySettings = JSON.parse(localStorage.getItem('proxySettings')) || {
          host: '',
          port: '',
          username: '',
          password: '',
        };
        setProxySettings(storedProxySettings);
      };

      const addAccount = (newAccount) => {
        if (!accounts.find(acc => acc.id === newAccount.id)) {
          const updatedAccounts = [...accounts, newAccount];
          setAccounts(updatedAccounts);
          localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        }
      };

      const removeAccount = (accountId) => {
        const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
        setAccounts(updatedAccounts);
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(null);
          setEmails([]);
        }
      };

      const handleLogin = async () => {
        setLoading(true);
        try {
          const loginResponse = await msalInstance.loginPopup({
            scopes: ['user.read', 'mail.read']
          });
          addAccount(loginResponse.account);
          logMessage('Login successful.');
        } catch (error) {
          console.error('Login error:', error);
          logMessage(`Login error: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      const handleLogout = async () => {
        try {
          await msalInstance.logoutPopup();
          setAccounts([]);
          setSelectedAccount(null);
          setEmails([]);
          logMessage('Logout successful.');
        } catch (error) {
          console.error('Logout error:', error);
          logMessage(`Logout error: ${error.message}`);
        }
      };

      const initializeGraphClient = async (account) => {
        try {
          const options = {};
          if (proxySettings.host && proxySettings.port) {
            const proxyUrl = `http://${proxySettings.username ? `${proxySettings.username}:${proxySettings.password}@` : ''}${proxySettings.host}:${proxySettings.port}`;
            const proxyAgent = new HttpsProxyAgent(proxyUrl);
            options.fetchOptions = {
              agent: proxyAgent,
            };
          }
          const client = Client.init({
            authProvider: async (done) => {
              try {
                const silentRequest = {
                  scopes: ['user.read', 'mail.read'],
                  account: account
                };
                const response = await msalInstance.acquireTokenSilent(silentRequest);
                done(null, response.accessToken);
              } catch (error) {
                if (error.name === 'InteractionRequiredAuthError') {
                  msalInstance.acquireTokenPopup({
                    scopes: ['user.read', 'mail.read'],
                    account: account
                  }).then(response => {
                    done(null, response.accessToken);
                  }).catch(popupError => {
                    console.error('Popup error:', popupError);
                    logMessage(`Popup error: ${popupError.message}`);
                    done(popupError, null);
                  });
                } else {
                  console.error('Token acquisition error:', error);
                  logMessage(`Token acquisition error: ${error.message}`);
                  done(error, null);
                }
              }
            },
            ...options,
          });
          return client;
        } catch (error) {
          console.error('Graph client initialization error:', error);
          logMessage(`Graph client initialization error: ${error.message}`);
          throw error;
        }
      };

      const saveEmailToFile = async (account, email, emailBody) => {
        const fs = require('fs').promises;
        const accountIdentifier = account.username.replace(/[^a-zA-Z0-9]/g, '-');
        const emailDir = `emails/${accountIdentifier}`;

        try {
          await fs.mkdir(emailDir, { recursive: true });

          const senderEmail = email.from.emailAddress.address.replace(/[^a-zA-Z0-9@.]/g, '_');
          const subject = email.subject.replace(/[^a-zA-Z0-9]/g, '_');
          const date = new Date(email.receivedDateTime);
          const formattedDate = `${date.toLocaleString('default', { month: 'short' })}-${date.getDate()}-${date.getFullYear().toString().slice(-2)}`;
          const fileName = `${senderEmail}_${subject}_${formattedDate}.eml`;
          const filePath = `${emailDir}/${fileName}`;

          await fs.writeFile(filePath, emailBody);
          logMessage(`Email saved to ${filePath}`);
        } catch (error) {
          console.error('Error saving email to file:', error);
          logMessage(`Error saving email to file: ${error.message}`);
        }
      };

      const fetchEmails = async (account) => {
        if (!account) return;
        setSyncing(true);
        try {
          const client = await initializeGraphClient(account);
          let fetchedCount = 0;
          let continueFetching = true;
          while (continueFetching) {
            const response = await client.api('/me/messages')
              .select('subject,from,receivedDateTime,body')
              .top(settings.apiCallLimit)
              .skip(fetchedCount)
              .get();

            if (response.value.length === 0) {
              continueFetching = false;
              break;
            }

            const emailPromises = response.value.map(async (email) => {
              try {
                const emailResponse = await client.api(`/me/messages/${email.id}`)
                  .get();
                await saveEmailToFile(account, email, emailResponse.body.content);
                return {
                  ...email,
                  body: emailResponse.body.content,
                };
              } catch (error) {
                console.error(`Error fetching email body for ${email.id}:`, error);
                logMessage(`Error fetching email body for ${email.id}: ${error.message}`);
                return null;
              }
            });

            const emailsWithBodies = (await Promise.all(emailPromises)).filter(email => email !== null);
            setEmails(prevEmails => [...prevEmails, ...emailsWithBodies]);
            fetchedCount += response.value.length;

            if (response.value.length < settings.apiCallLimit) {
              continueFetching = false;
            }

            const randomWait = Math.random() * (settings.maxWaitTime - settings.minWaitTime) + settings.minWaitTime;
            await new Promise(resolve => setTimeout(resolve, randomWait));
          }
        } catch (error) {
          console.error('Error fetching emails:', error);
          logMessage(`Error fetching emails: ${error.message}`);
        } finally {
          setSyncing(false);
        }
      };

      const handleAccountSelect = (account) => {
        setSelectedAccount(account);
        setEmails([]);
      };

      const handleSettingsChange = (event) => {
        const { name, value } = event.target;
        const updatedSettings = { ...settings, [name]: parseInt(value, 10) * 1000 };
        setSettings(updatedSettings);
        localStorage.setItem('settings', JSON.stringify(updatedSettings));
      };

      const handleResetSettings = () => {
        setSettings(defaultSettings);
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
      };

      const handleProxySettingsChange = (event) => {
        const { name, value } = event.target;
        const updatedProxySettings = { ...proxySettings, [name]: value };
        setProxySettings(updatedProxySettings);
        localStorage.setItem('proxySettings', JSON.stringify(updatedProxySettings));
      };

      const startBackgroundSync = () => {
        if (syncing) return;
        if (!selectedAccount) return;
        setSyncing(true);
        try {
          const syncIntervalId = setInterval(() => {
            fetchEmails(selectedAccount);
          }, settings.syncInterval);

          return () => clearInterval(syncIntervalId);
        } catch (error) {
          console.error('Error starting background sync:', error);
          logMessage(`Error starting background sync: ${error.message}`);
          setSyncing(false);
        }
      };

      return (
        <div className="container">
          <LoadingIndicator isLoading={loading} message="Loading..." />
          <AuthSection handleLogin={handleLogin} handleLogout={handleLogout} loading={loading} accounts={accounts} />
          <Tabs>
            <AccountTab
              label="Accounts"
              accounts={accounts}
              handleAccountSelect={handleAccountSelect}
              removeAccount={removeAccount}
            />
            <SettingsTab
              label="Settings"
              settings={settings}
              handleSettingsChange={handleSettingsChange}
              handleResetSettings={handleResetSettings}
              proxySettings={proxySettings}
              handleProxySettingsChange={handleProxySettingsChange}
            />
            <EmailTab
              label="Emails"
              emails={emails}
              selectedAccount={selectedAccount}
            />
          </Tabs>
          <SyncSection selectedAccount={selectedAccount} startBackgroundSync={startBackgroundSync} syncing={syncing} />
          <LogSection logs={logs} />
        </div>
      );
    }

    export default App;
