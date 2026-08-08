use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem, MasterPty};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::{Arc, Mutex, OnceLock};
use std::thread;
use tauri::{Emitter, Runtime};

pub struct TerminalHistory {
    pub bytes: Vec<u8>,
    pub total_read: usize,
}

pub struct TerminalSession {
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    master: Arc<Mutex<Box<dyn MasterPty + Send>>>,
    history: Arc<Mutex<TerminalHistory>>,
    child: Arc<Mutex<Box<dyn portable_pty::Child + Send>>>,
}

fn kill_process_tree(pid: u32) {
    #[cfg(windows)]
    {
        let _ = std::process::Command::new("taskkill")
            .args(["/F", "/T", "/PID", &pid.to_string()])
            .output();
    }
    #[cfg(not(windows))]
    {
        let _ = std::process::Command::new("pkill")
            .args(["-9", "-P", &pid.to_string()])
            .output();
    }
}

impl Drop for TerminalSession {
    fn drop(&mut self) {
        if let Ok(mut child) = self.child.lock() {
            if let Some(pid) = child.process_id() {
                kill_process_tree(pid);
            }
            let _ = child.kill();
        }
    }
}

type SessionMap = Arc<Mutex<HashMap<String, TerminalSession>>>;

fn sessions() -> &'static SessionMap {
    static SESSIONS: OnceLock<SessionMap> = OnceLock::new();
    SESSIONS.get_or_init(|| Arc::new(Mutex::new(HashMap::new())))
}

const MAX_HISTORY_BYTES: usize = 100_000;

#[derive(Clone, serde::Serialize)]
pub struct TerminalEventPayload {
    pub offset: usize,
    pub data: String,
}

#[derive(serde::Serialize)]
pub struct TerminalHistoryInfo {
    pub history: String,
    pub total_read: usize,
}

#[tauri::command]
pub fn create_terminal<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    cols: u16,
    rows: u16,
    cwd: Option<String>,
) -> Result<bool, String> {
    let mut sessions_guard = sessions().lock().map_err(|e| e.to_string())?;

    let mut cols = cols;
    let mut rows = rows;
    if cols == 0 {
        cols = 80;
    }
    if rows == 0 {
        rows = 24;
    }

    if sessions_guard.contains_key(&id) {
        // Re-use existing session, just trigger a resize to be sure
        if let Some(session) = sessions_guard.get(&id) {
            if let Ok(master) = session.master.lock() {
                let _ = master.resize(PtySize {
                    rows,
                    cols,
                    pixel_width: 0,
                    pixel_height: 0,
                });
            }
        }
        return Ok(false); // Reused
    }

    let pty_system = NativePtySystem::default();
    let pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| format!("Failed to open PTY: {}", e))?;

    let mut cmd = CommandBuilder::new_default_prog();
    if let Some(ref path) = cwd {
        if !path.trim().is_empty() {
            cmd.cwd(path);
        }
    }

    let child = pair.slave
        .spawn_command(cmd)
        .map_err(|e| format!("Failed to spawn shell: {}", e))?;

    // Drop the slave side to avoid holding resources open in this process
    drop(pair.slave);

    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    let reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;

    let history = Arc::new(Mutex::new(TerminalHistory {
        bytes: Vec::new(),
        total_read: 0,
    }));
    let shared_history = Arc::clone(&history);
    let session_id = id.clone();
    let app_handle = app.clone();

    // Spawn stdout/stderr reader thread
    thread::spawn(move || {
        let mut buf = [0u8; 4096];
        let mut reader = reader;
        loop {
            match reader.read(&mut buf) {
                Ok(n) if n > 0 => {
                    let data = &buf[..n];
                    
                    if let Ok(mut hist) = shared_history.lock() {
                        let offset = hist.total_read;
                        hist.bytes.extend_from_slice(data);
                        hist.total_read += n;
                        if hist.bytes.len() > MAX_HISTORY_BYTES {
                            let drain_amt = hist.bytes.len() - MAX_HISTORY_BYTES;
                            hist.bytes.drain(0..drain_amt);
                        }

                        // Emit event to frontend with offset
                        let text = String::from_utf8_lossy(data).to_string();
                        let payload = TerminalEventPayload {
                            offset,
                            data: text,
                        };
                        let event_name = format!("terminal-stdout-{}", session_id);
                        let _ = app_handle.emit(&event_name, payload);
                    }
                }
                _ => {
                    // Shell exited or error reading
                    break;
                }
            }
        }

        // Clean up session automatically when the reader thread finishes
        if let Ok(mut sessions_guard) = sessions().lock() {
            sessions_guard.remove(&session_id);
        }
    });

    let session = TerminalSession {
        writer: Arc::new(Mutex::new(writer)),
        master: Arc::new(Mutex::new(pair.master)),
        history: Arc::clone(&history),
        child: Arc::new(Mutex::new(child)),
    };

    sessions_guard.insert(id, session);

    // Wait up to 400ms for full initial shell prompt output to be read into history
    for _ in 0..16 {
        thread::sleep(std::time::Duration::from_millis(25));
        if let Ok(hist) = history.lock() {
            if !hist.bytes.is_empty() {
                let text = String::from_utf8_lossy(&hist.bytes);
                if text.contains('>') || text.contains('$') || text.contains('%') || hist.bytes.len() > 120 {
                    break;
                }
            }
        }
    }

    Ok(true) // New session
}

#[tauri::command]
pub fn write_terminal(id: String, data: String) -> Result<(), String> {
    let sessions_guard = sessions().lock().map_err(|e| e.to_string())?;
    if let Some(session) = sessions_guard.get(&id) {
        let mut writer = session.writer.lock().map_err(|e| e.to_string())?;
        writer
            .write_all(data.as_bytes())
            .map_err(|e| format!("Failed to write to terminal: {}", e))?;
        writer.flush().map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[tauri::command]
pub fn resize_terminal(id: String, cols: u16, rows: u16) -> Result<(), String> {
    if cols == 0 || rows == 0 {
        return Ok(()); // Ignore invalid resize events to avoid conhost freezes
    }
    let sessions_guard = sessions().lock().map_err(|e| e.to_string())?;
    if let Some(session) = sessions_guard.get(&id) {
        let master = session.master.lock().map_err(|e| e.to_string())?;
        master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| format!("Failed to resize PTY: {}", e))?;
        Ok(())
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[tauri::command]
pub fn get_terminal_history(id: String) -> Result<TerminalHistoryInfo, String> {
    let sessions_guard = sessions().lock().map_err(|e| e.to_string())?;
    if let Some(session) = sessions_guard.get(&id) {
        let history = session.history.lock().map_err(|e| e.to_string())?;
        Ok(TerminalHistoryInfo {
            history: String::from_utf8_lossy(&history.bytes).to_string(),
            total_read: history.total_read,
        })
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[tauri::command]
pub fn close_terminal(id: String) -> Result<(), String> {
    let mut sessions_guard = sessions().lock().map_err(|e| e.to_string())?;
    if sessions_guard.remove(&id).is_some() {
        // Drop implementation handles process killing
        Ok(())
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[cfg(windows)]
fn has_child_processes(parent_pid: u32) -> bool {
    use std::ffi::c_void;
    use std::mem;

    type HANDLE = *mut c_void;
    type BOOL = i32;
    type DWORD = u32;
    type UlongPtr = usize;

    const TH32CS_SNAPPROCESS: DWORD = 0x00000002;
    const INVALID_HANDLE_VALUE: HANDLE = -1isize as HANDLE;
    const MAX_PATH: usize = 260;

    #[repr(C)]
    #[allow(non_snake_case)]
    struct PROCESSENTRY32W {
        dwSize: DWORD,
        cntUsage: DWORD,
        th32ProcessID: DWORD,
        th32DefaultHeapID: UlongPtr,
        th32ModuleID: DWORD,
        cntThreads: DWORD,
        th32ParentProcessID: DWORD,
        pcPriClassBase: i32,
        dwFlags: DWORD,
        szExeFile: [u16; MAX_PATH],
    }

    extern "system" {
        fn CreateToolhelp32Snapshot(dwFlags: DWORD, th32ProcessID: DWORD) -> HANDLE;
        fn Process32FirstW(hSnapshot: HANDLE, lppe: *mut PROCESSENTRY32W) -> BOOL;
        fn Process32NextW(hSnapshot: HANDLE, lppe: *mut PROCESSENTRY32W) -> BOOL;
        fn CloseHandle(hObject: HANDLE) -> BOOL;
    }

    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if snapshot == INVALID_HANDLE_VALUE {
            return false;
        }

        let mut entry: PROCESSENTRY32W = mem::zeroed();
        entry.dwSize = mem::size_of::<PROCESSENTRY32W>() as DWORD;

        let mut found_active = false;
        if Process32FirstW(snapshot, &mut entry) != 0 {
            loop {
                if entry.th32ParentProcessID == parent_pid && entry.th32ProcessID != parent_pid {
                    let len = entry
                        .szExeFile
                        .iter()
                        .position(|&c| c == 0)
                        .unwrap_or(entry.szExeFile.len());
                    let exe_name = String::from_utf16_lossy(&entry.szExeFile[..len]).to_lowercase();

                    if !exe_name.contains("conhost")
                        && !exe_name.contains("openconsole")
                        && !exe_name.contains("conpty")
                    {
                        found_active = true;
                        break;
                    }
                }
                if Process32NextW(snapshot, &mut entry) == 0 {
                    break;
                }
            }
        }

        CloseHandle(snapshot);
        found_active
    }
}

#[cfg(not(windows))]
fn has_child_processes(parent_pid: u32) -> bool {
    let output = std::process::Command::new("pgrep")
        .arg("-P")
        .arg(parent_pid.to_string())
        .output();
    if let Ok(out) = output {
        !out.stdout.is_empty()
    } else {
        false
    }
}

#[tauri::command]
pub fn is_terminal_busy(id: String) -> Result<bool, String> {
    let sessions_guard = sessions().lock().map_err(|e| e.to_string())?;
    if let Some(session) = sessions_guard.get(&id) {
        if let Ok(child) = session.child.lock() {
            if let Some(pid) = child.process_id() {
                return Ok(has_child_processes(pid));
            }
        }
    }
    Ok(false)
}

#[tauri::command]
pub fn reset_terminal<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    cols: u16,
    rows: u16,
    cwd: Option<String>,
) -> Result<TerminalHistoryInfo, String> {
    let mut sessions_guard = sessions().lock().map_err(|e| e.to_string())?;

    if let Some(old_session) = sessions_guard.remove(&id) {
        if let Ok(mut child) = old_session.child.lock() {
            let _ = child.kill();
        }
    }

    let mut cols = cols;
    let mut rows = rows;
    if cols == 0 {
        cols = 80;
    }
    if rows == 0 {
        rows = 24;
    }

    let pty_system = NativePtySystem::default();
    let pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| format!("Failed to open PTY: {}", e))?;

    let mut cmd = CommandBuilder::new_default_prog();
    if let Some(ref path) = cwd {
        if !path.trim().is_empty() {
            cmd.cwd(path);
        }
    }

    let child = pair.slave
        .spawn_command(cmd)
        .map_err(|e| format!("Failed to spawn shell: {}", e))?;

    drop(pair.slave);

    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    let reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;

    let history = Arc::new(Mutex::new(TerminalHistory {
        bytes: Vec::new(),
        total_read: 0,
    }));
    let shared_history = Arc::clone(&history);
    let session_id = id.clone();
    let app_handle = app.clone();

    thread::spawn(move || {
        let mut buf = [0u8; 4096];
        let mut reader = reader;
        loop {
            match reader.read(&mut buf) {
                Ok(n) if n > 0 => {
                    let data = &buf[..n];
                    if let Ok(mut hist) = shared_history.lock() {
                        let offset = hist.total_read;
                        hist.bytes.extend_from_slice(data);
                        hist.total_read += n;
                        if hist.bytes.len() > MAX_HISTORY_BYTES {
                            let drain_amt = hist.bytes.len() - MAX_HISTORY_BYTES;
                            hist.bytes.drain(0..drain_amt);
                        }

                        let text = String::from_utf8_lossy(data).to_string();
                        let payload = TerminalEventPayload {
                            offset,
                            data: text,
                        };
                        let event_name = format!("terminal-stdout-{}", session_id);
                        let _ = app_handle.emit(&event_name, payload);
                    }
                }
                _ => {
                    break;
                }
            }
        }

        if let Ok(mut sessions_guard) = sessions().lock() {
            sessions_guard.remove(&session_id);
        }
    });

    let session = TerminalSession {
        writer: Arc::new(Mutex::new(writer)),
        master: Arc::new(Mutex::new(pair.master)),
        history: Arc::clone(&history),
        child: Arc::new(Mutex::new(child)),
    };

    sessions_guard.insert(id, session);

    // Wait up to 500ms for initial shell prompt output to be read into history
    for _ in 0..20 {
        thread::sleep(std::time::Duration::from_millis(25));
        if let Ok(hist) = history.lock() {
            if !hist.bytes.is_empty() {
                return Ok(TerminalHistoryInfo {
                    history: String::from_utf8_lossy(&hist.bytes).to_string(),
                    total_read: hist.total_read,
                });
            }
        }
    }

    Ok(TerminalHistoryInfo {
        history: String::new(),
        total_read: 0,
    })
}



