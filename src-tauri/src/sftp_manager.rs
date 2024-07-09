use crate::connection_manager::Connection;
use crate::ssh_instance::SSHInstance;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct File {
    pub path: String,
    pub filename: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: u64,
    pub access: u64,
    pub permissions: u32,
    pub owner: u32,
    pub group: u32,
}
#[tauri::command()]
pub fn test_connection(options: Connection) -> bool {
    return match options.protocol {
        0 => { // SFTP
            return match SSHInstance::connect(options) {
                Ok(instance) => {
                    let mut session = instance.session;
                    if let Err(e) = session.handshake() {
                        println!("Error: {:?}", e);
                    }

                    if let Err(error) = session.sftp()
                    {
                        println!("Error: {:?}", error);
                    }

                    if let Some(banner) = session.banner()
                    {
                        println!("Banner: {:?}", banner);
                    }
                    session.authenticated()
                }
                Err(e) => {
                    println!("Error: {:?}", e);
                    false
                }
            }
        }
        1 => { // FTP
            false
        }
        _ => {
            println!("Unknown protocol: {}", options.protocol);
            return false;
        }
    };
}
#[tauri::command()]
pub fn list(path: &str, show_hidden: bool, options: Connection) -> Result<Vec<File>, String> {
    match options.protocol {
        0 => {
            SSHInstance::list_dir(path, show_hidden, options)
        }
        1 => {
            Err("FTP not implemented".to_string())
        }
        _ => {
            Err("Unknown protocol".to_string())
        }
    }
}

#[tauri::command()]
pub fn send_ssh_command(command: &str, options: Connection) -> Result<String, String> {
    match options.protocol {
        0 => {
            SSHInstance::send_ssh_command(command, options)
        }
        1 => {
            Err("FTP not implemented".to_string())
        }
        _ => {
            Err("Unknown protocol".to_string())
        }
    }
}

#[tauri::command()]
pub fn download_file(remote_path: &str, local_path: &str, options: Connection) -> Result<(), String> {
    match options.protocol {
        0 => {
            SSHInstance::download_file(remote_path, local_path, options)
        }
        1 => {
            Err("FTP not implemented".to_string())
        }
        _ => {
            Err("Unknown protocol".to_string())
        }
    }
}
