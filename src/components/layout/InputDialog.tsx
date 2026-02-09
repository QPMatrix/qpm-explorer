import { ReactElement, useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface InputDialogProps {
  title: string
  defaultValue?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

/**
 * Custom input dialog component
 * 
 * @param props - Component props
 * @param props.title - Dialog title
 * @param props.defaultValue - Default input value
 * @param props.onConfirm - Callback when user confirms
 * @param props.onCancel - Callback when user cancels
 * @returns InputDialog component
 */
export function InputDialog({ title, defaultValue = '', onConfirm, onCancel }: InputDialogProps): ReactElement {
  const [value, setValue] = useState<string>(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (value.trim()) {
      onConfirm(value.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div
        className="bg-background border border-border rounded-lg shadow-lg p-6 min-w-[400px]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-4"
            placeholder="Enter name..."
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!value.trim()}>
              OK
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
