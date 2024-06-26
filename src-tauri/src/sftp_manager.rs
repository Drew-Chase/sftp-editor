use std::env;
use std::io::Write;
use std::net::TcpStream;
use std::path::{Path, PathBuf};

use ssh2::Session;

use crate::connection_manager::Connection;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct File {
    path: String,
    is_dir: bool,
    size: u64,
    modified: u64,
    permissions: u32,
    owner: u32,
    group: u32,
}

#[tauri::command()]
pub fn test_connection(options: Connection) -> bool {
    return match options.protocol {
        0 => { // SFTP
            let mut session = connect(options);
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
        1 => { // FTP
            false
        }
        _ => {
            println!("Unknown protocol: {}", options.protocol);
            return false;
        }
    };
}

fn connect(options: Connection) -> Session {
    let tcp = TcpStream::connect(format!("{}:{}", options.host, options.port)).unwrap();
    let mut session = Session::new().unwrap();
    session.set_tcp_stream(tcp);
    session.handshake().unwrap();
    if options.private_key != "" {
        let password: Option<&str> =
            if options.password != "" {
                Some(&options.password)
            } else {
                None
            };
        let private_key = extract_private_key_to_file(&options.private_key);
        let private_key = private_key.as_path();

        session.userauth_pubkey_file(&options.username, None, private_key, password).unwrap();
        std::fs::remove_file(private_key).unwrap();
    } else {
        session.userauth_password(&options.username, &options.password).unwrap();
    }

    return session;
}

fn extract_private_key_to_file(private_key: &str) -> PathBuf {
    let binding = env::current_exe().unwrap().parent().unwrap().join(".tmp");
    let filepath = binding.to_str().unwrap();
    let mut file = std::fs::File::create(&filepath).unwrap();
    file.write_all(private_key.as_bytes()).unwrap();
    return PathBuf::from(&filepath);
}
#[tauri::command()]
pub fn list(path: &str, options: Connection) -> Vec<File> {
    let mut files: Vec<File> = Vec::new();
    let session = connect(options);
    let sftp = session.sftp().unwrap();
    match sftp.opendir(Path::new(path)) {
        Ok(mut dir) => {
            loop {
                match dir.readdir() {
                    Ok((path, stat)) => {
                        files.push(File {
                            path: path.to_str().unwrap().to_string(),
                            is_dir: stat.is_dir(),
                            size: stat.size.unwrap(),
                            modified: stat.mtime.unwrap(),
                            permissions: stat.perm.unwrap(),
                            owner: stat.uid.unwrap(),
                            group: stat.gid.unwrap(),
                        });
                    }
                    Err(e) => {
                        println!("Error: {:?}", e);
                        break;
                    }
                }
            }
        }
        Err(e) => {
            println!("Error: {:?}", e);
        }
    }
    return files;
}
// pub fn download(remote_path: &str, local_path: &str, options: Connection) -> bool {}
//
// pub fn upload(local_path: &str, remote_path: &str, options: Connection) -> bool {}

