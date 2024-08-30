document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'Shxp5f9xBouqM62oXhOd2Wp5Qvx77Pbq';
    const locationForm = document.getElementById('location-form');
    const locationInput = document.getElementById('location-input');
    const weatherInfo = document.getElementById('weather-info');
    const getLocationBtn = document.getElementById('get-location');

    async function fetchWeather(lat, lon) {
        const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode,humidity&units=metric&apikey=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            weatherInfo.innerHTML = `Error fetching weather data: ${error.message}`;
        }
    }

    function displayWeather(data) {
        if (!data || !data.data || !data.data.timelines || !data.data.timelines[0].intervals[0].values) {
            weatherInfo.innerHTML = 'No weather data available.';
            return;
        }

        const current = data.data.timelines[0].intervals[0].values;
        weatherInfo.innerHTML = `
            <h2>Current Weather</h2>
            <p>Temperature: ${current.temperature}°C</p>
            <p>Humidity: ${current.humidity}%</p>
            <p>Condition: ${current.weatherCode}</p>
        `;
    }

    locationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const location = locationInput.value.trim();
        if (location) {
            fetch(`https://geocode.xyz/${location}?json=1`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (!data.latt || !data.longt) throw new Error('Invalid location data');
                    const { latt, longt } = data;
                    fetchWeather(latt, longt);
                })
                .catch(error => {
                    weatherInfo.innerHTML = `Error fetching location data: ${error.message}`;
                });
        } else {
            weatherInfo.innerHTML = 'Please enter a location.';
        }
    });

    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                },
                (error) => {
                    weatherInfo.innerHTML = `Error getting location: ${error.message}`;
                }
            );
        } else {
            weatherInfo.innerHTML = 'Geolocation is not supported by this browser.';
        }
    });
});
