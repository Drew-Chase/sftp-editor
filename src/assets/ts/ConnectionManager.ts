import {invoke} from "@tauri-apps/api/tauri";
import Log from "./Logger.ts";

export enum Protocol
{
    SFTP = 0,
    FTP = 1,
}

export interface Connection
{
    id: number,
    name: string,
    host: string,
    port: number,
    username: string,
    password: string,
    private_key: string,
    remote_path: string,
    local_path: string,
    default: boolean,
    protocol: Protocol,
    created_at: Date,
    updated_at: Date,
    last_connected_at: Date,
}

export interface File
{
    path: string,
    filename: string,
    is_dir: boolean,
    size: number,
    modified: number,
    permissions: number,
    owner: number,
    group: number,
}

export const EmptyConnection: Connection = {
    id: -1,
    name: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    private_key: "",
    remote_path: "",
    local_path: "",
    default: false,
    protocol: Protocol.SFTP,
    created_at: new Date(),
    updated_at: new Date(),
    last_connected_at: new Date()
};

export default class ConnectionManager
{
    /**
     * The singleton instance of ConnectionManager.
     */
    public static readonly instance = new ConnectionManager();
    private connections: Connection[] = [];
    private current: Connection = EmptyConnection;


    /**
     * Checks if the user is currently connected to a connection.
     */
    public isConnected = () => this.current !== EmptyConnection;

    private constructor()
    {
        // Load the connections from the backend when the ConnectionManager is created.
        this.loadConnections().then((connections) =>
        {
            Log.debug("Loading connections: {0}", connections.map(c => c.name));
        });
    }


    /**
     * Adds the provided connection to the backend.
     * @param connection - The connection to add.
     */
    static async addConnection(connection: Connection): Promise<void>
    {
        await invoke("add_connection", {connection: {...connection, protocol: connection.protocol}});
    }

    /**
     * Updates the provided connection in the backend.
     * @param connection - The connection to update.
     */
    static async updateConnection(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            Log.error(`Cannot update empty connection!`, connection);
            return;
        }
        Log.info("Updating connection: {0}", connection.id);
        await invoke("update_connection", {id: connection.id, connection: {...connection, protocol: connection.protocol}});
        await this.instance.loadConnections();
    }

    /**
     * Updates the last connected time for the provided connection.
     * @param connection
     */
    static async updateJoined(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            Log.error(`Cannot update empty connection!`, connection);
            return;
        }
        Log.info("Updating last connected time for connection: {0}", connection.id);
        await invoke("update_join", {id: connection.id});
        await this.instance.loadConnections();
    }

    /**
     * Retrieves the default connection.
     */
    getDefault(): Connection
    {
        return this.connections.find(c => c.default) || EmptyConnection;
    }

    /**
     * Checks if there is a default connection.
     */
    hasDefault(): boolean
    {
        return this.connections.some(c => c.default);
    }

    /**
     * Sets the provided connection as the default connection.
     * Default connections will be automatically connected to when the application is opened.
     * @param connection - The connection to set as default.
     */
    static async setDefault(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            Log.error(`Cannot update empty connection!`, connection);
            return;
        }
        Log.info("Setting default connection: {0}", connection.id);
        await invoke("set_default", {id: connection.id});
        await this.instance.loadConnections();
    }

    /**
     * Removes the provided connection from the backend.
     * @param connection - The connection to remove.
     */
    static async removeConnection(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            Log.error(`Cannot remove empty connection!`, connection);
            return;
        }
        Log.info("Removing connection: {0}", connection.id);
        await invoke("delete_connection", {id: connection.id, connection: connection});
    }


    /**
     * Retrieves all connections from the backend.
     * @returns A list of connections.
     */
    async loadConnections(): Promise<Connection[]>
    {
        Log.info("Getting connections from the file system.");
        this.connections = await invoke("get_connections") as Connection[];
        this.connections = this.connections.map(connection =>
        {
            connection.created_at = new Date(connection.created_at);
            connection.updated_at = new Date(connection.updated_at);
            connection.last_connected_at = new Date(connection.last_connected_at);
            return connection;
        });
        return this.connections;
    }

    /**
     * Retrieves cached connections.
     */
    getConnections()
    {
        return this.connections;
    }

    /**
     * Tests the provided connection to see if it is valid.
     * @param connection - The connection to test.
     */
    static async testConnection(connection: Connection): Promise<boolean>
    {
        Log.info("Testing connection: ", connection.id);
        const response: boolean = await invoke("test_connection", {options: {...connection, protocol: connection.protocol}});
        Log.debug("Test connection response: ", response);
        return response;
    }

    /**
     * Retrieves a connection by its id.
     * @param id - The id of the connection to retrieve.
     */
    static async getConnectionById(id: number): Promise<Connection>
    {
        Log.info("Getting connection by id: {0}", id);
        try
        {
            const connection: Connection = await invoke("get_connection_by_id", {id: id});
            Log.debug("Connections: ", connection);
            return connection;
        } catch (e)
        {
            Log.error(`Unable to get connection with id of ${id}\nError: `, e);
            return EmptyConnection;
        }
    }

    /**
     * Navigates to the Browser page with the provided connection.
     * @param connection - The connection to navigate to.
     */
    connect(connection: Connection)
    {
        if (connection.id === EmptyConnection.id)
        {
            Log.error(`Cannot connect to an empty connection!`, connection);
            return;
        }

        this.current = connection; // Set the current connection to the provided connection.

        // Update the last connected time for the connection.
        // This is non-blocking and will not wait for a response.
        ConnectionManager.updateConnection(connection);
    }

    /**
     * Sends the provided SSH command to the current connection.
     * If no connection is currently active, an error message will be logged and empty string will be returned.<br>
     * <u><i><b>NOTE:</b> This function will only work with SFTP connections.</i></u>
     * @param command
     */
    async sendCommand(command: string): Promise<string>
    {
        if (!this.isConnected())
        {
            Log.error(`No connection is currently active!`);
            return "";
        }
        try
        {
            return await invoke("send_ssh_command", {command: command, options: {...this.current, protocol: this.current.protocol}});
        } catch (e)
        {
            Log.error("Failed to send command:", e);
            return "";
        }
    }

    /**
     * Lists the contents of the provided directory for the current connection.
     * @param path
     */
    async listDirectory(path: string): Promise<File[]>
    {
        if (!this.isConnected())
        {
            Log.error(`No connection is currently active!`);
            return [];
        }
        try
        {
            let files: File[] = await invoke("list", {path: path, showHidden: true, options: {...this.current, protocol: this.current.protocol}});
            files =  files.filter(i => i.filename !== "." && i.filename !== ".."); // Filter out the current and parent directory.
            files.push(...files)
            files.push(...files)
            return files;
        } catch (e)
        {
            Log.error("Unable to get directory list:", e);
            return [];
        }
    }

}


/**
 * Calculates the time difference between the current date and the provided date.
 * The time difference is returned as a string in the format of "x years y months z days h hours m minutes s seconds".
 * @param date - The date to calculate the time difference from.
 */
export function calculateTimeDifference(date: Date): string
{
    const currentDate = new Date();

    const totalSeconds: number = Math.floor((currentDate.getTime() - date.getTime()) / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
    const remainingDays = days % 30; // Note: Assumes each month is 30 days
    const remainingMonths = months % 12;
    let time: string = "";

    if (years > 0)
        time += `${years}y `;
    if (remainingMonths > 0)
        time += `${remainingMonths}mon `;
    if (remainingDays > 0)
        time += `${remainingDays}d `;
    if (hours > 0)
        time += `${hours}h `;
    if (minutes > 0)
        time += `${minutes}m `;
    if (seconds > 0)
        time += `${seconds}s `;
    return time;
}