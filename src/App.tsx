import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFileSystem } from '@/hooks/useFileSystem'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/layout/Layout'
import { Sidebar } from '@/components/layout/Sidebar'
import { PathBar } from '@/components/explorer/PathBar'
import { FileGrid } from '@/components/explorer/FileGrid'
import { ContextMenu } from '@/components/layout/ContextMenu'
import { FileNode } from '@/types'
import { Loader2 } from 'lucide-react'

const queryClient = new QueryClient()

function Explorer() {
    const { 
        view, 
        isLoading, 
        error, 
        openFolder, 
        goBack, 
        deleteItem, 
        createFolder, 
        createFile,
        renameItem,
        navigateToPath 
    } = useFileSystem()
    
    useTheme()
    
    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item?: FileNode } | null>(null)
    
    // Close context menu on click elsewhere
    const closeContextMenu = () => setContextMenu(null)

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             // Avoid shortcuts if input is focused
            if (document.activeElement?.tagName === 'INPUT') return

            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault()
                handleCreateFile()
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'n') {
                 e.preventDefault()
                 handleCreateFolder()
            }
            if (e.key === 'Backspace') {
                if (view?.can_go_back) goBack()
            }
        }
    
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [view, goBack])

    const handleContextMenu = (e: React.MouseEvent, item?: FileNode) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY, item })
    }

    const handleCreateFolder = async () => {
        const name = prompt('Enter folder name:')
        if (name) await createFolder(name)
    }
    
    const handleCreateFile = async () => {
        const name = prompt('Enter file name:')
        if (name) await createFile(name)
    }

    const handleDelete = async (item: FileNode) => {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            await deleteItem(item.name)
        }
    }

    const handleRename = async (item: FileNode) => {
        const newName = prompt('Enter new name:', item.name)
        if (newName && newName !== item.name) {
            await renameItem({ oldName: item.name, newName })
        }
    }

    const getContextMenuOptions = () => {
        if (contextMenu?.item) {
            return [
                { label: 'Open', action: () => openFolder(contextMenu.item!.name) },
                { label: 'Rename', action: () => handleRename(contextMenu.item!) },
                { label: 'Delete', action: () => handleDelete(contextMenu.item!), danger: true }
            ]
        }
        return [
            { label: 'New Folder', action: handleCreateFolder },
            { label: 'New File', action: handleCreateFile },
            { label: 'Refresh', action: () => queryClient.invalidateQueries({ queryKey: ['explorer-view'] }) }
        ]
    }

    return (
        <Layout 
            sidebar={<Sidebar onNavigate={navigateToPath} />}
        >
            <div 
                className="flex flex-col h-full bg-background" 
                onClick={closeContextMenu}
                onContextMenu={(e) => handleContextMenu(e)}
            >
                {/* Header Area */}
                <div className="border-b p-2 flex items-center gap-2 bg-muted/20">
                    <PathBar 
                        path={view?.current_path || ''} 
                        onNavigate={navigateToPath}
                        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['explorer-view'] })}
                    />
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
                                e.stopPropagation();
                                handleContextMenu(e, item)
                            }}
                        />
                    )}
                </div>

                {contextMenu && (
                    <ContextMenu 
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={closeContextMenu}
                        options={getContextMenuOptions()}
                    />
                )}
            </div>
        </Layout>
    )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Explorer />
    </QueryClientProvider>
  )
}

export default App