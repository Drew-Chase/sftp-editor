use std::path::Path;

use sqlite::State;

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