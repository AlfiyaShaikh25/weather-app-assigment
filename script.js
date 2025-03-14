const API_KEY = "ce862ff7ea525d1fa5118a8b70a657ce"; // Replace with your API key
const city = "Nashik";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        //displayForecast(forecast);


    }
    )


    .catch(error => console.error("Error:", error));

fetch("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=ce862ff7ea525d1fa5118a8b70a657ce&units=metric")
    .then(response => response.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(error => console.error("Fetch Error:", error));

document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
async function getWeather() {
    const city = document.querySelector('.city').value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const API_KEY = 'ce862ff7ea525d1fa5118a8b70a657ce';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        console.log(`Fetching weather for: ${city}`);

        // Fetch current weather data
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(`API Error: ${data.message}`);
        }

        console.log("Weather API Response:", data);

        // ✅ Update UI with Current Weather
        document.querySelector(".currentcity").textContent = data.name;
        document.querySelector(".temp").textContent = `${data.main.temp}°C`;
        document.querySelector('.feel-like').textContent = `Feels like: ${data.main.feels_like}°C`;
        document.querySelector('.humidity').textContent = ` ${data.main.humidity}%`;
        document.querySelector('.wind-speed').textContent = ` ${data.wind.speed} m/s`;
        document.querySelector('.pressure').textContent = ` ${data.main.pressure} hPa`;

        // Format Sunrise & Sunset Time
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.querySelector(".sunrise").textContent = `Sunrise: ${sunriseTime}`;
        document.querySelector(".sunset").textContent = `Sunset: ${sunsetTime}`;

        // ✅ Set Weather Icon
        const weatherIcons = {
            "clear sky": "assets/clear sky.png",
            "few clouds": "assets/few-clouds.png",
            "very heavy rain": "assets/rain.png",
            "scattered clouds": "assets/scattered-thunderstorms.png",
            "broken clouds": "assets/severe-weather.png",
            "shower rain": "assets/shower-rain.png",
            "light rain": "assets/shower-rain.png",
            "rain": "assets/rain.png",
            "light snow": "assets/light snow.png",
            "thunderstorm": "assets/thunderstorm.png",
            "snow": "assets/snow.png",
            "mist": "assets/mist.png",
            "smoke": "assets/smoke.png",
            "moderate rain": "assets/rain.png",
            "overcast clouds": "assets/smoke.png",
        };

        const weatherDescription = data.weather[0].description.toLowerCase();
        const weatherImg = weatherIcons[weatherDescription] || "assets/default.png"; // Default image if not found

        document.querySelector(".weather-description").innerHTML = `
            <img class="weather-img justify-content-center " src="${weatherImg}" alt="${weatherDescription}" width="80" height="80">
            <p class="weatherdecriptext mt-5 text-start justify-content-center " style=" font-weight: bold; color: #333;  margin-left: 80px">${weatherDescription}</p>
        `;

        console.log("UI updated successfully!");

        // ✅ Fetch City Time & 5-Day Forecast
        const { lat, lon } = data.coord;
        fetchCityTime(lat, lon);
        fetchFiveDayForecast(data.name);
        const hourlyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const hourlyData = await hourlyResponse.json();

        if (!hourlyResponse.ok) {
            throw new Error(`API Error: ${hourlyData.message}`);
        }

        console.log("Hourly Weather Data:", hourlyData);
        displayHourlyWeather(hourlyData.list);
        fetchUVIndex(lat, lon);
        // fetchHourlyWeather(lat, lon, API_KEY);
    } catch (error) {
        console.error("Error fetching weather:", error.message);
        alert(`Error: ${error.message}`);
    }
}







document.getElementById("cityInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission (if inside a form)
        console.log("Enter key pressed!");
        getWeather(); // Call the function to fetch weather
    }
});



//******************************************************current time and location *************************************************//
// ***********************************************************************************************************************************//

document.querySelector('.btn-currentlocation').addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Current Location: Latitude=${latitude}, Longitude=${longitude}`);
    getCityName(latitude, longitude); // Get city name for display
    getWeatherByCoordinates(latitude, longitude); // Fetch weather for current location
    displayTime(latitude, longitude);
    fetchCityTime(latitude, longitude)


}

function errorCallback(error) {
    console.error(`Geolocation error: ${error.message}`);
}

function getCityName(latitude, longitude) {
    const apiKey = 'd04d0c5775584c3699b001dddad09de5';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const components = data.results[0].components;
            const city = components.city || components.town || components.village || 'Unknown location';
            document.querySelector('.currentcity').textContent = ` ${city}`;


        })
        .catch(error => console.error('Error fetching city name:', error));
}

function displayTime(latitude, longitude) {
    const apiKey = 'OR6U4NT96J02';
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeZone = data.zoneName;
            const options = { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formatter = new Intl.DateTimeFormat([], options);
            const formattedDate = formatter.format(new Date());

            // document.querySelector('.currenttime').textContent = ` ${formattedDate}`;
        })
        .catch(error => console.error('Error fetching time information:', error));
}


async function fetchCityTime(latitude, longitude) {
    const apiKey = "OR6U4NT96J02"; // Replace with your TimeZoneDB API key
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            const timeZone = data.zoneName;
            const cityTime = new Date().toLocaleString("en-US", { timeZone });

            const formattedTime = new Date(cityTime);
            const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            const timeOptions = { hour: "2-digit", minute: "2-digit" };

            document.querySelector(".daydate").textContent = formattedTime.toLocaleDateString(undefined, dateOptions);
            document.querySelector(".currenttime").textContent = formattedTime.toLocaleTimeString(undefined, timeOptions);
        } else {
            console.error("Error fetching timezone data:", data.message);
        }
    } catch (error) {
        console.error("Error fetching city time:", error);
    }
}

async function fetchUVIndex(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const uvElement = document.querySelector(".uv-index");

        if (uvElement) {
            if (data.value !== undefined) {
                uvElement.textContent = ` ${data.value}`;
            } else {
                uvElement.textContent = `UV Index: Data not available`;
            }
        } else {
            console.warn("Element with class 'uv-index' not found.");
        }
    } catch (error) {
        console.error("Error fetching UV index:", error);
    }
}

// *******************************************************5 days forcast *****************************//

async function fetchFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            console.error("Error:", data.message);
            return;
        }

        displayFiveDayForecast(data);
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
    }
}

function displayFiveDayForecast(data) {
    const forecastContainer = document.querySelector(".five-day-forecast");
    forecastContainer.innerHTML = ""; // Clear previous data

    const dailyForecasts = {};

    // Extract data for every 24 hours at 12:00 PM
    data.list.forEach(forecast => {
        const date = forecast.dt_txt.split(" ")[0]; // Get date
        if (!dailyForecasts[date] && forecast.dt_txt.includes("12:00:00")) {
            dailyForecasts[date] = forecast;
        }
    });

    // Generate forecast rows
    Object.values(dailyForecasts).forEach(forecast => {
        const { dt_txt, main, weather } = forecast;
        const date = new Date(dt_txt).toDateString();
        const temp = Math.round(main.temp); // Round temperature
        const description = weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        // Append to forecast container
        forecastContainer.innerHTML += `
            <div class="row text-center align-items-center py-2 ">
                <div class="col">
                    <img class="forecast-img" src="${icon}" alt="${description}">
                </div>
                <div class="col">
                    ${temp}°C
                </div>
                <div class="col">
                    ${date}
                </div>
            </div>


         
        `;
    });
}
//********************************************************************** */
// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check user preference from local storage
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.checked = true;
}

// Event Listener to Toggle Theme
themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark"); // Save preference
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});

//************************************************************************************ */

async function getWeatherByCoordinates(lat, lon) {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            console.error("Error:", data.message);
            return;
        }

        // Update UI with current location's weather data
        document.querySelector(".currentcity").textContent = data.name;
        document.querySelector(".temp").innerHTML = `${data.main.temp}°C`;
        document.querySelector('.feel-like').innerHTML = `Feels Like: ${data.main.feels_like}°C`;
        document.querySelector('.humidity').innerHTML = ` ${data.main.humidity}%`;
        document.querySelector('.wind-speed').innerHTML = ` ${data.wind.speed} m/s`;
        document.querySelector('.pressure').innerHTML = ` ${data.main.pressure} hPa`;

        // Convert timestamps to readable time
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        document.querySelector(".sunrise").innerHTML = `Sunrise: ${sunriseTime}`;
        document.querySelector(".sunset").innerHTML = `Sunset: ${sunsetTime}`;



        const weatherIcons = {
            "clear sky": "assets/clear sky.png",
            "few clouds": "assets/few-clouds.png",
            "very heavy rain": "assets/rain.png",
            "scattered clouds": "assets/scattered-thunderstorms.png",
            "broken clouds": "assets/severe-weather.png",
            "shower rain": "assets/shower-rain.png",
            "light rain": "assets/shower-rain.png",
            "rain": "assets/rain.png",
            "light snow": "assets/light snow.png",
            "thunderstorm": "assets/thunderstorm.png",
            "snow": "assets/snow.png",
            "mist": "assets/mist.png",
            "smoke": "assets/smoke.png",
            "moderate rain": "assets/rain.png",
            "overcast clouds": "assets/smoke.png",
        };

        const weatherDescription = data.weather[0].description.toLowerCase();
        const weatherImg = weatherIcons[weatherDescription] || "assets/default.png"; // Default image if not found

        document.querySelector(".weather-description").innerHTML = `
            <img class="weather-img   justify-content-center" src="${weatherImg}" alt="${weatherDescription}" width="80" height="80">
            <p class="weatherdecriptext text-start mt-5  justify-content-center "  style=" font-weight: bold; color: #333;  margin-left: 100px">${weatherDescription}</p>
        `;


        // Fetch UV Index
        fetchUVIndex(lat, lon);

        // Fetch 5-day forecast for current location
        fetchFiveDayForecast(data.name);


        const hourlyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const hourlyData = await hourlyResponse.json();

        if (!hourlyResponse.ok) {
            throw new Error(`API Error: ${hourlyData.message}`);
        }

        console.log("Hourly Weather Data:", hourlyData);

        // ✅ Display Hourly Data
        displayHourlyWeather(hourlyData.list);

    } catch (error) {
        console.error("Error fetching weather for current location:", error);
    }
}

//*****************************************************hourly data */

// async function fetchHourlyWeather(lat, lon, API_KEY) {
//     try {
//         const hourlyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
//         const hourlyData = await hourlyResponse.json();

//         if (hourlyData.cod !== "200") {
//             throw new Error(`API Error: ${hourlyData.message}`);
//         }

//         console.log("Hourly Weather Data:", hourlyData);

//         displayHourlyWeather(hourlyData.list);
//     } catch (error) {
//         console.error("Error fetching hourly weather:", error.message);
//     }
// }

function displayHourlyWeather(hourlyList) {
    const forecastContainer = document.getElementById("forecast-container");

    if (!forecastContainer) {
        console.error("Error: forecast-container element not found.");
        return;
    }

    if (!hourlyList || hourlyList.length === 0) {
        console.error("No hourly data available.");
        forecastContainer.innerHTML = "<p>No hourly forecast available.</p>";
        return;
    }

    console.log("Updating hourly forecast in UI...");

    // Clear old forecast
    forecastContainer.innerHTML = "";

    // Show next 6 hours forecast
    for (let i = 0; i < 5; i++) {
        const hourData = hourlyList[i];
        const time = new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const temp = `${hourData.main.temp}°C`;
        const wind = `${hourData.wind.speed}km/h`;
        const icon = `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`;
        const description = hourData.weather[0].description;



        
        // Create hourly forecast HTML
        const hourCard = `
           <div class="card card-hourly me-2  d-flex flex-column justify-content-between text-center"
     style="width: 20rem; ">
    <div class="card-body">
        <h5 class="card-title">${time}</h5>
        <img src="${icon}" alt="${description}" width="40" height="40" class="mb-2">

        <div class="col-12 col-md-12 fs-5 fw-bold">${temp}</div>

        <div class=" justify-content-center align-items-center gap-2 mt-3">
            <img src="assets/navigation.png" width="40" height="40">
            <div class="col-12 fs-6">${wind}</div>
        </div>
    </div>
</div>

        `;

        // Append to forecast container
        forecastContainer.innerHTML += hourCard;
    }

    console.log("Hourly forecast updated successfully!");
}


