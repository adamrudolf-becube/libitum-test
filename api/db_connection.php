<?php

require_once(__DIR__ . "/../config.php");

Class DatabaseConnectionFacroty {

    var $connection;
    
	function createConnection() {
        $connection = mysqli_connect($SERVER_NAME, $USER_NAME, $PASSWORD, $DB_NAME);
        
        if ($connection->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
 
		if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
		} else {
			$this->connection = $connect_string;
        }
        
		return $this->connection;
    }
}

?>