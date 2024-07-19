import {invoke} from "@tauri-apps/api/tauri";

/**
 * Interface for the log message
 */
export interface LogMessage {
    id?: number;
    created?: Date;
    message: string;
    type: LogType,
    args: any[];
}

export enum LogType {
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

export interface LogHistoryRequest {
    from?: Date,
    to?: Date,
    types?: LogType[]
    limit?: number,
    query?: string
}

function LogTypeToString(type: LogType): string {
    switch (type) {
        case LogType.DEBUG:
            return "DEBUG";
        case LogType.INFO:
            return "INFO";
        case LogType.WARN:
            return "WARN";
        case LogType.ERROR:
            return "ERROR";
    }
}


export default class Log {
    private static instance: Log;
    private originalConsole: Console;

    private constructor() {
        this.originalConsole = {...console};
        console.log = Log.debug;
        console.debug = Log.debug;
        console.info = Log.info;
        console.warn = Log.warn;
        console.error = Log.error;
    }

    public static initialize() {
        if (!Log.instance) Log.instance = new Log();
        this.debug("Logger initialized");
    }


    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static debug(message: string, ...args: any[]) {
        try {
            if (Log.instance.originalConsole === undefined) {
                setTimeout(() => Log.debug(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.DEBUG);
            Log.instance.originalConsole.debug(`%c[${LogTypeToString(msg.type)}] ${msg.message}`, "background: transparent; color: #bada55; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch {
            setTimeout(() => Log.debug(message, ...args), 100);
        }
    }

    /**
     * Log an info message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static info(message: string, ...args: any[]) {
        try {
            if (Log.instance.originalConsole === undefined) {
                setTimeout(() => Log.info(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.INFO);
            Log.instance.originalConsole.info(`%c[${LogTypeToString(msg.type)}] ${msg.message}`, "background: #303f62; color: #45a1ff; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch {
            setTimeout(() => Log.info(message, ...args), 100);
        }
    }

    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static warn(message: string, ...args: any[]) {
        try {
            if (Log.instance.originalConsole === undefined) {
                setTimeout(() => Log.warn(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.WARN);
            Log.instance.originalConsole.warn(`[${LogTypeToString(msg.type)}] ${msg.message}`, ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch {
            setTimeout(() => Log.warn(message, ...args), 100);
        }
    }

    /**
     * Log an error message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static error(message: string, ...args: any[]) {
        try {
            if (Log.instance.originalConsole === undefined) {
                setTimeout(() => Log.error(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.ERROR);
            Log.instance.originalConsole.error(`[${LogTypeToString(msg.type)}] ${msg.message}`, ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch {
            setTimeout(() => Log.error(message, ...args), 100);
        }
    }

    /**
     * Build the log message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     * @param type - The type of the log message
     * @private
     */
    private static buildMessage(message: string, args: any[], type: LogType): LogMessage {
        // Get the indexes of the included arguments
        const includedIndexes: number[] = message.match(/{(\d+)}/g)?.map(i => parseInt(i.replace(/[{}]/g, ""))) ?? [];

        // Get the arguments that are not included in the message
        const notIncludedArgs = args.filter((_, index) => !includedIndexes.includes(index));

        return {message: `${message.replace(/{(\d+)}/g, (_, number) => `${JSON.stringify(args[number])}`)}`, type, args: notIncludedArgs};
    }

    public static history(request?: LogHistoryRequest, callback?: (logs: LogMessage[]) => void) {
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
            .then((response: any[]) => {
                return response.map((log: any) => {
                    log.created = new Date(log.created);
                    log.type = log.log_type;
                    log.args = JSON.parse(log.args);
                    delete log.log_type;
                    return log;
                }) as LogMessage[];
            })
            .then((logs: LogMessage[]) => {
                if (callback) callback(logs);
            });

    }
}
