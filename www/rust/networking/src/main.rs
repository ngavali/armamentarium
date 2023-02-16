use libc;
use std::{
    collections::HashMap,
    io::{Read, Write},
    net::{TcpListener, TcpStream},
    os::fd::{AsRawFd, RawFd},
    thread::{self, JoinHandle, ThreadId},
};

const BACKEND_ADDR: &str = "www.google.com:443";

struct ProxyServer {
    listener: TcpListener,
    fd_hash_map: HashMap<RawFd, RawFd>,
    thread_pool: Vec<JoinHandle<()>>,
}

impl ProxyServer {
    fn new(bind_addr: &str) -> Self {
        let listener = match TcpListener::bind(bind_addr) {
            Ok(listener) => listener,
            Err(error) => panic!("Couldn't bind to address {}. Error -> {}", bind_addr, error),
        };
        println!("Listening on {} for incoming client_streams", bind_addr);
        ProxyServer {
            listener,
            fd_hash_map: HashMap::new(),
            thread_pool: Vec::new(),
        }
    }

    fn start(&self) {
        let ep_fd = unsafe { libc::epoll_create1(0) };
        for client_stream in self.listener.incoming() {
            match client_stream {
                Ok(client_stream) => {
                    let ep_fd_clone = ep_fd.clone();
                    thread::spawn(move || {
                        let mut connection = Connection::new(ep_fd_clone, client_stream);
                        connection.handle_client_stream();
                        drop(connection);
                    });
                }
                Err(err) => println!("Failed to accept client_stream {}", err),
            }
        }
    }
}

struct Connection {
    epoll_fd: RawFd,
    client: TcpStream,
    backend: TcpStream,
}

fn data_mover(tpid: ThreadId, in_stream: &mut TcpStream, out_stream: &mut TcpStream) -> bool {
    let mut buf: [u8; 1024] = [0; 1024];
    match in_stream.read(&mut buf) {
        Ok(0) => {
            println!("[{:?}] Connection closed", tpid);
            return false;
        }
        Ok(bytes_read) => {
            println!("[{:?}] Data: {:?}", tpid, bytes_read);
            match out_stream.write(&buf[..bytes_read]) {
                Ok(res) => {
                    println!("[{:?}] Written {} bytes", tpid, res,);
                    return true;
                }
                Err(err) => {
                    println!("[{:?}] Write failed. Error -> {}", tpid, err);
                    return false;
                }
            };
        }
        Err(err) => {
            println!("[{:?}] Read failed. Error -> {}", tpid, err);
            return false;
        }
    }
}

impl Connection {
    fn new(ep_fd: RawFd, client_stream: TcpStream) -> Connection {
        let backend_stream = TcpStream::connect(BACKEND_ADDR).expect("Couln't connect to Backend.");
        backend_stream
            .set_nonblocking(true)
            .expect("Couldn't set backend_stream to NonBlocking.");
        Connection {
            epoll_fd: ep_fd,
            client: client_stream,
            backend: backend_stream,
        }
    }

    fn handle_client_stream(&mut self) {
        let tpid = thread::current().id();
        println!("[{:?}] Connected to {:?}", tpid, self.client);

        let flags = (libc::EPOLLIN) as u32;
        //let flags = libc::EPOLLONESHOT | libc::EPOLLIN;

        let client_epoll_event = &mut libc::epoll_event {
            events: flags as u32,
            u64: self.client.as_raw_fd() as u64,
        };
        let backend_epoll_event = &mut libc::epoll_event {
            events: flags as u32,
            u64: self.backend.as_raw_fd() as u64,
        };

        let mut events: Vec<libc::epoll_event> = Vec::with_capacity(200);
        let mut connected = true;
        let mut timeout = 100; //default 100ms
        let mut res: i32;
        let mut errno = 0;
        unsafe {
            libc::epoll_ctl(
                self.epoll_fd,
                libc::EPOLL_CTL_ADD,
                self.client.as_raw_fd(),
                client_epoll_event,
            );
            libc::epoll_ctl(
                self.epoll_fd,
                libc::EPOLL_CTL_ADD,
                self.backend.as_raw_fd(),
                backend_epoll_event,
            );
        }

        let error_flags = libc::EINTR | libc::EAGAIN;

        while connected && (errno & error_flags != 0 || errno == 0) {
            events.clear();
            res = unsafe {
                let res = libc::epoll_wait(
                    self.epoll_fd,
                    events.as_mut_ptr() as *mut libc::epoll_event,
                    200,
                    timeout,
                );
                errno = std::io::Error::last_os_error().raw_os_error().unwrap();
                res
            };

            println!(
                "[{:?}] Start... ep_fd:{} , res:{}, Error:#{}:{{{}}}",
                tpid,
                self.epoll_fd,
                res,
                errno,
                std::io::Error::last_os_error().to_string()
            );
            if res >= 0 {
                unsafe {
                    events.set_len(res as usize);
                }
                if events.len() > 0 {
                    println!("[{:?}] Ready events count -> {:?}", tpid, events.len());
                    for event in events.iter() {
                        if event.u64 == self.backend.as_raw_fd() as u64 {
                            println!("[{:?}] Ready event fd# -> {:?}", tpid, event.u64 as u64);
                            connected = data_mover(tpid, &mut self.backend, &mut self.client);
                        }
                        if event.u64 == self.client.as_raw_fd() as u64 {
                            println!("[{:?}] Ready event fd# -> {:?}", tpid, event.u64 as u64);
                            connected = data_mover(tpid, &mut self.client, &mut self.backend);
                        }
                    }
                    timeout = 100;
                } else {
                    timeout += 1000; //add 1 second
                }
            } else {
                println!("[{:?}] Something went wrong!!! RES -> {}", tpid, res);
            }
        }
        unsafe {
            libc::epoll_ctl(
                self.epoll_fd,
                libc::EPOLL_CTL_DEL,
                self.client.as_raw_fd(),
                client_epoll_event,
            );
            libc::epoll_ctl(
                self.epoll_fd,
                libc::EPOLL_CTL_DEL,
                self.backend.as_raw_fd(),
                backend_epoll_event,
            );
        }
        println!("[{:?}] Completed...", tpid);
    }
}

fn main() {
    fn handler(signal: libc::c_int) {
        println!("Recived signal -> {}", signal);
    }
    unsafe {
        libc::signal(libc::SIGUSR1, handler as usize);
    }
    let bind_addr = "0.0.0.0:3306";
    let proxy_server = ProxyServer::new(bind_addr);
    proxy_server.start();
}
