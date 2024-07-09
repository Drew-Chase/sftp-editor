use std::env;
use std::io::Write;
use std::net::TcpStream;
use std::path::PathBuf;
use ssh2::Session;
use crate::connection_manager::Connection;

struct SSHInstance {
    session: ssh2::Session,
    channel: ssh2::Channel,
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
                if let Err(e) = session.set_tcp_stream(tcp) {
                    return Err(format!("Error setting TCP stream: {:?}", e));
                }
                if let Err(e) = session.handshake() {
                    return Err(format!("Error handshaking: {:?}", e));
                }

                let private_key = SSHInstance::extract_private_key_to_file(&options.private_key);
                let private_key = private_key.as_path();

                if options.private_key != "" {
                    let password: Option<&str> = if options.password != "" {
                        Some(&options.password)
                    } else {
                        None
                    };
                    if (session.userauth_pubkey_file(&options.username, None, private_key, password).is_err()) {
                        SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                        return Err("Error authenticating with public key".to_string());
                    }
                    SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                } else {
                    if (session.userauth_password(&options.username, &options.password).is_err()) {
                        return Err("Error authenticating with password".to_string());
                    }
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


    fn extract_private_key_to_file(private_key: &str) -> PathBuf {
        println!("Extracting private key to file");
        let binding = env::current_exe().unwrap().parent().unwrap().join(".tmp");
        let filepath = binding.to_str().unwrap();
        let mut file = std::fs::File::create(&filepath).unwrap();
        file.write_all(private_key.as_bytes()).unwrap();
        return PathBuf::from(&filepath);
    }
    fn cleanup_private_key_file(private_key: PathBuf) {
        std::fs::remove_file(private_key).unwrap();
    }
}