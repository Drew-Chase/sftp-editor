import {invoke} from "@tauri-apps/api/tauri";

/**
 * Interface for the log message
 */
export interface LogMessage
{
    id?: number;
    created?: Date;
    message: string;
    type: LogType,
    args: any[];
}

export enum LogType
{
    DEBUG,
    INFO,
    WARN,
    ERROR
}

export interface LogHistoryRequest
{
    from?: Date,
    to?: Date,
    types?: LogType[]
    limit?: number,
    query?: string
}


export default class Log
{


    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static debug(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, LogType.DEBUG);
        console.debug(`%c[${msg.type}] ${msg.message}`, "background: transparent; color: #bada55; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

        // Invoke the log function in the Tauri backend
        // This is non-blocking and will not halt the application
        invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log an info message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static info(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, LogType.INFO);
        console.info(`%c[${msg.type}] ${msg.message}`, "background: #303f62; color: #45a1ff; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

        // Invoke the log function in the Tauri backend
        // This is non-blocking and will not halt the application
        invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static warn(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, LogType.WARN);
        console.warn(`[${msg.type}] ${msg.message}`, ...msg.args);

        // Invoke the log function in the Tauri backend
        // This is non-blocking and will not halt the application
        invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log an error message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static error(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, LogType.ERROR);
        console.error(`[${msg.type}] ${msg.message}`, ...msg.args);

        // Invoke the log function in the Tauri backend
        // This is non-blocking and will not halt the application
        invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Build the log message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     * @param type - The type of the log message
     * @private
     */
    private static buildMessage(message: string, args: any[], type: LogType): LogMessage
    {
        // Get the indexes of the included arguments
        const includedIndexes: number[] = message.match(/{(\d+)}/g)?.map(i => parseInt(i.replace(/[{}]/g, ""))) ?? [];

        // Get the arguments that are not included in the message
        const notIncludedArgs = args.filter((_, index) => !includedIndexes.includes(index));

        return {message: `${message.replace(/{(\d+)}/g, (_, number) => `${JSON.stringify(args[number])}`)}`, type, args: notIncludedArgs};
    }

    public static history(request?: LogHistoryRequest, callback?: (logs: LogMessage[]) => void)
    {
        if (!request) request = {};

        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 1); // Default to 1 day ago

        const option = {
            endDate: request.to?.toISOString() ?? new Date().toISOString().replace("T", " ").replace("Z", ""),
            startDate: request.from?.toISOString() ?? defaultStartDate.toISOString().replace("T", " ").replace("Z", ""),
            logTypes: request.types ?? [LogType.DEBUG, LogType.INFO, LogType.WARN, LogType.ERROR],
            limit: request.limit ?? 100,
            query: request.query
        };

        if (!option.query || option.query === "") delete request.query;

        (invoke("get_log_history", option) as Promise<any[]>)
            .then((response: any[]) =>
            {
                return response.map((log: any) =>
                {
                    log.created = new Date(log.created);
                    log.type = log.log_type;
                    log.args = JSON.parse(log.args);
                    delete log.log_type;
                    return log;
                }) as LogMessage[];
            })
            .then((logs: LogMessage[]) =>
            {
                if (callback) callback(logs);
            });

    }
}
