import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Button } from '../../components/Button'
import { useQuery } from '@tanstack/react-query'
import { api, type MenuItem, type Category } from '../../lib/api'

const menuItemSchema = z.object({
  name_en: z.string().min(1, 'Required'),
  name_ar: z.string().min(1, 'مطلوب'),
  description_en: z.string().min(1, 'Required'),
  description_ar: z.string().min(1, 'مطلوب'),
  price: z.coerce.number().positive('Must be positive'),
  category_id: z.string().uuid('Select a category'),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_popular: z.boolean(),
  is_spicy: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
  calories: z.coerce.number().int().positive().optional().or(z.literal('')),
})

type MenuItemFormData = z.infer<typeof menuItemSchema>

interface MenuItemFormProps {
  initial?: Partial<MenuItem>
  onSubmit: (data: MenuItemFormData) => Promise<void>
  onCancel: () => void
}

export function MenuItemForm({ initial, onSubmit, onCancel }: MenuItemFormProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.admin.categories.getAll(),
  })

  const categoryOptions = categories?.map((c) => ({ value: c.id, label: c.name_en })) || []

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name_en: initial?.name_en || '',
      name_ar: initial?.name_ar || '',
      description_en: initial?.description_en || '',
      description_ar: initial?.description_ar || '',
      price: initial?.price || 0,
      category_id: initial?.category_id || '',
      is_available: initial?.is_available ?? true,
      is_featured: initial?.is_featured ?? false,
      is_new: initial?.is_new ?? false,
      is_popular: initial?.is_popular ?? false,
      is_spicy: initial?.is_spicy ?? false,
      sort_order: initial?.sort_order || 0,
      calories: initial?.calories || ('' as any),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name (English)" {...register('name_en')} error={errors.name_en?.message} />
        <Input label="الاسم (العربية)" {...register('name_ar')} error={errors.name_ar?.message} dir="rtl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Description (English)" {...register('description_en')} error={errors.description_en?.message} />
        <Input label="الوصف (العربية)" {...register('description_ar')} error={errors.description_ar?.message} dir="rtl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Price" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
        <Select label="Category" options={categoryOptions} {...register('category_id')} error={errors.category_id?.message} />
        <Input label="Sort Order" type="number" {...register('sort_order')} error={errors.sort_order?.message} />
      </div>
      <Input label="Calories (optional)" type="number" {...register('calories')} />
      <div>
        <p className="text-sm font-medium text-text-secondary mb-2">Flags</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" {...register('is_available')} className="rounded" /><span className="text-sm text-text-secondary">Available</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('is_featured')} className="rounded" /><span className="text-sm text-text-secondary">Featured</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('is_new')} className="rounded" /><span className="text-sm text-text-secondary">New</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('is_popular')} className="rounded" /><span className="text-sm text-text-secondary">Popular</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('is_spicy')} className="rounded" /><span className="text-sm text-text-secondary">Spicy</span></label>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
