// Prevent console window in addition to Tauri window on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;
mod db;

use std::path::PathBuf;
use std::sync::Mutex;
use rusqlite::Connection;

/// Application state shared across Tauri commands
pub struct AppState {
    pub(crate) current_dir: Mutex<PathBuf>,
    pub(crate) db_conn: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Get data directory and initialize database
    let data_dir = dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("qpm-explorer");
    
    std::fs::create_dir_all(&data_dir).expect("Failed to create data directory");
    let db_path = data_dir.join("favorites.db");
    let conn = db::init_db(&db_path).expect("Failed to initialize database");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState {
            current_dir: Mutex::new(
                dirs::home_dir().unwrap_or_else(|| PathBuf::from("/")),
            ),
            db_conn: Mutex::new(conn),
        })
        .invoke_handler(tauri::generate_handler![
            commands::io::get_current_view,
            commands::io::open_folder,
            commands::io::go_back,
            commands::io::delete_item,
            commands::io::create_folder,
            commands::io::create_file,
            commands::io::rename_item,
            commands::io::search_files,
            commands::system::get_system_paths,
            commands::system::get_all_favorites,
            commands::system::add_new_favorite,
            commands::system::remove_existing_favorite,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}