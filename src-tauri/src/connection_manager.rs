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
    pub protocol: i8,
    pub created_at: String,
    pub updated_at: String,
    pub last_connected_at: String,
}

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub enum Protocol {
    Sftp = 0,
    Ftp = 1,
}

impl From<Protocol> for i32 {
    fn from(protocol: Protocol) -> i32 {
        match protocol {
            Protocol::Sftp => 0,
            Protocol::Ftp => 1,
        }
    }
}

impl From<i32> for Protocol {
    fn from(protocol: i32) -> Protocol {
        match protocol {
            0 => Protocol::Sftp,
            1 => Protocol::Ftp,
            _ => Protocol::Sftp,
        }
    }
}


pub fn initialize() -> Result<(), String> {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        "CREATE TABLE IF NOT EXISTS `connections` (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' TEXT NOT NULL,
                'host' TEXT NOT NULL,
                'port' INTEGER NOT NULL,
                'username' TEXT NOT NULL,
                'password' TEXT NOT NULL,
                'private_key' TEXT NOT NULL,
                'remote_path' TEXT NOT NULL,
                'local_path' TEXT NOT NULL,
                'default' BOOLEAN NOT NULL,
                'protocol' TINYINT NOT NULL DEFAULT 0,
                'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                'last_connected_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
    ) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Code: {:?}, Message: {:?}", e.code, e.message))
    }
}

// pub fn create_tmp_connection() {
//     let lite = sqlite::open(get_database_path()).unwrap();
//     match lite.execute(
//         "INSERT INTO `connections` ('name', 'host', 'port', 'username', 'password', 'private_key', 'remote_path', 'local_path', 'default', 'protocol', 'last_connected_at')
//                 VALUES ('Temporary Connection', 'localhost', 22, 'root', '', '', '', '', 0, 0, '2024-06-20 10:30:13.000')",
//     ) {
//         Ok(_) => (),
//         Err(e) => println!("{:?}", e),
//     }
// }

#[tauri::command]
pub fn add_connection(connection: Connection) {
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &format!(
            "INSERT INTO `connections` ('name', 'host', 'port', 'username', 'password', 'private_key', 'remote_path', 'local_path', 'default', 'protocol')
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
            connection.protocol
        ),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn get_connections() -> Result<Vec<Connection>, String> {
    let mut connections = Vec::new();
    let lite = sqlite::open(get_database_path()).map_err(|e| e.to_string())?;
    let mut statement = lite
        .prepare("SELECT * FROM connections ORDER BY last_connected_at DESC")
        .map_err(|e| e.to_string())?;

    while let sqlite::State::Row = statement.next().unwrap() {
        let connection = Connection {
            id: statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get id from database: {:?}", e.to_string()))? as i32,
            name: statement.read::<String, usize>(1).map_err(|e| format!("Failed to get name from database: {:?}", e.to_string()))?,
            host: statement.read::<String, usize>(2).map_err(|e| format!("Failed to get host from database: {:?}", e.to_string()))?,
            port: statement.read::<i64, usize>(3).map_err(|e| format!("Failed to get port from database: {:?}", e.to_string()))? as i32,
            username: statement.read::<String, usize>(4).map_err(|e| format!("Failed to get username from database: {:?}", e.to_string()))?,
            password: statement.read::<String, usize>(5).map_err(|e| format!("Failed to get password from database: {:?}", e.to_string()))?,
            private_key: statement.read::<String, usize>(6).map_err(|e| format!("Failed to get private_key from database: {:?}", e.to_string()))?,
            remote_path: statement.read::<String, usize>(7).map_err(|e| format!("Failed to get remote_path from database: {:?}", e.to_string()))?,
            local_path: statement.read::<String, usize>(8).map_err(|e| format!("Failed to get local_path from database: {:?}", e.to_string()))?,
            default: statement.read::<i64, usize>(9).map_err(|e| format!("Failed to get default from database: {:?}", e.to_string()))? != 0,
            protocol: statement.read::<i64, usize>(10).map_err(|e| format!("Failed to get protocol from database: {:?}", e.to_string()))? as i8,
            created_at: statement.read::<String, usize>(11).map_err(|e| format!("Failed to get created_at from database: {:?}", e.to_string()))?,
            updated_at: statement.read::<String, usize>(12).map_err(|e| format!("Failed to get updated_at from database: {:?}", e.to_string()))?,
            last_connected_at: statement.read::<String, usize>(13).map_err(|e| format!("Failed to get last_connected_at from database: {:?}", e.to_string()))?,
        };
        connections.push(connection);
    }

    Ok(connections)
}

#[tauri::command]
pub fn get_connection_by_id(id: i32) -> Result<Connection, String> {
    let sqlite = sqlite::open(get_database_path()).map_err(|e| e.to_string())?;
    let query = format!("SELECT * FROM connections WHERE id = {} limit 1", id);
    let mut statement = sqlite.prepare(&query).map_err(|e| e.to_string())?;

    if statement.next().map_err(|e| e.to_string())? != sqlite::State::Row {
        return Err(format!("No connection found with id: {}", id));
    }

    Ok(Connection {
        id: statement.read::<i64, usize>(0).map_err(|e| format!("Failed to get id from database: {:?}", e.to_string()))? as i32,
        name: statement.read::<String, usize>(1).map_err(|e| format!("Failed to get name from database: {:?}", e.to_string()))?,
        host: statement.read::<String, usize>(2).map_err(|e| format!("Failed to get host from database: {:?}", e.to_string()))?,
        port: statement.read::<i64, usize>(3).map_err(|e| format!("Failed to get port from database: {:?}", e.to_string()))? as i32,
        username: statement.read::<String, usize>(4).map_err(|e| format!("Failed to get username from database: {:?}", e.to_string()))?,
        password: statement.read::<String, usize>(5).map_err(|e| format!("Failed to get password from database: {:?}", e.to_string()))?,
        private_key: statement.read::<String, usize>(6).map_err(|e| format!("Failed to get private_key from database: {:?}", e.to_string()))?,
        remote_path: statement.read::<String, usize>(7).map_err(|e| format!("Failed to get remote_path from database: {:?}", e.to_string()))?,
        local_path: statement.read::<String, usize>(8).map_err(|e| format!("Failed to get local_path from database: {:?}", e.to_string()))?,
        default: statement.read::<i64, usize>(9).map_err(|e| format!("Failed to get default from database: {:?}", e.to_string()))? != 0,
        protocol: statement.read::<i64, usize>(10).map_err(|e| format!("Failed to get protocol from database: {:?}", e.to_string()))? as i8,
        created_at: statement.read::<String, usize>(11).map_err(|e| format!("Failed to get created_at from database: {:?}", e.to_string()))?,
        updated_at: statement.read::<String, usize>(12).map_err(|e| format!("Failed to get updated_at from database: {:?}", e.to_string()))?,
        last_connected_at: statement.read::<String, usize>(13).map_err(|e| format!("Failed to get last_connected_at from database: {:?}", e.to_string()))?,
    })
}

#[tauri::command]
pub fn update_connection(id: i32, connection: Connection) {
    println!("Updating '{:?}' {:?}", id, connection);
    let lite = sqlite::open(get_database_path()).unwrap();
    let sql = &format!(
        "UPDATE `connections` SET 'name' = '{}', 'host' = '{}', 'port' = {}, 'username' = '{}', 'password' = '{}', 'private_key' = '{}', 'remote_path' = '{}', 'local_path' = '{}', 'default' = {}, 'protocol' = {}, 'updated_at'='{}' WHERE id = {}",
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
    );
    println!("{}", &sql);
    match lite.execute(&sql) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
}

#[tauri::command]
pub fn update_join(id: i32) {
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

#[tauri::command]
pub fn set_default(id: i32)
{
    let lite = sqlite::open(get_database_path()).unwrap();
    match lite.execute(
        &"UPDATE `connections` SET 'default' = 0".to_string(),
    ) {
        Ok(_) => (),
        Err(e) => println!("{:?}", e),
    }
    match lite.execute(
        &format!(
            "UPDATE `connections` SET 'default' = 1 WHERE id = {}",
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
