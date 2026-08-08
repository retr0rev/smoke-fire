import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-elevated border border-border rounded p-6 shadow-2xl">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading text-text-primary">{title}</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl leading-none">&times;</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
