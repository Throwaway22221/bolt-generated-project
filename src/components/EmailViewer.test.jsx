import React from 'react';
    import { render, screen, fireEvent, waitFor } from '@testing-library/react';
    import EmailViewer from './EmailViewer';
    import { getCachedData, setCachedData } from '../utils/cache';
    import fs from 'fs/promises';

    jest.mock('../utils/cache');
    jest.mock('../App', () => ({
      initializeGraphClient: jest.fn().mockResolvedValue({
        api: jest.fn().mockReturnThis(),
        delete: jest.fn().mockResolvedValue(),
      }),
    }));

    // Mock the file system
    jest.mock('fs/promises', () => ({
      readdir: jest.fn().mockResolvedValue(['test1.eml', 'test2.eml']),
      readFile: jest.fn().mockResolvedValue('From: test@example.com\nSubject: Test Email\nReceived: 2024-01-01T00:00:00Z\n\nThis is a test email body.'),
      unlink: jest.fn().mockResolvedValue(),
    }));

    describe('EmailViewer Component', () => {
      const mockSelectedAccount = { username: 'test@example.com' };
      const mockEmails = [
        { id: 'test1.eml', from: 'test@example.com', subject: 'Test Email 1', received: '2024-01-01T00:00:00Z', body: 'This is a test email body.', filePath: 'emails/test-example-com/test1.eml' },
        { id: 'test2.eml', from: 'test2@example.com', subject: 'Test Email 2', received: '2024-01-02T00:00:00Z', body: 'This is another test email body.', filePath: 'emails/test-example-com/test2.eml' },
      ];

      beforeEach(() => {
        jest.clearAllMocks();
        getCachedData.mockReturnValue(mockEmails);
      });

      it('renders email list correctly', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          expect(screen.getByText('Test Email 1')).toBeInTheDocument();
          expect(screen.getByText('Test Email 2')).toBeInTheDocument();
        });
      });

      it('filters emails by subject', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          const searchInput = screen.getByPlaceholderText('Search emails...');
          fireEvent.change(searchInput, { target: { value: 'Test Email 1' } });
          const searchButton = screen.getByText('Search');
          fireEvent.click(searchButton);
          expect(screen.getByText('Test Email 1')).toBeInTheDocument();
          expect(screen.queryByText('Test Email 2')).not.toBeInTheDocument();
        });
      });

      it('filters emails by sender', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          const searchInput = screen.getByPlaceholderText('Search emails...');
          fireEvent.change(searchInput, { target: { value: 'test2@example.com' } });
          const filterSelect = screen.getByRole('combobox');
          fireEvent.change(filterSelect, { target: { value: 'sender' } });
          const searchButton = screen.getByText('Search');
          fireEvent.click(searchButton);
          expect(screen.queryByText('Test Email 1')).not.toBeInTheDocument();
          expect(screen.getByText('Test Email 2')).toBeInTheDocument();
        });
      });

      it('filters emails by body', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          const searchInput = screen.getByPlaceholderText('Search emails...');
          fireEvent.change(searchInput, { target: { value: 'another test email body' } });
          const filterSelect = screen.getByRole('combobox');
          fireEvent.change(filterSelect, { target: { value: 'body' } });
          const searchButton = screen.getByText('Search');
          fireEvent.click(searchButton);
          expect(screen.queryByText('Test Email 1')).not.toBeInTheDocument();
          expect(screen.getByText('Test Email 2')).toBeInTheDocument();
        });
      });

      it('deletes an email', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          const deleteButton = screen.getAllByText('Delete')[0];
          fireEvent.click(deleteButton);
          expect(fs.unlink).toHaveBeenCalled();
        });
      });

      it('displays loading indicator while loading emails', async () => {
        getCachedData.mockReturnValue(null);
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        expect(screen.getByText('Loading emails...')).toBeInTheDocument();
        await waitFor(() => {
          expect(screen.queryByText('Loading emails...')).not.toBeInTheDocument();
        });
      });

      it('displays error message when there is an error', async () => {
        fs.readdir.mockRejectedValueOnce(new Error('Test error'));
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          expect(screen.getByText('Error: Error reading email directory: Test error')).toBeInTheDocument();
        });
      });

      it('displays emails per page', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          expect(screen.getAllByRole('listitem').length).toBe(2);
        });
      });

      it('navigates to the next page', async () => {
        render(<EmailViewer selectedAccount={mockSelectedAccount} />);
        await waitFor(() => {
          const page2Button = screen.getByText('2');
          fireEvent.click(page2Button);
          expect(screen.getAllByRole('listitem').length).toBe(0);
        });
      });
    });
