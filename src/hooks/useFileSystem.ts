import { invoke } from '@tauri-apps/api/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMANDS } from '../constants/commands'
import { ExplorerView } from '../types'

export const useFileSystem = () => {
  const queryClient = useQueryClient()

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

  return {
    view,
    isLoading,
    error,
    openFolder: openFolderMutation.mutateAsync,
    goBack: goBackMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    createFolder: createFolderMutation.mutateAsync,
    createFile: createFileMutation.mutateAsync,
    renameItem: renameItemMutation.mutateAsync,
    navigateToPath: navigateToPathMutation.mutateAsync
  }
}
