const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

        export const getCachedData = (key) => {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
            } else {
            localStorage.removeItem(key);
            }
        }
        return null;
        };

        export const setCachedData = (key, data) => {
        const cacheData = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        };
