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

#[tauri::command]
pub fn get_log_history(start_date: &str, end_date: &str, limit: i32, log_types: Vec<i8>, search: Option<&str>) {
    let mut query = "SELECT * FROM `logs` WHERE `created` BETWEEN ? AND ?".to_string();
    let mut params = vec![start_date, end_date];
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
        query.push_str(" AND `message` LIKE ? OR `arguments` LIKE ?");
        params.push(q);
        params.push(q);
    }
    query.push_str(" ORDER BY `created` DESC LIMIT ?");
    let limit = limit.to_string();
    let limit = limit.as_str();
    params.push(limit);
    match sqlite::open(std::env::var("LOG_FILE_PATH").unwrap()) {
        Ok(connection) => {
            match connection.prepare(query.as_str()) {
                Ok(mut statement) => {
                    loop {
                        for (i, param) in params.iter().enumerate() {
                            statement.bind((i + 1, param.to_owned())).unwrap();
                        }
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
}