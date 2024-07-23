use std::path::Path;

use serde::{Deserialize, Serialize};
use sqlite::State;
use tauri::{LogicalSize, Manager, Size};
use window_shadows::set_shadow;

#[derive(Debug, Serialize, Deserialize)]
pub struct LogMessage {
	id: i64,
	message: String,
	log_type: i8,
	args: String,
	created: String,
}

#[tauri::command]
/// Asynchronous function for logging messages to a database.
/// Takes in the message, the arguments, and the log type to be logged.
///
/// # Arguments
/// * `message` - A string slice that holds the log message.
/// * `arguments` - A string slice that holds the log arguments.
/// * `log_type` - An i64 that represents the type of the log.
///
/// # Errors
/// Returns an Err if there are issues obtaining the LOG_FILE_PATH environment variable,
/// opening the log file database, preparing or executing the SQL statement
pub async fn log(message: &str, arguments: &str, log_type: i64) -> Result<(), String> {
	// Get log file path from environment variable
	let log_file_path = std::env::var("LOG_FILE_PATH").map_err(|e| format!("Failed to get LOG_FILE_PATH environment variable: {}", e))?;

	// Open sqlite connection
	match sqlite::open(log_file_path) {
		Ok(connection) => {
			// Prepare SQL statement for inserting log
			match connection.prepare("INSERT INTO `logs` (`type`, `message`, `arguments`) VALUES (?, ?, ?);") {
				Ok(mut statement) => {
					// Bind values to SQL statement
					statement.bind((1, log_type)).map_err(|e| format!("Failed to bind log_type: {}", e))?;
					statement.bind((2, message)).map_err(|e| format!("Failed to bind message: {}", e))?;
					statement.bind((3, arguments)).map_err(|e| format!("Failed to bind arguments: {}", e))?;
					// Execute the SQL statement
					loop {
						match statement.next() {
							Ok(state) => {
								if state == State::Done {
									break;
								}
							},
							Err(e) => return Err(format!("Failed to move statement cursor to the next row: {}", e))
						}
					}
					// Output message for debugging purposes
					println!("{}", message);
					Ok(())
				},
				Err(e) => Err(format!("Failed to prepare log statement: {}", e))
			}
		},
		Err(e) => Err(format!("Failed to open log file: {}", e))
	}
}

/// Initializes the log file by creating a SQLite database and a log table
///
/// # Examples
///
/// ```
/// initialize_log_file();
/// ```
pub fn initialize_log_file() {
	// Define the name of the log database file
	let file_name = "sftp-editor-client-log.db";

	// Get the path to the temporary directory of the system
	let temp_dir = std::env::temp_dir();

	// Convert the path to a Path object for further operations
	let temp_dir = Path::new(&temp_dir);

	// Join the database file name to the path of the temporary directory
	let file_path = temp_dir.join(file_name);

	// Set an environment variable with the location of the log database file
	std::env::set_var("LOG_FILE_PATH", &file_path);

	// Try to open or create the log database file
	match sqlite::open(file_path) {
		// If the file was successfully opened or created proceed with the connection
		Ok(connection) => {
			// Execute an SQL command to create a new table for the logs if it doesn't exist
			if let Err(e) = connection.execute("CREATE TABLE IF NOT EXISTS `logs` ('id' INTEGER PRIMARY KEY, 'type' TINYINT, 'message' TEXT, 'arguments' TEXT DEFAULT NULL, 'created' TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
			{
				// Print an error message if the SQL command execution failed
				eprintln!("Error creating log table: {}", e);
			}
		}
		// If the file opening/creation failed, print an error message
		Err(e) => eprintln!("Error creating log file: {}", e)
	}
}

/// Retrieves log history based on provided parameters.
///
/// # Arguments
///
/// * `start_date` - Start date in the format 'YYYY-MM-DD'.
/// * `end_date` - End date in the format 'YYYY-MM-DD'.
/// * `limit` - The maximum number of log messages to retrieve.
/// * `log_types` - A vector of log types to filter by.
/// * `search` - An optional string to search for in log messages and arguments.
///
/// # Returns
///
/// * `Ok(Vec<LogMessage>)` - A vector containing the retrieved log messages.
/// * `Err(String)` - An error message if there was a problem executing the query.
///
/// # Examples
///
/// ```
/// use crate::LogMessage;
/// let start_date = "2021-01-01";
/// let end_date = "2021-12-31";
/// let limit = 100;
/// let log_types = vec![1, 2, 3];
/// let search = Some("error");
/// let result = get_log_history(start_date, end_date, limit, log_types, search);
/// assert!(result.is_ok());
/// ```
#[tauri::command]
pub async fn get_log_history(start_date: &str, end_date: &str, limit: i32, log_types: Vec<i8>, search: Option<&str>) -> Result<Vec<LogMessage>, String> {

	// Build SQL query string based on provided start_date, end_date, limit, log_types and search parameters
	let mut query: String = format!("SELECT * FROM `logs` WHERE `created` BETWEEN '{}' AND '{}'", start_date, end_date);
	if log_types.len() > 0 {
		query.push_str(" AND `type` IN (");
		// add types to the SQL query string
		for (i, log_type) in log_types.iter().enumerate() {
			query.push_str(&log_type.to_string());
			if i < log_types.len() - 1 {
				query.push_str(", ");
			}
		}
		query.push_str(")");
	}
	// if search query is provided, add it to the SQL query string
	if let Some(q) = search {
		query.push_str(format!(" AND `message` LIKE '%{search}%' OR `arguments` LIKE '%{search}%'", search = q).as_str());
	}
	// add order by and limit clause to the SQL query string
	query.push_str(format!(" ORDER BY `created` DESC LIMIT {}", limit).as_str());

	println!("{}", query);

	// Open the log file
	match sqlite::open(std::env::var("LOG_FILE_PATH").unwrap_or_else(|_| return "Failed to get LOG_FILE_PATH environment variable.".to_string())) {
		Ok(conn) => {
			// Prepare the SQL statement
			match conn.prepare(&query) {
				Ok(mut statement) => {
					// Create an empty vector of LogMessages
					let mut logs: Vec<LogMessage> = Vec::new();
					// Iterate through each returned row
					while let Ok(state) = statement.next() {
						if state == State::Row {
							// For each row, read out each column
							let id = statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get column from database: {}", e.to_string()));
							let log_type = statement.read::<i64, usize>(1).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))? as i8;
							let message = statement.read::<String, usize>(2).map_err(|e| format!("Failed to get column from database: {}", e.to_string()));
							let args = statement.read::<String, usize>(3).map_err(|e| format!("Failed to get column from database: {}", e.to_string()));
							let created = statement.read::<String, usize>(4).map_err(|e| format!("Failed to get column from database: {}", e.to_string()));

							// Create the LogMessage from the read values and add it to the vector
							match (id, log_type, message, args, created) {
								(Ok(id), log_type, Ok(message), Ok(args), Ok(created)) => {
									logs.push(LogMessage { id, log_type, message, args, created });
								},
								_ => {}
							}
						}
					}
					// Return the vector of LogMessages
					return Ok(logs);
				},
				Err(e) => Err(format!("Error executing log query: {}", e))    // If there is a problem with the SQL execution, return an error
			}
		}
		// If there is a problem opening the file, return an error
		Err(e) => Err(format!("Error opening the Log file: {}", e))
	}
}


/// Retrieves the oldest log message date from the log file.
///
/// # Arguments
///
/// None
///
/// # Returns
///
/// - `Ok(String)`: The oldest log message date.
/// - `Err(String)`: An error message if an error occurs during the retrieval process.
///
/// # Errors
///
/// - If the log file fails to open, an error message is returned.
/// - If the SQL statement fails to execute, an error message is returned.
/// - If no logs are found, an error message is returned.
///
/// # Example
///
/// ```
/// use sqlite;
///
/// let oldest_date = get_oldest_log_date().unwrap();
/// println!("Oldest log date: {}", oldest_date);
/// ```
#[tauri::command]
pub fn get_oldest_log_date() -> Result<String, String>
{
	// Try to open the log file
	match sqlite::open(std::env::var("LOG_FILE_PATH").unwrap()) {
		Ok(conn) => {
			// Prepare the SQL statement to select the oldest log message
			match conn.prepare("SELECT `created` FROM `logs` ORDER BY `created` ASC LIMIT 1") {
				Ok(mut statement) => {
					// Executing the statement
					if let State::Row = statement.next().unwrap() {
						// Read the date from the returned row
						let date = statement.read::<String, usize>(0).unwrap();
						// Return the date
						Ok(date)
					} else {
						Err("No logs found".to_string())
					}
				}
				Err(e) => Err(format!("Error executing log query: {}", e))
			}
		}
		Err(e) => Err(format!("Error creating log file: {}", e))
	}
}

/// Opens a log window.
///
/// # Arguments
///
/// * `handle` - A handle to the Tauri application.
/// * `always_on_top` - A boolean indicating whether the log window should stay on top of other windows.
///
/// # Returns
///
/// Returns `Ok(())` if the operation is successful, or an error message as a `String` if an error occurs.
///
/// # Example
///
/// ```
/// use tauri::AppHandle;
///
/// # #[tauri::command]
/// # async fn open_log_window(handle: AppHandle, always_on_top: bool) -> Result<(), String> {
/// #     // implementation details...
/// #     # Ok(())
/// # }
/// ```
#[tauri::command]
pub async fn open_log_window(handle: tauri::AppHandle, always_on_top: bool) -> Result<(), String> {
	// Check if the window is already open
	let window = handle.get_window("logger");

	// If it is, focus the window
	if window.is_some() {
		window.unwrap().set_focus().unwrap();
		return Ok(());
	}

	// If not, create a new window
	let window = tauri::WindowBuilder::new(
		&handle,
		"logger",
		tauri::WindowUrl::App("log-window.html".into())
	)
		// Configure the window settings
		.transparent(true)
		.resizable(true)
		.title("Log Viewer")
		.minimizable(false)
		.decorations(false)
		.always_on_top(always_on_top)
		.focused(true)
		.build().unwrap();

	// Set a shadow for the window
	set_shadow(&window, true).unwrap();

	// Set minimum and initial size for the window
	window.set_min_size(Some(Size::from(LogicalSize::new(530, 370)))).unwrap();
	window.set_size(LogicalSize::new(600, 600)).unwrap();

	// Show the window
	window.show().unwrap();

	Ok(())
}

/// Sets the "always on top" property of the log window.
///
/// # Arguments
///
/// * `handle` - The Tauri application handle.
/// * `always_on_top` - A boolean indicating whether the log window should always be on top.
///
/// # Errors
///
/// Returns `Err("Log window is not open".to_string())` if the log window does not exist.
///
/// # Example
///
/// ```
/// use tauri::AppHandle;
///
/// let handle: AppHandle = get_app_handle();
///
/// // Set the log window to always be on top
/// set_log_window_always_on_top(handle, true)?;
/// ```
#[tauri::command]
pub fn set_log_window_always_on_top(handle: tauri::AppHandle, always_on_top: bool) -> Result<(), String> {
	// Check if the window exists
	match handle.get_window("logger") {
		Some(window) => {
			// If it does, set its 'always on top' property
			window.set_always_on_top(always_on_top).unwrap();
			Ok(())
		},
		// If it doesn't, return an error message
		None => Err("Log window is not open".to_string())
	}
}

/// Closes the log window.
///
/// # Arguments
///
/// * `handle` - The `AppHandle` to access application resources.
///
/// # Returns
///
/// Returns `Ok(())` if the log window is successfully closed. Otherwise, returns `Err(String)`
/// with an error message indicating that the log window is not open.
///
/// # Example
///
/// ```
/// use tauri::AppHandle;
///
/// let handle: AppHandle = ...;
/// let result = close_log_window(handle);
/// assert_eq!(result, Ok(()));
/// ```
#[tauri::command]
pub fn close_log_window(handle: tauri::AppHandle) -> Result<(), String> {
	// Check if the window exists
	match handle.get_window("logger") {
		Some(window) => {
			// If it does, close the window
			window.close().unwrap();
			Ok(())
		},
		// If it doesn't, return an error message
		None => Err("Log window is not open".to_string())
	}
}
