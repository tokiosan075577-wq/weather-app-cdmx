const Storage = (() => {
    const API_KEY_STORAGE = 'weatherAppApiKey';
    const CACHE_EXPIRY = 600000;
    const LAST_UPDATE = 'weatherAppLastUpdate';
    const WEATHER_CACHE = 'weatherAppCache';

    return {
        saveApiKey(key) {
            try {
                localStorage.setItem(API_KEY_STORAGE, key);
                return true;
            } catch (error) {
                console.error('Error saving API key:', error);
                return false;
            }
        },

        getApiKey() {
            try {
                return localStorage.getItem(API_KEY_STORAGE) || null;
            } catch (error) {
                console.error('Error retrieving API key:', error);
                return null;
            }
        },

        removeApiKey() {
            try {
                localStorage.removeItem(API_KEY_STORAGE);
                return true;
            } catch (error) {
                console.error('Error removing API key:', error);
                return false;
            }
        },

        hasApiKey() {
            return this.getApiKey() !== null && this.getApiKey() !== '';
        },

        saveWeatherCache(data) {
            try {
                const cacheData = {
                    data: data,
                    timestamp: Date.now()
                };
                localStorage.setItem(WEATHER_CACHE, JSON.stringify(cacheData));
                return true;
            } catch (error) {
                console.error('Error saving weather cache:', error);
                return false;
            }
        },

        getWeatherCache() {
            try {
                const cached = localStorage.getItem(WEATHER_CACHE);
                if (!cached) return null;

                const cacheData = JSON.parse(cached);
                const age = Date.now() - cacheData.timestamp;

                if (age > CACHE_EXPIRY) {
                    localStorage.removeItem(WEATHER_CACHE);
                    return null;
                }

                return cacheData.data;
            } catch (error) {
                console.error('Error retrieving weather cache:', error);
                return null;
            }
        },

        clearWeatherCache() {
            try {
                localStorage.removeItem(WEATHER_CACHE);
                return true;
            } catch (error) {
                console.error('Error clearing weather cache:', error);
                return false;
            }
        },

        saveLastUpdate(timestamp) {
            try {
                localStorage.setItem(LAST_UPDATE, timestamp);
                return true;
            } catch (error) {
                console.error('Error saving last update:', error);
                return false;
            }
        },

        getLastUpdate() {
            try {
                return localStorage.getItem(LAST_UPDATE) || null;
            } catch (error) {
                console.error('Error retrieving last update:', error);
                return null;
            }
        },

        getStorageInfo() {
            return {
                hasApiKey: this.hasApiKey(),
                lastUpdate: this.getLastUpdate(),
                cacheExists: this.getWeatherCache() !== null
            };
        },

        clearAll() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing storage:', error);
                return false;
            }
        }
    };
})();