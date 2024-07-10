import {Button, Listbox, ListboxItem, ListboxSection, Tooltip} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {ArchiveIcon, ClosePanelIcon, CopyIcon, DownloadIcon, EditIcon, MoveIcon, NewFileIcon, NewFolderIcon, RenameIcon, SaveIcon, TrashIcon, UploadIcon} from "../components/Icons.tsx";
import $ from "jquery";
import RemoteDirectoryTable from "../components/RemoteBrowser/RemoteDirectoryTable.tsx";
import PathBreadcrumb from "../components/RemoteBrowser/PathBreadcrumbs.tsx";
import Console from "../components/RemoteBrowser/Console.tsx";
import ConnectionManager, {EmptyConnection} from "../assets/ts/ConnectionManager.ts";
import {useParams} from "react-router-dom";
import Log from "../assets/ts/Logger.ts";

// let path = "";
let contextMenuPosition = {x: 0, y: 0};
let isContextMenuOpen = false;
export default function Browser()
{
    const [path, setPath] = useState("");
    const [connection, setConnection] = useState(EmptyConnection);
    const manager = new ConnectionManager();
    const id = useParams()["id"] ?? "";
    if (id === "") window.location.href = "/site-browser/new";

    useEffect(() =>
    {
        manager.getConnectionById(Number.parseInt(id)).then(res =>
        {
            setConnection(res);
        });
    }, [id]);

    return (
        <div className={"flex flex-col w-[calc(100%_-_3rem)] mx-auto"}>
            <ContextMenu/>
            <div className={"flex flex-row"}>
                <div className={"flex flex-col w-[calc(50%_-_40px)] m-0"}>
                    <PathBreadcrumb path={path} onPathSelected={setPath}/>
                    <RemoteDirectoryTable onPathChange={setPath} path={path} manager={manager} connection={connection}/>
                </div>

                <div className={"flex flex-col mt-auto max-h-[calc(75vh_-_120px)] h-[100vh]"}>
                    <div className={"flex flex-row h-[100%] justify-between"}>
                        <Tooltip content={"Collapse Local Folder View"} placement={"left"}>
                            <Button variant={"light"} className={"h-full w-0 min-w-1 mx-1"}> <ClosePanelIcon opacity={.5} className={"rotate-180"}/> </Button>
                        </Tooltip>
                        <Tooltip content={"Collapse Remote Folder View"} placement={"right"}>
                            <Button variant={"light"} className={"h-full w-0 min-w-1 mx-1"}> <ClosePanelIcon opacity={.5}/> </Button>
                        </Tooltip>
                    </div>
                    <Tooltip content={"Collapse Console View"} placement={"top"}>
                        <Button variant={"light"} className={"h-8 w-[100%] my-1"}> <ClosePanelIcon opacity={.5} className={"rotate-90"}/> </Button>
                    </Tooltip>
                </div>
                <div className={"flex flex-col w-[calc(50%_-_40px)] m-0"}>
                    <PathBreadcrumb path={path} onPathSelected={setPath}/>
                    <RemoteDirectoryTable onPathChange={setPath} path={path} manager={manager} connection={connection}/>
                </div>
            </div>
            <Console manager={manager} connection={connection}/>
        </div>
    );
}


function ContextMenu()
{

    return (
        <div
            id={"context-menu"}
            className={
                "w-full max-w-[260px] px-1 py-2 rounded-small absolute z-10 shadow-small bg-[rgba(24_,_24_,_27_,_0.9)] backdrop-blur-sm transition-[opacity,scale,transform] max-h-[350px] overflow-y-scroll " +
                (isContextMenuOpen ? "opacity-1 pointer-events-all scale-100" : "opacity-0 pointer-events-none scale-90 transform-gpu")
            }
            style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y
            }}
            tabIndex={0}
            onBlur={() =>
            {
                $("tr[context-menu-item]").css({background: ""}).removeAttr("context-menu-item");
                setIsContextMenuOpen(false);
            }}
        >
            <Listbox>
                <ListboxSection
                    showDivider
                    title={"Actions"}
                >
                    <ListboxItem
                        key={"new-folder"}
                        description={"Create a new folder in this directory"}
                        startContent={<NewFolderIcon/>}
                        onClick={() => Log.debug("New Folder")}
                    >
                        New Folder
                    </ListboxItem>
                    <ListboxItem
                        key={"new-file"}
                        description={"Create a new file in this directory"}
                        startContent={<NewFileIcon/>}
                    >
                        New File
                    </ListboxItem>
                    <ListboxItem
                        key={"goto"}
                        description={"Opens a dialog to navigate to a different directory"}
                        startContent={<NewFileIcon/>}
                    >
                        Go To...
                    </ListboxItem>
                    <ListboxItem
                        key={"upload"}
                        description={"Upload a file or folder to this directory"}
                        startContent={<UploadIcon/>}
                    >
                        Upload
                    </ListboxItem>
                    <ListboxItem
                        key={"set-default-remote-path"}
                        description={"Set this directory as the default path"}
                        startContent={<SaveIcon/>}
                    >
                        Set as Default
                    </ListboxItem>

                </ListboxSection>
                <ListboxSection
                    showDivider
                    title={"Item actions"}
                >
                    <ListboxItem
                        key={"rename"}
                        description={"Rename this file or folder"}
                        startContent={<RenameIcon/>}
                    >
                        Rename
                    </ListboxItem>
                    <ListboxItem
                        key={"move"}
                        description={"Move this file or folder to another location"}
                        startContent={<MoveIcon/>}
                    >
                        Move
                    </ListboxItem>
                    <ListboxItem
                        key={"copy"}
                        description={"Copy this file or folder to another location"}
                        startContent={<CopyIcon/>}
                    >
                        Copy
                    </ListboxItem>
                    <ListboxItem
                        key={"archive"}
                        description={"Archive this file or folder"}
                        startContent={<ArchiveIcon/>}
                    >
                        Archive
                    </ListboxItem>
                    <ListboxItem
                        key={"download"}
                        description={"Download this file or folder"}
                        startContent={<DownloadIcon/>}
                    >
                        Download
                    </ListboxItem>
                    <ListboxItem
                        key={"edit"}
                        description={"Edit this file in a text editor"}
                        startContent={<EditIcon/>}
                    >
                        Edit
                    </ListboxItem>
                </ListboxSection>
                <ListboxSection title={"Danger zone"}>
                    <ListboxItem
                        key={"delete"}
                        color={"danger"}
                        className={"text-danger"}
                        description={"Delete this file or folder"}
                        startContent={<TrashIcon color={"text-danger"}/>}
                    >
                        Delete
                    </ListboxItem>
                </ListboxSection>
            </Listbox>
        </div>
    );
}


export function setContextMenuPosition(position: { x: number; y: number })
{
    contextMenuPosition = position;
    $("#context-menu").css({left: position.x, top: position.y});
}

export function setIsContextMenuOpen(open: boolean)
{
    isContextMenuOpen = open;

    const menu = $("#context-menu")
        .css({
            opacity: open ? 1 : 0,
            transform: open ? "scale(1)" : "scale(0.9)",
            pointerEvents: "all"
        });
    if (!open)
    {
        Log.debug("Closing context menu");
        setTimeout(() =>
        {
            if (!isContextMenuOpen)
            {
                $("#context-menu").css({pointerEvents: "none"}).removeAttr("open");

            }
        }, 100);
        setTimeout(() =>
        {
            if (!isContextMenuOpen)
            {
                $("#context-menu").css({left: 0, top: 0});
            }
        }, 500);
    } else
    {
        menu.attr("open", "");
    }
}
