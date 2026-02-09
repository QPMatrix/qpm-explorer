import React from 'react'
import { FileNode } from '../../types'
import { Folder, File, FileCode, FileImage, FileText, FileVideo, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileItemProps {
  item: FileNode
  onOpen: (item: FileNode) => void
  onContextMenu: (e: React.MouseEvent, item: FileNode) => void
}

export const FileItem: React.FC<FileItemProps> = ({ item, onOpen, onContextMenu }) => {
  const getIcon = () => {
    const iconClass = "w-12 h-12"
    if (item.is_dir) return <Folder className={cn(iconClass, "text-yellow-400 fill-yellow-400")} />
    
    const ext = item.name.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <FileImage className={cn(iconClass, "text-yellow-600")} />
      case 'mp4':
      case 'mov':
        return <FileVideo className={cn(iconClass, "text-orange-500")} />
      case 'mp3':
      case 'wav':
        return <Music className={cn(iconClass, "text-purple-600")} />
      case 'txt':
      case 'md':
        return <FileText className={cn(iconClass, "text-gray-500")} />
      case 'js':
      case 'ts':
      case 'rs':
      case 'tsx':
      case 'jsx':
      case 'json':
      case 'toml':
        return <FileCode className={cn(iconClass, "text-blue-500")} />
      default:
        return <File className={cn(iconClass, "text-gray-400")} />
    }
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center p-3 rounded-md cursor-pointer transition-colors border border-transparent",
        "hover:bg-accent hover:text-accent-foreground active:scale-95 duration-100"
      )}
      onDoubleClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <div className="mb-2">
        {getIcon()}
      </div>
      <div className="text-xs text-center break-all line-clamp-2 w-full leading-tight">
        {item.name}
      </div>
    </div>
  )
}
