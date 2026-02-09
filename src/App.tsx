import React, { useState, useEffect } from 'react'
import { useFileSystem } from './hooks/useFileSystem'
import { useTheme } from './hooks/useTheme'
import { Header } from './components/layout/Header'
import { FileGrid } from './components/explorer/FileGrid'
import { ContextMenu } from './components/layout/ContextMenu'
import { FileNode } from './types'
import './App.css'

/**
 * Main Application Component.
 */
function App() {
  const { 
    view, 
    loading, 
    refresh, 
    openFolder, 
    goBack, 
    deleteItem, 
    createFolder, 
    createFile,
    searchFiles
  } = useFileSystem()
  
  useTheme() // Initialize theme

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item?: FileNode } | null>(null)
  
  // Close context menu on click elsewhere
  const closeContextMenu = () => setContextMenu(null)

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N for new file (or folder? let's pop up prompt)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleCreateFile()
      }
      // Ctrl+Shift+N for new folder
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'n') {
         e.preventDefault()
         handleCreateFolder()
      }
      // Backspace to go back
      if (e.key === 'Backspace' && document.activeElement?.tagName !== 'INPUT') {
        if (view?.can_go_back) goBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, goBack])

  const handleContextMenu = (e: React.MouseEvent, item: FileNode) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  const handleGridContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (e.target === e.currentTarget) {
        setContextMenu({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:')
    if (name) createFolder(name)
  }

  const handleCreateFile = () => {
    const name = prompt('Enter file name:')
    if (name) createFile(name)
  }

  const handleDelete = (item: FileNode) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteItem(item.name)
    }
  }

  const getContextMenuOptions = () => {
    // If clicked on an item
    if (contextMenu?.item) {
        return [
            { label: 'Open', action: () => openFolder(contextMenu.item!.name) },
            { label: 'Delete', action: () => handleDelete(contextMenu.item!), danger: true }
        ]
    }
    // If clicked on empty space
    return [
        { label: 'New Folder', action: handleCreateFolder },
        { label: 'New File', action: handleCreateFile },
        { label: 'Refresh', action: refresh }
    ]
  }

  return (
    <div className="app-container" onClick={closeContextMenu} onContextMenu={handleGridContextMenu}>
      <Header 
        currentPath={view?.current_path || ''}
        canGoBack={!!view?.can_go_back}
        canGoUp={!!view?.can_go_up}
        onBack={goBack}
        onUp={() => { if(view?.can_go_up) goBack() }} // Determine if "Up" is different from "Back". For now, same action logic on backend usually.
        onRefresh={refresh}
        onSearch={searchFiles}
      />

      {loading && <div className="loading-overlay">Loading...</div>}

      <FileGrid 
        items={view?.items || []}
        onOpen={(item) => openFolder(item.name)}
        onContextMenu={handleContextMenu}
      />

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          options={getContextMenuOptions()}
        />
      )}
    </div>
  )
}

export default App