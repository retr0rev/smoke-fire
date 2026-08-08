import { useRef, useState } from 'react'
import { Button } from './Button'

interface ImageUploadProps {
  currentUrl?: string | null
  onUpload: (file: File) => Promise<string>
  onRemove?: () => void
  label?: string
}

export function ImageUpload({ currentUrl, onUpload, onRemove, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      setPreview(url)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-text-secondary">{label}</p>}
      {preview ? (
        <div className="relative aspect-video bg-surface border border-border rounded overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => inputRef.current?.click()}>Change</Button>
            {onRemove && <Button size="sm" variant="ghost" onClick={handleRemove} className="!text-error">Remove</Button>}
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 aspect-video bg-surface border-2 border-dashed rounded cursor-pointer transition-colors ${dragOver ? 'border-orange bg-orange/5' : 'border-border hover:border-text-disabled'} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
        >
          <span className="text-2xl text-text-disabled">{uploading ? '...' : '+'}</span>
          <span className="text-sm text-text-secondary">{uploading ? 'Uploading...' : 'Click or drop image'}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
