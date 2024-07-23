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
    /// Connects to an SSH server using the given options and returns an `SSHInstance` if successful.
    ///
    /// # Arguments
    ///
    /// * `options` - The connection options specifying the host, port, username, password, and private key.
    ///
    /// # Returns
    ///
    /// * `Result<SSHInstance, String>` - The `SSHInstance` if the connection was successful, otherwise an error message.
    pub fn connect(options: Connection) -> Result<SSHInstance, String> {
		// Log the attempt to establish a connection
        println!("Attempting to create connection using {:?}", options);

		// Attempt to establish a TCP stream to the given host and port
        return match TcpStream::connect(format!("{}:{}", options.host, options.port)) {
            Ok(tcp) => {
				// Try creating a new SSH session
                let mut session = match ssh2::Session::new() {
                    Ok(session) => session,
					Err(e) => return Err(format!("Error creating session: {:?}", e)), // Error in creating the session
                };

				// Set the TCP stream in the SSH session
                session.set_tcp_stream(tcp);

				// Try performing the SSH handshake
                if let Err(e) = session.handshake() {
					// Error in performing the SSH handshake
                    return Err(format!("Error handshaking: {:?}", e));
                }

				// Extracts the private key from `options` and creates a file
                let private_key = SSHInstance::extract_private_key_to_file(&options.private_key);
                let private_key = private_key.as_path();

				// Check if there is a private key provided
                if !options.private_key.is_empty() {
					// If there's also a password provided, use that. If not, set the password to None
                    let password: Option<&str> = if !options.password.is_empty() {
                        Some(&options.password)
                    } else {
                        None
                    };

					// Try authenticating using a public key
                    if session.userauth_pubkey_file(&options.username, None, private_key, password).is_err() {
                        SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                        return Err("Error authenticating with public key".to_string());
                    }

					// Clean up the temporary private key file, regardless of success
                    SSHInstance::cleanup_private_key_file(private_key.to_path_buf());
                } else if session.userauth_password(&options.username, &options.password).is_err() {
					// If no private key is provided, try authenticating using a password
                    return Err("Error authenticating with password".to_string());
                }

				// Try creating a new channel for the session
                let channel = match session.channel_session() {
                    Ok(channel) => channel,
					Err(e) => return Err(format!("Error creating channel: {:?}", e)), // Error creating the channel
                };

				// Return a new SSHInstance
                Ok(SSHInstance {
                    session,
                    channel,
                })
            }
            Err(e) => {
				// Error establishing the TCP connection
                return Err(format!("Error connecting: {:?}", e));
            }
        };
    }

    /// Sends an SSH command to a server and returns the output as a string.
    ///
    /// # Arguments
    ///
    /// * `command` - The command to execute on the server.
    /// * `options` - The SSH connection options.
    ///
    /// # Examples
    ///
    /// ```
    /// use my_ssh_library::send_ssh_command;
    ///
    /// let command = "ls";
    /// let options = Connection {
    ///     hostname: "example.com",
    ///     username: "sshuser",
    ///     password: "sshpassword",
    /// };
    ///
    /// let result = send_ssh_command(command, options);
    /// match result {
    ///     Ok(output) => println!("Command output: {}", output),
    ///     Err(error) => println!("Error: {}", error),
    /// }
    /// ```
    ///
    /// # Returns
    ///
    /// * `Ok(output)` - The output of the executed command as a string.
    /// * `Err(error)` - An error description if there was an error connecting or executing the command.
    pub fn send_ssh_command(command: &str, options: Connection) -> Result<String, String> {
		// Attempt to connect the SSH instance with the given options
        match SSHInstance::connect(options) {
			// If successful, do the following:
            Ok(connection) => {
                let mut channel = connection.channel;
				let mut bytes: Vec<u8> = vec![]; // Create a mutable byte vector

				// Execute the command on the server. Panic if there is an error
                channel.exec(command).unwrap();

				// Read the output of the command to the end and store it in the byte vector. Panic if there is an error
                channel.read_to_end(&mut bytes).unwrap();

				// Convert the byte vector to a string. Panic if there is an error
                let output = String::from_utf8(bytes).unwrap();

				// Return the output as a successful Result
                Ok(output)
            }
			// If there was an error connecting, return an error Result with a description of the error
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }

    /// Lists the files in a directory.
    ///
    /// # Arguments
    ///
    /// * `path` - The path of the directory to list.
    /// * `show_hidden` - Whether or not to show hidden files.
    /// * `options` - The connection options.
    ///
    /// # Returns
    ///
    /// Returns a vector of `File` objects representing the files in the directory.
    ///
    /// # Errors
    ///
    /// Returns an error string if any of the following occur:
    /// - Connection attempt fails.
    /// - SFTP session creation fails.
    /// - Directory opening fails.
    ///
    /// # Example
    ///
    /// ```
    /// use my_library::{list_dir, Connection};
    ///
    /// let options = Connection::new("host", "username", "password");
    /// let result = list_dir("/path/to/directory", true, options);
    /// match result {
    ///     Ok(files) => {
    ///         for file in files {
    ///             println!("{}", file.filename);
    ///         }
    ///     },
    ///     Err(e) => {
    ///         println!("Error: {}", e);
    ///     }
    /// }
    /// ```
    pub fn list_dir(path: &str, show_hidden: bool, options: Connection) -> Result<Vec<File>, String>
    {
		// Connection attempt
        match SSHInstance::connect(options) {
			// If successful connection...
            Ok(connection) => {
                let session = connection.session;
				// ... attempt to create a new SFTP session
                match session.sftp() {
					// If successful SFTP session creation...
                    Ok(sftp) => {
						// ... attempt to open the provided directory
                        match sftp.opendir(Path::new(path)) {
							// If successful directory opening...
                            Ok(mut dir) => {
								// Create a new, empty file vector
                                let mut files: Vec<File> = Vec::new();
								// Read through directory
                                loop {
									// Ignore '.' and '..' directories
                                    if path.eq(".") || path.eq("..") {
                                        continue;
                                    }
									// Read directory
                                    match dir.readdir() {
										// If reading directory is successful...
                                        Ok((buf, stat)) => {
                                            let filename = buf.to_str().unwrap().to_string();
                                            let absolute_path = Path::join(Path::new(path), Path::new(&filename)).to_str().unwrap().to_string();
											// If we are not showing hidden files, ignore files starting with '.'
                                            if !show_hidden && filename.starts_with('.') {
                                                continue;
                                            }
											// Add files to the vector
                                            files.push(File {
		                                        path: absolute_path, // Path of the file
		                                        filename, // Name of the file
		                                        is_dir: stat.is_dir(), // Bool indicating if the file is a directory
		                                        size: stat.size.unwrap(), // Size of the file
		                                        modified: stat.mtime.unwrap(), // Modification time of the file
		                                        access: stat.atime.unwrap(), // Access time of the file
		                                        permissions: stat.perm.unwrap(), // Permissions of the file
		                                        owner: stat.uid.unwrap(), // User ID of the owner
		                                        group: stat.gid.unwrap(), // Group ID of the owner
                                            });
                                        }
										// If there is an error reading the directory, print the error and break
                                        Err(e) => {
                                            println!("Error: {:?}", e);
                                            break;
                                        }
                                    }
                                }
								// Return the file vector if all operations are successful
                                Ok(files)
                            }
							// If there is an error opening the directory, return the error
                            Err(e) => {
                                Err(format!("Error opening directory: {:?}", e))
                            }
                        }
                    }
					// If there is an error creating the SFTP session, return the error
                    Err(e) => {
                        Err(format!("Error creating SFTP session: {:?}", e))
                    }
                }
            }
			// If there is an error connecting, return the error
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }

	/// This function downloads a file from a remote path to a local path.
    ///
    /// # Arguments
    ///
    /// * `remote_path` - The path of the file on the remote server.
    /// * `local_path` - The path of the local file to be created.
    /// * `options` - The connection options for establishing an SSH connection.
    ///
    /// # Returns
    ///
    /// `Result<(), String>` - Returns `Ok` if the download is successful, otherwise returns an error message as `Err`.
    pub fn download_file(remote_path: &str, local_path: &str, options: Connection) -> Result<(), String> {
		// Try to establish connection with the given options
        match SSHInstance::connect(options) {
			// If connection is successful...
            Ok(connection) => {
				let session = connection.session; // Get the session from the connection

				// Try to retrieve the file from the remote path
                match session.scp_recv(Path::new(remote_path)) {
					// If successful retrieval...
                    Ok((mut channel, _)) => {
						// Create a local file at the given local path
                        let mut local_file = std::fs::File::create(local_path).unwrap();

						let mut buffer = [0; 4096]; // Buffer to hold the file data in 4KB chunks

						// Loop to read from the source (remote file) to the local file
                        loop {
                            match channel.read(&mut buffer) {
								// End of file, so break from the loop
                                Ok(0) => {
                                    break;
                                }
								// Read 'n' bytes from source and write to the local file
                                Ok(n) => {
                                    local_file.write_all(&buffer[..n]).unwrap();
                                }
								// If there is an error reading from source, return an error message
                                Err(e) => {
                                    return Err(format!("Error reading remote file: {:?}", e));
                                }
                            }
                        }
						// Return success if no errors encountered
                        Ok(())
                    }
					// If there is an error retrieving the file, return an error message
                    Err(e) => {
                        Err(format!("Error opening remote file: {:?}", e))
                    }
                }
            }
			// If there is an error establishing the connection, return an error message
            Err(e) => {
                Err(format!("Error: {:?}", e))
            }
        }
    }


	/// Extracts the private key to a temporary file.
    ///
    /// # Arguments
    ///
    /// * `private_key` - A string containing the private key.
    ///
    /// # Returns
    ///
    /// Returns a `PathBuf` object representing the path of the private key file.
    ///
    /// # Panics
    ///
    /// Panics if there's an error creating the file or writing to it.
    fn extract_private_key_to_file(private_key: &str) -> PathBuf {
        println!("Extracting private key to file");

		// Get the path for the temporary file
        let binding = env::current_exe().unwrap().parent().unwrap().join(".tmp");
        let filepath = binding.to_str().unwrap();

		// Create a new file at the temporary file path. Panic if there's an error
        let mut file = std::fs::File::create(filepath).unwrap();

		// Write the private key to the file. Panic if there's an error
        file.write_all(private_key.as_bytes()).unwrap();

		// Return the path of the private key file
        PathBuf::from(&filepath)
    }

	/// Deletes a file at the specified path.
    ///
    /// # Arguments
    ///
    /// * `private_key` - The path to the private key file to be deleted.
    ///
    /// # Panics
    ///
    /// This function will panic if there is an error while attempting to remove the file.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// # use std::path::PathBuf;
    /// # fn main() {
    /// #     let private_key = PathBuf::from("path/to/private_key");
    /// cleanup_private_key_file(private_key);
    /// # }
    /// ```
    fn cleanup_private_key_file(private_key: PathBuf) {
		// Attempt to remove the file. Panic if there's an error
        std::fs::remove_file(private_key).unwrap();
    }
}