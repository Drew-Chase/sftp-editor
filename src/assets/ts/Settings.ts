export interface SettingsProps
{
    general: GeneralProps;
    connections: ConnectionsProps;
}

export interface GeneralProps
{
    startWithWindows: boolean;
    darkMode: boolean;
}

export interface ConnectionsProps
{

}

export function GetSettings(): SettingsProps
{
    const settings: string | null = localStorage.getItem("settings");
    console.log(settings)
    return settings ? JSON.parse(settings) :
        {
            general: {
                startWithWindows: false,
                darkMode: true
            },
            connections: {}
        };
}

export function SaveSettings(settings: SettingsProps)
{
    localStorage.setItem("settings", JSON.stringify(settings));
}