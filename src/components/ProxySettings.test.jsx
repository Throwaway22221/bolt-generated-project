import React from 'react';
        import { render, screen, fireEvent } from '@testing-library/react';
        import ProxySettings from './ProxySettings';

        describe('ProxySettings Component', () => {
          const mockProxySettings = {
            host: 'proxy.example.com',
            port: 8080,
            username: 'testuser',
            password: 'testpassword',
          };
          const mockHandleProxySettingsChange = jest.fn();

          it('renders proxy settings correctly', () => {
            render(<ProxySettings proxySettings={mockProxySettings} handleProxySettingsChange={mockHandleProxySettingsChange} />);

            expect(screen.getByText('Proxy Settings:')).toBeInTheDocument();
            expect(screen.getByLabelText('Host:')).toHaveValue('proxy.example.com');
            expect(screen.getByLabelText('Port:')).toHaveValue(8080);
            expect(screen.getByLabelText('Username:')).toHaveValue('testuser');
            expect(screen.getByLabelText('Password:')).toHaveValue('testpassword');
          });

          it('calls handleProxySettingsChange when input values are changed', () => {
            render(<ProxySettings proxySettings={mockProxySettings} handleProxySettingsChange={mockHandleProxySettingsChange} />);

            fireEvent.change(screen.getByLabelText('Host:'), { target: { value: 'newproxy.example.com' } });
            expect(mockHandleProxySettingsChange).toHaveBeenCalled();

            fireEvent.change(screen.getByLabelText('Port:'), { target: { value: '9000' } });
            expect(mockHandleProxySettingsChange).toHaveBeenCalled();

            fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'newuser' } });
            expect(mockHandleProxySettingsChange).toHaveBeenCalled();

            fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'newpassword' } });
            expect(mockHandleProxySettingsChange).toHaveBeenCalled();
          });
        });
