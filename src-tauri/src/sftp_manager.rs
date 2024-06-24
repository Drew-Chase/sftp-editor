use std::net::TcpStream;

use ssh2::Session;

use crate::connection_manager::{Connection, Protocol};

#[tauri::command()]
pub fn test_connection(options: Connection) -> bool {
    match options.protocol {
        Protocol::Sftp => {
            let tcp = TcpStream::connect(format!("{}:{}", options.host, options.port)).unwrap();
            let mut session = Session::new().unwrap();
            session.set_tcp_stream(tcp);
            session.handshake().unwrap();
            if (options.private_key != "") {
                let password: Option<&str> =
                    if options.password != "" {
                        Some(&options.password)
                    } else {
                        None
                    };

                session.userauth_pubkey_memory(&options.username, None, &options.private_key, password).unwrap();
            } else {
                session.userauth_password(&options.username, &options.password).unwrap();
            }
        }
        Protocol::Ftp => {}
    }

    return false;
}

// pub fn list(path: &str, options: Connection) -> Vec<String> {}
//
// pub fn download(remote_path: &str, local_path: &str, options: Connection) -> bool {}
//
// pub fn upload(local_path: &str, remote_path: &str, options: Connection) -> bool {}

