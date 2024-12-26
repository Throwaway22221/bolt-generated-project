
    import { PublicClientApplication } from '@azure/msal-browser';
    import { Client } from '@microsoft/microsoft-graph-client';
    import { initializeGraphClient, fetchEmails } from '../src/App'; // Assuming these functions are exported from App.jsx

    jest.mock('@azure/msal-browser');
    jest.mock('@microsoft/microsoft-graph-client');

    describe('API Integration Tests', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('initializes Graph client with a valid token', async () => {
        const mockAccount = { username: 'test@example.com' };
        const mockToken = 'valid-token';
        PublicClientApplication.prototype.acquireTokenSilent.mockResolvedValueOnce({ accessToken: mockToken });

        const client = await initializeGraphClient(mockAccount);
        expect(client).toBeDefined();
        expect(Client.init).toHaveBeenCalled();
      });

      it('fetches emails successfully', async () => {
        const mockAccount = { username: 'test@example.com' };
        const mockEmails = [{ id: '1', subject: 'Test Email' }];
        const mockClient = {
          api: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          top: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValueOnce({ value: mockEmails }),
        };
        Client.init.mockReturnValue(mockClient);

        const emails = await fetchEmails(mockAccount);
        expect(emails).toEqual(mockEmails);
        expect(mockClient.api).toHaveBeenCalledWith('/me/messages');
      });

      it('handles token acquisition failure', async () => {
        const mockAccount = { username: 'test@example.com' };
        PublicClientApplication.prototype.acquireTokenSilent.mockRejectedValueOnce(new Error('Token acquisition failed'));

        await expect(initializeGraphClient(mockAccount)).rejects.toThrow('Token acquisition failed');
      });

      it('handles API call failure', async () => {
        const mockAccount = { username: 'test@example.com' };
        const mockClient = {
          api: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          top