import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={`text-left text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="border-b border-border hover:bg-surface transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 text-sm ${col.className || ''}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-2">
        {data.map((item) => (
          <div key={keyExtractor(item)} className="bg-surface border border-border rounded p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1">
                <span className="text-xs text-text-secondary">{col.header}</span>
                <span className="text-sm">{col.render(item)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
