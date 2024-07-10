import {useEffect, useState} from "react";
import ConnectionManager, {Connection} from "../../assets/ts/ConnectionManager.ts";
import Log from "../../assets/ts/Logger.ts";

export default function Console({connection, manager}: { connection: Connection, manager: ConnectionManager })
{
    const [consoleText, setConsoleText] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    useEffect(() =>
    {
        Log.debug("Connection: {0}", connection);
        if (connection.id === -1) return;
    }, [connection]);

    return (
        <div className={"bg-[#101010] rounded-lg overflow-y-auto mt-4 h-[25vh] min-h-[140px]"}>
            <h1>Console</h1>
        </div>
    );
}