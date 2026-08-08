import { useState } from 'react'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import type { Category } from '../../lib/api'

interface CategoryFormProps {
  initial?: Partial<Category>
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [nameEn, setNameEn] = useState(initial?.name_en || '')
  const [nameAr, setNameAr] = useState(initial?.name_ar || '')
  const [descEn] = useState(initial?.description_en || '')
  const [descAr] = useState(initial?.description_ar || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0)
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn || !nameAr || !slug) return
    setLoading(true)
    try {
      await onSubmit({ name_en: nameEn, name_ar: nameAr, description_en: descEn, description_ar: descAr, slug, sort_order: Number(sortOrder), is_active: isActive })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Name (English)" value={nameEn} onChange={e => setNameEn(e.target.value)} required />
      <Input label="الاسم (العربية)" value={nameAr} onChange={e => setNameAr(e.target.value)} required dir="rtl" />
      <Input label="Slug" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="burgers" />
      <Input label="Sort Order" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded" />
        <span className="text-sm text-text-secondary">Active</span>
      </label>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}
