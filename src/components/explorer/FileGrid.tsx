import React from 'react'
import { FileNode } from '../../types'
import { FileItem } from './FileItem'


interface FileGridProps {
  items: FileNode[]
  onOpen: (item: FileNode) => void
  onContextMenu: (e: React.MouseEvent, item: FileNode) => void
}

export const FileGrid: React.FC<FileGridProps> = ({ items, onOpen, onContextMenu }) => {
  if (items.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Empty folder</div>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-4 content-start overflow-y-auto flex-1">
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
