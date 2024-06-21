import {invoke} from "@tauri-apps/api/tauri";

export interface Panel
{
    content: number;
    width: number;
    height: number;
    visible: boolean;
}

export interface PanelSettings
{
    left: Panel;
    top: Panel;
    right: Panel;
    bottom: Panel;
}

export interface GeneralSettings
{
    dark_mode: boolean;
    start_with_windows: boolean;
    panel_settings: PanelSettings;
}

export interface AppSettings
{
    general_settings: GeneralSettings;
}

export let currentSettings: AppSettings = {"general_settings": {"dark_mode": true, "start_with_windows": false, "panel_settings": {"left": {"content": 0, "width": 0, "height": 0, "visible": false}, "top": {"content": 0, "width": 0, "height": 0, "visible": false}, "right": {"content": 0, "width": 0, "height": 0, "visible": false}, "bottom": {"content": 0, "width": 0, "height": 0, "visible": false}}}};

export async function GetSettings(): Promise<AppSettings>
{
    const settings: AppSettings = await invoke("get_settings");
    console.log("Settings Loaded", settings);
    currentSettings = settings;
    return settings;
}

export async function SaveSettings(settings: AppSettings)
{
    await invoke("save_settings", {settings: settings}).then(() => console.log("Settings saved"));
    await GetSettings();
}