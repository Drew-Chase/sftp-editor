import ConnectionManager, {Connection, EmptyConnection, Protocol} from "../../assets/ts/ConnectionManager.ts";
import {ReactNode, useState} from "react";
import {Autocomplete, AutocompleteItem, Button, Divider, Input, Select, SelectItem, Spinner} from "@nextui-org/react";
import SwitchOption from "../SwitchSetting.tsx";
import FileInput from "../FileInput.tsx";
import {CheckmarkIcon, XIcon} from "../Icons.tsx";

enum TestingState
{
    Idle,
    Testing,
    Success,
    Failure
}

export default function Details(props: { manager: ConnectionManager, connection: Connection })
{
    let [connection, setConnection] = useState<Connection>(props.connection);
    if (connection.id !== props.connection.id) setConnection(props.connection);
    const isNewConnection = connection.id === EmptyConnection.id;
    const uniqueHosts = props.manager.connections.reduce((acc, val) => acc.includes(val.host) ? acc : [...acc, val.host], [] as string[]);
    const uniqueUsernames = props.manager.connections.reduce((acc, val) => acc.includes(val.username) ? acc : [...acc, val.username], [] as string[]);
    const uniquePorts = props.manager.connections.reduce((acc, val) => acc.includes(val.port.toString()) ? acc : [...acc, val.port.toString()], [] as string[]).map(i => Number.parseInt(i));
    const [testingState, setTestingState] = useState(TestingState.Idle);
    const onSave = async () =>
    {
        console.log("Saving connection", connection);
        await props.manager.addConnection(connection);
        window.location.reload();

    };
    return (
        <div className={"flex flex-col w-full gap-3 overflow-y-auto relative pr-5 pb-10"}>
            <div className={"mb-5"}>
                <Input classNames={{
                    input: "text-4xl font-bold pb-5 pt-2",
                    label: "text-lg font-bold",
                    description: "text-sm",
                    base: "w-full pt-2"
                }} placeholder={isNewConnection ? "New Connection" : "Connection Name"} value={connection.name} variant={"underlined"} onValueChange={async value =>
                {
                    const temp: Connection = {...connection, name: value};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}/>
                {isNewConnection ? <></> :
                    <>
                        <div className={`flex flex-row`}>
                            <p className={""}><span className={"opacity-30"}>Created:</span><br/><span className={"font-bold opacity-30"}>{connection.created_at.toDateString()}</span></p>
                            <Divider orientation={"vertical"} className={"mx-5 my-auto h-6"}/>
                            <p className={""}><span className={"opacity-30"}>Updated:</span><br/><span className={"font-bold opacity-30"}>{connection.updated_at.toDateString()}</span></p>
                            <Divider orientation={"vertical"} className={"mx-5 my-auto h-6"}/>
                            <p className={""}><span className={"opacity-30"}>Last Joined:</span><br/><span className={"font-bold opacity-30"}>{connection.last_connected_at.toDateString()}</span></p>
                        </div>
                        <SwitchOption label={"Default"} description={"This will automatically connect on startup."} selected={connection.default} onToggle={async value =>
                        {
                            const temp: Connection = {...connection, default: value};
                            if (!isNewConnection)
                                if (value)
                                {
                                    await props.manager.setDefault(connection);
                                } else
                                {
                                    await props.manager.updateConnection(temp);
                                }
                            setConnection(temp);
                        }}/>
                    </>
                }
            </div>
            <h2 className={"text-lg font-bold"}>Connection Details</h2>
            <div className={"flex flex-row gap-2"}>
                <Autocomplete inputValue={connection.host} allowsCustomValue label={"Host"} description={"The hostname or ip address of the ftp/sftp server"} onSelectionChange={async key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    const temp: Connection = {...connection, host: key as string};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);

                }} onValueChange={async value =>
                {
                    const temp: Connection = {...connection, host: value as string};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniqueHosts.map(host => <AutocompleteItem key={host} value={host}>{host}</AutocompleteItem>)}
                </Autocomplete>
                <Autocomplete inputValue={connection.port.toString()} allowsCustomValue label={"Port"} description={"The port of the ftp/sftp server"} onSelectionChange={async key =>
                {
                    if (key === "" || key === null || key === undefined)
                        return;
                    const temp = {...connection, port: Number.parseInt(key as string)};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }} onValueChange={async value =>
                {
                    if (value === "" || value === null || value === undefined)
                        return;
                    value = value.replace(/[^0-9]/g, "");
                    const temp: Connection = {...connection, port: Number.parseInt(value)};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniquePorts.map(port => <AutocompleteItem key={port} value={port}>{port}</AutocompleteItem>)}
                </Autocomplete>
                <Select label={"Protocol"} description={"The connection protocol that will be used."} defaultSelectedKeys={[connection.protocol === Protocol.SFTP ? "0" : "1"]} className={"w-[30%] min-w-[100px]"} onSelectionChange={async keys =>
                {
                    const temp: Connection = {...connection, protocol: Number.parseInt([...keys][0] as string)};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
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
                    const temp: Connection = {...connection, username: key as string};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);

                }} onValueChange={async value =>
                {
                    const temp: Connection = {...connection, username: value as string};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}>
                    {uniqueUsernames.map(username => <AutocompleteItem key={username} value={username}>{username}</AutocompleteItem>)}
                </Autocomplete>
                <Input label={"Password"} type={"password"} description={"The password to use for authentication"} value={connection.password} onChange={async e =>
                {
                    const temp: Connection = {...connection, password: e.target.value};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}/>
            </div>

            <FileInput
                label={"Private Key"}
                description={"The private key to use for authentication"}
                variant={"multiline"}
                valueType={"contents"}
                value={connection.private_key}
                onChange={async content =>
                {
                    const temp: Connection = {...connection, private_key: content};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}/>

            <h2 className={"text-lg font-bold"}>Locations</h2>
            <div className={"flex flex-row gap-2"}>
                <Input
                    label={"Local Path"}
                    description={"The local path that will be navigated to when connected."}
                    value={connection.local_path}
                    onValueChange={async value =>
                    {
                        const temp: Connection = {...connection, local_path: value};
                        if (!isNewConnection)
                            await props.manager.updateConnection(temp);
                        setConnection(temp);
                    }}/>
                <Input label={"Remote Path"} description={"The remote path that will be navigated to when connected."} value={connection.remote_path} onValueChange={async value =>
                {
                    const temp: Connection = {...connection, remote_path: value};
                    if (!isNewConnection)
                        await props.manager.updateConnection(temp);
                    setConnection(temp);
                }}/>
            </div>
            <div className={"flex flex-row gap-2 fixed bottom-4 right-7 z-10"}>
                <Button variant={"solid"} onClick={async () =>
                {
                    if (testingState !== TestingState.Idle) return;
                    setTestingState(TestingState.Testing);
                    const response = await props.manager.testConnection(connection);
                    setTestingState(response ? TestingState.Success : TestingState.Failure);
                    setTimeout(() => setTestingState(TestingState.Idle), 5000);

                }}>{((): ReactNode =>
                {
                    switch (testingState)
                    {
                        case TestingState.Testing:
                            return (<Spinner size={"sm"}></Spinner>);
                        case TestingState.Success:
                            return (<CheckmarkIcon size={16}></CheckmarkIcon>);
                        case TestingState.Failure:
                            return (<XIcon size={16}></XIcon>);
                        default:
                        case TestingState.Idle:
                            return (<span>Test Connection</span>);
                    }
                })()
                }</Button>
                {isNewConnection ? <Button color={"primary"} onClick={onSave}>Add</Button> : <></>}
            </div>
        </div>
    );
}