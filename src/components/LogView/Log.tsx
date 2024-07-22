import {default as Logger, LogMessage, LogType} from "../../assets/ts/Logger.ts";
import {useEffect, useState} from "react";
import {Accordion, AccordionItem, Button, Spinner} from "@nextui-org/react";
import JsonHierarchyComponent from "./JsonHierarchyComponent.tsx";
import $ from "jquery";
import {PauseIcon, PlayIcon} from "../Icons.tsx";

let updateProgressbar: number;

export default function Log({showDebug, showInfo, showWarn, showError, limit, startDate, endDate, search}: { showDebug: boolean, showInfo: boolean, showWarn: boolean, showError: boolean, limit: number, startDate: Date, endDate: Date, search: string | undefined })
{
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [reloadPaused, setReloadPaused] = useState<boolean>(false);
    const reloadSpeed = 100;

    const reload = () =>
    {
        const progress = $("#logview-progress");
        if (progress)
        {
            clearInterval(updateProgressbar);
            progress.css("--transition", "0.2s");
            progress.css("--progress", "0%");
            setTimeout(() => progress.css("--transition", `${reloadSpeed / 1000}s`), 200);
        }
        setLoading(true);
        Logger.history({
            types: [
                showDebug ? 0 : -1,
                showInfo ? 1 : -1,
                showWarn ? 2 : -1,
                showError ? 3 : -1
            ].filter((type: number) => type !== -1) as LogType[],
            limit: limit,
            // from: startDate,
            // to: endDate,
            // query: search
        }, (logs: LogMessage[]) =>
        {
            setLogs(logs);
            setLoading(false);
            // if (!reloadPaused)
            //     startProgressbar();
        });
    };


    useEffect(() =>
    {
        reload();
    }, [showDebug, showInfo, showWarn, showError, limit, startDate, endDate, search]);


    const startProgressbar = () =>
    {
        clearInterval(updateProgressbar);
        // @ts-ignore
        updateProgressbar = setInterval(() =>
        {
            const progress = $("#logview-progress");
            if (progress)
            {
                const currentProgress = parseInt(progress.css("--progress")?.replace("%", "") ?? "0");
                const newProgress = (currentProgress + 1) % 101;
                if (newProgress === 0)
                {
                    progress.css("--transition", "0.2s");
                    progress.css("--progress", "0%");
                    setTimeout(() => progress.css("--transition", `${reloadSpeed / 1000}s`), 200);
                    reload();
                }
                progress.css("--progress", `${newProgress}%`);
            }
        }, reloadSpeed);
    };


    return (
        <div id={"log-view"} className={"rounded-md w-[calc(100vw_-_4rem)] h-[calc(100vh_-_100px)] mt-4 dark:bg-[#101010] bg-[#ccc] overflow-y-auto"}>

            {loading && <Spinner size="lg" className={"w-full h-full"} label={"Loading Logs..."}/>}
            {!loading && logs.map((log: LogMessage) =>
                {
                    return (
                        <Accordion
                            key={log.id}
                            className={"p-2 border-b dark:border-[#303030] border-[#ccc] dark:hover:bg-[#303030] hover:bg-[#f0f0f0] transition-all"}
                            style={
                                {
                                    wordBreak: "break-all",
                                    whiteSpace: "pre-wrap",
                                    backgroundColor: (() =>
                                    {
                                        switch (log.type)
                                        {
                                            case 1:
                                                return "rgba(61,86,147,0.47)";
                                            case 2:
                                                return "rgba(245,166,35,0.34)";
                                            case 3:
                                                return "rgba(208,2,27,0.34)";
                                            case 0:
                                            default:
                                                return "rgba(186,218,85,0.07)";
                                        }
                                    })()
                                }

                            }
                        >
                            <AccordionItem textValue={"fdasfads"} isCompact startContent={
                                <div className={"flex flex-row"}>
                                    <div className={"font-light"}>{
                                        (() =>
                                        {
                                            switch (log.type)
                                            {
                                                case 1:
                                                    return (<span>ℹ️ Info</span>);
                                                case 2:
                                                    return (<span>⚠️ Warn</span>);
                                                case 3:
                                                    return (<span>❌ Error</span>);
                                                case 0:
                                                default:
                                                    return (<span>Debug</span>);
                                            }
                                        })()
                                    }
                                    </div>
                                    <p className={"pl-4 max-w-[calc(90vw_-_7rem)] truncate"}>{log.message}</p>
                                </div>
                            }
                            >
                                <>
                                    <span className={"opacity-70"}>Timestamp:</span> <span>{log.created?.toLocaleString()}</span>
                                    <p>{log.message}</p>
                                    {
                                        log.args.length === 0 ? <div className={"opacity-70"}>No additional data</div> : log.args.map((arg: any, index: number) =>
                                        {
                                            const supportedTypes = ["number", "string", "boolean"];
                                            return (
                                                <div key={index} className={"text-xs"}>
                                                    {supportedTypes.includes(typeof arg) ? arg : <JsonHierarchyComponent key={log.id?.toString() ?? ""} content={arg}/>}
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            </AccordionItem>
                        </Accordion>

                    );

                }
            )
            }
            <div className={"fixed bottom-[4px] left-4 right-4 flex flex-row items-center gap-2"}>
                <div className={"relative w-full"}>
                    <div id={"logview-progress"} className={"h-[3px] bg-[#101010] rounded-full w-full"}></div>
                </div>
                <Button className={"h-[16px] w-[16px] min-w-0"} onPress={() =>
                {
                    setReloadPaused(!reloadPaused);
                    if (reloadPaused)
                    {
                        startProgressbar();
                    } else
                    {
                        clearInterval(updateProgressbar);
                    }
                }}>{reloadPaused ? <PlayIcon size={12}/> : <PauseIcon size={12}/>}</Button>
            </div>
        </div>
    );
}
