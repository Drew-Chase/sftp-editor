import {useParams} from "react-router-dom";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import ConnectionManager from "../assets/ts/ConnectionManager.ts";

const id = useParams().id ?? "";
if (id === "") window.location.href = "/site-browser/new";
const manager = new ConnectionManager();
const connection = await manager.getConnectionById(Number.parseInt(id));
const files = await manager.listDirectory("/", connection);
console.log(files)
export default function Browser()
{
    return (
        <div>
            <Table shadow={"none"}>
                <TableHeader>
                    <TableColumn className={"w-full"}>Filename</TableColumn>
                    <TableColumn>Date Modified</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Size</TableColumn>
                </TableHeader>
                <TableBody>
                    {files.map(file =>
                    {
                        return (
                            <TableRow>
                                <TableCell>{file.path}</TableCell>
                                <TableCell>{file.modified}</TableCell>
                                <TableCell>{file.is_dir ? "Folder" : "File"}</TableCell>
                                <TableCell>{file.size}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
