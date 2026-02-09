import { useQuery } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { COMMANDS } from '@/constants/commands'
import type { SystemPath, Favorite } from '@/types'
import * as LucideIcons from 'lucide-react'
import { ReactNode } from 'react'

interface SidebarProps {
  onNavigate: (path: string) => void
}

/**
 * Sidebar component that displays system paths and favorites
 * All data comes from the Rust backend
 * 
 * @param props - Component props
 * @param props.onNavigate - Callback when a path is clicked
 * @returns Sidebar component
 */
export function Sidebar({ onNavigate }: SidebarProps): ReactNode {
  const { data: systemPaths } = useQuery({
    queryKey: ['system-paths'],
    queryFn: () => invoke<SystemPath[]>(COMMANDS.GET_SYSTEM_PATHS),
  })

  const { data: favorites, refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => invoke<Favorite[]>(COMMANDS.GET_ALL_FAVORITES),
  })

  const handleRemoveFavorite = async (id: number): Promise<void> => {
    await invoke(COMMANDS.REMOVE_EXISTING_FAVORITE, { id })
    refetchFavorites()
  }

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as Record<string, unknown>)[iconName.charAt(0).toUpperCase() + iconName.slice(1)]
    return Icon && typeof Icon === 'function' ? Icon as React.ComponentType<{ size?: number }> : LucideIcons.Folder
  }

  return (
    <div className="w-56 border-r h-full flex flex-col p-2 space-y-1 bg-muted/30">
      {/* System Paths */}
      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Locations
      </div>
      {systemPaths?.map((path) => {
        const IconComponent = getIcon(path.icon)
        return (
          <Button
            key={path.path}
            variant="ghost"
            className="justify-start gap-2 h-9 px-4 font-normal"
            onClick={() => onNavigate(path.path)}
          >
            <IconComponent size={16} />
            {path.label}
          </Button>
        )
      })}

      {/* Favorites */}
      {favorites && favorites.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
            Favorites
          </div>
          {favorites.map((fav) => {
            const IconComponent = getIcon(fav.icon)
            return (
              <div key={fav.id} className="group relative">
                <Button
                  variant="ghost"
                  className="justify-start gap-2 h-9 px-4 font-normal w-full"
                  onClick={() => onNavigate(fav.path)}
                >
                  <IconComponent size={16} />
                  <span className="truncate flex-1 text-left">{fav.label}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFavorite(fav.id)
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
