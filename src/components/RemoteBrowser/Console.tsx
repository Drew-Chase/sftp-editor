import {useEffect} from "react";
import {Connection} from "../../assets/ts/ConnectionManager.ts";
import Log from "../../assets/ts/Logger.ts";
import {Button, Tooltip} from "@nextui-org/react";
import {ClosePanelIcon} from "../Icons.tsx";

export default function Console({connection}: { connection: Connection })
{
    // const [consoleText, setConsoleText] = useState<string[]>([]);
    // const [input, setInput] = useState<string>("");
    // const [history, setHistory] = useState<string[]>([]);
    // const [historyIndex, setHistoryIndex] = useState<number>(-1);

    useEffect(() =>
    {
        Log.debug("Connection: ", connection);
        if (connection.id === -1) return;
    }, [connection]);

    return (
        <div className={"bg-[#101010] rounded-lg overflow-y-auto mt-4 h-[25vh] min-h-[140px] relative"}>
            <div className={"absolute right-1 top-1"}>
                <Tooltip content={"Collapse the Console Panel"}>
                    <Button variant={"light"} className={"max-w-4 min-w-4 w-4 rounded-small"}>
                        <ClosePanelIcon opacity={.25} className={"rotate-[-90deg]"}/>
                    </Button>
                </Tooltip>
            </div>
            <h1>Console</h1>
        </div>
    );
}