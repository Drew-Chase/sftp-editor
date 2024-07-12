import React, {useEffect} from "react";
import ConnectionManager, {Connection, EmptyConnection, File} from "../../assets/ts/ConnectionManager.ts";
import {AsyncListData, useAsyncList} from "@react-stately/data";
import {Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import $ from "jquery";
import {setContextMenuPosition, setIsContextMenuOpen} from "../../pages/Browser.tsx";
import KeyboardShortcuts, {ModifierKey} from "../../assets/ts/KeyboardShortcuts.ts";
import {getLargestFileSize} from "../../assets/ts/FileMath.ts";
import {RenameIcon, TrashIcon} from "../Icons.tsx";
import Log from "../../assets/ts/Logger.ts";
import {GetSettings} from "../../assets/ts/Settings.ts";
import PathBreadcrumb from "./PathBreadcrumbs.tsx";

export default function RemoteDirectoryTable({path, onPathChange, connection}: { path: string, onPathChange: (path: string) => void, connection: Connection })
{
    let oldPath = "";
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRenaming, setIsRenaming] = React.useState(false);
    let list: AsyncListData<File> = useAsyncList({
        async load({})
        {
            Log.debug("Initial Path: {0}", path);
            setIsLoading(true);
            if (path === "" && connection.remote_path !== "")
            {
                Log.debug("Remote Path:", connection.remote_path);
                path = oldPath = connection.remote_path;
            } else if (path === "" && connection.remote_path === "")
            {
                path = oldPath = "/";
            }
            if (connection.id === EmptyConnection.id)
            {
                Log.error(`Cannot list files for an empty connection!`, connection);
                return {items: []};
            }
            Log.debug("Loading path: {0}, Connection:", path, connection);
            // const files = await ConnectionManager.instance.listDirectory(path);
            const files:File[] = [{path: "/test", filename: "test", is_dir: true, modified: 84641300, size: 846413, owner: 0x0077777, group: 0x0077777, permissions: 0x0077777},];
            for(let i = 0; i < 45; i++)
            {
                const rand = Math.random();
                files.push({path: `/test${rand}`, filename: `test${rand}`, is_dir: rand >= .25, modified: 84641300/rand, size: 846413/rand, owner: 0x0077777, group: 0x0077777, permissions: 0x0077777});
            }
            Log.debug("Files:", files);
            onPathChange(path);
            setIsLoading(false);

            return {items: files};
        },
        async sort({items, sortDescriptor})
        {
            Log.debug("Sorting: {0}, Items:", sortDescriptor, items);
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
                                first = a.filename.localeCompare(b.filename);
                                second = b.filename.localeCompare(a.filename);
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
        if (oldPath === path) return;
        if (oldPath === "" && path === "/")
        {
            oldPath = path;
            return;
        }
        Log.debug("Reloading list due to path changing...");
        oldPath = path;
        list.reload();
    }, [path]);

    useEffect(() =>
    {
        if (connection === EmptyConnection) return;
        list.reload();
    }, [connection]);

    return (
        <div>
            <PathBreadcrumb path={path} onPathSelected={onPathChange}/>
            <Table isHeaderSticky
                   sortDescriptor={list.sortDescriptor}
                   onSortChange={list.sort}
                   classNames={{
                       base: "overflow-y-auto mt-4",
                       table: "min-h-[32px]",
                       wrapper: "dark:bg-[#101010] max-h-[calc(100vh_-_100px)] h-[100vh]",
                   }}
            >
                <TableHeader>
                    <TableColumn key={"Filename"} allowsSorting className={"w-full dark:bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Filename</TableColumn>
                    <TableColumn key={"Modified"} allowsSorting className={"min-w-[170px] dark:bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Date Modified</TableColumn>
                    <TableColumn key={"Type"} allowsSorting className={"min-w-[100px] dark:bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Type</TableColumn>
                    <TableColumn key={"Size"} allowsSorting className={"min-w-[170px] dark:bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}>Size</TableColumn>
                    <TableColumn key={"Actions"} className={"dark:bg-[hsl(240,4%,16%,0.75)] backdrop-blur-sm"}> </TableColumn>
                </TableHeader>
                <TableBody
                    items={list.items as File[]}
                    isLoading={isLoading}
                    loadingContent={<Spinner label={"Loading..."}/>}
                >
                    {
                        (file: File) =>
                            (
                                <TableRow
                                    key={file.path}
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
                                        if (GetSettings()?.general_settings?.dark_mode)
                                            $(e.currentTarget as HTMLElement).css({background: "hsl(230.37deg 7.36% 34.47%)"}).attr("context-menu-item", "");
                                        else
                                            $(e.currentTarget as HTMLElement).css({background: "hsl(230.37deg 7.36% 84.47%)"}).attr("context-menu-item", "");

                                        Log.debug("Opening context menu at {0} {1}", e.clientX, e.clientY);
                                    }}
                                    onClick={(e) =>
                                    {
                                        const selectItems = $("tr[item-selected]");
                                        const currentTarget = $(e.currentTarget as HTMLElement);
                                        if ($("#context-menu").attr("open") !== undefined) return;

                                        if (currentTarget.attr("item-selected") !== undefined && (selectItems.length === 1 || KeyboardShortcuts.instance.isModifierPressed(ModifierKey.Control)))
                                        {
                                            currentTarget
                                                .css({background: ""})
                                                .removeAttr("item-selected")
                                                .removeAttr("last-selected-item");
                                            return;
                                        }

                                        if (!KeyboardShortcuts.instance.isModifierPressed(ModifierKey.Control) && !KeyboardShortcuts.instance.isModifierPressed(ModifierKey.Shift))
                                        {
                                            if (selectItems.length > 0)
                                            {
                                                selectItems.css({background: ""}).removeAttr("item-selected");
                                            }
                                        }

                                        if (KeyboardShortcuts.instance.isModifierPressed(ModifierKey.Shift) && selectItems.length > 0)
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
                                        if (file.is_dir)
                                        {
                                            onPathChange(file.path.replace(/[\\/]+/g, "/"));
                                        }
                                    }}>
                                    <TableCell className={"rounded-l-md"}>
                                        {isRenaming ? <Input value={file.filename} onBlur={async (_) =>
                                        {
                                            // TODO: Send message to the server to rename the file
                                            // const value = (e.target as HTMLInputElement).value;
                                            // const response = await manager.sendCommand(`mv "${item.path}" "${path}/${value}"`, connection);
                                            // Log.debug("Rename Response: {0}", response);
                                            // setIsRenaming(false);
                                        }}/> : file.filename}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip content={new Date(file.modified * 1000).toTimeString()} delay={1000}>
                                            {new Date(file.modified * 1000).toDateString()}
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{file.is_dir ? "Folder" : "File"}</TableCell>
                                    <TableCell>{file.is_dir ? "" : getLargestFileSize(file.size)}</TableCell>
                                    <TableCell className={"rounded-r-md"}>
                                        <div className={"flex flex-row gap-2"}>
                                            <Tooltip content={`Rename ${file.filename}`}>
                                        <span onClick={() => setIsRenaming(true)}>
                                            <RenameIcon size={16}/>
                                        </span>
                                            </Tooltip>
                                            <Tooltip content={`Delete ${file.filename}`} color={"danger"}>
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

