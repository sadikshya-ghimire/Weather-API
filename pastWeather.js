
const apiUrl = "http://localhost/Weather%20API/Sadikshya%20Ghimire(2406777).php";

async function fetchWeatherData(city, date = "") {
    try {
        if (!city.trim()) {
            throw new Error("Please enter a valid city name.");
        }

        let url = `${apiUrl}?city=${city}`;
        if (date) {
            url += `&date=${date}`;
        }
        const response = await fetch(url);
        const dataString = await response.text();
        // Check if the response is valid JSON
        try {
            const data = JSON.parse(dataString);

            if (!response.ok) {
                throw new Error("City not found or error in fetching data");
            }

            return data;
        } catch (jsonError) {
            // Log the error for debugging
            console.error("JSON Parse Error:", jsonError);

            // Handle non-JSON response (e.g., HTML error page)
            throw new Error("Please enter a valid city name.");
        }
    } catch (error) {
        handleError(error.message);
        return null; // Return null to indicate error
    }
}

async function fetchDataAndDisplayWeather() {
    try {
        const weatherData = await fetchWeatherData("Saharsa");
        if (weatherData !== null) {
            // Display weather data on success
            displayWeather(weatherData);
        }
    } catch (error) {
        handleError(error.message);
    }
}
async function fetchDataAndDisplayPastWeather() {
    try {
        const currentDate = new Date();
        const pastWeatherDataArray = [];

        // Fetch and store past seven days weather data
        for (let i = 1; i <= 7; i++) {
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - i);

            const pastWeatherData = await fetchPastWeatherData("Saharsa", pastDate.toISOString());

            if (pastWeatherData !== null) {
                pastWeatherDataArray.push(pastWeatherData);
            }
        }

        // Display past weather data
        for (let i = 0; i < pastWeatherDataArray.length; i++) {
            displayPastWeather(pastWeatherDataArray[i], `day${i + 1}`);
        }
    } catch (error) {
        handleError(error.message);
    }
}
fetchDataAndDisplayWeather();

fetchDataAndDisplayPastWeather();

 async function displayWeather(data) {
    try {
        const date = new Date(data.dates);
        const dateTime = date.toLocaleDateString("en-US", {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        document.querySelector(".city").innerHTML = data.city;
        document.querySelector(".day-info").innerHTML = data.weeks;
        document.querySelector(".date-info").innerHTML = data.dates;
        document.querySelector(".temperature").innerHTML = Math.round(data.temperature) + "°C";
        document.querySelector(".humidity").innerHTML = "Humidity: " + data.humidity + "%";
        document.querySelector(".wind-speed").innerHTML = "Wind: " + data.wind_speed + " km/h";
        document.querySelector(".pressure").innerHTML = "Pressure: " + data.air_pressure + " Pa";
        document.querySelector(".icons").src = "https://openweathermap.org/img/wn/" + data.icons + ".png"
    } catch (error) {
        handleError(error.message);
    }
}



// Fetch past weather data from your server
async function fetchPastWeatherData(city, date) {
    try {
        const pastWeatherData = await fetchWeatherData(city, date);

        if (pastWeatherData !== null) {
            return pastWeatherData;
        }
    } catch (error) {
        console.error(`Error fetching data for date ${date}:`, error.message);
        return null;
    }
}

function displayPastWeather(data, dayId) {
    try {
        const dayElement = document.getElementById(dayId);
        dayElement.querySelector(".day-info").innerHTML = getDayOfWeek(data.dates);
        dayElement.querySelector(".date-info").innerHTML = data.dates;
        dayElement.querySelector(".temperature").innerHTML = Math.round(data.temperature) + "°C";
        dayElement.querySelector(".humidity").innerHTML = "Humidity: " + data.humidity + "%";
        dayElement.querySelector(".wind-speed").innerHTML = "Wind: " + data.wind_speed + " km/h";
        dayElement.querySelector(".pressure").innerHTML = "Pressure: " + data.air_pressure + " Pa";
        dayElement.querySelector(".icons").src = "https://openweathermap.org/img/wn/" + data.icons + ".png";
    } catch (error) {
        console.error(`Error displaying data for day ${dayId}:`, error.message);
    }
}
for (let i = 0; i < pastWeatherDataArray.length; i++) {
    displayPastWeather(pastWeatherDataArray[i], `day${i + 1}`); // Pass the day ID
}
function getDayOfWeek(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}



