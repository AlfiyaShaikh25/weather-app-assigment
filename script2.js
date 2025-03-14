document.addEventListener("DOMContentLoaded", () => {
    getWeather("Mumbai"); // Load Mumbai weather by default when the app starts
});

// Search button & Enter key event
document.querySelector(".search-btn").addEventListener("click", () => {
    const city = document.querySelector(".city").value.trim();
    if (city) getWeather(city);
});

document.querySelector(".city").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = document.querySelector(".city").value.trim();
        if (city) getWeather(city);
    }
});

// Current Location button
document.querySelector('.btn-currentlocation').addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function successCallback(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoordinates(lat, lon);
}

function errorCallback(error) {
    console.error(`Geolocation error: ${error.message}`);
}

// Fetch Weather Data (By City Name)
async function getWeather(city = "Mumbai") {
    const API_KEY = "ce862ff7ea525d1fa5118a8b70a657ce";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        updateWeatherUI(data);

        // Fetch hourly weather data
        fetchHourlyWeather(data.coord.lat, data.coord.lon);

    } catch (error) {
        console.error("Error fetching weather:", error.message);
        alert(`Error: ${error.message}`);
    }
}

// Fetch Weather Data (By Coordinates)
async function getWeatherByCoordinates(lat, lon) {
    const API_KEY = "ce862ff7ea525d1fa5118a8b70a657ce";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        updateWeatherUI(data);

        // Fetch hourly weather data
        fetchHourlyWeather(lat, lon);

    } catch (error) {
        console.error("Error fetching weather:", error.message);
    }
}

// Update the UI with fetched weather data
function updateWeatherUI(data) {
    document.querySelector(".currentcity").textContent = data.name;
        document.querySelector(".temp").textContent = `${data.main.temp}°C`;
        document.querySelector('.feel-like').textContent = `Feels like: ${data.main.feels_like}°C`;
        document.querySelector('.humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.querySelector('.wind-speed').textContent = `Wind: ${data.wind.speed} m/s`;
        document.querySelector('.pressure').textContent = `Pressure: ${data.main.pressure} hPa`;

        // Format Sunrise & Sunset Time
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.querySelector(".sunrise").textContent = `Sunrise: ${sunriseTime}`;
        document.querySelector(".sunset").textContent = `Sunset: ${sunsetTime}`;

    // Update weather icon based on description
    const weatherIcons = {
        "clear sky": "assets/clear sky.png",
        "few clouds": "assets/few-clouds.png",
        "scattered clouds": "assets/scattered-thunderstorms.png",
        "broken clouds": "assets/severe-weather.png",
        "shower rain": "assets/shower-rain.png",
        "rain": "assets/rain.png",
        "thunderstorm": "assets/thunderstorm.png",
        "snow": "assets/snow.png",
        "mist": "assets/mist.png"
    };

    const weatherDescription = data.weather[0].description.toLowerCase();
    const weatherImg = weatherIcons[weatherDescription] || "assets/default.png";

    document.querySelector(".weather-description").innerHTML = `
        <img class="weather-img" src="${weatherImg}" alt="${weatherDescription}" width="80" height="80">
        <p class="text-center">${weatherDescription}</p>
    `;

    console.log("UI updated successfully!");
}

// Fetch Hourly Forecast Data
async function fetchHourlyWeather(lat, lon) {
    const API_KEY = "ce862ff7ea525d1fa5118a8b70a657ce";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            throw new Error(data.message);
        }

        displayHourlyWeather(data.list.slice(0, 6)); // Show next 6 hours

    } catch (error) {
        console.error("Error fetching hourly weather:", error.message);
    }
}

// Display Hourly Weather on UI
function displayHourlyWeather(hourlyData) {
    const hourlyContainer = document.querySelector("#hourly-forecast");
    hourlyContainer.innerHTML = ""; // Clear previous data

    hourlyData.forEach(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = `${hour.main.temp}°C`;
        const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;

        const hourlyHTML = `
            <div class="hourly-item">
                <p>${time}</p>
                <img src="${icon}" alt="${hour.weather[0].description}">
                <p>${temp}</p>
            </div>
        `;

        hourlyContainer.innerHTML += hourlyHTML;
    });
}
