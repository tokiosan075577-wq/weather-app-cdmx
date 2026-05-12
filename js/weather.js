const Weather = (() => {
    const CITY_LAT = 19.4326;
    const CITY_LON = -99.1332;
    const CITY_NAME = 'Ciudad de México';
    const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
    let refreshInterval = null;

    const checkApiKey = () => {
        if (!Storage.hasApiKey()) {
            UI.hideSections();
            UI.showApiKeyModal();
            return false;
        }
        return true;
    };

    const saveApiKey = () => {
        const key = UI.elements.apiKeyInput.value.trim();
        
        if (!key) {
            UI.showError('Por favor ingresa una API Key válida');
            return;
        }

        if (key.length < 30) {
            UI.showError('La API Key parece ser inválida (muy corta)');
            return;
        }

        Storage.saveApiKey(key);
        UI.showSuccess('API Key guardada correctamente');
        UI.hideApiKeyModal();
        
        setTimeout(() => {
            fetchWeather();
        }, 500);
    };

    const fetchWeather = async () => {
        if (!checkApiKey()) return;

        UI.showLoader();
        UI.updateRefreshButton(true);

        try {
            const apiKey = Storage.getApiKey();
            const url = `${API_BASE_URL}/forecast?lat=${CITY_LAT}&lon=${CITY_LON}&appid=${apiKey}&units=metric&lang=es`;

            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API Key inválida. Por favor verifica tu clave.');
                } else if (response.status === 404) {
                    throw new Error('Ubicación no encontrada');
                } else {
                    throw new Error(`Error HTTP ${response.status}`);
                }
            }

            const data = await response.json();
            
            const weatherData = {
                current: data.list[0],
                hourly: data.list.slice(0, 40),
                daily: getDaily(data.list),
                timezone: data.city.timezone
            };

            Storage.saveWeatherCache(weatherData);
            Storage.saveLastUpdate(new Date().toLocaleTimeString('es-MX'));
            
            updateUI(weatherData);
            UI.showSuccess('Clima actualizado correctamente');

        } catch (error) {
            console.error('Error fetching weather:', error);
            UI.showError(error.message || 'Error al obtener los datos del clima');
            
            const cached = Storage.getWeatherCache();
            if (cached) {
                updateUI(cached);
                UI.showSuccess('Mostrando datos del caché (conexión sin internet)');
            }
        } finally {
            UI.hideLoader();
            UI.updateRefreshButton(false);
        }
    };

    const getDaily = (hourlyData) => {
        const daily = [];
        const dayMap = new Map();

        hourlyData.forEach(hour => {
            const date = new Date(hour.dt * 1000);
            const dayKey = date.toDateString();

            if (!dayMap.has(dayKey)) {
                dayMap.set(dayKey, {
                    dt: hour.dt,
                    temp: {
                        min: hour.main.temp,
                        max: hour.main.temp
                    },
                    weather: [hour.weather[0]],
                    pop: hour.pop || 0,
                    wind_speed: hour.wind.speed
                });
            } else {
                const day = dayMap.get(dayKey);
                day.temp.min = Math.min(day.temp.min, hour.main.temp);
                day.temp.max = Math.max(day.temp.max, hour.main.temp);
                day.pop = Math.max(day.pop, hour.pop || 0);
                day.wind_speed = (day.wind_speed + hour.wind.speed) / 2;
            }
        });

        dayMap.forEach(day => daily.push(day));
        return daily.slice(0, 5);
    };

    const updateUI = (data) => {
        UI.showSections();
        UI.updateCurrentWeather(data);
        UI.updateHourlyForecast(data);
        UI.updateDailyForecast(data);
        UI.updateTemperatureChart(data);
        UI.updateTimestamps();
    };

    const refreshWeather = () => {
        fetchWeather();
    };

    const setupAutoRefresh = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        refreshInterval = setInterval(() => {
            console.log('Auto-refreshing weather data...');
            fetchWeather();
        }, 600000);
    };

    const initialize = () => {
        UI.initializeEventListeners();
        
        UI.elements.saveApiKeyBtn.addEventListener('click', saveApiKey);
        
        if (Storage.hasApiKey()) {
            fetchWeather();
            setupAutoRefresh();
        } else {
            UI.showApiKeyModal();
        }
    };

    return {
        initialize,
        fetchWeather,
        refreshWeather
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    Weather.initialize();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('Page is visible again, checking if refresh needed...');
    }
});