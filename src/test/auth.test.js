import { signIn, handleRedirect, getToken, signOut, getAllAccounts } from '../auth';
import test from './testRunner';
import assert from './assert';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

// Mock msal functions
const mockMsalInstance = {
  loginRedirect: jest.fn(),
  handleRedirectPromise: jest.fn(),
  getAllAccounts: jest.fn(),
  acquireTokenSilent: jest.fn(),
  acquireTokenRedirect: jest.fn(),
  logoutRedirect: jest.fn(),
};

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn(() => mockMsalInstance),
  InteractionRequiredAuthError: jest.fn(),
}));

test('signIn should call loginRedirect', async () => {
  await signIn();
  assert(mockMsalInstance.loginRedirect.mock.calls.length === 1, 'signIn should call loginRedirect');
});

test('handleRedirect should return an account if successful', async () => {
  mockMsalInstance.handleRedirectPromise.mockResolvedValueOnce({ account: { username: 'test-user' } });
  const account = await handleRedirect();
  assert(account.username === 'test-user', 'handleRedirect should return an account');
});

test('handleRedirect should return null if no account is found', async () => {
  mockMsalInstance.handleRedirectPromise.mockResolvedValueOnce(null);
  mockMsalInstance.getAllAccounts.mockReturnValueOnce([]);
  const account = await handleRedirect();
  assert(account === null, 'handleRedirect should return null if no account is found');
});

test('getToken should return a token if successful', async () => {
  mockMsalInstance.acquireTokenSilent.mockResolvedValueOnce({ accessToken: 'test-token' });
  const token = await getToken('test-user');
  assert(token === 'test-token', 'getToken should return a token');
});

test('getToken should return null if no account is found', async () => {
  mockMsalInstance.getAllAccounts.mockReturnValueOnce([]);
  const token = await getToken('test-user');
  assert(token === null, 'getToken should return null if no account is found');
});

test('getToken should return null if acquireTokenSilent fails with InteractionRequiredAuthError', async () => {
  mockMsalInstance.acquireTokenSilent.mockRejectedValueOnce(new InteractionRequiredAuthError());
  const token = await getToken('test-user');
  assert(token === null, 'getToken should return null if acquireTokenSilent fails with InteractionRequiredAuthError');
});

test('signOut should call logoutRedirect', async () => {
  await signOut('test-user');
  assert(mockMsalInstance.logoutRedirect.mock.calls.length === 1, 'signOut should call logoutRedirect');
});

test('getAllAccounts should return an object of accounts', () => {
  const accounts = getAllAccounts();
  assert(typeof accounts === 'object', 'getAllAccounts should return an object');
});
