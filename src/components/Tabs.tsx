import { useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  items: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ items, active, onChange }: TabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-2">
      {items.map((item) => (
        <button
          key={item.id}
          ref={item.id === active ? activeRef : undefined}
          onClick={() => onChange(item.id)}
          className={`shrink-0 h-12 px-4 text-sm font-medium border-b-2 transition-colors ${
            item.id === active
              ? 'border-orange text-orange'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
