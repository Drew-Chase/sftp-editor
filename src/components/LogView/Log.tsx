import {default as Logger, LogHistoryRequest, LogMessage} from "../../assets/ts/Logger.ts";
import {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/react";

export default function Log({filter}: { filter: LogHistoryRequest })
{
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() =>
    {
        setLoading(true);
        Logger.history(filter).then((res: LogMessage[]) =>
        {
            setLogs(res);
            setLoading(false);
        });
    }, [filter]);


    return (
        <div id={"log-view"} className={"rounded-md w-[calc(100vw_-_4rem)] h-[calc(100vh_-_200px)] mt-4 dark:bg-[#101010] bg-[#ccc] overflow-y-auto"}>

            {loading && <Spinner size="lg" className={"m-auto"} title={"Loading Logs..."}/>}
            {!loading && logs.map((log: LogMessage) =>
                {
                    return (
                        <div
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
                            <div className={"flex gap-2"}>
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
                                <span className={"font-medium"}>{log.message}</span>
                            </div>
                            <div className={"flex gap-2 hidden"}>
                                {log.args.map((arg: any, index: number) =>
                                {
                                    return (
                                        <span key={index} className={"text-xs"}>{JSON.stringify(arg)}</span>
                                    );
                                })}
                            </div>

                        </div>);

                }
            )
            }

        </div>
    );
}
