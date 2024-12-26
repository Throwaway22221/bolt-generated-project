import React from 'react';
    import { render, screen, fireEvent } from '@testing-library/react';
    import Settings from './Settings';

    describe('Settings Component', () => {
      const mockSettings = {
        minWaitTime: 1000,
        maxWaitTime: 5000,
        apiCallLimit: 100,
        syncInterval: 3600000,
        concurrentConnections: 1,
      };
      const mockHandleSettingsChange = jest.fn();

      it('renders settings correctly', () => {
        render(<Settings settings={mockSettings} handleSettingsChange={mockHandleSettingsChange} />);

        expect(screen.getByText('Settings:')).toBeInTheDocument();
        expect(screen.getByLabelText('Min Wait Time (s):')).toHaveValue(1);
        expect(screen.getByLabelText('Max Wait Time (s):')).toHaveValue(5);
        expect(screen.getByLabelText('API Call Limit:')).toHaveValue(100);
        expect(screen.getByLabelText('Sync Interval (s):')).toHaveValue(3600);
        expect(screen.getByLabelText('Concurrent Connections:')).toHaveValue(1);
      });

      it('calls handleSettingsChange when input values are changed', () => {
        render(<Settings settings={mockSettings} handleSettingsChange={mockHandleSettingsChange} />);

        fireEvent.change(screen.getByLabelText('Min Wait Time (s):'), { target: { value: '2' } });
        expect(mockHandleSettingsChange).toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('Max Wait Time (s):'), { target: { value: '6' } });
        expect(mockHandleSettingsChange).toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('API Call Limit:'), { target: { value: '200' } });
        expect(mockHandleSettingsChange).toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('Sync Interval (s):'), { target: { value: '7200' } });
        expect(mockHandleSettingsChange).toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('Concurrent Connections:'), { target: { value: '2' } });
        expect(mockHandleSettingsChange).toHaveBeenCalled();
      });
    });
