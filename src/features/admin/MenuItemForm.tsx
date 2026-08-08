import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Button } from '../../components/Button'
import { api, type MenuItem, type Category } from '../../lib/api'

export function MenuItemForm({ initial, onSubmit, onCancel }: {
  initial?: Partial<MenuItem>
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.admin.categories.getAll(),
  })

  const [nameEn, setNameEn] = useState(initial?.name_en || '')
  const [nameAr, setNameAr] = useState(initial?.name_ar || '')
  const [descEn, setDescEn] = useState(initial?.description_en || '')
  const [descAr, setDescAr] = useState(initial?.description_ar || '')
  const [price, setPrice] = useState(initial?.price ?? 0)
  const [catId, setCatId] = useState(initial?.category_id || '')
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0)
  const [calories, setCalories] = useState(initial?.calories ?? '')
  const [isAvailable, setIsAvailable] = useState(initial?.is_available ?? true)
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false)
  const [isNew, setIsNew] = useState(initial?.is_new ?? false)
  const [isPopular, setIsPopular] = useState(initial?.is_popular ?? false)
  const [isSpicy, setIsSpicy] = useState(initial?.is_spicy ?? false)
  const [loading, setLoading] = useState(false)

  const opts = categories?.map(c => ({ value: c.id, label: c.name_en })) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn || !nameAr || !descEn || !descAr || !price || !catId) return
    setLoading(true)
    try {
      await onSubmit({
        name_en: nameEn, name_ar: nameAr,
        description_en: descEn, description_ar: descAr,
        price: Number(price), category_id: catId,
        sort_order: Number(sortOrder),
        calories: calories ? Number(calories) : null,
        is_available: isAvailable, is_featured: isFeatured,
        is_new: isNew, is_popular: isPopular, is_spicy: isSpicy,
      })
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Name (English)" value={nameEn} onChange={e => setNameEn(e.target.value)} required />
      <Input label="الاسم (العربية)" value={nameAr} onChange={e => setNameAr(e.target.value)} required dir="rtl" />
      <Input label="Description (English)" value={descEn} onChange={e => setDescEn(e.target.value)} required />
      <Input label="الوصف (العربية)" value={descAr} onChange={e => setDescAr(e.target.value)} required dir="rtl" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
        <Input label="Sort" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
      </div>
      <Select label="Category" options={opts} value={catId} onChange={e => setCatId(e.target.value)} required />
      <Input label="Calories" type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="Optional" />
      <div>
        <p className="text-sm font-medium text-text-secondary mb-2">Flags</p>
        <div className="flex flex-wrap gap-3">
          <Checkbox label="Available" checked={isAvailable} onChange={setIsAvailable} />
          <Checkbox label="Featured" checked={isFeatured} onChange={setIsFeatured} />
          <Checkbox label="New" checked={isNew} onChange={setIsNew} />
          <Checkbox label="Popular" checked={isPopular} onChange={setIsPopular} />
          <Checkbox label="Spicy" checked={isSpicy} onChange={setIsSpicy} />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded" />
      <span className="text-sm text-text-secondary">{label}</span>
    </label>
  )
}
