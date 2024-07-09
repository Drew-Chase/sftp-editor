import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import ConnectionManager, {Connection, EmptyConnection, File} from "../../assets/ts/ConnectionManager.ts";
import {AsyncListData, useAsyncList} from "@react-stately/data";
import $ from "jquery";
import {Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {getLargestFileSize} from "../../assets/ts/FileMath.ts";
import {RenameIcon, TrashIcon} from "../Icons.tsx";
import {setContextMenuPosition, setIsContextMenuOpen} from "../../pages/Browser.tsx";

export default function DirectoryTable({path, onPathChange}: { path: string, onPathChange: (path: string) => void })
{
    const [isLoading, setIsLoading] = React.useState(true);
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
                                                         onPathChange(path);
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

    useEffect(() =>
              {
                  list.reload();
              }, [path]);


    let modifierKeys: string[] = [];
    $(document)
        // .off("keydown")
        // .off("keyup")
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
            <Table isHeaderSticky
                   sortDescriptor={list.sortDescriptor}
                   onSortChange={list.sort}
                   classNames={{
                       base: "max-h-[calc(75vh_-_120px)] h-[100vh] overflow-y-auto w-[calc(100%_-_3rem)] mx-auto mt-4",
                       table: "min-h-[32px]",
                       wrapper: "bg-[#101010] flex-grow"
                   }}
            >
                <TableHeader>
                    <TableColumn key={"Filename"} allowsSorting className={"w-full bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Filename</TableColumn>
                    <TableColumn key={"Modified"} allowsSorting className={"min-w-[170px] bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Date Modified</TableColumn>
                    <TableColumn key={"Type"} allowsSorting className={"min-w-[100px] bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Type</TableColumn>
                    <TableColumn key={"Size"} allowsSorting className={"min-w-[170px] bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Size</TableColumn>
                    <TableColumn key={"Actions"} className={"bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}> </TableColumn>
                </TableHeader>
                <TableBody
                    items={list.items as File[]}
                    isLoading={isLoading}
                    loadingContent={<Spinner label={"Loading..."}/>}
                >
                    {(item: File) =>
                        (
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
                                    if ($("#context-menu").attr("open") !== undefined) return;

                                    if (currentTarget.attr("item-selected") !== undefined && (selectItems.length === 1 || modifierKeys.includes("Control")))
                                    {
                                        currentTarget
                                            .css({background: ""})
                                            .removeAttr("item-selected")
                                            .removeAttr("last-selected-item");
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
                                        const allItems = currentTarget.parent().children();
                                        const currentIndex = allItems.index(currentTarget);
                                        const lastIndex = allItems.index(lastSelectedItem);
                                        const inBetween = allItems.slice(Math.min(currentIndex, lastIndex), Math.max(currentIndex, lastIndex) + 1);
                                        inBetween.css({background: "hsl(230.37deg 7.36% 30%)"}).attr("item-selected", "");
                                        return;
                                    }
                                    selectItems.removeAttr("last-selected-item");
                                    currentTarget.css({background: "hsl(230.37deg 7.36% 30%)"}).attr("item-selected", "").attr("last-selected-item", "");
                                }}
                                onDoubleClick={() =>
                                {
                                    if (item.is_dir)
                                    {
                                        path = `${path}/${item.path}`.replace(/\/\//g, "/");
                                        onPathChange(path);
                                    }
                                }}>
                                <TableCell className={"rounded-l-md"}>{item.path}</TableCell>
                                <TableCell>
                                    <Tooltip content={new Date(item.modified * 1000).toTimeString()} delay={1000}>
                                        {new Date(item.modified * 1000).toDateString()}
                                    </Tooltip>
                                </TableCell>
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
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );

}