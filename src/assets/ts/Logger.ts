import {invoke} from "@tauri-apps/api/tauri";
import {GetSettings} from "./Settings.ts";

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
    ERROR,
}

export interface LogHistoryRequest
{
    from?: Date,
    to?: Date,
    types?: LogType[]
    limit?: number,
    query?: string
}

function LogTypeToString(type: LogType): string
{
    switch (type)
    {
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

/**
 * This is a Log class which performs logging related operations.
 * This exported default class contains private static instance and originalConsole properties.
 * The purpose of this class is to keep logs in an organized manner.
 */
export default class Log
{
    /**
     * Establishes and maintains a single static instance of the log class.
     */
    private static instance: Log;
    /**
     * An object that represents the original console in which logs were outputted.
     * This is stored so that usual logging is not affected when the log class is used.
     */
    private originalConsole: Console;

    /**
     * A private constructor. This is used to restrict the instantiation of the Log class.
     * Also, it assigns debug, info, warn, and error console methods to respective Log class static methods.
     */
    private constructor()
    {
        this.originalConsole = {...console};
        console.log = Log.debug;
        console.debug = Log.debug;
        console.info = Log.info;
        console.warn = Log.warn;
        console.error = Log.error;
    }


    /**
     * Method to initialize the logger by creating its instance if not already created.
     */
    public static initialize()
    {
        if (!Log.instance)
        {
            Log.instance = new Log();
            this.debug("Logger initialized");
        }
    }


    /**
     * Method to log a debug message, it takes string message and additional arguments.
     * It logs to the console and invokes the 'log' function of the backend.
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static debug(message: string, ...args: any[])
    {
        try
        {
            if (Log.instance.originalConsole === undefined)
            {
                setTimeout(() => Log.debug(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.DEBUG);
            Log.instance.originalConsole.debug(`%c[${LogTypeToString(msg.type)}] ${msg.message}`, "background: transparent; color: #bada55; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch
        {
            setTimeout(() => Log.debug(message, ...args), 100);
        }
    }

    /**
     * Method to log an information message, it takes string message and additional arguments.
     * It logs to the console and invokes the 'log' function of the backend.
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static info(message: string, ...args: any[])
    {
        try
        {
            if (Log.instance.originalConsole === undefined)
            {
                setTimeout(() => Log.info(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.INFO);
            Log.instance.originalConsole.info(`%c[${LogTypeToString(msg.type)}] ${msg.message}`, "background: #303f62; color: #45a1ff; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch
        {
            setTimeout(() => Log.info(message, ...args), 100);
        }
    }

    /**
     * Method to log a warning message, it takes string message and additional arguments.
     * It logs to the console and invokes the 'log' function of the backend.
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static warn(message: string, ...args: any[])
    {
        try
        {
            if (Log.instance.originalConsole === undefined)
            {
                setTimeout(() => Log.warn(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.WARN);
            Log.instance.originalConsole.warn(`[${LogTypeToString(msg.type)}] ${msg.message}`, ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch
        {
            setTimeout(() => Log.warn(message, ...args), 100);
        }
    }

    /**
     * Method to log an error message, it takes string message and additional arguments.
     * It logs to the console and invokes the 'log' function of the backend.
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static error(message: string, ...args: any[])
    {
        try
        {
            if (Log.instance.originalConsole === undefined)
            {
                setTimeout(() => Log.error(message, ...args), 100);
                return;
            }
            const msg: LogMessage = Log.buildMessage(message, args, LogType.ERROR);
            Log.instance.originalConsole.error(`[${LogTypeToString(msg.type)}] ${msg.message}`, ...msg.args);

            // Invoke the log function in the Tauri backend
            // This is non-blocking and will not halt the application
            invoke("log", {message: msg.message, logType: msg.type, arguments: JSON.stringify(msg.args)});
        } catch
        {
            setTimeout(() => Log.error(message, ...args), 100);
        }
    }

    /**
     * This is a private function that builds the log message. It formats the provided message and arguments into a LogMessage.
     * It takes a string as a message, an array of arguments, and a type of log message.
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

    /**
     * Method to get the history of logs. It takes as argument an optional request object and a callback function.
     * @param request - The request object
     * @param callback - The callback function
     */
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

/**
 * Opens the log window in the application.
 * This function makes a call to the Tauri backend to trigger the opening of a log window,
 * allowing users to view log messages in a dedicated UI.
 */
export function openLogWindow()
{
    invoke("open_log_window", {alwaysOnTop: GetSettings().general_settings.log_window_always_on_top});
}

/**
 * Closes the log window in the application.
 * This function communicates with the Tauri backend to close the log window,
 * effectively hiding the log messages UI from the user.
 */
export function closeLogWindow()
{
    invoke("close_log_window");
}

/**
 * Clears all log messages from the log storage.
 * By invoking this function, all stored log messages are deleted from the backend,
 * ensuring that the log window (if opened again) will start fresh without any old messages.
 */
export function clearLog()
{
    invoke("clear_log");
}