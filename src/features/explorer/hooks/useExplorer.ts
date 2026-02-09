import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMANDS } from '@/constants/commands'
import type { ExplorerView, FileNode } from '@/types'

/**
 * Custom hook for file system operations
 * 
 * @returns File system state and operations
 */
export function useExplorer() {
  const queryClient = useQueryClient()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item?: FileNode } | null>(null)

  const { data: view, isLoading, error } = useQuery({
    queryKey: ['explorer-view'],
    queryFn: () => invoke<ExplorerView>(COMMANDS.GET_CURRENT_VIEW),
  })

  // Mutations
  const openFolderMutation = useMutation({
    mutationFn: (name: string) => invoke<ExplorerView>(COMMANDS.OPEN_FOLDER, { name }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const goBackMutation = useMutation({
    mutationFn: () => invoke<ExplorerView>(COMMANDS.GO_BACK),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const deleteItemMutation = useMutation({
    mutationFn: (name: string) => invoke<ExplorerView>(COMMANDS.DELETE_ITEM, { name }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => invoke<ExplorerView>(COMMANDS.CREATE_FOLDER, { name }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const createFileMutation = useMutation({
    mutationFn: (name: string) => invoke<ExplorerView>(COMMANDS.CREATE_FILE, { name }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const renameItemMutation = useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) =>
      invoke<ExplorerView>(COMMANDS.RENAME_ITEM, { oldName, newName }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  const navigateToPathMutation = useMutation({
    mutationFn: (path: string) => invoke<ExplorerView>(COMMANDS.OPEN_FOLDER, { name: path }),
    onSuccess: (data: ExplorerView) => queryClient.setQueryData(['explorer-view'], data),
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (document.activeElement?.tagName === 'INPUT') return

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        const name = prompt('Enter file name:')
        if (name) createFileMutation.mutate(name)
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        const name = prompt('Enter folder name:')
        if (name) createFolderMutation.mutate(name)
      }

      if (e.key === 'Backspace') {
        if (view?.can_go_back) goBackMutation.mutate()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, createFileMutation, createFolderMutation, goBackMutation])

  return {
    view,
    isLoading,
    error,
    contextMenu,
    setContextMenu,
    openFolder: openFolderMutation.mutateAsync,
    goBack: goBackMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    createFolder: createFolderMutation.mutateAsync,
    createFile: createFileMutation.mutateAsync,
    renameItem: renameItemMutation.mutateAsync,
    navigateToPath: navigateToPathMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['explorer-view'] }),
  }
}
