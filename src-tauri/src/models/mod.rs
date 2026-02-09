use serde::Serialize;

/// Represents a single file or directory.
#[derive(Debug, Serialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub is_dir: bool,
    pub size: u64,
}

/// The "View" we send to the frontend. 
/// It contains everything the UI needs to render the screen.
#[derive(Debug,Serialize,Clone)]
pub struct ExplorerView{
    pub current_path: String,
    pub items: Vec<FileNode>,
    pub can_go_back: bool,
    pub can_go_forward: bool,
    pub can_go_up: bool,
}

/// Standard error for our app
#[derive(Debug, Serialize)]
pub struct AppError {
    pub message: String,
}

impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError { message: error.to_string() }
    }
}