// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::Manager;

use app_settings::{get_settings, save_settings};
use connection_manager::{add_connection, delete_connection, get_connection_by_id, get_connections, initialize, set_default, update_connection, update_join};
use sftp_manager::{list, send_ssh_command, test_connection};

use crate::logger::{initialize_log_file, log, get_log_history};
use crate::sftp_manager::download_file;

// use crate::connection_manager::create_tmp_connection;

mod app_settings;
mod connection_manager;
mod sftp_manager;
mod ssh_instance;
mod logger;

fn main() {
    match initialize() {
        Ok(_) => (),
        Err(e) => {
            println!("{}", e);

            // exit with error code
            std::process::exit(1);
        }
    }
    // create_tmp_connection();
    // return;

    initialize_log_file();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            get_connections,
            add_connection,
            delete_connection,
            update_connection,
            update_join,
            set_default,
            test_connection,
            list,
            get_connection_by_id,
            send_ssh_command,
            download_file,
            log,
            get_log_history
        ])
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            use window_shadows::set_shadow;
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).unwrap();
            window.set_decorations(false).unwrap();
            window.show().unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}