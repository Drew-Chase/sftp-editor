use std::env;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::path::{Path, PathBuf};

use crate::connection_manager::Connection;
use crate::sftp_manager::File;

pub struct SSHInstance {
    pub session: ssh2::Session,
    pub channel: ssh2::Channel,
}


impl SSHInstance {
    pub fn connect(options: Connection) -> Result<SSHInstance, String> {
        println!("Attempting to create connection using {:?}", options);
        return match TcpStream::connect(format!("{}:{}", options.host, options.port)) {
            Ok(tcp) => {
                let mut session = match ssh2::Session::new() {
                    Ok(session) => session,
                    Err(e) => return Err(format!("Error creating session: {:?}", e)),
                };
                session.set_tcp_stream(tcp);
                if let Err(e) = session.handshake() {
                    return Err(format!("Error handshaking: {:?}", e));
                }

                let private_key = SSHInstance::extract_private_key_to_file(&options.private_key);
                let private_key = private_key.as_path();

                if !options.private_key.is_empty() {
                    let password: Option<&str> = if !options.password.is_empty() {
                        Some(&options.password)
                    } else {
                        None
                    };
                    if session.userauth_pubkey_file(&options.username, None, private_key, password).is_err() {
                        SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                        return Err("Error authenticating with public key".to_string());
                    }
                    SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                } else if session.userauth_password(&options.username, &options.password).is_err() {
                    return Err("Error authenticating with password".to_string());
                }
                let channel = match session.channel_session() {
                    Ok(channel) => channel,
                    Err(e) => return Err(format!("Error creating channel: {:?}", e)),
                };
                Ok(SSHInstance {
                    session,
                    channel,
                })
            }
            Err(e) => {
                return Err(format!("Error connecting: {:?}", e));
            }
        };
    }

    pub fn send_ssh_command(command: &str, options: Connection) -> Result<String, String> {
        match SSHInstance::connect(options) {
            Ok(connection) => {
                let mut channel = connection.channel;
                let mut output = String::new();
                channel.exec(command).unwrap();
                channel.read_to_string(&mut output).unwrap();
                Ok(output)
            }
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }

    pub fn list_dir(path: &str, show_hidden: bool, options: Connection) -> Result<Vec<File>, String>
    {
        match SSHInstance::connect(options) {
            Ok(connection) => {
                let session = connection.session;
                match session.sftp() {
                    Ok(sftp) => {
                        match sftp.opendir(Path::new(path)) {
                            Ok(mut dir) => {
                                let mut files: Vec<File> = Vec::new();

                                loop {
                                    if path.eq(".") || path.eq("..") {
                                        continue;
                                    }
                                    match dir.readdir() {
                                        Ok((buf, stat)) => {
                                            let filename = buf.to_str().unwrap().to_string();
                                            let absolute_path = Path::join(Path::new(path), Path::new(&filename)).to_str().unwrap().to_string();
                                            if !show_hidden && filename.starts_with('.') {
                                                continue;
                                            }
                                            files.push(File {
                                                path: absolute_path,
                                                filename,
                                                is_dir: stat.is_dir(),
                                                size: stat.size.unwrap(),
                                                modified: stat.mtime.unwrap(),
                                                access: stat.atime.unwrap(),
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

                                Ok(files)
                            }
                            Err(e) => {
                                Err(format!("Error opening directory: {:?}", e))
                            }
                        }
                    }
                    Err(e) => {
                        Err(format!("Error creating SFTP session: {:?}", e))
                    }
                }
            }
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }

    pub fn download_file(remote_path: &str, local_path: &str, options: Connection) -> Result<(), String> {
        match SSHInstance::connect(options) {
            Ok(connection) => {
                let session = connection.session;
                match session.scp_recv(Path::new(remote_path)) {
                    Ok((mut channel, _)) => {
                        let mut local_file = std::fs::File::create(local_path).unwrap();
                        let mut buffer = [0; 4096]; // This will download the file in 4k chunks
                        loop {
                            match channel.read(&mut buffer) {
                                Ok(0) => {
                                    break;
                                }
                                Ok(n) => {
                                    local_file.write_all(&buffer[..n]).unwrap();
                                }
                                Err(e) => {
                                    return Err(format!("Error reading remote file: {:?}", e));
                                }
                            }
                        }
                        Ok(())
                    }
                    Err(e) => {
                        Err(format!("Error opening remote file: {:?}", e))
                    }
                }
            }
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }


    fn extract_private_key_to_file(private_key: &str) -> PathBuf {
        println!("Extracting private key to file");
        let binding = env::current_exe().unwrap().parent().unwrap().join(".tmp");
        let filepath = binding.to_str().unwrap();
        let mut file = std::fs::File::create(filepath).unwrap();
        file.write_all(private_key.as_bytes()).unwrap();
        PathBuf::from(&filepath)
    }
    fn cleanup_private_key_file(private_key: PathBuf) {
        std::fs::remove_file(private_key).unwrap();
    }
}