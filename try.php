<?php
include("database.php");
// Assuming you have established a database connection
// Replace these values with your actual database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weather";

// Create connection
$connection = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}


$city = "Saharsa";
$weather_data = fetch_weather_data($city);

// Insert data into the weather_data table
insert_weather_data($connection, $weather_data);

// Close connection
$connection->close();

function insert_weather_data($connection, $weather_data) {
    try {
        $weeks = isset($weather_data["weeks"]) ? $weather_data["weeks"] : null;
        $temperature = isset($weather_data["temperature"]) ? $weather_data["temperature"] : null;
        $humidity = isset($weather_data["humidity"]) ? $weather_data["humidity"] : null;
        $wind_speed = isset($weather_data["wind_speed"]) ? $weather_data["wind_speed"] : null;
        $air_pressure = isset($weather_data["air_pressure"]) ? $weather_data["air_pressure"] : null;
        $dates = isset($weather_data["dates"]) ? $weather_data["dates"] : null;
        $icons = isset($weather_data["icons"]) ? $weather_data["icons"] : null;
        $city = isset($weather_data["city"]) ? $weather_data["city"] : null;

        // Prepare and bind the statement
        $stmt = $connection->prepare("INSERT INTO weathers (weeks, temperature, humidity, wind_speed, air_pressure, dates, icons, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssssss', $weeks, $temperature, $humidity, $wind_speed, $air_pressure, $dates, $icons, $city);

        // Execute the statement
        $result = $stmt->execute();

        if ($result) {
            echo "Data inserted successfully!";
        } else {
            error_log("Error: " . $stmt->error);
            echo "Error inserting data into the database.";
        }

        // Close the statement
        $stmt->close();

    } catch (Exception $th) {
        echo "Exception: " . $th->getMessage();
    }
}
?>
