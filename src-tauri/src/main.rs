// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::Manager;

use app_settings::{get_settings, save_settings};
use connection_manager::{add_connection, delete_connection, get_connections, initialize, update_connection, update_join};

use crate::connection_manager::Connection;

mod app_settings;
mod connection_manager;

fn main() {
    initialize();
    add_connection(Connection {
        id: 0,
        name: "test".to_string(),
        host: "localhost".to_string(),
        port: 22,
        username: "test".to_string(),
        password: "test".to_string(),
        private_key: "".to_string(),
        remote_path: "/".to_string(),
        local_path: "C:/".to_string(),
        default: true,
        protocol: "sftp".to_string(),
        created_at: "".to_string(),
        updated_at: "".to_string(),
        last_connected_at: "".to_string(),
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            get_connections,
            add_connection,
            delete_connection,
            update_connection,
            update_join
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