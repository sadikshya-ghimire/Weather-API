// API key and URL for OpenWeatherMap
const apiKey = "07311d20d768949071996f5f5a067fda";
const apiUrl = "http://localhost/Weather%20API/Sadikshya%20Ghimire(2406777).php";

// DOM elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

// Function to fetch weather data from the server
async function fetchWeatherData(city) {
    try {
        if (!city.trim()) {
            throw new Error("Please enter a valid city name.");
        }

        const response = await fetch(`${apiUrl}?city=${city}`);
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


// Display function to show weather information on the web
function displayWeather(data) {
    try {
        const date = new Date(data.dates);
        const dateTime = date.toLocaleDateString("en-US", {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        // Update HTML elements with weather information
        document.querySelector(".city").innerHTML = data.city;
        document.querySelector(".temp").innerHTML = Math.round(data.temperature) + "°C";
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + data.icons + ".png";
        document.querySelector(".time").innerHTML = data.dates;
        document.querySelector(".humidity").innerHTML = "Humidity: " + data.humidity + "%";
        document.querySelector(".wind").innerHTML = "Wind Speed: " + data.wind_speed + " km/h";
        document.querySelector(".pressure").innerHTML = "Pressure: " + data.air_pressure + " Pa";

    } catch (error) {
        handleError(error.message);
    }
}

// Function to handle errors and update UI
function handleError(message) {
    console.error("Error:", message);
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".error").innerHTML = message;
}

// Event listener for the search button to trigger the weather fetch when clicked
searchBtn.addEventListener("click", async () => {
    try {
        // Call the fetchWeatherData function with the value from the search input
        const weatherData = await fetchWeatherData(searchBox.value);
        if (weatherData !== null) {
            // Display weather data on success
            displayWeather(weatherData);
        }
    } catch (error) {
        // Handle errors and update UI
        handleError(error.message);
    }
});

searchBox.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault(); // Prevent the default behavior (e.g., form submission)

        fetchWeatherData(searchBox.value)
            .then((weatherData) => {
                if (weatherData !== null) {
                    displayWeather(weatherData);
                }
            })
            .catch((error) => handleError(error.message));
    }
});


// Initial fetch and display for a default city (Saharsa)
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

// Call the initial fetch and display function
fetchDataAndDisplayWeather();
