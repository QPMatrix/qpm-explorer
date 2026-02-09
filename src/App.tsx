import React, { useEffect, useState } from 'react'
import { ExplorerView, FileNode } from './types'
import { rustApi } from './api'
type Nullable<T> = T | null
const App = () => {
  const [view, setView] = useState<Nullable<ExplorerView>>(null)
  const [error, setError] = useState<string>("")
  useEffect(() => {
    rustApi.getCurrentView().then(setView).catch(setError)
  }, [])
  const handleOpen = async (item: FileNode) => {
    if (!item.is_dir) return
    try {
      const data = await rustApi.openFolder(item.name)
      setView(data)
    } catch {
      setError("Error opening folder")
    }
  }
  const handleBack = async () => {
    try {
      const data = await rustApi.back()
      setView(data)
    }  catch{
      setError("Cannot go back");
    }
  }
  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    if (confirm(`Delete ${name}`)) {
      try {
        const data = await rustApi.delete(name)
        setView(data);
      } catch {
        setError("Failed to delete");
      }
    }
  }
  if (!view) {
    return <div className="loading">Loading System...</div>;
  }
  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <button onClick={handleBack} disabled={!view.can_go_back}>
          ⬅ Back
        </button>
        <div className="path-bar">{view.current_path}</div>
      </div>

      {/* ERROR DISPLAY */}
      {error && <div className="error">{error}</div>}

      {/* FILE GRID */}
      <div className="grid">
        {view.items.map((item) => (
          <div
            key={item.name}
            className={`file-item ${item.is_dir ? "folder" : "file"}`}
            onClick={() => handleOpen(item)}
          >
            <div className="icon">{item.is_dir ? "📁" : "📄"}</div>
            <div className="name">{item.name}</div>
            
            <button 
                className="delete-btn"
                onClick={(e) => handleDelete(e, item.name)}
            >
                ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App