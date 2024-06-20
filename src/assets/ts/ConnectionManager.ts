import {invoke} from "@tauri-apps/api/tauri";

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
    protocol: string,
    created_at: Date,
    updated_at: Date,
    last_connected_at: Date,
}

export default class ConnectionManager
{
    connections: Connection[] = [];

    __constructor()
    {
        this.getConnections().then((connections) =>
        {
            console.log("Connections loaded: ", connections);
        });
    }

    async addConnection(connection: Connection): Promise<void>
    {
        await invoke("add_connection", {connection});
    }

    async removeConnection(connection: Connection): Promise<void>
    {
        await invoke("remove_connection", {id: connection.id, connection: connection});
    }

    async getConnections(): Promise<Connection[]>
    {
        this.connections = await invoke("get_connections") as Connection[];
        return this.connections;
    }
}