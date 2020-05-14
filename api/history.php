<?php

require_once('db_connection.php');
require_once(__DIR__ . "/../config.php");

/**
 * Returns an SQL compatible string representation of $input.
 * 
 * When running and SQL query, you need to represent your boolean
 * values as either "true" or "false". This is often not how this
 * data is received through the API. This function converts any
 * value to a string.
 * 
 * @param any value which can be interpreted as true / false
 * 
 * @return string "true" if $input can be interpreted as true and
 * "false" otherwise.
 */
function get_db_bool($input) {
    return $input ? "true" : "false";
}

/**
 * This class encapsulates the database connection and application specific
 * data about how to handle REST API requests.
 * 
 * The class object needs to be created and serve_request needs to be called.
 * The serve_request will identify the request type and can query, add and
 * delete data for GET, POST and DELETE methods.
 * 
 * When you create an instance of this class, SERVER_NAME, USER_NAME, PASSWORD
 * and DB_NAME constants need to be defined.
 * 
 * @author Adam Rudolf
 */
class ApiEndpoint {

    private $database_connection;
    private $tablename = "selectionhistory";
    
    /**
     * Returns an instance of the ApiEndpoint class.
     * 
     * When you create an instance of this class, SERVER_NAME, USER_NAME, PASSWORD
     * and DB_NAME constants need to be defined.
     */
    function __construct() {
        $this->database_connection = new DatabaseConnection(SERVER_NAME, USER_NAME, PASSWORD, DB_NAME);
    }

    /**
     * Serves a request which has already arrived.
     * 
     * This method can serve a GET, POST and DELETE requests. For any other request
     * it will response by a 405 Method Not Allowed response.
     * 
     * For GET it will return the contents of the selectionhistory table of the
     * given database.
     * 
     * For POST it will write the given data to the database and reply TRUE or FALSE
     * based on the success of the operation.
     * 
     * For DELETE it will delete all data from the database and reply TRUE or FALSE
     * based on the success of the operation.
     */
    public function serve_request() {

        $request_method = $_SERVER["REQUEST_METHOD"];

        switch($request_method) {
            case 'GET':
                $this->echo_history();
                break;
            case 'POST':
                $this->append_history();
                break;
            case 'DELETE':
                $this->delete_history();
                break;
            default:
                header("HTTP/1.0 405 Method Not Allowed");
                break;
        }
    }

    private function echo_history() {

        $sql = "SELECT * FROM $this->tablename";
        $result = $this->database_connection->query($sql);
    
        $response = array();
    
        while ($row = mysqli_fetch_array($result)) {
            $response[] = $row;
        }
    
        header('Content-Type: application/json');
        echo json_encode($response);    
    }

    private function append_history() {
                            
        $data = json_decode(file_get_contents('php://input'), true);

        error_log("In append_history, data is [".var_dump($data)."].");

        $sql = "INSERT INTO $this->tablename (datetime, bicycleSelected, warrantySelected) VALUES ";

        foreach ($data as $row) {
            $datetime = $row['dateTime'];
            $bicycleSelected = get_db_bool($row["bicycleIsSelected"]);
            $warrantySelected = get_db_bool($row["warrantyIsSelected"]);

            $sql = $sql . "(\"$datetime\", $bicycleSelected, $warrantySelected),";
        }

        // Change the last comma to semicolon
        $sql = substr($sql, 0, -1) . ";";

        $result = $this->database_connection->query($sql);

        if ($result === FALSE) {
            error_log("Error: " . $this->database_connection->get_error());
            echo json_encode(false);
        } else {
            echo json_encode(true);
        }

    }

    private function delete_history() {

        $sql = "DELETE FROM $this->tablename";
        $result = $this->database_connection->query($sql);

        if ($result === FALSE) {
            error_log("Error: " . $this->database_connection->get_error());
            echo json_encode(false);
        } else {
            echo json_encode(true);
        }
    }
}

$api_endpoint = new ApiEndpoint();
$api_endpoint->serve_request();

?>