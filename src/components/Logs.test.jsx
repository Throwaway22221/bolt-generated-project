import React from 'react';
        import { render, screen } from '@testing-library/react';
        import Logs from './Logs';

        describe('Logs Component', () => {
          const mockLogs = ['Log entry 1', 'Log entry 2', 'Error: Something went wrong'];

          it('renders logs correctly', () => {
            render(<Logs logs={mockLogs} />);

            expect(screen.getByText('Logs:')).toBeInTheDocument();
            expect(screen.getByText('Log entry 1')).toBeInTheDocument();
            expect(screen.getByText('Log entry 2')).toBeInTheDocument();
            expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
          });

          it('renders no logs message when logs array is empty', () => {
            render(<Logs logs={[]} />);

            expect(screen.getByText('Logs:')).toBeInTheDocument();
            expect(screen.queryByText('Log entry 1')).not.toBeInTheDocument();
            expect(screen.queryByText('Log entry 2')).not.toBeInTheDocument();
            expect(screen.queryByText('Error: Something went wrong')).not.toBeInTheDocument();
          });
        });
