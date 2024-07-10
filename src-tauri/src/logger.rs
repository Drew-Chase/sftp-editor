use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

use tauri::regex;

// #[tauri::command]
// pub fn log_debug(message: &str) {
//     log(&format!("[DEBUG] {}", message));
// }
//
// #[tauri::command]
// pub fn log_info(message: &str) {
//     log(&format!("[INFO] {}", message));
// }
//
// #[tauri::command]
// pub fn log_error(message: &str) {
//     log(&format!("[ERROR] {}", message));
// }
//
// #[tauri::command]
// pub fn log_warn(message: &str) {
//     log(&format!("[WARN] {}", message));
// }
//
// #[tauri::command]
// pub fn log_fatal(message: &str) {
//     log(&format!("[FATAL] {}", message));
// }


#[tauri::command]
pub fn log(message: &str) {
    let time = chrono::Local::now().format("%m-%d-%Y %H:%M:%S").to_string();
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(std::env::var("LOG_FILE_PATH").unwrap())
        .unwrap();

    let message = format!("[{}] {}", time, strip_ansi_codes(message));
    println!("{}", message);

    if let Err(e) = writeln!(file, "{}", message) {
        eprintln!("Couldn't write to file: {}", e);
    }
}

pub fn initialize_log_file() {
    let time = chrono::Local::now().timestamp();
    let file_name = format!("sftp-client-{}.log", time);
    let temp_dir = std::env::temp_dir();
    let temp_dir = Path::new(&temp_dir);
    let file_path = temp_dir.join(file_name);
    std::env::set_var("LOG_FILE_PATH", file_path);
}

fn strip_ansi_codes(input: &str) -> String {
    let re = regex::Regex::new(r"\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]").unwrap();
    re.replace_all(input, "").to_string()
}