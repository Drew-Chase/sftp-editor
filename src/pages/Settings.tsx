import {Divider, Listbox, ListboxItem} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import {ReactNode} from "react";
import General from "../components/GeneralSettings.tsx";
import Connections from "../components/ConnectionSettings.tsx";
import About from "../components/AboutSettings.tsx";

export default function Settings()
{
    const tab = useParams().tab ?? "general";
    return (
        <div className={"flex flex-row gap-3 mt-5 mx-4 h-[100vh_!important] max-h-[calc(100vh_-_3.875rem)]"}>
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
        <div className={"w-full overflow-y-auto pr-4"}>
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


