import {Autocomplete, AutocompleteItem, Button, Divider, Input, Listbox, ListboxItem, Select, SelectItem} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import ConnectionManager, {Connection, EmptyConnection} from "../assets/ts/ConnectionManager.ts";
import {useState} from "react";

const manager = new ConnectionManager();
const connections = await manager.getConnections();

export default function SiteBrowser()
{
    const tab = useParams().id ?? "general";
    return (
        <div className={"flex flex-row gap-3 mt-5 mx-4 h-[100vh] max-h-[calc(100vh_-_3.875rem)]"}>
            <Sidebar tab={tab}/>
            <Divider orientation={"vertical"}/>
            <SiteDetails connection={connections.find(c => c.id.toString() === tab) ?? EmptyConnection}/>
        </div>
    );
}

function Sidebar(props: { tab?: string })
{
    return (
        <div className={"flex flex-col min-w-[200px] w-[25%] max-w-[400px] relative overflow-y-auto"}>
            <h1 className={"text-2xl font-bold mb-4"}>Site Browser</h1>
            <Listbox>
                {connections.map(connection =>
                    (
                        <ListboxItem key={connection.id} href={`/site-browser/${connection.id}`} className={`${props.tab === connection.id.toString() ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}>{connection.name}{connection.default ? (<span className={"text-danger ml-2"}>*</span>) : (<></>)}</ListboxItem>
                    )
                ) as any}
            </Listbox>

            <Button color={"primary"} className={"absolute bottom-[10px] right-3"} href={"/site-browser/new"}>+</Button>
        </div>
    );
}

function SiteDetails(props: { connection: Connection })
{
    const [connection, setConnection] = useState<Connection>(props.connection);
    const uniqueHosts = connections.reduce((acc, val) => acc.includes(val.host) ? acc : [...acc, val.host], [] as string[]);
    const uniquePorts = connections.reduce((acc, val) => acc.includes(val.port.toString()) ? acc : [...acc, val.port.toString()], [] as string[]).map(i => Number.parseInt(i));
    return (
        <div className={"flex flex-col w-full gap-3 overflow-y-auto"}>
            <h1 className={"text-4xl font-bold mb-5"}>{connection.name}</h1>
            <h2 className={"text-lg font-bold"}>Connection Details</h2>
            <div className={"flex flex-row gap-2"}>
                <Autocomplete inputValue={connection.host} allowsCustomValue label={"Host"} description={"The hostname or ip address of the ftp/sftp server"} onSelectionChange={key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    setConnection({...connection, host: key as string});

                }} onValueChange={value => setConnection({...connection, host: value})}>
                    {uniqueHosts.map(host => <AutocompleteItem key={host} value={host}>{host}</AutocompleteItem>)}
                </Autocomplete>
                <Autocomplete inputValue={connection.port.toString()} allowsCustomValue label={"Port"} description={"The port of the ftp/sftp server"} onSelectionChange={key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    setConnection({...connection, port: Number.parseInt(key as string)});
                }} onValueChange={value =>
                {
                    if (value === "" || value === null || value === undefined)
                        return;
                    value = value.replace(/[^0-9]/g, "");
                    setConnection({...connection, port: Number.parseInt(value)});
                }}>
                    {uniquePorts.map(port => <AutocompleteItem key={port} value={port}>{port}</AutocompleteItem>)}
                </Autocomplete>
                <Select label={"Protocol"} description={"The connection protocol that will be used."}>
                    <SelectItem key={"ftp"}>FTP</SelectItem>
                    <SelectItem key={"sftp"}>SFTP</SelectItem>
                </Select>
            </div>
            <h2 className={"text-lg font-bold"}>Authentication</h2>
            <div className={"flex flex-row gap-2"}>
                <Autocomplete inputValue={connection.host} allowsCustomValue label={"Username"} description={"The hostname or ip address of the ftp/sftp server"} onSelectionChange={key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    setConnection({...connection, host: key as string});

                }} onValueChange={value => setConnection({...connection, host: value})}>
                    {uniqueHosts.map(host => <AutocompleteItem key={host} value={host}>{host}</AutocompleteItem>)}
                </Autocomplete>
                <Input label={"Password"} type={"password"} description={"The password to use for authentication"} value={connection.password} onChange={e => setConnection({...connection, password: e.target.value})}/>
            </div>
        </div>
    );
}