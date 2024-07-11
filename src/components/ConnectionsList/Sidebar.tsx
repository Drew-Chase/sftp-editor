import {Button, Listbox, ListboxItem, Tooltip} from "@nextui-org/react";
import {ConnectIcon, TrashIcon} from "../Icons.tsx";
import ConnectionManager from "../../assets/ts/ConnectionManager.ts";
import {useNavigate} from "react-router-dom";

export default function Sidebar(props: { tab?: string, onSetTab: (tab: string) => void })
{
    const navigate = useNavigate();
    return (
        <div className={"flex flex-col min-w-[200px] w-[25%] max-w-[400px] relative overflow-y-auto"}>
            <h1 className={"text-2xl font-bold mb-4"}>Site Browser</h1>
            <Listbox aria-label={"List of connections."}>
                {ConnectionManager.instance.getConnections().map(connection =>
                    (
                        <ListboxItem
                            key={connection.id}
                            description={`${connection.username}@${connection.host}:${connection.port}`}
                            className={`${props.tab === connection.id.toString() ? "bg-primary/75 hover:!bg-primary transition-all" : ""} py-3 my-1`}
                            textValue={connection.name}
                            aria-label={connection.name}
                            onClick={
                                () => props.onSetTab(connection.id.toString())
                            }
                            onContextMenu={e =>
                            {
                                e.preventDefault();
                            }}
                            classNames={{
                                title: "w-full",
                                description: "truncate"
                            }}
                        >
                            <div className={"flex flex-row w-full flex-nowrap"}>
                                <div className={"w-full flex flex-grow truncate max-w-[calc(100%-48px)]"}>
                                    {connection.name}
                                    {connection.default ? (<span className={"ml-2"}>*</span>) : (<></>)}
                                </div>
                                <div className={"flex flex-row"}>
                                    <Tooltip content={"Delete"} color={"danger"}>
                                        <Button variant={"light"} color={"danger"} className={"max-w-[24px] min-w-[24px] min-h-[24px] max-h-[24px] p-0"} onClick={async e =>
                                        {
                                            e.stopPropagation();
                                            await ConnectionManager.removeConnection(connection);
                                            window.location.reload();
                                        }}><TrashIcon opacity={.5} size={12}/></Button>
                                    </Tooltip>
                                    <Tooltip content={"Connect"}>
                                        <Button variant={"light"} className={"max-w-[24px] min-w-[24px] min-h-[24px] max-h-[24px] p-0"} onClick={() => navigate(`/connection/${connection.id}`)}>
                                            <ConnectIcon size={12} opacity={.5}/>
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </ListboxItem>
                    )
                ) as any}
            </Listbox>

            <Button color={"primary"} variant={"ghost"} className={"absolute bottom-[10px] right-3"} href={"/site-browser/new"} onClick={() => props.onSetTab("new")}>+</Button>
        </div>
    );
}
