import { getCachedData, setCachedData } from './cache';

        // Mock localStorage for testing
        const localStorageMock = (() => {
          let store = {};
          return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => (store[key] = value),
            removeItem: (key) => delete store[key],
            clear: () => (store = {}),
          };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        describe('Cache Utilities', () => {
          beforeEach(() => {
            localStorage.clear();
          });

          it('should set and get cached data correctly', () => {
            const key = 'testKey';
            const data = { message: 'This is cached data', value: 123 };

            setCachedData(key, data);
            const retrievedData = getCachedData(key);

            expect(retrievedData).toEqual(data);
          });

          it('should return null for expired cache data', () => {
            const key = 'expiredKey';
            const data = { message: 'This is expired data' };
            const pastTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago

            localStorage.setItem(key, JSON.stringify({ data, timestamp: pastTimestamp }));
            const retrievedData = getCachedData(key);

            expect(retrievedData).toBeNull();
          });

          it('should return null for non-existent cache data', () => {
            const key = 'nonExistentKey';
            const retrievedData = getCachedData(key);

            expect(retrievedData).toBeNull();
          });
        });
