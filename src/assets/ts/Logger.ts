import {invoke} from "@tauri-apps/api/tauri";

export enum ColorCodes
{
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m"
}

interface LogMessage
{
    message: string;
    type: string,
    args: any[];
}

export default class Log
{
    static debug(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "DEBUG");
        console.debug(`%c[${msg.type}] ${msg.message}`, "background: transparent; color: #bada55; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);
        invoke("log", {message: msg.message, logType: 0, arguments: JSON.stringify(msg.args)});
    }

    static info(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "INFO");
        console.info(`%c[${msg.type}] ${msg.message}`, "background: #303f62; color: #45a1ff; font-size: 12px; padding: 2px 5px; border-radius: 5px;", ...msg.args);

        invoke("log", {message: msg.message, logType: 1, arguments: JSON.stringify(msg.args)});
    }

    static warn(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "WARN");
        console.warn(`[${msg.type}] ${msg.message}`, ...msg.args);
        invoke("log", {message: msg.message, logType: 2, arguments: JSON.stringify(msg.args)});
    }

    static error(message: string, ...args: any[])
    {
        const msg: LogMessage = this.buildMessage(message, args, "ERROR");
        console.error(`[${msg.type}] ${msg.message}`, ...msg.args);
        invoke("log", {message: msg.message, logType: 3, arguments: JSON.stringify(msg.args)});
    }

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
