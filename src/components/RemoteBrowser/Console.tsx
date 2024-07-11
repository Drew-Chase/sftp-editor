import {useEffect, useState} from "react";
import {Connection} from "../../assets/ts/ConnectionManager.ts";
import Log from "../../assets/ts/Logger.ts";

export default function Console({connection}: { connection: Connection })
{
    const [consoleText, setConsoleText] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    useEffect(() =>
    {
        Log.debug("Connection: ", connection);
        if (connection.id === -1) return;
    }, [connection]);

    return (
        <div className={"bg-[#101010] rounded-lg overflow-y-auto mt-4 h-[25vh] min-h-[140px]"}>
            <h1>Console</h1>
        </div>
    );
}