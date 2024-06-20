use std::env;

use sqlite;

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub struct Connection {
    pub id: i32,
    pub name: String,
    pub host: String,
    pub port: i32,
    pub username: String,
    pub password: String,
    pub private_key: String,
    pub remote_path: String,
    pub local_path: String,
    pub default: bool,
    pub protocol: String,
    pub created_at: String,
    pub updated_at: String,
    pub last_connected_at: String,
}


pub fn initialize() {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        "CREATE TABLE IF NOT EXISTS connections (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `name` TEXT NOT NULL,
                `host` TEXT NOT NULL,
                `port` INTEGER NOT NULL,
                `username` TEXT NOT NULL,
                `password` TEXT NOT NULL,
                `private_key` TEXT NOT NULL,
                `remote_path` TEXT NOT NULL,
                `local_path` TEXT NOT NULL,
                `default` BOOLEAN NOT NULL,
                `protocol` TEXT NOT NULL DEFAULT 'sftp',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `last_connected_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            )",
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn add_connection(connection: Connection) {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &format!(
            "INSERT INTO connections ('name', 'host', 'port', 'username', 'password', 'private_key', 'remote_path', 'local_path', 'default', 'protocol')
                    VALUES ('{}', '{}', {}, '{}', '{}', '{}', '{}', '{}', {}, '{}')",
            connection.name,
            connection.host,
            connection.port,
            connection.username,
            connection.password,
            connection.private_key,
            connection.remote_path,
            connection.local_path,
            connection.default,
            connection.protocol,
        ),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn get_connections() -> Vec<Connection> {
    let mut connections = Vec::new();
    let lite = sqlite::open(get_database_path()).unwrap();
    let mut statement = lite
        .prepare("SELECT * FROM connections")
        .unwrap();

    while let sqlite::State::Row = statement.next().unwrap() {
        let connection = Connection {
            id: statement.read::<i64, usize>(0).unwrap() as i32,
            name: statement.read::<String, usize>(1).unwrap(),
            host: statement.read::<String, usize>(2).unwrap(),
            port: statement.read::<i64, usize>(3).unwrap() as i32,
            username: statement.read::<String, usize>(4).unwrap(),
            password: statement.read::<String, usize>(5).unwrap(),
            private_key: statement.read::<String, usize>(6).unwrap(),
            remote_path: statement.read::<String, usize>(7).unwrap(),
            local_path: statement.read::<String, usize>(8).unwrap(),
            default: statement.read::<i64, usize>(9).unwrap() != 0,
            protocol: statement.read::<String, usize>(10).unwrap(),
            created_at: statement.read::<String, usize>(11).unwrap(),
            updated_at: statement.read::<String, usize>(12).unwrap(),
            last_connected_at: statement.read::<String, usize>(13).unwrap(),
        };
        connections.push(connection);
    }

    connections
}

#[tauri::command]
pub fn update_connection(id: i32, connection: Connection) {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &format!(
            "UPDATE `connections` SET 'name' = '{}', 'host' = '{}', 'port' = {}, 'username' = '{}', 'password' = '{}', 'private_key' = '{}', 'remote_path' = '{}', 'local_path' = '{}', 'default' = {}, 'protocol' = '{}' 'updated_at'={} WHERE id = {}",
            connection.name,
            connection.host,
            connection.port,
            connection.username,
            connection.password,
            connection.private_key,
            connection.remote_path,
            connection.local_path,
            connection.default,
            connection.protocol,
            chrono::Local::now().to_string(),
            id
        ),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn update_join(id: i32, connection: Connection) {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &format!(
            "UPDATE `connections` SET 'last_connected_at' = '{}' WHERE id = {}",
            chrono::Local::now().to_string(),
            id
        ),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn delete_connection(id: i32) {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &format!(
            "DELETE FROM connections WHERE id = '{}'",
            id
        ),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}


fn get_database_path() -> String {
    let exe_path = match env::current_exe() {
        Ok(exe_path) => exe_path,
        Err(e) => {
            eprintln!("Failed to get current exe path: {}", e);
            return "connections.db".to_string();
        }
    };

    let exe_directory = match exe_path.parent() {
        Some(dir) => dir,
        None => {
            eprintln!("Failed to get directory of the exe");
            return "connections.db".to_string();
        }
    };

    return exe_directory.join("connections.db").to_str().unwrap().to_string();
}
