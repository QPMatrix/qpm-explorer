import { useEffect, useRef } from 'react'

interface ContextMenuOption {
  label: string
  action: () => void
  danger?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  options: ContextMenuOption[]
}

/**
 * Custom context menu component
 * 
 * @param props - Component props
 * @param props.x - X position
 * @param props.y - Y position
 * @param props.onClose - Close callback
 * @param props.options - Menu options
 * @returns ContextMenu component
 */
export function ContextMenu({ x, y, onClose, options }: ContextMenuProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
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
      className="fixed bg-popover border border-border rounded-md shadow-lg py-1 min-w-[180px] z-50"
      style={{ top: y, left: x }}
    >
      {options.map((opt, i) => (
        <button
          key={i}
          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
            opt.danger ? 'text-destructive hover:text-destructive' : ''
          }`}
          onClick={() => {
            opt.action()
            onClose()
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
