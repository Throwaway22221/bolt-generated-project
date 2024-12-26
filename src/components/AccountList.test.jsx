import React from 'react';
        import { render, screen, fireEvent } from '@testing-library/react';
        import AccountList from './AccountList';

        describe('AccountList Component', () => {
          const mockAccounts = [
            { id: '1', name: 'Test Account 1', username: 'test1@example.com' },
            { id: '2', name: 'Test Account 2', username: 'test2@example.com' },
          ];
          const mockHandleAccountSelect = jest.fn();
          const mockRemoveAccount = jest.fn();

          it('renders account list correctly', () => {
            render(<AccountList accounts={mockAccounts} handleAccountSelect={mockHandleAccountSelect} removeAccount={mockRemoveAccount} />);

            expect(screen.getByText('Accounts:')).toBeInTheDocument();
            expect(screen.getByText('Test Account 1 (test1@example.com)')).toBeInTheDocument();
            expect(screen.getByText('Test Account 2 (test2@example.com)')).toBeInTheDocument();
          });

          it('calls handleAccountSelect when select button is clicked', () => {
            render(<AccountList accounts={mockAccounts} handleAccountSelect={mockHandleAccountSelect} removeAccount={mockRemoveAccount} />);

            fireEvent.click(screen.getAllByText('Select')[0]);
            expect(mockHandleAccountSelect).toHaveBeenCalledWith(mockAccounts[0]);
          });

          it('calls removeAccount when remove button is clicked', () => {
            render(<AccountList accounts={mockAccounts} handleAccountSelect={mockHandleAccountSelect} removeAccount={mockRemoveAccount} />);

            fireEvent.click(screen.getAllByText('Remove')[0]);
            expect(mockRemoveAccount).toHaveBeenCalledWith(mockAccounts[0].id);
          });
        });
