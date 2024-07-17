import {default as Logger, LogMessage, LogType} from "../../assets/ts/Logger.ts";
import {useEffect, useState} from "react";
import {Accordion, AccordionItem, Spinner} from "@nextui-org/react";
import JsonHierarchyComponent from "./JsonHierarchyComponent.tsx";

export default function Log({showDebug, showInfo, showWarn, showError, limit}: { showDebug: boolean, showInfo: boolean, showWarn: boolean, showError: boolean, limit: number })
{
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() =>
    {
        setLoading(true);
        Logger.history({
            types: [
                showDebug ? 0 : -1,
                showInfo ? 1 : -1,
                showWarn ? 2 : -1,
                showError ? 3 : -1
            ].filter((type: number) => type !== -1) as LogType[],
            limit: limit
        }, (logs: LogMessage[]) =>{
            setLogs(logs);
            setLoading(false);
        });
    }, [showDebug, showInfo, showWarn, showError, limit]);


    return (
        <div id={"log-view"} className={"rounded-md w-[calc(100vw_-_4rem)] h-[calc(100vh_-_230px)] mt-4 dark:bg-[#101010] bg-[#ccc] overflow-y-auto"}>

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
                            <AccordionItem isCompact title={log.message} startContent={
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
                            }
                            >
                                <>
                                    <span className={"opacity-70"}>Timestamp:</span> <span>{log.created?.toLocaleString()}</span>
                                    {log.args.length === 0 ? <span>No additional data</span> : log.args.map((arg: any, index: number) =>
                                    {
                                        const supportedTypes = ["number", "string", "boolean"];
                                        return (
                                            <div key={index} className={"text-xs"}>
                                                {supportedTypes.includes(typeof arg) ? arg : <JsonHierarchyComponent key={log.id?.toString()??""} content={arg}/>}
                                            </div>
                                        );
                                    })}
                                </>
                            </AccordionItem>
                        </Accordion>);

                }
            )
            }

        </div>
    );
}
