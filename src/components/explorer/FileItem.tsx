import React from 'react'
import { FileNode } from '../../types'
import { Folder, File, FileCode, FileImage, FileText, FileVideo, Music } from 'lucide-react'

interface FileItemProps {
  item: FileNode
  onOpen: (item: FileNode) => void
  onContextMenu: (e: React.MouseEvent, item: FileNode) => void
}

/**
 * Component representing a single file or folder.
 */
export const FileItem: React.FC<FileItemProps> = ({ item, onOpen, onContextMenu }) => {
  const getIcon = () => {
    if (item.is_dir) return <Folder className="icon folder-icon" />
    
    const ext = item.name.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <FileImage className="icon image-icon" />
      case 'mp4':
      case 'mov':
        return <FileVideo className="icon video-icon" />
      case 'mp3':
      case 'wav':
        return <Music className="icon music-icon" />
      case 'txt':
      case 'md':
        return <FileText className="icon text-icon" />
      case 'js':
      case 'ts':
      case 'rs':
      case 'tsx':
      case 'jsx':
      case 'json':
      case 'toml':
        return <FileCode className="icon code-icon" />
      default:
        return <File className="icon file-icon" />
    }
  }

  return (
    <div 
      className="file-item"
      onDoubleClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <div className="file-icon-wrapper">
        {getIcon()}
      </div>
      <div className="file-name" title={item.name}>
        {item.name}
      </div>
      <div className="file-size">
        {item.is_dir ? '-' : formatSize(item.size)}
      </div>
    </div>
  )
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
