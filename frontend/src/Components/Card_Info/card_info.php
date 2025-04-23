<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$card_number = $data["card_number"];
$name = $data["name"];
$expiration_date = $data["expiration_date"];
$cvv = $data["cvv"];

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli('localhost', 'root', '', 'muvo');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed"]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO card_info(card_number, name, expiration_date, cvv) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $card_number, $name, $expiration_date, $cvv);
    $stmt->execute();
    echo json_encode(["message" => "Card saved successfully"]);
    $stmt->close();
    $conn->close();
} catch (\mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        http_response_code(409);
        echo json_encode(["message" => "Card already exists"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "An error occurred"]);
    }
}
?>

