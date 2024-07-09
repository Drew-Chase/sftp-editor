import {Divider} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import ConnectionManager, {EmptyConnection} from "../assets/ts/ConnectionManager.ts";
import {useState} from "react";
import Sidebar from "../components/ConnectionsList/Sidebar.tsx";
import Details from "../components/ConnectionsList/Details.tsx";

const manager = new ConnectionManager();
await manager.getConnections();


export default function ConnectionsList()
{
    const [tab, setTab] = useState(useParams().id ?? "new");
    const connection = manager.connections.find(c => c.id.toString() === tab) ?? EmptyConnection;
    return (
        <div className={"flex flex-row gap-3 mt-5 mx-4 h-[100vh] max-h-[calc(100vh_-_3.875rem)]"}>
            <Sidebar tab={tab} onSetTab={t => setTab(t)} manager={manager}/>
            <Divider orientation={"vertical"}/>
            <Details manager={manager} connection={connection}/>
        </div>
    );
}
