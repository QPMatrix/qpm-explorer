import { Layout } from '@/components/layout/Layout'
import { Sidebar } from '@/components/layout/Sidebar'
import { PathBar } from '@/components/explorer/PathBar'
import { FileGrid } from '@/components/explorer/FileGrid'
import { ContextMenu } from '@/components/layout/ContextMenu'
import { InputDialog } from '@/components/layout/InputDialog'
import { useExplorer } from './hooks/useExplorer'
import { Loader2 } from 'lucide-react'
import type { FileNode } from '@/types'
import { ReactNode, useState } from 'react'
import { ask, message } from '@tauri-apps/plugin-dialog'

interface ContextMenuOption {
  label: string
  action: () => void | Promise<void>
  danger?: boolean
}

interface InputDialogState {
  title: string
  defaultValue?: string
  onConfirm: (value: string) => void
}

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

  const [inputDialog, setInputDialog] = useState<InputDialogState | null>(null)

  const closeContextMenu = (): void => setContextMenu(null)

  const handleContextMenu = (e: React.MouseEvent, item?: FileNode): void => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  const handleDelete = async (item: FileNode): Promise<void> => {
    const confirmed = await ask(`Are you sure you want to delete "${item.name}"?`, {
      title: 'Confirm Delete',
      kind: 'warning',
    })
    if (confirmed) {
      try {
        await deleteItem(item.name)
      } catch (err) {
        await message(`Failed to delete: ${err}`, {
          title: 'Error',
          kind: 'error',
        })
      }
    }
  }

  const handleRename = async (item: FileNode): Promise<void> => {
    setInputDialog({
      title: 'Rename',
      defaultValue: item.name,
      onConfirm: async (newName: string) => {
        setInputDialog(null)
        if (newName && newName !== item.name) {
          try {
            await renameItem({ oldName: item.name, newName })
          } catch (err) {
            await message(`Failed to rename: ${err}`, {
              title: 'Error',
              kind: 'error',
            })
          }
        }
      },
    })
  }

  const getContextMenuOptions = (): ContextMenuOption[] => {
    if (contextMenu?.item) {
      const item = contextMenu.item
      return [
        ...(item.is_dir ? [{
          label: 'Open',
          action: async () => {
            await openFolder(item.name)
          }
        }] : []),
        { label: 'Rename', action: () => handleRename(item) },
        { label: 'Delete', action: async() => await handleDelete(item), danger: true },
      ]
    }

    return [
      {
        label: 'New Folder',
        action: () => {
          setInputDialog({
            title: 'New Folder',
            onConfirm: async (name: string) => {
              setInputDialog(null)
              console.log('Create folder - got name:', name)
              try {
                console.log('Calling createFolder mutation...')
                await createFolder(name)
                console.log('Folder created successfully')
              } catch (err) {
                console.error('Failed to create folder:', err)
                await message(`Failed to create folder: ${err}`, {
                  title: 'Error',
                  kind: 'error',
                })
              }
            },
          })
        },
      },
      {
        label: 'New File',
        action: () => {
          setInputDialog({
            title: 'New File',
            onConfirm: async (name: string) => {
              setInputDialog(null)
              console.log('Create file - got name:', name)
              try {
                console.log('Calling createFile mutation...')
                await createFile(name)
                console.log('File created successfully')
              } catch (err) {
                console.error('Failed to create file:', err)
                await message(`Failed to create file: ${err}`, {
                  title: 'Error',
                  kind: 'error',
                })
              }
            },
          })
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

        {inputDialog && (
          <InputDialog
            title={inputDialog.title}
            defaultValue={inputDialog.defaultValue}
            onConfirm={inputDialog.onConfirm}
            onCancel={() => setInputDialog(null)}
          />
        )}
      </div>
    </Layout>
  )
}
