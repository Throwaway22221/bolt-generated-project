import React from 'react';
        import { render, screen } from '@testing-library/react';
        import EmailList from './EmailList';

        describe('EmailList Component', () => {
          const mockEmails = [
            { id: '1', subject: 'Test Email 1', from: { emailAddress: { address: 'test1@example.com' } } },
            { id: '2', subject: 'Test Email 2', from: { emailAddress: { address: 'test2@example.com' } } },
          ];
          const mockSelectedAccount = { name: 'Test Account' };

          it('renders email list correctly when an account is selected', () => {
            render(<EmailList emails={mockEmails} selectedAccount={mockSelectedAccount} />);

            expect(screen.getByText('Emails for Test Account:')).toBeInTheDocument();
            expect(screen.getByText('Test Email 1 - From: test1@example.com')).toBeInTheDocument();
            expect(screen.getByText('Test Email 2 - From: test2@example.com')).toBeInTheDocument();
          });

          it('does not render email list when no account is selected', () => {
            render(<EmailList emails={mockEmails} selectedAccount={null} />);

            expect(screen.queryByText('Emails for Test Account:')).not.toBeInTheDocument();
            expect(screen.queryByText('Test Email 1 - From: test1@example.com')).not.toBeInTheDocument();
            expect(screen.queryByText('Test Email 2 - From: test2@example.com')).not.toBeInTheDocument();
          });
        });
