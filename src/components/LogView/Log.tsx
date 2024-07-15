import {default as Logger, LogHistoryRequest, LogMessage} from "../../assets/ts/Logger.ts";
import {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/react";

export default function Log({filter}: { filter: LogHistoryRequest }) {
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        setLoading(true);
        Logger.history(filter).then((res: LogMessage[]) => {
            setLogs(res);
            setLoading(false);
        })
    }, [filter]);


    return (
        <div id={"log-view"} className={"rounded-md w-[calc(100vw_-_4rem)] h-[calc(100vh_-_200px)] mt-4 dark:bg-[#101010] bg-[#ccc] overflow-y-auto"}>

            {loading && <Spinner size="lg" className={"m-auto"} title={"Loading Logs..."}/>}
            {!loading && logs.map((log: LogMessage, index: number) => {
                return (
                    <div key={index} className={"p-2 border-b dark:border-[#303030] border-[#ccc] dark:hover:bg-[#303030] hover:bg-[#f0f0f0] transition-all"}>
                        <div className={"flex gap-2"}>
                            <span className={"font-bold"}>{log.type}</span>
                            <span>{log.message}</span>
                        </div>
                        <div className={"flex gap-2"}>
                            {log.args.map((arg: any, index: number) => {
                                return (
                                    <span key={index} className={"text-xs"}>{JSON.stringify(arg)}</span>
                                )
                            })}
                        </div>
                    </div>);
            })}

        </div>
    )
}
