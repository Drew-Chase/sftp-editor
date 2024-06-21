import {Autocomplete, AutocompleteItem, Button, Divider, Input, Listbox, ListboxItem, Select, SelectItem} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import ConnectionManager, {Connection, EmptyConnection, Protocol} from "../assets/ts/ConnectionManager.ts";
import {useState} from "react";
import SwitchOption from "../components/SwitchSetting.tsx";

const manager = new ConnectionManager();
await manager.getConnections();

export default function SiteBrowser()
{
    const [tab, setTab] = useState(useParams().id ?? "new");
    const connection = manager.connections.find(c => c.id.toString() === tab) ?? EmptyConnection;
    console.log("Tab", tab);
    return (
        <div className={"flex flex-row gap-3 mt-5 mx-4 h-[100vh] max-h-[calc(100vh_-_3.875rem)]"}>
            <Sidebar tab={tab} onSetTab={t => setTab(t)}/>
            <Divider orientation={"vertical"}/>
            <SiteDetails connection={connection}/>
        </div>
    );
}

function Sidebar(props: { tab?: string, onSetTab: (tab: string) => void })
{
    return (
        <div className={"flex flex-col min-w-[200px] w-[25%] max-w-[400px] relative overflow-y-auto"}>
            <h1 className={"text-2xl font-bold mb-4"}>Site Browser</h1>
            <Listbox>
                {manager.connections.map(connection =>
                    (
                        <ListboxItem key={connection.id} href={`/site-browser/${connection.id}`} description={`${connection.username}@${connection.host}:${connection.port}`} onClick={() => props.onSetTab(connection.id.toString())} className={`${props.tab === connection.id.toString() ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}>{connection.name}{connection.default ? (<span className={"text-danger ml-2"}>*</span>) : (<></>)}</ListboxItem>
                    )
                ) as any}
            </Listbox>

            <Button color={"primary"} className={"absolute bottom-[10px] right-3"} href={"/site-browser/new"} onClick={() => props.onSetTab("new")}>+</Button>
        </div>
    );
}

function SiteDetails(props: { connection: Connection })
{
    let [connection, setConnection] = useState<Connection>(props.connection);
    if (connection.id !== props.connection.id) setConnection(props.connection);
    console.log("Connection", props.connection);
    const uniqueHosts = manager.connections.reduce((acc, val) => acc.includes(val.host) ? acc : [...acc, val.host], [] as string[]);
    const uniqueUsernames = manager.connections.reduce((acc, val) => acc.includes(val.username) ? acc : [...acc, val.username], [] as string[]);
    const uniquePorts = manager.connections.reduce((acc, val) => acc.includes(val.port.toString()) ? acc : [...acc, val.port.toString()], [] as string[]).map(i => Number.parseInt(i));
    return (
        <div className={"flex flex-col w-full gap-3 overflow-y-auto"}>
            <div className={"mb-5"}>
                <h1 className={"text-4xl font-bold mb-3"}>{connection.name}</h1>
                <div className={"flex flex-row"}>
                    <p className={""}><span className={"opacity-30"}>Created:</span><br/><span className={"font-bold opacity-30"}>{connection.created_at.toDateString()}</span></p>
                    <Divider orientation={"vertical"} className={"mx-5 my-auto h-6"}/>
                    <p className={""}><span className={"opacity-30"}>Updated:</span><br/><span className={"font-bold opacity-30"}>{connection.updated_at.toDateString()}</span></p>
                    <Divider orientation={"vertical"} className={"mx-5 my-auto h-6"}/>
                    <p className={""}><span className={"opacity-30"}>Last Joined:</span><br/><span className={"font-bold opacity-30"}>{connection.last_connected_at.toDateString()}</span></p>
                </div>
            </div>
            <SwitchOption label={"Default"} description={"This will automatically connect on startup."} selected={connection.default} onToggle={async value =>
            {
                const temp = {...connection, default: value};
                if (value)
                {
                    await manager.setDefault(connection);
                } else
                {
                    await manager.updateConnection(temp);
                }
                setConnection(temp);
            }}/>
            <h2 className={"text-lg font-bold"}>Connection Details</h2>
            <div className={"flex flex-row gap-2"}>
                <Autocomplete inputValue={connection.host} allowsCustomValue label={"Host"} description={"The hostname or ip address of the ftp/sftp server"} onSelectionChange={async key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    const temp = {...connection, host: key as string};
                    await manager.updateConnection(temp);
                    setConnection(temp);

                }} onValueChange={async value =>
                {
                    const temp = {...connection, host: value as string};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniqueHosts.map(host => <AutocompleteItem key={host} value={host}>{host}</AutocompleteItem>)}
                </Autocomplete>
                <Autocomplete inputValue={connection.port.toString()} allowsCustomValue label={"Port"} description={"The port of the ftp/sftp server"} onSelectionChange={async key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    const temp = {...connection, port: Number.parseInt(key as string)};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }} onValueChange={async value =>
                {
                    if (value === "" || value === null || value === undefined)
                        return;
                    value = value.replace(/[^0-9]/g, "");
                    const temp = {...connection, port: Number.parseInt(value)};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniquePorts.map(port => <AutocompleteItem key={port} value={port}>{port}</AutocompleteItem>)}
                </Autocomplete>
                <Select label={"Protocol"} description={"The connection protocol that will be used."} defaultSelectedKeys={[connection.protocol === Protocol.SFTP ? "0" : "1"]} className={"w-[30%] min-w-[100px]"} onSelectionChange={async keys =>
                {
                    const temp = {...connection, protocol: Number.parseInt([...keys][0] as string)};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    <SelectItem key={"0"}>SFTP</SelectItem>
                    <SelectItem key={"1"}>FTP</SelectItem>
                </Select>
            </div>
            <h2 className={"text-lg font-bold"}>Authentication</h2>
            <div className={"flex flex-row gap-2"}>
                <Autocomplete inputValue={connection.username} allowsCustomValue label={"Username"} description={"The username to use for authentication"} onSelectionChange={async key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    const temp = {...connection, username: key as string};
                    await manager.updateConnection(temp);
                    setConnection(temp);

                }} onValueChange={async value =>
                {
                    const temp = {...connection, username: value as string};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniqueUsernames.map(username => <AutocompleteItem key={username} value={username}>{username}</AutocompleteItem>)}
                </Autocomplete>
                <Input label={"Password"} type={"password"} description={"The password to use for authentication"} value={connection.password} onChange={async e =>
                {
                    const temp = {...connection, password: e.target.value};
                    await manager.updateConnection(temp);
                    setConnection(temp);
                }}/>
            </div>
        </div>
    );
}