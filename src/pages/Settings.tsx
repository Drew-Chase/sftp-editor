import {Divider, Listbox, ListboxItem} from "@nextui-org/react";
import {useParams} from "react-router-dom";

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
            <h1 className={"text-2xl font-bold"}>Settings</h1>
            <Listbox>
                <ListboxItem key={"general"} href={"/settings"} className={`${props.tab === "general" ? "bg-primary/50 hover:!bg-primary transition-all" : ""} py-3 my-1`}>General</ListboxItem>
                <ListboxItem key={"connections"} href={"/settings/connections"} className={`${props.tab === "connections" ? "bg-primary/50 hover:!bg-primary transition-all" : ""} py-3 my-1`}>Connections</ListboxItem>
                <ListboxItem key={"about"} href={"/settings/about"} className={`${props.tab === "about" ? "bg-primary/50 hover:!bg-primary transition-all" : ""} py-3 my-1`}>About</ListboxItem>
            </Listbox>
        </div>
    );
}

function SettingsContent(props: { tab?: string })
{
    return (
        <div className={"w-full"}>
            <h1>{props.tab}</h1>
        </div>
    );
}