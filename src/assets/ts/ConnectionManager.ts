import {invoke} from "@tauri-apps/api/tauri";

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
    connections: Connection[] = [];

    constructor()
    {
        this.getConnections().then((connections) =>
        {
            console.log("Connections loaded: ", connections);
        });
    }


    async addConnection(connection: Connection): Promise<void>
    {

        await invoke("add_connection", {connection: {...connection, protocol: connection.protocol}});
    }

    async updateConnection(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            console.error(`Cannot update empty connection!`, connection);
            return;
        }
        console.log("Updating connection:", connection);
        await invoke("update_connection", {id: connection.id, connection: {...connection, protocol: connection.protocol}});
        await this.getConnections();
    }

    async setDefault(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            console.error(`Cannot update empty connection!`, connection);
            return;
        }
        await invoke("set_default", {id: connection.id});
        await this.getConnections();
    }

    async removeConnection(connection: Connection): Promise<void>
    {
        if (connection.id === EmptyConnection.id)
        {
            console.error(`Cannot remove empty connection!`, connection);
            return;
        }
        await invoke("delete_connection", {id: connection.id, connection: connection});
    }

    async getConnections(): Promise<Connection[]>
    {
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

    async testConnection(connection: Connection): Promise<boolean>
    {
        const response: boolean = await invoke("test_connection", {options: {...connection, protocol: connection.protocol}});
        console.log("Test connection response: ", response);
        return response;
    }

    async listDirectory(path: string, connection: Connection): Promise<string[]>
    {
        return await invoke("list", {path: path, options: {...connection, protocol: connection.protocol}});
    }
}

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