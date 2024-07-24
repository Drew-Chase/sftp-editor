export interface Panel
{
    content: ContentType;
    width: number;
    height: number;
    visible: boolean;
}

export enum ContentType
{
    None = 0,
    RemoteFilesystem = 1,
    LocalFilesystem = 2,
    LocalTerminal = 3,
    RemoteTerminal = 4,
    CodeEditor = 5,
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
    log_settings: LogSettings;
}

export interface LogSettings
{
    log_window_always_on_top: boolean;
    dont_keep_older_than?: Date;
    in_memory_logging: boolean;
    log_file_path?: string;

}

export interface AppSettings
{
    general_settings: GeneralSettings;
}

export let currentSettings: AppSettings = {
    "general_settings": {
        "dark_mode": true,
        "start_with_windows": false,
        "log_settings": {
            "log_window_always_on_top": true,
            "in_memory_logging": false
        },
        "panel_settings":
            {
                "left":
                    {
                        "content": ContentType.LocalFilesystem,
                        "width": 0,
                        "height": 0,
                        "visible": false
                    },
                "top":
                    {
                        "content": ContentType.CodeEditor,
                        "width": 0,
                        "height": 0,
                        "visible": false
                    },
                "right": {
                    "content": ContentType.RemoteFilesystem,
                    "width": 0,
                    "height": 0,
                    "visible": false
                },
                "bottom": {
                    "content": ContentType.RemoteTerminal,
                    "width": 0,
                    "height": 0,
                    "visible": false
                }
            }
    }
};

export function GetSettings(): AppSettings
{
    const settings: AppSettings = JSON.parse(localStorage.getItem("settings") ?? JSON.stringify(currentSettings));
    // const settings: AppSettings = await invoke("get_settings");
    currentSettings = settings;
    return settings;
}

export function SaveSettings(settings: AppSettings)
{
    localStorage.setItem("settings", JSON.stringify(settings));
    // await invoke("save_settings", {settings: settings}).then(() => Log.info("Settings saved"));
    GetSettings();
}