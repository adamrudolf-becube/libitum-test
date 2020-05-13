<?php

require_once('db_connection.php');

function get_db_connection() {
    $db_connection_factory = new DatabaseConnectionFacroty();
    return $db_connection_factory->create_connection();
}

function echo_history() {

    $connection = get_db_connection();
    $sql = "SELECT * FROM selectionhistory";
    $result = $connection->query($sql);
    $response = array();

    while ($row = mysqli_fetch_array($result)) {
        $response[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($response);

    $connection->close();

}

function append_history() {

    $data = json_decode(file_get_contents('php://input'), true);

    $connection = get_db_connection();

    $sql = "INSERT INTO history (ID, datetime, bicycleSelected, warrantySelected) VALUES ";

    foreach ($data as $row) {
        $datetime = $row['datetime'];
        $bicycleSelected = $row["bicycleSelected"];
        $warrantySelected = $row["warrantySelected"];

        $sql = $sql . "(LAST_INSERT_ID(), $datetime, $bicycleSelected, $warrantySelected),";
    }

    // Change the last comma to semicolon
    $sql = substr($sql, 0, -1) . ";";

    $result = $connection->query($sql);

    if ($connection->query($sql) === FALSE) {
        error_log("Error: " . $connection->error);
        echo json_encode(false);
    } else {
        echo json_encode(true);
    }

    $connection->close();

}

function delete_history() {

    $connection = get_db_connection();
    $sql = "DELETE * FROM selectionhistory";
    $result = $connection->query($sql);

    header('Content-Type: application/json');
    echo json_encode($response);

    if ($connection->query($sql) === FALSE) {
        error_log("Error: " . $connection->error);
        echo json_encode(false);
    } else {
        echo json_encode(true);
    }

    $connection->close();
    
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        echo_history();
        break;
    case 'POST':
        append_history();
        break;
    case 'DELETE':
        delete_history();
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

?>