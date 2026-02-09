import React, { useEffect, useRef } from 'react'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  options: { label: string; action: () => void; danger?: boolean }[]
}

/**
 * Custom context menu component.
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, options }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div 
      ref={ref}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      {options.map((opt, i) => (
        <div 
          key={i} 
          className={`menu-item ${opt.danger ? 'danger' : ''}`}
          onClick={() => {
            opt.action()
            onClose()
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )
}
