const API_KEY = "41c953e75dba832f388f6ceb74adf093";

function fetchWeather() {
    const location = document.getElementById("location").value.trim();
    if (!location) {
        alert("Please enter a location.");
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    console.log("Fetching Weather for:", location);
    getWeatherData(url);
}

function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                console.log("Latitude:", latitude, "Longitude:", longitude); 

                const reverseGeocodeURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

                try {
                    const response = await fetch(reverseGeocodeURL);
                    const data = await response.json();

                    const city = data.address.city || data.address.town || data.address.village || "Unknown Location";

                    console.log("Detected City:", city);

                    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
                    getWeatherData(url);

                } catch (error) {
                    console.error("Error fetching reverse geocode data:", error);
                    alert("Could not determine your location accurately. Please try again.");
                }
            },
            (error) => {
                alert("Unable to retrieve your location. Make sure location services are enabled.");
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

