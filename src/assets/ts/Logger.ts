import {invoke} from "@tauri-apps/api/tauri";

/**
 * Interface for the log message
 */
interface LogMessage
{
    message: string;
    type: string,
    args: any[];
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
        const msg: LogMessage = this.buildMessage(message, args, "DEBUG");
        console.debug(`%c[${msg.type}] ${msg.message}`, "background: transparent; color: #bada55; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);
        invoke("log", {message: msg.message, logType: 0, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log an info message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static info(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "INFO");
        console.info(`%c[${msg.type}] ${msg.message}`, "background: #303f62; color: #45a1ff; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

        invoke("log", {message: msg.message, logType: 1, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static warn(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "WARN");
        console.warn(`[${msg.type}] ${msg.message}`, ...msg.args);
        invoke("log", {message: msg.message, logType: 2, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Log an error message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     */
    static error(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "ERROR");
        console.error(`[${msg.type}] ${msg.message}`, ...msg.args);
        invoke("log", {message: msg.message, logType: 3, arguments: JSON.stringify(msg.args)});
    }

    /**
     * Build the log message
     * @param message - The message to log
     * @param args - The arguments to replace in the message
     * @param type - The type of the log message
     * @private
     */
    private static buildMessage(message: string, args: any[], type: string): LogMessage
    {
        const includedIndexes: number[] = message.match(/{(\d+)}/g)?.map(i => parseInt(i.replace(/[{}]/g, ""))) ?? [];
        const notIncludedArgs = args.filter((_, index) => !includedIndexes.includes(index));
        for (const index of includedIndexes)
        {
            if (args[index] === undefined)
            {
                Log.error(`Failed build log message: Argument at index {0} is undefined`, index);
                return {} as LogMessage;
            }
        }

        return {message: `${message.replace(/{(\d+)}/g, (_, number) => `${JSON.stringify(args[number])}`)}`, type, args: notIncludedArgs};
    }

}
