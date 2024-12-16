const API_KEY = "41c953e75dba832f388f6ceb74adf093";

function fetchWeather() {
    const location = document.getElementById("location").value.trim();
    if (!location) {
        alert("Please enter a location.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    console.log("Fetching URL:", url); // Debugging log
    getWeatherData(url);
}

function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                getWeatherData(url);
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function getWeatherData(url) {
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
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById("weather-info");
    const { name, weather, main } = data;
    const { description, icon } = weather[0];
    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>${description.toUpperCase()}</p>
        <p>Temperature: ${main.temp}°C</p>
        <p>Feels Like: ${main.feels_like}°C</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}
