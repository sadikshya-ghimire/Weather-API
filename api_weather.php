<?php
function fetch_weather_data($city){
    try {
        $apiKey = '07311d20d768949071996f5f5a067fda';
        $url = "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid={$apiKey}&units=metric";
        
        $dataString = file_get_contents($url);
        
        if ($dataString === false) {
            throw new Exception("Failed to fetch data from the API.");
        }
        
        $weather_data = json_decode($dataString);
        
        
        if ($weather_data === null || !isset($weather_data->main, $weather_data->wind, $weather_data->weather[0], $weather_data->dt,)) {
            throw new Exception("Failed to decode JSON response from the API.");
        }else{
            $weeks = date("D");
            $temperature = $weather_data->main->temp;
            $humidity = $weather_data->main->humidity;
            $wind_speed = $weather_data->wind->speed;
            $air_pressure = $weather_data->main->pressure;
            $icons = $weather_data->weather[0]->icon;
            $dates = date("Y-m-d H:i:s", $weather_data->dt);
            $city = $weather_data->name;
            $resultArray = [
                'weeks' => $weeks,
                'temperature' => $temperature,
                'humidity' => $humidity,
                'wind_speed' => $wind_speed,
                'air_pressure' => $air_pressure,
                'icons' => $icons,
                'dates' => $dates,
                'city' => $city,
            ];
            $jsonOutput = json_encode($resultArray);
            return $jsonOutput;
        }
        
    } catch (Exception $th) {
        error_log("Error in fetch_weather_data: " . $th->getMessage());
        return null;
    }
}


?>