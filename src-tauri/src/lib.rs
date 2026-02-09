mod models;

use std::sync::Mutex;
use std::path::PathBuf;
use tauri::{State,Manager};
use models::{ExplorerView,FileNode,AppError};
use std::fs;

pub struct AppState {
    current_dir: Mutex<PathBuf>,
}
/// Reads the directory at `path` and returns an ExplorerView.
fn read_directory(path: &PathBuf) -> Result<ExplorerView, AppError> {
    let mut items = Vec::new();

    // Read directory content
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let meta = entry.metadata()?;
            items.push(FileNode {
                name: entry.file_name().to_string_lossy().to_string(),
                is_dir: meta.is_dir(),
                size: meta.len(),
            });
        }
    }

    // Sort: Directories first, then alphabetical
    items.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name))
    });

    // Check if we can go back (parent exists)
    let can_go_back = path.parent().is_some();

    Ok(ExplorerView {
        current_path: path.to_string_lossy().to_string(),
        items,
        can_go_back,
        can_go_forward: false,
        can_go_up: can_go_back,
    })
}
#[tauri::command]
fn get_current_view(state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    read_directory(&path)
    
}
/// 2. Open a folder by name (Relative to current path)
#[tauri::command]
fn open_folder(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let mut path = state.current_dir.lock().unwrap();
    let new_path = path.join(name);

    if new_path.is_dir() {
        *path = new_path;
        read_directory(&path)
    } else {
        Err(AppError { message: "Not a directory".into() })
    }
}

/// 3. Go back one level
#[tauri::command]
fn go_back(state: State<AppState>) -> Result<ExplorerView, AppError> {
    let mut path = state.current_dir.lock().unwrap();
    if let Some(parent) = path.parent() {
        *path = parent.to_path_buf();
    }
    read_directory(&path)
}

/// 4. Delete an item by name
#[tauri::command]
fn delete_item(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let target = path.join(name);

    if target.is_dir() {
        fs::remove_dir_all(target)?;
    } else {
        fs::remove_file(target)?;
    }

    read_directory(&path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Default starting path (User's Home or Root)
    let start_path = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/"));

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            current_dir: Mutex::new(start_path),
        })
        .invoke_handler(tauri::generate_handler![
            get_current_view,
            open_folder,
            go_back,
            delete_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}