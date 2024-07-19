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

/// Logs a message with the given log type and saves it to a SQLite database.
///
/// # Arguments
///
/// * `message` - The message to be logged.
/// * `arguments` - Additional arguments for the log message.
/// * `log_type` - The type of the log.
///
/// # Examples
///
/// ```
/// log("Error occurred", "Argument: 123", 1);
/// ```
#[tauri::command]
pub fn log(message: &str, arguments: &str, log_type: i64) {
	match sqlite::open(std::env::var("LOG_FILE_PATH").unwrap()) {
		Ok(connection) => {
			match connection.prepare("INSERT INTO `logs` (`type`, `message`, `arguments`) VALUES (?, ?, ?);") {
				Ok(mut statement) => {
					loop {
						statement.bind((1, log_type)).unwrap();
						statement.bind((2, message)).unwrap();
						statement.bind((3, arguments)).unwrap();
						if statement.next().unwrap() == State::Done
						{
							break;
						}
					}
				}
				Err(e) => eprintln!("Error preparing log statement: {}", e)
			}
		}
		Err(e) => eprintln!("Error creating log file: {}", e)
	}


	println!("{}", message);
}

/// Initializes the log file by creating a SQLite database and a log table
///
/// # Examples
///
/// ```
/// initialize_log_file();
/// ```
pub fn initialize_log_file() {
	let file_name = "sftp-editor-client-log.db";
	let temp_dir = std::env::temp_dir();
	let temp_dir = Path::new(&temp_dir);
	let file_path = temp_dir.join(file_name);
	std::env::set_var("LOG_FILE_PATH", &file_path);
	match sqlite::open(file_path) {
		Ok(connection) => {
			if let Err(e) = connection.execute("CREATE TABLE IF NOT EXISTS `logs` ('id' INTEGER PRIMARY KEY, 'type' TINYINT, 'message' TEXT, 'arguments' TEXT DEFAULT NULL, 'created' TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
			{
				eprintln!("Error creating log table: {}", e);
			}
		}
		Err(e) => eprintln!("Error creating log file: {}", e)
	}
}

#[tauri::command]
pub fn get_log_history(start_date: &str, end_date: &str, limit: i32, log_types: Vec<i8>, search: Option<&str>) -> Result<Vec<LogMessage>, String> {
	let mut query: String = format!("SELECT * FROM `logs` WHERE `created` BETWEEN '{}' AND '{}'", start_date, end_date);
	if log_types.len() > 0 {
		query.push_str(" AND `type` IN (");
		for (i, log_type) in log_types.iter().enumerate() {
			query.push_str(&log_type.to_string());
			if i < log_types.len() - 1 {
				query.push_str(", ");
			}
		}
		query.push_str(")");
	}
	if let Some(q) = search {
		query.push_str(format!(" AND `message` LIKE %{search}% OR `arguments` LIKE %{search}%", search = q).as_str());
	}
	query.push_str(format!(" ORDER BY `created` DESC LIMIT {}", limit).as_str());
	match sqlite::open(std::env::var("LOG_FILE_PATH").unwrap()) {
		Ok(conn) => {
			match conn.prepare(query) {
				Ok(mut statement) => {
					let mut logs: Vec<LogMessage> = Vec::new();
					while let State::Row = statement.next().unwrap() {
						logs.push(LogMessage {
							id: statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))?,
							log_type: statement.read::<i64, usize>(1).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))? as i8,
							message: statement.read::<String, usize>(2).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))?,
							args: statement.read::<String, usize>(3).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))?,
							created: statement.read::<String, usize>(4).map_err(|e| format!("Failed to get column from database: {}", e.to_string()))?,
						});
					}
					return Ok(logs);
				}
				Err(e) => Err(format!("Error executing log query: {}", e))
			}
		}
		Err(e) => Err(format!("Error creating log file: {}", e))
	}
}
#[tauri::command]
pub async fn open_log_window(handle: tauri::AppHandle) -> Result<(), String> {
	if handle.get_window("logger").is_some() {
		return Err("Log window is already open".to_string());
	}
	let window = tauri::WindowBuilder::new(
		&handle,
		"logger",
		tauri::WindowUrl::App("log-window.html".into())
	).build().unwrap();
	set_shadow(&window, true).unwrap();
	window.set_decorations(false).unwrap();
	window.set_minimizable(false).unwrap();
	window.set_min_size(Some(Size::from(LogicalSize::new(530, 370)))).unwrap();
	window.set_size(LogicalSize::new(600, 600)).unwrap();
	window.show().unwrap();

	Ok(())
}

#[tauri::command]
pub fn close_log_window(handle: tauri::AppHandle) -> Result<(), String> {
	match handle.get_window("logger") {
		Some(window) => {
			window.close().unwrap();
			Ok(())
		},
		None => Err("Log window is not open".to_string())
	}
}

