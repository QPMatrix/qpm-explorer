import { useState, useEffect, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ExplorerView } from '../types'

/**
 * Hook to manage file system operations.
 * 
 * @returns {Object} File system operations and state.
 */
export const useFileSystem = () => {
  const [view, setView] = useState<ExplorerView | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const fetchView = useCallback(async () => {
    try {
      setLoading(true)
      const data = await invoke<ExplorerView>('get_current_view')
      setView(data)
      setError("")
    } catch (err: any) {
      console.error(err)
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchView()
  }, [fetchView])

  const openFolder = async (name: string) => {
    try {
      const data = await invoke<ExplorerView>('open_folder', { name })
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    }
  }

  const goBack = async () => {
    try {
      const data = await invoke<ExplorerView>('go_back')
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    }
  }

  const deleteItem = async (name: string) => {
    try {
      const data = await invoke<ExplorerView>('delete_item', { name })
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    }
  }

  const createFolder = async (name: string) => {
    try {
      const data = await invoke<ExplorerView>('create_folder', { name })
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    }
  }

  const createFile = async (name: string) => {
    try {
      const data = await invoke<ExplorerView>('create_file', { name })
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    }
  }

  const searchFiles = async (query: string) => {
    try {
      setLoading(true)
      const data = await invoke<ExplorerView>('search_files', { query })
      setView(data)
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }

  return {
    view,
    error,
    loading,
    refresh: fetchView,
    openFolder,
    goBack,
    deleteItem,
    createFolder,
    createFile,
    searchFiles
  }
}
