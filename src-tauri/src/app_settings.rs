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

#[tauri::command()]
pub fn get_settings() -> AppSettings {
    use std::io::Read;
    let file = get_settings_path();

    let mut file = File::open(&file).unwrap_or_else(|_| {
        save_settings(DEFAULT_SETTINGS);
        File::open(&file).expect("Failed to open file")
    });

    let mut serialized = String::new();
    file.read_to_string(&mut serialized).expect("Failed to read file");
    return serde_json::from_str(&serialized).expect("Failed to deserialize");
}

#[tauri::command()]
pub fn save_settings(settings: AppSettings) {
    use std::io::Write;
    let file = get_settings_path();

    let serialized = serde_json::to_string_pretty(&settings).expect("Failed to serialize");
    let mut file = File::create(file).expect("Failed to create file");
    file.write_all(serialized.as_bytes()).expect("Failed to write to file");
}

fn get_settings_path() -> String {
    let exe_path = match env::current_exe() {
        Ok(exe_path) => exe_path,
        Err(e) => {
            eprintln!("Failed to get current exe path: {}", e);
            return "app_settings.json".to_string();
        }
    };

    let exe_directory = match exe_path.parent() {
        Some(dir) => dir,
        None => {
            eprintln!("Failed to get directory of the exe");
            return "app_settings.json".to_string();
        }
    };

    return exe_directory.join("app_settings.json").to_str().unwrap().to_string();
}