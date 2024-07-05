import {useParams} from "react-router-dom";
import {Listbox, ListboxItem, ListboxSection, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import ConnectionManager, {Connection, EmptyConnection, File} from "../assets/ts/ConnectionManager.ts";
import React from "react";
import {getLargestFileSize} from "../assets/ts/FileMath.ts";
import {AsyncListData, useAsyncList} from "@react-stately/data";
import {ArchiveIcon, CopyIcon, DownloadIcon, EditIcon, MoveIcon, NewFileIcon, NewFolderIcon, RenameIcon, TrashIcon, UploadIcon} from "../components/Icons.tsx";
import $ from "jquery";

let path = "";
export default function Browser()
{
    const [isLoading, setIsLoading] = React.useState(true);
    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);
    const [contextMenuPosition, setContextMenuPosition] = React.useState({x: 0, y: 0});
    const id = useParams().id ?? "";
    if (id === "") window.location.href = "/site-browser/new";
    const manager = new ConnectionManager();
    let connection: Connection = EmptyConnection;
    let list: AsyncListData<File> = useAsyncList({
                                                     async load({})
                                                     {
                                                         console.log("Initial Path: ", path);
                                                         setIsLoading(true);
                                                         connection = await manager.getConnectionById(parseInt(id));
                                                         if (path === "" && connection.remote_path !== "")
                                                         {
                                                             console.log("Remote Path: ", connection.remote_path);
                                                             path = connection.remote_path;
                                                         } else if (path === "" && connection.remote_path === "")
                                                         {
                                                             path = "/";
                                                         }
                                                         if (connection.id === EmptyConnection.id)
                                                         {
                                                             console.error(`Cannot list files for an empty connection!`, connection);
                                                             return {items: []};
                                                         }
                                                         console.log("Loading path: ", path, ", Connection: ", connection);
                                                         const files = await manager.listDirectory(path, connection);
                                                         setIsLoading(false);

                                                         return {items: files};
                                                     },
                                                     async sort({items, sortDescriptor})
                                                     {
                                                         console.log("Sorting: ", sortDescriptor, "Items: ", items);
                                                         return {
                                                             items: (items as File[])
                                                                 .sort((a, b) =>
                                                                       {
                                                                           let first: number;
                                                                           let second: number;

                                                                           switch (sortDescriptor.column)
                                                                           {
                                                                               case "Modified":
                                                                                   first = a.modified;
                                                                                   second = b.modified;
                                                                                   break;
                                                                               case "Type":
                                                                                   first = a.is_dir ? 1 : 0;
                                                                                   second = b.is_dir ? 1 : 0;
                                                                                   break;
                                                                               case "Size":
                                                                                   if (a.is_dir && !b.is_dir) return -1;
                                                                                   if (!a.is_dir && b.is_dir) return 1;
                                                                                   first = a.size;
                                                                                   second = b.size;
                                                                                   break;
                                                                               default:
                                                                               case "Filename":
                                                                                   first = a.path.localeCompare(b.path);
                                                                                   second = b.path.localeCompare(a.path);
                                                                                   break;
                                                                           }

                                                                           let cmp = first < second ? -1 : 1;

                                                                           if (sortDescriptor.direction === "descending")
                                                                           {
                                                                               cmp *= -1;
                                                                           }

                                                                           return cmp;
                                                                       })
                                                         };
                                                     }
                                                 });
    let modifierKeys: string[] = [];
    $(document)
        .on("keydown", (e) =>
        {
            if (e.key === "Control" || e.key === "Shift" || e.key === "Alt")
            {
                if (modifierKeys.includes(e.key)) return;
                modifierKeys.push(e.key);
                console.log("Modifier Key Pressed: ", e.key, modifierKeys);
            }
        })
        .on("keyup", (e) =>
        {
            if (e.key === "Control" || e.key === "Shift" || e.key === "Alt")
            {
                modifierKeys = modifierKeys.filter((key) => key !== e.key);
                console.log("Modifier Key Released: ", e.key, modifierKeys);
            }
        });

    return (
        <div>
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
                    setTimeout(() =>
                               {
                                   $("tr[context-menu-item]").css({background: ""}).removeAttr("context-menu-item");
                                   setIsContextMenuOpen(false);
                               }, 100);
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
                            key={"upload"}
                            description={"Upload a file or folder to this directory"}
                            startContent={<UploadIcon/>}
                        >
                            Upload
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


            <Table isHeaderSticky
                   sortDescriptor={list.sortDescriptor}
                   onSortChange={list.sort}
                   classNames={{
                       base: "max-h-[calc(100vh_-_68px)] h-[100%] overflow-y-auto w-[calc(100%_-_3rem)] mx-auto mt-4",
                       table: "min-h-[32px]",
                       wrapper: "bg-[#101010]"
                   }}
            >
                <TableHeader>
                    <TableColumn key={"Filename"} allowsSorting className={"w-full"}>Filename</TableColumn>
                    <TableColumn key={"Modified"} allowsSorting className={"min-w-[170px]"}>Date Modified</TableColumn>
                    <TableColumn key={"Type"} allowsSorting className={"min-w-[100px]"}>Type</TableColumn>
                    <TableColumn key={"Size"} allowsSorting className={"min-w-[170px]"}>Size</TableColumn>
                    <TableColumn key={"Actions"}> </TableColumn>
                </TableHeader>
                <TableBody
                    items={list.items as File[]}
                    isLoading={isLoading}
                    loadingContent={<Spinner label={"Loading..."}/>}
                >
                    {(item: File) => (
                        <TableRow
                            key={item.path}
                            className={"cursor-pointer hover:bg-default-200 select-none"}
                            onContextMenu={(e) =>
                            {
                                e.preventDefault();
                                const contextMenu = $("#context-menu");
                                const contextMenuWidth: number = contextMenu.width()!;
                                const contextMenuHeight: number = contextMenu.height()!;
                                let x = e.clientX - 24;
                                let y = e.clientY;

                                if (e.clientX + contextMenuWidth + 16 > window.innerWidth)
                                {
                                    x = window.innerWidth - contextMenuWidth - 16;
                                }
                                if (e.clientY + contextMenuHeight + 24 > window.innerHeight)
                                {
                                    y = window.innerHeight - contextMenuHeight - 24;
                                }

                                setContextMenuPosition({x, y});
                                setIsContextMenuOpen(true);
                                contextMenu.trigger("focus");
                                contextMenu.scrollTop(0);
                                $(e.currentTarget as HTMLElement).css({background: "hsl(230.37deg 7.36% 34.47%)"}).attr("context-menu-item", "");

                                console.log("Opening context menu at ", e.clientX, e.clientY);
                            }}
                            onClick={(e) =>
                            {
                                const selectItems = $("tr[item-selected]");
                                const currentTarget = $(e.currentTarget as HTMLElement);
                                if ($("tr[context-menu-item]").length > 0) return;

                                if (currentTarget.attr("item-selected") !== undefined)
                                {
                                    currentTarget.css({background: ""}).removeAttr("item-selected").removeAttr("last-selected-item");
                                    return;
                                }

                                if (!modifierKeys.includes("Control") && !modifierKeys.includes("Shift"))
                                {
                                    if (selectItems.length > 0)
                                    {
                                        selectItems.css({background: ""}).removeAttr("item-selected");
                                    }
                                }

                                if (modifierKeys.includes("Shift") && selectItems.length > 0)
                                {
                                    const lastSelectedItem = $("tr[last-selected-item]");
                                    const lastSelectedIndex = list.items.findIndex((item) => item.path === lastSelectedItem.attr("data-key")!);
                                    const currentIndex = list.items.findIndex((i) => i.path === item.path);
                                    const items: File[] = list.items.slice(Math.min(lastSelectedIndex, currentIndex), Math.max(lastSelectedIndex, currentIndex) + 1);
                                    items.forEach((item) =>
                                                  {
                                                      $(`tr[data-key='${item.path}']`).css({background: "hsl(230.37deg 7.36% 30%)"}).attr("item-selected", "");
                                                      console.log("Selected Item: ", item.path);
                                                  });
                                    return;
                                }
                                selectItems.removeAttr("last-selected-item");
                                currentTarget.css({background: "hsl(230.37deg 7.36% 30%)"}).attr("item-selected", "").attr("last-selected-item", "");
                            }}
                            onDoubleClick={() =>
                            {
                                if (item.is_dir)
                                {
                                    console.log("Before Path: ", path);
                                    console.log("Item Path: ", item.path);
                                    console.log(`Setting path to ${path}/${item.path}`);
                                    path = `${path}/${item.path}`.replace(/\/\//g, "/");
                                    list.reload();
                                }
                            }}>
                            <TableCell className={"rounded-l-md"}>{item.path}</TableCell>
                            <TableCell>{new Date(item.modified * 1000).toDateString()}</TableCell>
                            <TableCell>{item.is_dir ? "Folder" : "File"}</TableCell>
                            <TableCell>{item.is_dir ? "" : getLargestFileSize(item.size)}</TableCell>
                            <TableCell className={"rounded-r-md"}>
                                <div className={"flex flex-row gap-2"}>
                                    <Tooltip content={`Rename ${item.path}`}>
                                        <span>
                                            <RenameIcon size={16}/>
                                        </span>
                                    </Tooltip>
                                    <Tooltip content={`Delete ${item.path}`} color={"danger"}>
                                        <span className={"text-danger"}>
                                            <TrashIcon size={16}/>
                                        </span>
                                    </Tooltip>
                                </div>

                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
