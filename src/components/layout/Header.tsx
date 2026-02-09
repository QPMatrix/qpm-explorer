import React from 'react'
import { ArrowLeft, ArrowUp, RotateCw, Search } from 'lucide-react'

interface HeaderProps {
  currentPath: string
  canGoBack: boolean
  canGoUp: boolean
  onBack: () => void
  onUp: () => void
  onRefresh: () => void
  onSearch: (query: string) => void
}

/**
 * Application header with navigation and search.
 */
export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  canGoBack, 
  canGoUp, 
  onBack, 
  onUp, 
  onRefresh, 
  onSearch 
}) => {
  return (
    <header className="app-header">
      <div className="nav-controls">
        <button className="icon-btn" onClick={onBack} disabled={!canGoBack} title="Back">
          <ArrowLeft size={18} />
        </button>
        <button className="icon-btn" onClick={onUp} disabled={!canGoUp} title="Up">
          <ArrowUp size={18} />
        </button>
        <button className="icon-btn" onClick={onRefresh} title="Refresh">
          <RotateCw size={18} />
        </button>
      </div>

      <div className="path-bar">
        <span>{currentPath}</span>
      </div>

      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  )
}
