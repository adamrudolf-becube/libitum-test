<?php

/**
 * DatabaseConnection encapsulates a connection to the database.
 * 
 * This class gets the connection information, and implements a RAII approach.
 * This means that the connection is created and opened upon construction and
 * closed upon destruction time. This makes the usage less error prone, as it
 * reduces coupling.
 * 
 * The constructor also takes care of the checks whether the connection could
 * be opened or not.
 * 
 * The user only needs to create the object and execute queries.
 * 
 * @author Adam Rudolf
 */
Class DatabaseConnection {

    private $server_name;
    private $user_name;
    private $password;
    private $db_name;
    private $mysqli;

    /**
     * Returns an instance of the DatabaseConnection class.
     * 
     * @param $server_name name of the database server
     * @param $user_name username of a user who has read and write access in that database
     * @param $password password of the user
     * @param $db_name name of the database
     * 
     * @author Adam Rudolf
     * 
     * @return created instance of DatabaseConnection
     */
    function __construct($server_name, $user_name, $password, $db_name) {
        $this->server_name = $server_name;
        $this->user_name = $user_name;
        $this->password = $password;
        $this->db_name = $db_name;

        $this->mysqli = new mysqli($this->server_name, $this->user_name, $this->password, $this->db_name);
 
		if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
        }
    }

    function __destruct() {
        $this->mysqli->close();
    }

    /**
     * Perform query against the stored database.
     * 
     * This function wraps mysqli's function with the same name
     * with a little simplified signature, so the query parameter
     * and the return value is the same as for that function.
     * 
     * @param query Required. Specifies the SQL query string
     * 
     * @return Returns FALSE on failure. For successful SELECT,
     * SHOW, DESCRIBE or EXPLAIN queries mysqli_query() will
     * return a mysqli_result object. For other successful
     * queries mysqli_query() will return TRUE.
     */
    function query ( string $query ) : mixed {
        return $this->mysqli->query($query);
    }
}

?>