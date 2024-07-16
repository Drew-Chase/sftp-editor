import {Switch} from "@nextui-org/react";
import Log from "../components/LogView/Log.tsx";
import {LogHistoryRequest, LogType} from "../assets/ts/Logger.ts";

export default function LogViewer() {
    let filter: LogHistoryRequest = {
        types: [LogType.DEBUG,LogType.INFO, LogType.WARN, LogType.ERROR],
        limit: 10,
    };
    return (
        <div className={"m-8"}>
            <div className={"flex-row flex mb-3 gap-4"}>
                <h1 className={"text-4xl w-full"}>Log Viewer</h1>
                <Switch
                    isSelected={filter.types?.includes(LogType.DEBUG) ?? false}
                    className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                    onValueChange={
                        value => {
                            if (value) {
                                if (!filter.types?.includes(LogType.DEBUG))
                                    filter.types?.push(LogType.DEBUG)
                            } else
                                filter.types?.splice(filter.types.indexOf(LogType.DEBUG), 1)
                        }
                    }
                >
                    Debug
                </Switch>
                <Switch
                    isSelected={filter.types?.includes(LogType.INFO) ?? true}
                    className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                    onValueChange={
                        value => {
                            if (value) {
                                if (!filter.types?.includes(LogType.INFO))
                                    filter.types?.push(LogType.INFO)
                            } else
                                filter.types?.splice(filter.types.indexOf(LogType.INFO), 1)

                        }
                    }
                >
                    Info
                </Switch>
                <Switch
                    isSelected={filter.types?.includes(LogType.WARN) ?? true}
                    className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                    onValueChange={
                        value => {
                            if (value) {
                                if (!filter.types?.includes(LogType.WARN))
                                    filter.types?.push(LogType.WARN)
                            } else
                                filter.types?.splice(filter.types.indexOf(LogType.WARN), 1)

                        }
                    }
                >
                    Warnings
                </Switch>
                <Switch
                    isSelected={filter.types?.includes(LogType.ERROR) ?? true}
                    className={"dark:bg-[#101010] hover:dark:bg-[#151515] bg-[#c0c0c0] hover:bg-[#c9c9c9] rounded-md p-3 transition-all"}
                    onValueChange={
                        value => {
                            if (value) {
                                if (!filter.types?.includes(LogType.ERROR))
                                    filter.types?.push(LogType.ERROR)
                            } else
                                filter.types?.splice(filter.types.indexOf(LogType.ERROR), 1)
                        }
                    }
                >
                    Errors
                </Switch>
            </div>
            <Log filter={filter}/>
        </div>
    )
}