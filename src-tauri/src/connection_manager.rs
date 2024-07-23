use std::env;

use sqlite;

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub struct Connection {
	pub id: i32,
	pub name: String,
	pub host: String,
	pub port: i32,
	pub username: String,
	pub password: String,
	pub private_key: String,
	pub remote_path: String,
	pub local_path: String,
	pub default: bool,
	pub protocol: i8,
	pub created_at: String,
	pub updated_at: String,
	pub last_connected_at: String,
}

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub enum Protocol {
	Sftp = 0,
	Ftp = 1,
}

impl From<Protocol> for i32 {
	fn from(protocol: Protocol) -> i32 {
		match protocol {
			Protocol::Sftp => 0,
			Protocol::Ftp => 1,
		}
	}
}

impl From<i32> for Protocol {
	fn from(protocol: i32) -> Protocol {
		match protocol {
			0 => Protocol::Sftp,
			1 => Protocol::Ftp,
			_ => Protocol::Sftp,
		}
	}
}


/// Initializes the SQLite database and creates a 'connections' table if it doesn't already exist.
///
/// # Arguments
/// * None
///
/// # Returns
/// * `Ok(())` if the initialization is successful
/// * `Err(String)` with the error message if there's an error
pub fn initialize() -> Result<(), String> {
	// Open a SQLite database with a dynamically calculated path
	let lite = sqlite::open(get_database_path()).unwrap();

	// Execute a CREATE TABLE SQL statement to ensure a table named 'connections' exists
	// This table contains all necessary fields for storing connection information
	match lite.execute(
		"CREATE TABLE IF NOT EXISTS `connections` (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,                     // Autoincrement ID
                'name' TEXT NOT NULL,                                       // Human-friendly connection name
                'host' TEXT NOT NULL,                                       // Host name or IP address of the remote machine
                'port' INTEGER NOT NULL,                                    // Port number for the connection
                'username' TEXT NOT NULL,                                   // Username for the connection
                'password' TEXT NOT NULL,                                   // Password for the connection
                'private_key' TEXT NOT NULL,                                // Private key content for SSH connection if applicable
                'remote_path' TEXT NOT NULL,                                // Remote path that this connection should start at
                'local_path' TEXT NOT NULL,                                 // Local path that this connection maps to
                'default' BOOLEAN NOT NULL,                                 // Flag to check if it's a default connection
                'protocol' TINYINT NOT NULL DEFAULT 0,                      // Protocol to use for the connection. 0 means SFTP, 1 means FTP
                'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           // Timestamp of creation
                'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,           // Timestamp of last update
                'last_connected_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP     // Timestamp of last connection attempt
            )",
	) {
		Ok(_) => Ok(()),   // If the SQL statement executes successfully, return Ok
		Err(e) => Err(format!("Code: {:?}, Message: {:?}", e.code, e.message))  // If there's an error, format and return the error
	}
}

/// Adds a new connection to the SQLite database.
///
/// # Arguments
///
/// * `connection` - The `Connection` structure containing all the necessary values for the new connection.
///
/// # Example
///
/// ```rust
/// use tauri::Command;
///
/// #[tauri::command]
/// pub fn add_connection(connection: Connection) {
///     // Implementation goes here
/// }
/// ```
#[tauri::command]
pub fn add_connection(connection: Connection) {
	// Open SQLite database, path is acquired through get_database_path() function
	let lite = sqlite::open(get_database_path()).unwrap();

	// Execute an SQL command to insert a new row to 'connections' inside the database
	// All necessary values for the new row are taken from the Connection structure passed as a parameter to add_connection method
	match lite.execute(
		&format!(
			"INSERT INTO `connections` ('name', 'host', 'port', 'username', 'password', 'private_key', 'remote_path', 'local_path', 'default', 'protocol')
                    VALUES ('{}', '{}', {}, '{}', '{}', '{}', '{}', '{}', {}, '{}')",
			// These fetched by the structure fields of Connection
			connection.name,                      // Name of the connection
			connection.host,                      // Host IP or URL of the connection
			connection.port,                      // The port number of the connection
			connection.username,                  // Username for authentication for the connection
			connection.password,                  // Password for authentication for the connection
			connection.private_key,               // SSH private key for the connection (if applicable)
			connection.remote_path,               // The path for the connection in the remote machine
			connection.local_path,                // Local path that this connection mapped to
			connection.default,                   // Boolean flag - is this connection default or not
			connection.protocol                   // The protocol of the connection (FTP or SFTP)
		),
	) {
		// If the query was executed successfully - do nothing
		Ok(_) => (),
		// If there's an error, print it to the console
		Err(e) => println!("{:?}", e),
	}
}

/// Retrieves a list of connections from the database.
///
/// Returns a `Result` containing a `Vec<Connection>` if successfully got the data or a `String` with an error message if failed.
#[tauri::command]
pub fn get_connections() -> Result<Vec<Connection>, String> {
	// Store all connections
	let mut connections = Vec::new();
	// Open SQLite database, path is acquired through get_database_path() function
	let lite = sqlite::open(get_database_path()).map_err(|e| e.to_string())?;
	// Execute a SELECT statement to retrieve all data from the connections table
	let mut statement = lite
		.prepare("SELECT * FROM connections ORDER BY last_connected_at DESC")
		.map_err(|e| e.to_string())?;

	// Read every row of data in the connections table
	while let sqlite::State::Row = statement.next().unwrap() {
		// Map the data to a Connection struct
		let connection = Connection {
			// Reading unique identifier (id) from the database and converting it to i32
			id: statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get id from database: {:?}", e.to_string()))? as i32,
			// Reading connection name from the database
			name: statement.read::<String, usize>(1).map_err(|e| format!("Failed to get name from database: {:?}", e.to_string()))?,
			// Reading host IP or URL of the remote connection from the database
			host: statement.read::<String, usize>(2).map_err(|e| format!("Failed to get host from database: {:?}", e.to_string()))?,
			// Reading port number for the remote connection from the database and converting it to i32
			port: statement.read::<i64, usize>(3).map_err(|e| format!("Failed to get port from database: {:?}", e.to_string()))? as i32,
			// Reading username for the remote connection from the database
			username: statement.read::<String, usize>(4).map_err(|e| format!("Failed to get username from database: {:?}", e.to_string()))?,
			// Reading password for the remote connection from the database
			password: statement.read::<String, usize>(5).map_err(|e| format!("Failed to get password from database: {:?}", e.to_string()))?,
			// Reading SSH private key for the connection from the database, if it is available
			private_key: statement.read::<String, usize>(6).map_err(|e| format!("Failed to get private_key from database: {:?}", e.to_string()))?,
			// Reading the remote path for the connection from the database
			remote_path: statement.read::<String, usize>(7).map_err(|e| format!("Failed to get remote_path from database: {:?}", e.to_string()))?,
			// Reading the local path the connection is mapped to from the database
			local_path: statement.read::<String, usize>(8).map_err(|e| format!("Failed to get local_path from database: {:?}", e.to_string()))?,
			// Reading the flag that signals if this is the default connection and converting it to a boolean
			default: statement.read::<i64, usize>(9).map_err(|e| format!("Failed to get default from database: {:?}", e.to_string()))? != 0,
			// Reading the protocol of the connection (protocol number: FTP = 0, SFTP = 1) from the database and converting it to i8
			protocol: statement.read::<i64, usize>(10).map_err(|e| format!("Failed to get protocol from database: {:?}", e.to_string()))? as i8,
			// Reading the creation time of the connection from the database
			created_at: statement.read::<String, usize>(11).map_err(|e| format!("Failed to get created_at from database: {:?}", e.to_string()))?,
			// Reading the last update time of the connection from the database
			updated_at: statement.read::<String, usize>(12).map_err(|e| format!("Failed to get updated_at from database: {:?}", e.to_string()))?,
			// Reading the last connection attempt time for this connection from the database
			last_connected_at: statement.read::<String, usize>(13).map_err(|e| format!("Failed to get last_connected_at from database: {:?}", e.to_string()))?,
		};
		connections.push(connection); // Add the connection into the collection
	}

	return Ok(connections); // Return the collection of connections
}

#[tauri::command]
// Function to retrieve a connection from the SQLite database based on the id
pub fn get_connection_by_id(id: i32) -> Result<Connection, String> {
	// Open SQLite connection using the get_database_path() function
	let sqlite = sqlite::open(get_database_path()).map_err(|e| e.to_string())?;
	// Create a SQL query by formatting a string with the provided id
	let query = format!("SELECT * FROM connections WHERE id = {} limit 1", id);
	// Prepare the SQL statement
	let mut statement = sqlite.prepare(&query).map_err(|e| e.to_string())?;

	// If there's no row to fetch for the provided id, return an error
	if statement.next().map_err(|e| e.to_string())? != sqlite::State::Row {
		return Err(format!("No connection found with id: {}", id));
	}

	// Build a Connection structure by reading row's columns and mapping them to the struct's fields
	Ok(Connection {
		id: statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get id from database: {:?}", e.to_string()))? as i32,  // ID of the connection
		name: statement.read::<String, usize>(1).map_err(|e| format!("Failed to get name from database: {:?}", e.to_string()))?,  // Name of the connection
		host: statement.read::<String, usize>(2).map_err(|e| format!("Failed to get host from database: {:?}", e.to_string()))?,  // Host of the connection
		port: statement.read::<i64, usize>(3).map_err(|e| format!("Failed to get port from database: {:?}", e.to_string()))? as i32,  // Port of the connection
		username: statement.read::<String, usize>(4).map_err(|e| format!("Failed to get username from database: {:?}", e.to_string()))?,  // Username for the connection
		password: statement.read::<String, usize>(5).map_err(|e| format!("Failed to get password from database: {:?}", e.to_string()))?,  // Password for the connection
		private_key: statement.read::<String, usize>(6).map_err(|e| format!("Failed to get private_key from database: {:?}", e.to_string()))?,  // SSH private key for the connection
		remote_path: statement.read::<String, usize>(7).map_err(|e| format!("Failed to get remote_path from database: {:?}", e.to_string()))?,  // The path for the connection in the remote machine
		local_path: statement.read::<String, usize>(8).map_err(|e| format!("Failed to get local_path from database: {:?}", e.to_string()))?,  // Local path that this connection mapped to
		default: statement.read::<i64, usize>(9).map_err(|e| format!("Failed to get default from database: {:?}", e.to_string()))? != 0,  // Boolean flag if the connection is default or not
		protocol: statement.read::<i64, usize>(10).map_err(|e| format!("Failed to get protocol from database: {:?}", e.to_string()))? as i8,  // The protocol of the connection (FTP or SFTP)
		created_at: statement.read::<String, usize>(11).map_err(|e| format!("Failed to get created_at from database: {:?}", e.to_string()))?,  // Connection creation time
		updated_at: statement.read::<String, usize>(12).map_err(|e| format!("Failed to get updated_at from database: {:?}", e.to_string()))?,  // Connection update time
		last_connected_at: statement.read::<String, usize>(13).map_err(|e| format!("Failed to get last_connected_at from database: {:?}", e.to_string()))?,  // Last time the connection was attempted
	})
}

/// Update an existing connection in the SQLite database based on the id.
///
/// # Arguments
///
/// * `id` - The id of the connection to update.
/// * `connection` - The updated connection details.
///
/// # Example
///
/// ```
/// use crate::Connection;
///
/// let id = 1;
/// let connection = Connection {
///     name: String::from("Connection 1"),
///     host: String::from("example.com"),
///     port: 22,
///     username: String::from("user"),
///     password: String::from("password"),
///     private_key: String::from("private_key"),
///     remote_path: String::from("/path/to/remote"),
///     local_path: String::from("/path/to/local"),
///     default: false,
///     protocol: 0,
/// };
/// update_connection(id, connection);
/// ```
#[tauri::command]
pub fn update_connection(id: i32, connection: Connection) {
	println!("Updating '{:?}' {:?}", id, connection);  // Debug print - show which connection(id) is updated

	// Open SQLite database, path is acquired through get_database_path() function
	let lite = sqlite::open(get_database_path()).unwrap();

	// Prepare an SQL command to update certain row (connection) in 'connections' inside the database
	// This command updates all fields of the row(connection) except id, which is used to identify the row to be updated
	let sql = &format!(
		"UPDATE `connections` SET 'name' = '{}', 'host' = '{}', 'port' = {}, 'username' = '{}', 'password' = '{}', 'private_key' = '{}', 'remote_path' = '{}', 'local_path' = '{}', 'default' = {}, 'protocol' = {}, 'updated_at'='{}' WHERE id = {}",
		connection.name,            // Set the name of the connection
		connection.host,            // Set the host IP or URL of the remote connection
		connection.port,            // Set the port number of the remote connection
		connection.username,        // Set the username for the remote connection
		connection.password,        // Set the password for the remote connection
		connection.private_key,     // Set the SSH private key for the connection
		connection.remote_path,     // Set the path for the connection in the remote machine
		connection.local_path,      // Set the local path that this connection mapped to
		connection.default,         // Set the boolean flag if the connection is default or not
		connection.protocol,        // Set the protocol of the connection (FTP or SFTP)
		chrono::Local::now().to_string(),  // Update the 'updated_at' field with the current time
		id   // This is the id of the row to be updated
	);
	println!("{}", &sql);  // Debug print - show the final SQL command string

	// Execute the prepared SQL command, print error to the console in case of failure
	match lite.execute(&sql) {
		Ok(_) => (),
		Err(e) => println!("{:?}", e),
	}
}

/// Updates the 'last_connected_at' field of a connection with the given ID in a SQLite database.
///
/// # Arguments
///
/// * `id` - The ID of the connection to update.
///
/// # Panics
///
/// This function will panic if the SQLite database cannot be opened or if there is an error during SQL execution.
#[tauri::command]
pub fn update_join(id: i32) {
	// Open a SQLite database with a dynamically calculated path
	let lite = sqlite::open(get_database_path()).unwrap();

	// Prepare an SQL command to update the 'last_connected_at' field of the connection with the given ID
	// 'last_connected_at' is updated with the current timestamp
	match lite.execute(
		&format!(
			"UPDATE `connections` SET 'last_connected_at' = '{}' WHERE id = {}",
			chrono::Local::now().to_string(),  // Current timestamp
			id   // ID of the connection to update
		),
	) {
		// If the query was successfully executed - do nothing
		Ok(_) => (),
		// In case of an error during SQL execution, print the error details to the console
		Err(e) => println!("{:?}", e),
	}
}

/// Delete a connection from the SQLite database based on the provided id.
///
/// # Arguments
///
/// * `id` - The id of the connection to delete.
///
/// # Examples
///
/// ```
/// // Delete the connection with id 1
/// delete_connection(1);
/// ```
#[tauri::command]
pub fn delete_connection(id: i32) {
	// Open a connection to the SQLite database.
	let lite = sqlite::open(get_database_path()).unwrap();
	match lite.execute(
		&format!(
			// SQL query to delete the connection based on the id.
			"DELETE FROM connections WHERE id = '{}'",
			id
		),
	) {
		Ok(_) => (),
		Err(e) => println!("{:?}", e),  // Print any error that occurs.
	}
}

/// Sets the specified connection as the default.
///
/// # Arguments
///
/// * `id` - The ID of the connection to set as default.
///
/// # Example
///
/// ```
/// # use tauri::sqlite;
/// # use get_database_path;
/// # #[tauri::command]
/// # pub fn set_default(id: i32) {
/// // Open a connection to the SQLite database.
/// let lite = sqlite::open(get_database_path()).unwrap();
///
/// // Remove default status from all connections.
/// match lite.execute(&"UPDATE `connections` SET 'default' = 0".to_string()) {
///     Ok(_) => (),
///     Err(e) => println!("{:?}", e),  // Print any error that occurs.
/// }
///
/// // Set the specified connection as default based on the ID.
/// match lite.execute(&format!("UPDATE `connections` SET 'default'
#[tauri::command]
pub fn set_default(id: i32) {
	// Open a connection to the SQLite database.
	let lite = sqlite::open(get_database_path()).unwrap();
	match lite.execute(
		&"UPDATE `connections` SET 'default' = 0".to_string(),
		// SQL query to remove default status from all connections.
	) {
		Ok(_) => (),
		Err(e) => println!("{:?}", e),  // Print any error that occurs.
	}
	match lite.execute(
		&format!(
			// SQL query to set the connection as default based on the id.
			"UPDATE `connections` SET 'default' = 1 WHERE id = {}",
			id
		),
	) {
		Ok(_) => (),
		Err(e) => println!("{:?}", e),  // Print any error that occurs.
	}
}

/// Retrieves the path to the SQLite database.
///
/// The function first gets the path to the current executable using `env::current_exe()`.
/// If successful, it then retrieves the directory of the executable using `exe_path.parent()`.
/// Finally, the function joins the directory path with the filename "connections.db" and returns
/// the resulting path as a string.
///
/// # Errors
///
/// If any error occurs while getting the current executable path or the directory of the executable,
/// an error message is printed to the standard error stream and the default path "connections.db" is returned.
///
/// # Returns
///
/// - The path to the SQLite database if the executable path and directory are successfully retrieved.
/// - The default path "connections.db" if any error occurs.
fn get_database_path() -> String {
	// Get the path to the current executable.
	let exe_path = match env::current_exe() {
		Ok(exe_path) => exe_path,
		Err(e) => {
			eprintln!("Failed to get current exe path: {}", e);
			return "connections.db".to_string();
		}
	};

	// Get the directory the executable is in.
	let exe_directory = match exe_path.parent() {
		Some(dir) => dir,
		None => {
			eprintln!("Failed to get directory of the exe");
			return "connections.db".to_string();
		}
	};

	// Return the path to the SQLite database.
	return exe_directory.join("connections.db").to_str().unwrap().to_string();
}
