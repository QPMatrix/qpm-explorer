use crate::models::{AppError, ExplorerView, FileNode};
use crate::AppState;
use std::fs;
use std::path::PathBuf;
use tauri::State;

// ... (existing imports and functions)

/// Reads the directory at `path` and returns an ExplorerView.
///
/// # Arguments
///
/// * `path` - The path to the directory to read.
pub fn read_directory(path: &PathBuf) -> Result<ExplorerView, AppError> {
    let mut items = Vec::new();

    // Read directory content
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(meta) = entry.metadata() {
                items.push(FileNode {
                    name: entry.file_name().to_string_lossy().to_string(),
                    is_dir: meta.is_dir(),
                    size: meta.len(),
                });
            }
        }
    }

    // Sort: Directories first, then alphabetical
    items.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));

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

/// Get the current directory view.
#[tauri::command]
pub fn get_current_view(state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    read_directory(&path)
}

/// Open a folder by name (Relative to current path) OR absolute path.
///
/// # Arguments
///
/// * `name` - The name of the folder to open or absolute path.
#[tauri::command]
pub fn open_folder(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let mut path = state.current_dir.lock().unwrap();
    
    // Check if it's an absolute path
    let new_path = if std::path::Path::new(&name).is_absolute() {
        PathBuf::from(&name)
    } else {
        path.join(&name)
    };

    if new_path.is_dir() {
        *path = new_path;
        read_directory(&path)
    } else {
        Err(AppError {
            message: "Not a directory".into(),
        })
    }
}

/// Go back one level to the parent directory.
#[tauri::command]
pub fn go_back(state: State<AppState>) -> Result<ExplorerView, AppError> {
    let mut path = state.current_dir.lock().unwrap();
    if let Some(parent) = path.parent() {
        *path = parent.to_path_buf();
    }
    read_directory(&path)
}

/// Delete an item by name (file or directory).
///
/// # Arguments
///
/// * `name` - The name of the item to delete.
#[tauri::command]
pub fn delete_item(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let target = path.join(name);

    if target.is_dir() {
        fs::remove_dir_all(target)?;
    } else {
        fs::remove_file(target)?;
    }

    read_directory(&path)
}

/// Create a new folder in the current directory.
///
/// # Arguments
///
/// * `name` - The name of the new folder.
#[tauri::command]
pub fn create_folder(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let target = path.join(name);

    fs::create_dir(target)?;
    read_directory(&path)
}

/// Create a new empty file in the current directory.
///
/// # Arguments
///
/// * `name` - The name of the new file.
#[tauri::command]
pub fn create_file(name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let target = path.join(name);

    fs::File::create(target)?;
    read_directory(&path)
}

/// Rename an item in the current directory.
/// 
/// # Arguments
/// 
/// * `old_name` - The current name of the item.
/// * `new_name` - The new name for the item.
#[tauri::command]
pub fn rename_item(old_name: String, new_name: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let source = path.join(old_name);
    let target = path.join(new_name);

    fs::rename(source, target)?;
    read_directory(&path)
}

/// Search for files in the current directory (simple filter).
///
/// # Arguments
///
/// * `query` - The search query string.
#[tauri::command]
pub fn search_files(query: String, state: State<AppState>) -> Result<ExplorerView, AppError> {
    let path = state.current_dir.lock().unwrap();
    let mut view = read_directory(&path)?;
    
    if !query.is_empty() {
        view.items.retain(|item| item.name.to_lowercase().contains(&query.to_lowercase()));
    }
    
    Ok(view)
}
