import { saveEmailToFile } from '../src/App';
    import { getCachedData, setCachedData } from '../src/utils/cache';
    import fs from 'fs/promises';
    import { decryptData } from '../src/utils/encryption';

    jest.mock('../src/utils/cache');
    jest.mock('../src/utils/encryption');

    // Mock the graph client to avoid actual API calls
    jest.mock('@microsoft/microsoft-graph-client', () => ({
      Client: {
        init: jest.fn().mockReturnValue({
          api: jest.fn().mockReturnThis(),
          delete: jest.fn().mockResolvedValue(),
        }),
      },
    }));

    describe('File System Operations Tests', () => {
      const testDir = './emails/testaccount';

      beforeAll(async () => {
        // Create test directory
        await fs.mkdir(testDir, { recursive: true });
      });

      afterAll(async () => {
        // Clean up test directory
        await fs.rm(testDir, { recursive: true, force: true });
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('saves email to file correctly', async () => {
        const mockAccount = { username: 'test@example.com' };
        const mockEmail = {
          from: { emailAddress: { address: 'sender@example.com' } },
          subject: 'Test Email',
          receivedDateTime: '2024-01-01T00:00:00Z',
          id: '123',
        };
        const mockEmailBody = 'This is a test email body.';

        await saveEmailToFile(mockAccount, mockEmail, mockEmailBody);

        const expectedFileName = 'sender@example.com_Test_Email_Jan-1-24.eml';
        const filePath = `${testDir}/${expectedFileName}`;
        const fileContent = await fs.readFile(filePath, 'utf-8');

        expect(fileContent).toEqual(mockEmailBody);
      });

      it('handles file saving errors gracefully', async () => {
        const mockAccount = { username: 'test@example.com' };
        const mockEmail = {
          from: { emailAddress: { address: 'sender@example.com' } },
          subject: 'Test Email',
          receivedDateTime: '2024-01-01T00:00:00Z',
          id: '456',
        };
        const mockEmailBody = 'This is a test email body.';

        // Simulate an error during file writing
        jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error('File write error'));

        await saveEmailToFile(mockAccount, mockEmail, mockEmailBody);

        // Ensure the error is logged (you may need to mock console.error to test this)
        // expect(console.error).toHaveBeenCalledWith('Error saving email to file:', expect.any(Error));
      });

      it('should create the directory if it does not exist', async () => {
        const mockAccount = { username: 'newtest@example.com' };
        const mockEmail = {
          from: { emailAddress: { address: 'sender@example.com' } },
          subject: 'Test Email',
          receivedDateTime: '2024-01-01T00:00:00Z',
          id: '789',
        };
        const mockEmailBody = 'This is a test email body.';
        const newTestDir = './emails/newtest-example-com';

        await saveEmailToFile(mockAccount, mockEmail, mockEmailBody);

        const expectedFileName = 'sender@example.com_Test_Email_Jan-1-24.eml';
        const filePath = `${newTestDir}/${expectedFileName}`;
        const fileContent = await fs.readFile(filePath, 'utf-8');

        expect(fileContent).toEqual(mockEmailBody);

        // Clean up the new directory
        await fs.rm(newTestDir, { recursive: true, force: true });
      });

      it('should handle errors when creating the directory', async () => {
        const mockAccount = { username: 'errortest@example.com' };
        const mockEmail = {
          from: { emailAddress: { address: 'sender@example.com' } },
          subject: 'Test Email',
          receivedDateTime: '2024-01-01T00:00:00Z',
          id: '101',
        };
        const mockEmailBody = 'This is a test email body.';
        const errorTestDir = './emails/errortest-example-com';

        // Simulate an error during directory creation
        jest.spyOn(fs, 'mkdir').mockRejectedValueOnce(new Error('Directory creation error'));

        await saveEmailToFile(mockAccount, mockEmail, mockEmailBody);

        // Ensure the error is logged (you may need to mock console.error to test this)
        // expect(console.error).toHaveBeenCalledWith('Error saving email to file:', expect.any(Error));

        // Clean up the new directory if it was created
        try {
          await fs.rm(errorTestDir, { recursive: true, force: true });
        } catch (e) {
          // Ignore if the directory does not exist
        }
      });
    });
