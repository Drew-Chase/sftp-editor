import {cn, Divider, Listbox, ListboxItem, Switch} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import {ReactNode, useState} from "react";
import {applyTheme, Themes} from "../assets/ts/Theme.ts";
import {GetSettings, SaveSettings, SettingsProps} from "../assets/ts/Settings.ts";

export default function Settings()
{
    const tab = useParams().tab ?? "general";
    return (
        <div className={"flex flex-row gap-3 h-full my-16 mx-4"}>
            <Sidebar tab={tab}/>
            <Divider orientation={"vertical"}/>
            <SettingsContent tab={tab}/>
        </div>
    );
}

function Sidebar(props: { tab?: string })
{
    return (
        <div className={"flex flex-col w-[300px]"}>
            <h1 className={"text-2xl font-bold mb-4"}>SFTP Editor</h1>
            <Listbox>
                <ListboxItem key={"general"} href={"/settings"} className={`${props.tab === "general" ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}>General</ListboxItem>
                <ListboxItem key={"connections"} href={"/settings/connections"} className={`${props.tab === "connections" ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}>Connections</ListboxItem>
                <ListboxItem key={"about"} href={"/settings/about"} className={`${props.tab === "about" ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}>About</ListboxItem>
            </Listbox>
        </div>
    );
}

function SettingsContent(props: { tab?: string })
{
    return (
        <div className={"w-full"}>
            {((): ReactNode =>
            {
                switch (props.tab)
                {
                    case "general":
                        return (<General/>);
                    case "connections":
                        return (<Connections/>);
                    case "about":
                        return (<About/>);
                }
            })()}
        </div>
    );
}

function General()
{
    const [settings, setSettings] = useState<SettingsProps>(GetSettings());
    return (
        <div className={"flex flex-col"}>
            <h1 className={"text-4xl mb-12"}>General</h1>
            <div className={"grid gap-4 sm:grid-cols-1 lg:grid-cols-4"}>
                <SwitchOption label={"Start with Windows"} description={"Should SFTP Editor start with Windows"} onToggle={value =>
                {
                    setSettings({...settings, general: {...settings?.general, startWithWindows: value}});
                    SaveSettings({...settings, general: {...settings?.general, startWithWindows: value}});
                }} selected={settings?.general.startWithWindows ?? false}/>
                <SwitchOption label={"Dark Mode"} description={"Enable or disable dark-mode"} onToggle={value =>
                {
                    applyTheme(value ? Themes.dark : Themes.light);
                    setSettings({...settings, general: {...settings?.general, darkMode: value}});
                }} selected={settings?.general.darkMode ?? false}/>
            </div>
        </div>
    );
}

function SwitchOption(props: { label: string, description: string, selected?: boolean, onToggle?: (value: boolean) => void })
{
    return (
        <Switch
            isSelected={props.selected}
            onValueChange={props.onToggle}
            classNames={{
                base: cn(
                    "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent my-1 ",
                    "data-[selected=true]:border-primary"
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    //selected
                    "group-data-[selected=true]:ml-6",
                    // pressed
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4"
                )
            }}
        >
            <div className="flex flex-col gap-1">
                <p className="text-medium">{props.label}</p>
                <p className="text-tiny text-default-400">{props.description}</p>
            </div>
        </Switch>
    );
}

function Connections()
{
    return (
        <div>
            <h1>Connections</h1>
        </div>
    );
}

function About()
{
    return (
        <div>
            <h1>About</h1>
        </div>
    );
}