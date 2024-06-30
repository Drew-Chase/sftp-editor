import {useParams} from "react-router-dom";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import ConnectionManager, {Connection, EmptyConnection, File} from "../assets/ts/ConnectionManager.ts";
import {useEffect, useState} from "react";

export default function Browser()
{
    const id = useParams().id ?? "";
    if (id === "") window.location.href = "/site-browser/new";
    const manager = new ConnectionManager();
    let connection: Connection = EmptyConnection;
    const [files, setFiles] = useState<File[]>([] as File[]);
    manager.getConnectionById(Number.parseInt(id))
        .then(con => connection = con)
        .then(() => path = connection.remote_path);
    let path = "/";

    useEffect(() =>
              {
                  if (connection.id === EmptyConnection.id)
                  {
                      console.error(`Cannot list files for an empty connection!`, connection);
                      return;
                  }
                  console.log("Loading path: ", path, ", Connection: ", connection)
                  manager.listDirectory(path, connection)
                      .then(files => setFiles(files))
                      .then(() => console.log("Connection: ", connection, ", Files: ", files))
                      .catch((e) =>
                             {
                                 console.error(e)
                                 window.location.href = "/site-browser/new";
                             });
              }, [path])
    return (
        <div>
            <Table isHeaderSticky classNames={{
                tbody: "max-h-96",
            }}>
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
                                       <TableRow onClick={() =>
                                       {
                                           if (file.is_dir)
                                           {
                                               path = `${path}${file.path}/`;
                                           }
                                       }}>
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
