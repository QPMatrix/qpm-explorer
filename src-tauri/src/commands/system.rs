use crate::db::Favorite;
use crate::models::AppError;
use crate::AppState;
use serde::Serialize;
use tauri::State;

#[derive(Debug, Serialize, Clone)]
pub struct SystemPath {
    pub label: String,
    pub path: String,
    pub icon: String,
}

/**
 * Get OS-specific system paths (Home, Desktop, Documents, etc.)
 * 
 * @returns Vector of SystemPath items
 * @throws AppError if paths cannot be retrieved
 */
#[tauri::command]
pub fn get_system_paths() -> Result<Vec<SystemPath>, AppError> {
    let mut paths = Vec::new();

    // Home directory
    if let Some(home) = dirs::home_dir() {
        paths.push(SystemPath {
            label: "Home".to_string(),
            path: home.to_string_lossy().to_string(),
            icon: "home".to_string(),
        });
    }

    // Desktop
    if let Some(desktop) = dirs::desktop_dir() {
        paths.push(SystemPath {
            label: "Desktop".to_string(),
            path: desktop.to_string_lossy().to_string(),
            icon: "monitor".to_string(),
        });
    }

    // Documents
    if let Some(documents) = dirs::document_dir() {
        paths.push(SystemPath {
            label: "Documents".to_string(),
            path: documents.to_string_lossy().to_string(),
            icon: "file-text".to_string(),
        });
    }

    // Downloads
    if let Some(downloads) = dirs::download_dir() {
        paths.push(SystemPath {
            label: "Downloads".to_string(),
            path: downloads.to_string_lossy().to_string(),
            icon: "download".to_string(),
        });
    }

    // Pictures
    if let Some(pictures) = dirs::picture_dir() {
        paths.push(SystemPath {
            label: "Pictures".to_string(),
            path: pictures.to_string_lossy().to_string(),
            icon: "image".to_string(),
        });
    }

    // Music
    if let Some(music) = dirs::audio_dir() {
        paths.push(SystemPath {
            label: "Music".to_string(),
            path: music.to_string_lossy().to_string(),
            icon: "music".to_string(),
        });
    }

    // Videos
    if let Some(videos) = dirs::video_dir() {
        paths.push(SystemPath {
            label: "Videos".to_string(),
            path: videos.to_string_lossy().to_string(),
            icon: "video".to_string(),
        });
    }

    Ok(paths)
}

/**
 * Get all favorites from the database
 * 
 * @param state - Application state
 * @returns Vector of Favorite items
 * @throws AppError if database operation fails
 */
#[tauri::command]
pub fn get_all_favorites(state: State<AppState>) -> Result<Vec<Favorite>, AppError> {
    let conn = state.db_conn.lock().unwrap();
    crate::db::get_favorites(&conn).map_err(|e| AppError {
        message: format!("Failed to get favorites: {}", e),
    })
}

/**
 * Add a new favorite to the database
 * 
 * @param path - File system path
 * @param label - Display label
 * @param icon - Icon identifier
 * @param state - Application state
 * @returns Updated list of favorites
 * @throws AppError if database operation fails
 */
#[tauri::command]
pub fn add_new_favorite(
    path: String,
    label: String,
    icon: String,
    state: State<AppState>,
) -> Result<Vec<Favorite>, AppError> {
    let conn = state.db_conn.lock().unwrap();
    crate::db::add_favorite(&conn, &path, &label, &icon).map_err(|e| AppError {
        message: format!("Failed to add favorite: {}", e),
    })?;
    
    crate::db::get_favorites(&conn).map_err(|e| AppError {
        message: format!("Failed to get favorites: {}", e),
    })
}

/**
 * Remove a favorite from the database
 * 
 * @param id - Favorite ID to remove
 * @param state - Application state
 * @returns Updated list of favorites
 * @throws AppError if database operation fails
 */
#[tauri::command]
pub fn remove_existing_favorite(id: i64, state: State<AppState>) -> Result<Vec<Favorite>, AppError> {
    let conn = state.db_conn.lock().unwrap();
    crate::db::remove_favorite(&conn, id).map_err(|e| AppError {
        message: format!("Failed to remove favorite: {}", e),
    })?;
    
    crate::db::get_favorites(&conn).map_err(|e| AppError {
        message: format!("Failed to get favorites: {}", e),
    })
}
