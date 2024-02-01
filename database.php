<?php
function connect_database($server, $username, $password, $db){
    $connection = null;
    try{
        $connection = new mysqli($server, $username, $password, $db);
        if($connection -> connect_errno){
            echo '{"error": "Database connection failed"}';
        }

        return $connection;
    } catch(Exception $th){
        return null;
    }
}

function get_weather_data($connection, $icons, $city ){
    
    try{
        $stmt = $connection->prepare("SELECT * FROM weathers WHERE city = ? AND dates = ?");
        $stmt->bind_param('ss', $city, $date);

        $result = $stmt->execute();
        if ($result){
            $data = $stmt -> fetch_all(MYSQLI_ASSOC);
            return $data;
        }else{
            return null;
        }
    }catch(Exception $th){
        return null;
    }
}

function fetchPastWeatherData($connection, $city, $date) {
    try {
        $pastWeatherData = get_weather_data($connection, $city, $date);

        if ($pastWeatherData !== null) {
            return $pastWeatherData;
        }
    } catch (Exception $error) {
        echo "Error fetching past weather data: " . $error->getMessage();
        return null;
    }
}

function insert_weather_data($connection, $result) {
    $weather_data = json_decode($result, true);
    try {
        $weeks = $weather_data["weeks"];
        $temperature = $weather_data["temperature"];
        $humidity = $weather_data["humidity"];
        $wind_speed = $weather_data["wind_speed"];
        $air_pressure = $weather_data["air_pressure"];
        $icons = $weather_data["icons"];
        $dates = $weather_data["dates"];
        $city = $weather_data["city"];

        if (!recordExists($connection, $city, $dates)) {
            // Prepare and bind the statement
            $stmt = $connection->prepare("INSERT INTO weathers (weeks, temperature, humidity, wind_speed, air_pressure, icons, dates, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('ssdsdsss', $weeks, $temperature, $humidity, $wind_speed, $air_pressure, $icons, $dates, $city);

            // Execute the statement
            $result = $stmt->execute();

            if ($result) {
                return null;
            } else {
                error_log("Error: " . $stmt->error);
                echo "Error inserting data into the database.";
            }

            // Close the statement
            $stmt->close();
        }
    } catch (Exception $th) {
        echo "Exception: " . $th->getMessage();
    }
}
function recordExists($connection, $city, $dates) {
    $stmt = $connection->prepare("SELECT * FROM weathers WHERE city = ? AND dates = ?");
    $stmt->bind_param('ss', $city, $dates);

    $result = $stmt->execute();
    
    if ($result) {
        $stmt->store_result();
        $recordExists = $stmt->num_rows > 0;
        $stmt->close();
        return $recordExists;
    } else {
        error_log("Error: " . $stmt->error);
        echo "Error checking if record exists in the database.";
        return true; // Assume record exists to avoid unintended insertions
    }
}

?>