// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::Manager;

use app_settings::{get_settings, save_settings};
use connection_manager::{add_connection, delete_connection, get_connection_by_id, get_connections, initialize, set_default, update_connection, update_join};
use sftp_manager::{list, send_ssh_command, test_connection};

use crate::logger::{clear_log, close_log_window, get_log_history, get_oldest_log_date, initialize_log_file, log, open_log_window, set_log_window_always_on_top};
use crate::sftp_manager::download_file;

mod app_settings;
mod connection_manager;
mod sftp_manager;
mod ssh_instance;
mod logger;

fn main() {
	// Set an environmental variable for webkit
	std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");

	// Initialize the application, handle any occurring error and exit the process is initialization fails
	match initialize() {
		Ok(_) => (),
		Err(e) => {
			println!("{}", e); // Log out the error
			std::process::exit(1); // Exit process with an error code
		}
	}

	// Initialize the log file
	if initialize_log_file().is_err() {
		println!("Failed to initialize log file");
		std::process::exit(1);
	}

	tauri::Builder::default()
		// Set various invoke handlers that control the core functionality of the app 
		.invoke_handler(tauri::generate_handler![
            get_settings,                                  // retrieves the applications settings
			save_settings,                                 // persist the set application settings
			get_connections,                               // get all connections in the application
			add_connection,                                // add a new connection to the application
			delete_connection,                             // remove a specific connection from the application using its ID
			update_connection,                             // update a specific connection in the application using its ID
			update_join,                                   // invoke an update join operation 
			set_default,                                   // set a particular connection as the default
			test_connection,                               // test a particular connection for validity
			list,                                          // list the file/directory structure via SFTP on the connected server
			get_connection_by_id,                          // retrieves a specific connection from the app using its ID
			send_ssh_command,                              // send an SSH command to the connected server
			download_file,                                 // triggers a download file operation from the connected server
			log,                                           // log a new message in the application
			get_log_history,                               // retrieves the history of logs in the application
			open_log_window,                               // opens the window displaying the logs
			close_log_window,                              // closes the window displaying the logs
			set_log_window_always_on_top,                  // sets the log window to always appear on top of other windows
			get_oldest_log_date,                           // gets the date of the oldest log in the application
			clear_log,                                     // clears the log history
        ])
		// Initialize and add a plugin to add single instance functionality
		.plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
			app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap(); // Emit the current active instance
		}))
		// Add a plugin to manage the window state
		.plugin(tauri_plugin_window_state::Builder::default().build())
		// Set up the app window and window properties
		.setup(|app| {
			use window_shadows::set_shadow; // Import method to set window shadow
			let window = app.get_window("main").unwrap(); // Get the main app window
			set_shadow(&window, true).unwrap(); // Set shadow
			window.set_decorations(false).unwrap(); // Remove the window's default decoration
			window.show().unwrap(); // Show the window
			Ok(())
		})
		// Run the Tauri application with the generated context, and throw an error if it fails
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

#[derive(Clone, serde::Serialize)]
struct Payload {
	args: Vec<String>,
	cwd: String,
}