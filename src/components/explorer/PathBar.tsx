import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronRight, Home, RotateCw } from 'lucide-react'

interface PathBarProps {
  path: string
  onNavigate: (path: string) => void
  onRefresh: () => void
}

export const PathBar: React.FC<PathBarProps> = ({ path, onNavigate, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempPath, setTempPath] = useState(path)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTempPath(path)
  }, [path])

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        onNavigate(tempPath)
        setIsEditing(false)
    }
    if (e.key === 'Escape') {
        setTempPath(path)
        setIsEditing(false)
    }
  }

  // Split path for breadcrumbs
  const parts = path.split('/').filter(Boolean)
  // Reconstruct path for each part (naive implementation for Unix-like, might need adjustment for Windows)
  const getPathForIndex = (index: number) => '/' + parts.slice(0, index + 1).join('/')

  return (
    <div className="flex items-center gap-2 w-full bg-background border rounded-md px-2 py-1 shadow-sm">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onNavigate('/')}>
        <Home size={16} />
      </Button>

      <div className="flex-1 flex items-center overflow-hidden h-8">
        {isEditing ? (
          <Input 
            ref={inputRef}
            value={tempPath}
            onChange={(e) => setTempPath(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { setIsEditing(false); setTempPath(path) }}
            className="h-8 border-none shadow-none focus-visible:ring-0 px-1 font-mono text-sm"
          />
        ) : (
          <div 
            className="flex items-center w-full h-full cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {parts.length === 0 && <span className="text-muted-foreground text-sm mx-1">/</span>}
            {parts.map((part, i) => (
              <div key={i} className="flex items-center text-sm">
                <span className="hover:bg-accent hover:text-accent-foreground px-1 rounded cursor-pointer"
                      onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(getPathForIndex(i));
                      }}
                >
                    {part}
                </span>
                {i < parts.length - 1 && <ChevronRight size={14} className="text-muted-foreground mx-0.5" />}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onRefresh}>
          <RotateCw size={14} />
      </Button>
    </div>
  )
}
