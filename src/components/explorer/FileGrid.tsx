import React from 'react'
import { FileNode } from '../../types'
import { FileItem } from './FileItem'

interface FileGridProps {
  items: FileNode[]
  onOpen: (item: FileNode) => void
  onContextMenu: (e: React.MouseEvent, item: FileNode) => void
}

/**
 * Grid view of file items.
 */
export const FileGrid: React.FC<FileGridProps> = ({ items, onOpen, onContextMenu }) => {
  if (items.length === 0) {
    return <div className="empty-state">No items found</div>
  }

  return (
    <div className="file-grid">
      {items.map((item) => (
        <FileItem 
          key={item.name} 
          item={item} 
          onOpen={onOpen}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  )
}
