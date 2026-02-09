use rusqlite::{Connection, Result};
use std::path::PathBuf;
use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Favorite {
    pub id: i64,
    pub path: String,
    pub label: String,
    pub icon: String,
}

/**
 * Initialize the favorites database
 * 
 * @param db_path - Path to the SQLite database file
 * @returns Result with Connection or error
 */
pub fn init_db(db_path: &PathBuf) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    
    conn.execute(
        "CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL UNIQUE,
            label TEXT NOT NULL,
            icon TEXT NOT NULL
        )",
        [],
    )?;
    
    Ok(conn)
}

/**
 * Get all favorites from the database
 * 
 * @param conn - SQLite database connection
 * @returns Vector of Favorite items
 */
pub fn get_favorites(conn: &Connection) -> Result<Vec<Favorite>> {
    let mut stmt = conn.prepare("SELECT id, path, label, icon FROM favorites ORDER BY label")?;
    let favorites = stmt.query_map([], |row| {
        Ok(Favorite {
            id: row.get(0)?,
            path: row.get(1)?,
            label: row.get(2)?,
            icon: row.get(3)?,
        })
    })?;
    
    favorites.collect()
}

/**
 * Add a favorite to the database
 * 
 * @param conn - SQLite database connection
 * @param path - File system path
 * @param label - Display label
 * @param icon - Icon identifier
 * @returns Result indicating success or failure
 */
pub fn add_favorite(conn: &Connection, path: &str, label: &str, icon: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO favorites (path, label, icon) VALUES (?1, ?2, ?3)",
        [path, label, icon],
    )?;
    Ok(())
}

/**
 * Remove a favorite from the database
 *  
 * @param conn - SQLite database connection
 * @param id - Favorite ID to remove
 * @returns Result indicating success or failure
 */
pub fn remove_favorite(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM favorites WHERE id = ?1", [id])?;
    Ok(())
}
