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
    width: i16,
    height: i16,
    visible: bool,
}

const DEFAULT_SETTINGS: AppSettings = AppSettings {
    general_settings: GeneralSettings {
        dark_mode: true,
        start_with_windows: false,
        panel_settings: PanelSettings {
            left: Panel {
                content: 0,
                width: 0,
                height: 0,
                visible: false,
            },
            top: Panel {
                content: 0,
                width: 0,
                height: 0,
                visible: false,
            },
            right: Panel {
                content: 0,
                width: 0,
                height: 0,
                visible: false,
            },
            bottom: Panel {
                content: 0,
                width: 0,
                height: 0,
                visible: false,
            },
        },
    },
};
const FILE_PATH: &str = "settings.json";

#[tauri::command()]
pub fn get_settings() -> AppSettings {
    use std::io::Read;

    let mut file = File::open(FILE_PATH).unwrap_or_else(|_| {
        save_settings(DEFAULT_SETTINGS);
        File::open(FILE_PATH).expect("Failed to open file")
    });

    let mut serialized = String::new();
    file.read_to_string(&mut serialized).expect("Failed to read file");
    return serde_json::from_str(&serialized).expect("Failed to deserialize");
}

#[tauri::command()]
pub fn save_settings(settings: AppSettings) {
    use std::io::Write;

    let serialized = serde_json::to_string_pretty(&settings).expect("Failed to serialize");
    let mut file = File::create(FILE_PATH).expect("Failed to create file");
    file.write_all(serialized.as_bytes()).expect("Failed to write to file");
}