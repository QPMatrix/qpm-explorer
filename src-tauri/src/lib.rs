mod commands;
mod models;

use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;

// Re-export models for commands to use
pub use models::{AppError, ExplorerView, FileNode};

pub struct AppState {
    pub(crate) current_dir: Mutex<PathBuf>,
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
            commands::io::get_current_view,
            commands::io::open_folder,
            commands::io::go_back,
            commands::io::delete_item,
            commands::io::create_folder,
            commands::io::create_file,
            commands::io::search_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}