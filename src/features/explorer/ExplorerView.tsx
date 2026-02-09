import { Layout } from '@/components/layout/Layout'
import { Sidebar } from '@/components/layout/Sidebar'
import { PathBar } from '@/components/explorer/PathBar'
import { FileGrid } from '@/components/explorer/FileGrid'
import { ContextMenu } from '@/components/layout/ContextMenu'
import { useExplorer } from './hooks/useExplorer'
import { Loader2 } from 'lucide-react'
import type { FileNode } from '@/types'
import { ReactNode } from 'react'

/**
 * Main explorer view component
 * Orchestrates file browsing experience
 * 
 * @returns Explorer view component
 */
export function ExplorerView():ReactNode {
  const {
    view,
    isLoading,
    error,
    contextMenu,
    setContextMenu,
    openFolder,
    deleteItem,
    createFolder,
    createFile,
    renameItem,
    navigateToPath,
    refresh,
  } = useExplorer()

  const closeContextMenu = (): void => setContextMenu(null)

  const handleContextMenu = (e: React.MouseEvent, item?: FileNode): void => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  const handleDelete = async (item: FileNode): Promise<void> => {
    if (confirm(`Delete ${item.name}?`)) {
      await deleteItem(item.name)
    }
  }

  const handleRename = async (item: FileNode): Promise<void> => {
    const newName = prompt('New name:', item.name)
    if (newName && newName !== item.name) {
      await renameItem({ oldName: item.name, newName })
    }
  }

  const getContextMenuOptions = () => {
    if (contextMenu?.item) {
      const item = contextMenu.item
      return [
        { label: 'Open', action: () => item.is_dir && openFolder(item.name) },
        { label: 'Rename', action: () => handleRename(item) },
        { label: 'Delete', action: () => handleDelete(item), danger: true },
      ].filter((opt) => opt.action)
    }

    return [
      {
        label: 'New Folder',
        action: () => {
          const name = prompt('Folder name:')
          if (name) createFolder(name)
        },
      },
      {
        label: 'New File',
        action: () => {
          const name = prompt('File name:')
          if (name) createFile(name)
        },
      },
      { label: 'Refresh', action: refresh },
    ]
  }

  return (
    <Layout sidebar={<Sidebar onNavigate={navigateToPath} />}>
      <div className="flex flex-col h-full bg-background" onClick={closeContextMenu} onContextMenu={(e) => handleContextMenu(e)}>
        {/* Header */}
        <div className="border-b p-2 flex items-center gap-2 bg-muted/20">
          <PathBar path={view?.current_path || ''} onNavigate={navigateToPath} onRefresh={refresh} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
              <Loader2 className="animate-spin" /> Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive p-4 text-center">
              Error: {error instanceof Error ? error.message : String(error)}
            </div>
          ) : (
            <FileGrid
              items={view?.items || []}
              onOpen={(item) => openFolder(item.name)}
              onContextMenu={(e, item) => {
                e.stopPropagation()
                handleContextMenu(e, item)
              }}
            />
          )}
        </div>

        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu} options={getContextMenuOptions()} />
        )}
      </div>
    </Layout>
  )
}
