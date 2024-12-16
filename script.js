const API_KEY = "41c953e75dba832f388f6ceb74adf093";

function fetchWeather() {
    const location = document.getElementById("location").value.trim();
    if (!location) {
        alert("Please enter a location.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    console.log("Fetching URL:", url); 
    showLoading(); 
    getWeatherData(url);
}

function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                showLoading();
                getWeatherData(url, latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                alert("Unable to retrieve your location. Please allow location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function getWeatherData(url, latitude = null, longitude = null) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Location not found. Please enter a valid city.");
            } else {
                throw new Error("An error occurred. Please try again later.");
            }
        }

        const data = await response.json();
        displayWeather(data, latitude, longitude);
    } catch (error) {
        hideLoading(); 
        alert(error.message);
    }
}

function displayWeather(data, latitude = null, longitude = null) {
    const weatherInfo = document.getElementById("weather-info");
    const { name, weather, main } = data;
    const { description, icon } = weather[0];

    const locationName = name ? name : `Lat: ${latitude}, Lon: ${longitude}`;

    weatherInfo.innerHTML = `
        <h2>${locationName}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>${description.toUpperCase()}</p>
        <p>Temperature: ${main.temp}°C</p>
        <p>Feels Like: ${main.feels_like}°C</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
    hideLoading(); 
}

function showLoading() {
    const weatherInfo = document.getElementById("weather-info");
    weatherInfo.innerHTML = `<p>Loading...</p>`;
}

function hideLoading() {
    const weatherInfo = document.getElementById("weather-info");
    if (weatherInfo.innerHTML === `<p>Loading...</p>`) {
        weatherInfo.innerHTML = "";
    }
}
