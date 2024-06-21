import {useState} from "react";
import {AppSettings, currentSettings, GetSettings, SaveSettings} from "../assets/ts/Settings.ts";
import SwitchOption from "./SwitchSetting.tsx";
import {applyTheme, Themes} from "../assets/ts/Theme.ts";
import {Select, SelectItem} from "@nextui-org/react";

export default function General()
{
    const [settings, setSettings] = useState<AppSettings>(currentSettings);
    return (
        <div className={"flex flex-col"}>
            <h1 className={"text-4xl mb-4"}>General</h1>
            <div className={"flex gap-3 sm:flex-col lg:flex-row mb-10"}>
                <SwitchOption label={"Start with Windows"} description={"Should SFTP Editor start with Windows"} onToggle={async value =>
                {
                    await SaveSettings({...settings, general_settings: {...settings?.general_settings, start_with_windows: value}});
                    setSettings({...settings, general_settings: {...settings?.general_settings, start_with_windows: value}});
                }} selected={settings?.general_settings.start_with_windows ?? false}/>
                <SwitchOption label={"Dark Mode"} description={"Enable or disable dark-mode"} onToggle={async value =>
                {
                    applyTheme(value ? Themes.dark : Themes.light);
                    await GetSettings();
                    setSettings({...settings, general_settings: {...settings?.general_settings, dark_mode: value}});
                }} selected={settings?.general_settings?.dark_mode}/>
            </div>
            <h1 className={"text-2xl mb-4"}>Panels</h1>
            <div className={"flex gap-3 sm:flex-col lg:flex-row mb-3"}>
                <Select defaultSelectedKeys={settings.general_settings.panel_settings.left.content.toString()} label={"Left Panel"} onSelectionChange={async keys =>
                {
                    settings.general_settings.panel_settings.left.content = Number.parseInt([...keys][0] as string);
                    await SaveSettings(settings);
                    setSettings(settings);
                }
                }>
                    <SelectItem key={"0"}>None</SelectItem>
                    <SelectItem key={"1"}>Remote Filesystem</SelectItem>
                    <SelectItem key={"2"}>Local Filesystem</SelectItem>
                    <SelectItem key={"3"}>Local Terminal</SelectItem>
                    <SelectItem key={"4"}>Remote Terminal</SelectItem>
                </Select>
                <Select defaultSelectedKeys={settings.general_settings.panel_settings.right.content.toString()} label={"Right Panel"} onSelectionChange={async keys =>
                {
                    settings.general_settings.panel_settings.right.content = Number.parseInt([...keys][0] as string);
                    await SaveSettings(settings);
                    setSettings(settings);
                }
                }>
                    <SelectItem key={"0"}>None</SelectItem>
                    <SelectItem key={"1"}>Remote Filesystem</SelectItem>
                    <SelectItem key={"2"}>Local Filesystem</SelectItem>
                    <SelectItem key={"3"}>Local Terminal</SelectItem>
                    <SelectItem key={"4"}>Remote Terminal</SelectItem>
                </Select>
            </div>
            <div className={"flex gap-3 sm:flex-col lg:flex-row mb-3"}>
                <Select defaultSelectedKeys={settings.general_settings.panel_settings.top.content.toString()} label={"Top Panel"} onSelectionChange={async keys =>
                {
                    settings.general_settings.panel_settings.top.content = Number.parseInt([...keys][0] as string);
                    await SaveSettings(settings);
                    setSettings(settings);
                }
                }>
                    <SelectItem key={"0"}>None</SelectItem>
                    <SelectItem key={"1"}>Remote Filesystem</SelectItem>
                    <SelectItem key={"2"}>Local Filesystem</SelectItem>
                    <SelectItem key={"3"}>Local Terminal</SelectItem>
                    <SelectItem key={"4"}>Remote Terminal</SelectItem>
                </Select>
                <Select defaultSelectedKeys={settings.general_settings.panel_settings.bottom.content.toString()} label={"Bottom Panel"} onSelectionChange={async keys =>
                {
                    settings.general_settings.panel_settings.bottom.content = Number.parseInt([...keys][0] as string);
                    await SaveSettings(settings);
                    setSettings(settings);
                }
                }>
                    <SelectItem key={"0"}>None</SelectItem>
                    <SelectItem key={"1"}>Remote Filesystem</SelectItem>
                    <SelectItem key={"2"}>Local Filesystem</SelectItem>
                    <SelectItem key={"3"}>Local Terminal</SelectItem>
                    <SelectItem key={"4"}>Remote Terminal</SelectItem>
                </Select>
            </div>
        </div>
    )
        ;
}