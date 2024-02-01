
<?php
include("database.php");
include("api_weather.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$connection = connect_database("localhost", "root", "", "weather");
if ($connection->connect_errno) {
    echo json_encode(["error" => "Database connection failed: " . $connection->connect_error]);
    exit;
}
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

$city = isset($_GET["city"]) ? $_GET["city"] : "Saharsa";


$weather_icons = "desired_icon_value";
$result = fetch_weather_data($city);

echo $result;
insert_weather_data($connection, $result);


?>