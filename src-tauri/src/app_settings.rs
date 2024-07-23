use std::env;
use std::fs::File;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AppSettings {
    general_settings: GeneralSettings,
}

#[derive(Serialize, Deserialize)]
pub struct GeneralSettings {
    dark_mode: bool,
    start_with_windows: bool,
    panel_settings: PanelSettings,
}

#[derive(Serialize, Deserialize)]
pub struct PanelSettings {
    left: Panel,
    top: Panel,
    right: Panel,
    bottom: Panel,
}

#[derive(Serialize, Deserialize)]
pub struct Panel {
    content: i16,
    width: f32,
    height: f32,
    visible: bool,
}

const DEFAULT_SETTINGS: AppSettings = AppSettings {
    general_settings: GeneralSettings {
        dark_mode: true,
        start_with_windows: false,
        panel_settings: PanelSettings {
            left: Panel {
                content: 2,
                width: 50f32,
                height: 100f32,
                visible: false,
            },
            top: Panel {
                content: 0,
                width: 100f32,
                height: 15f32,
                visible: false,
            },
            right: Panel {
                content: 0,
                width: 50f32,
                height: 100f32,
                visible: false,
            },
            bottom: Panel {
                content: 0,
                width: 100f32,
                height: 15f32,
                visible: false,
            },
        },
    },
};

/// Get the application settings.
///
/// This function uses the Tauri command attribute (`#[tauri::command()]`) to expose the function
/// as a command that can be invoked by the Tauri framework.
///
/// # Example
/// ```ignore
/// let settings = get_settings();
/// ```
///
/// # Return
/// The application settings as an `AppSettings` struct.
#[tauri::command()]
pub fn get_settings() -> AppSettings {
	// Importing Read from std::io
    use std::io::Read;

	// Get the path to where the settings file is located
    let file = get_settings_path();

	// Try to open the file. If the file does not exist, create a default settings file 
	// and then open the file, if it fails for any reason, the program will panic and print the respective error message
    let mut file = File::open(&file).unwrap_or_else(|_| {
        save_settings(DEFAULT_SETTINGS);
        File::open(&file).expect("Failed to open file")
    });

	// String to store the contents of the file
    let mut serialized = String::new();

	// Read the contents of the file into the string variable 'serialized'
    file.read_to_string(&mut serialized).expect("Failed to read file");

	// Deserialize the contents of the file from json format into the corresponding rust data structures and return
    return serde_json::from_str(&serialized).expect("Failed to deserialize");
}


/// Saves the given application settings to a file.
///
/// # Arguments
///
/// * `settings` - The application settings to be saved.
///
/// # Panics
///
/// This function may panic in the following situations:
///
/// * Failed to serialize the settings into a JSON string.
/// * Failed to create the file.
/// * Failed to write the serialized string to the file.
///
/// # Example
///
/// ```rust
/// use crate::AppSettings;
///
/// let settings = AppSettings {
///     // initialize the settings
/// };
///
/// save_settings(settings);
/// ```
#[tauri::command()]
pub fn save_settings(settings: AppSettings) {
	// Importing Write from std::io
    use std::io::Write;

	// Get the path of where the settings file is located
    let file = get_settings_path();

	// Serialize application settings in a pretty way (with indentations and line breaks) to a JSON string
    let serialized = serde_json::to_string_pretty(&settings).expect("Failed to serialize");

	// Create a file (overwrite if it exists) at the given path and store the reference to the file in variable 'file'
    let mut file = File::create(file).expect("Failed to create file");

	// Write all bytes in serialized to the file in one go
    file.write_all(serialized.as_bytes()).expect("Failed to write to file");
}

/// Retrieves the path to the application settings file.
///
/// # Returns
///
/// The path to the application settings file as a `String`.
///
/// # Errors
///
/// This function may fail if it is unable to determine the current executable path or if it is
/// unable to retrieve the parent directory of the executable path.
///
/// # Examples
///
/// ```
/// use std::env;
///
/// fn get_settings_path() -> String {
///     // Try to get the current executable path
///     let exe_path = match env::current_exe() {
///         Ok(exe_path) => exe_path,
///         Err(e) => {
///             // Print the exception and return the default file path if it failed
///             eprintln!("Failed to get current exe path: {}", e);
///             return "app_settings.json".to_string();
///         }
///     };
///
///     // Try to get the parent directory of the current executable path
///     let exe_directory = match exe_path.parent() {
///         Some(dir) => dir,
///         None => {
///             // Print the exception and return the default file path if it failed
///             eprintln!("Failed to get directory of the exe");
///             return "app_settings.json".to_string();
///         }
///     };
///
///     // Create new path by joining the directory path with the settings file name,
///     // convert to string and return
///     return exe_directory.join("app_settings.json").to_str()
///         .expect("Failed to convert path to string").to_string();
/// }
/// ```
fn get_settings_path() -> String {
	// Try to get the current executable path
    let exe_path = match env::current_exe() {
        Ok(exe_path) => exe_path,
        Err(e) => {
			// Print the exception and return the default file path if it failed
            eprintln!("Failed to get current exe path: {}", e);
            return "app_settings.json".to_string();
        }
    };

	// Try to get the parent directory of the current executable path
    let exe_directory = match exe_path.parent() {
        Some(dir) => dir,
        None => {
			// Print the exception and return the default file path if it failed
            eprintln!("Failed to get directory of the exe");
            return "app_settings.json".to_string();
        }
    };

	// Create new path by joining the directory path with the settings file name, convert to string and return
    return exe_directory.join("app_settings.json").to_str().unwrap().to_string();
}