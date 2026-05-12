const UI = (() => {
    const elements = {
        loader: document.getElementById('loader'),
        apiKeyBtn: document.getElementById('apiKeyBtn'),
        apiKeyModal: document.getElementById('apiKeyModal'),
        apiKeyInput: document.getElementById('apiKeyInput'),
        saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
        cancelApiKeyBtn: document.getElementById('cancelApiKeyBtn'),
        currentWeather: document.getElementById('currentWeather'),
        hourlySection: document.getElementById('hourlySection'),
        dailySection: document.getElementById('dailySection'),
        chartSection: document.getElementById('chartSection'),
        errorMessage: document.getElementById('errorMessage'),
        successMessage: document.getElementById('successMessage'),
        refreshBtn: document.getElementById('refreshBtn'),
        lastUpdate: document.getElementById('lastUpdate'),
        nextUpdate: document.getElementById('nextUpdate')
    };

    const showLoader = () => {
        elements.loader.classList.remove('hidden');
    };

    const hideLoader = () => {
        elements.loader.classList.add('hidden');
    };

    const showApiKeyModal = () => {
        elements.apiKeyModal.classList.remove('hidden');
        elements.apiKeyInput.focus();
    };

    const hideApiKeyModal = () => {
        elements.apiKeyModal.classList.add('hidden');
        elements.apiKeyInput.value = '';
    };

    const showSections = () => {
        elements.currentWeather.classList.remove('hidden');
        elements.hourlySection.classList.remove('hidden');
        elements.dailySection.classList.remove('hidden');
        elements.chartSection.classList.remove('hidden');
    };

    const hideSections = () => {
        elements.currentWeather.classList.add('hidden');
        elements.hourlySection.classList.add('hidden');
        elements.dailySection.classList.add('hidden');
        elements.chartSection.classList.add('hidden');
    };

    const updateCurrentWeather = (data) => {
        const current = data.current;
        const weather = current.weather[0];

        document.getElementById('currentTemp').textContent = Math.round(current.temp);
        document.getElementById('feelsLike').textContent = Math.round(current.feels_like);
        document.getElementById('humidity').textContent = current.humidity;
        document.getElementById('windSpeed').textContent = current.wind_speed.toFixed(1);
        document.getElementById('pressure').textContent = current.pressure;
        document.getElementById('weatherDesc').textContent = getWeatherDescription(weather.main, weather.description);
        document.getElementById('weatherIcon').textContent = getWeatherEmoji(weather.main);
        document.getElementById('rainChance').textContent = Math.round((current.clouds || 0));
        document.getElementById('visibility').textContent = (current.visibility / 1000).toFixed(1);
        
        const sunrise = new Date(current.sunrise * 1000);
        const sunset = new Date(current.sunset * 1000);
        document.getElementById('sunrise').textContent = formatTime(sunrise);
        document.getElementById('sunset').textContent = formatTime(sunset);
    };

    const updateHourlyForecast = (data) => {
        const container = document.querySelector('#hourlyContainer .flex');
        container.innerHTML = '';

        const hourlyData = data.hourly.slice(0, 24);
        
        hourlyData.forEach((hour, index) => {
            const date = new Date(hour.dt * 1000);
            const hour12 = date.getHours() % 12 || 12;
            const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
            const weather = hour.weather[0];

            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <p class="text-xs text-slate-400 mb-2">${hour12}:${String(date.getMinutes()).padStart(2, '0')} ${ampm}</p>
                <p class="text-3xl mb-2">${getWeatherEmoji(weather.main)}</p>
                <p class="temp">${Math.round(hour.temp)}°C</p>
                <p class="text-xs text-slate-500 mt-2">${weather.description}</p>
                <p class="text-xs text-blue-400 mt-1">💧 ${Math.round(hour.pop * 100)}%</p>
            `;
            container.appendChild(card);
        });
    };

    const updateDailyForecast = (data) => {
        const container = document.getElementById('dailyContainer');
        container.innerHTML = '';

        const dailyData = data.daily.slice(0, 5);
        
        dailyData.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const dayName = index === 0 ? 'Hoy' : date.toLocaleDateString('es-MX', { weekday: 'short' });
            const weather = day.weather[0];

            const card = document.createElement('div');
            card.className = 'daily-card card-hover';
            card.innerHTML = `
                <div class="day">${dayName}</div>
                <p class="text-xs text-slate-500 mb-2">${date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}</p>
                <div class="icon">${getWeatherEmoji(weather.main)}</div>
                <p class="text-xs text-slate-400 mb-3 capitalize h-8">${weather.description}</p>
                <div class="temp-range">
                    <span class="high">${Math.round(day.temp.max)}°</span>
                    <span class="text-slate-400">/</span>
                    <span class="low">${Math.round(day.temp.min)}°</span>
                </div>
                <p class="text-xs text-slate-500 mt-2">💧 ${Math.round(day.pop * 100)}%</p>
                <p class="text-xs text-slate-500 mt-1">💨 ${day.wind_speed.toFixed(1)} m/s</p>
            `;
            container.appendChild(card);
        });
    };

    const updateTemperatureChart = (data) => {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        
        const hourlyData = data.hourly.slice(0, 24);
        const labels = hourlyData.map(hour => {
            const date = new Date(hour.dt * 1000);
            return date.getHours() + ':00';
        });
        const temps = hourlyData.map(hour => Math.round(hour.temp));

        if (window.temperatureChartInstance) {
            window.temperatureChartInstance.destroy();
        }

        window.temperatureChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: temps,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#1e293b',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#06b6d4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#cbd5e1',
                            font: { family: "'Poppins', sans-serif", size: 12, weight: '600' },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        titleColor: '#06b6d4',
                        bodyColor: '#e2e8f0',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: "'Poppins', sans-serif" }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: "'Poppins', sans-serif" }
                        }
                    }
                }
            }
        });
    };

    const showError = (message) => {
        const msgEl = elements.errorMessage;
        document.getElementById('errorText').textContent = message;
        msgEl.classList.remove('hidden');
        msgEl.classList.add('message-enter');
        setTimeout(() => {
            msgEl.classList.add('hidden');
        }, 5000);
    };

    const showSuccess = (message) => {
        const msgEl = elements.successMessage;
        document.getElementById('successText').textContent = message;
        msgEl.classList.remove('hidden');
        msgEl.classList.add('message-enter');
        setTimeout(() => {
            msgEl.classList.add('hidden');
        }, 3000);
    };

    const updateRefreshButton = (isLoading) => {
        if (isLoading) {
            elements.refreshBtn.disabled = true;
            document.querySelector('.refresh-icon').classList.add('spinning');
        } else {
            elements.refreshBtn.disabled = false;
            document.querySelector('.refresh-icon').classList.remove('spinning');
        }
    };

    const updateTimestamps = () => {
        const now = new Date();
        elements.lastUpdate.textContent = formatTime(now);
        
        const nextUpdate = new Date(now.getTime() + 10 * 60000);
        elements.nextUpdate.textContent = formatTime(nextUpdate);
    };

    const initializeEventListeners = () => {
        elements.apiKeyBtn.addEventListener('click', showApiKeyModal);
        elements.cancelApiKeyBtn.addEventListener('click', hideApiKeyModal);
        elements.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.saveApiKeyBtn.click();
            }
        });

        elements.refreshBtn.addEventListener('click', () => {
            window.Weather.refreshWeather();
        });
    };

    return {
        elements,
        showLoader,
        hideLoader,
        showApiKeyModal,
        hideApiKeyModal,
        showSections,
        hideSections,
        updateCurrentWeather,
        updateHourlyForecast,
        updateDailyForecast,
        updateTemperatureChart,
        showError,
        showSuccess,
        updateRefreshButton,
        updateTimestamps,
        initializeEventListeners
    };
})();

function getWeatherEmoji(weatherType) {
    const type = weatherType.toLowerCase();
    const emojis = {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'smoke': '💨',
        'haze': '🌫️',
        'dust': '🌪️',
        'fog': '🌫️',
        'sand': '🌪️',
        'ash': '🌫️',
        'squall': '💨',
        'tornado': '🌪️'
    };
    return emojis[type] || '🌤️';
}

function getWeatherDescription(main, description) {
    const desc = {
        'Thunderstorm': 'Tormenta Eléctrica',
        'Drizzle': 'Llovizna',
        'Rain': 'Lluvia',
        'Snow': 'Nieve',
        'Mist': 'Niebla',
        'Smoke': 'Humo',
        'Haze': 'Neblina',
        'Dust': 'Polvo',
        'Fog': 'Niebla',
        'Sand': 'Arena',
        'Ash': 'Ceniza',
        'Squall': 'Ráfaga',
        'Tornado': 'Tornado',
        'Clear': 'Cielo Despejado',
        'Clouds': 'Nublado'
    };
    return desc[main] || description;
}

function formatTime(date) {
    return date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}