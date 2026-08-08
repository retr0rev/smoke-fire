import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import type { Category } from '../../lib/api'

const categorySchema = z.object({
  name_en: z.string().min(1, 'Required'),
  name_ar: z.string().min(1, 'مطلوب'),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  initial?: Partial<Category>
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_en: initial?.name_en || '',
      name_ar: initial?.name_ar || '',
      description_en: initial?.description_en || '',
      description_ar: initial?.description_ar || '',
      slug: initial?.slug || '',
      sort_order: initial?.sort_order || 0,
      is_active: initial?.is_active ?? true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name (English)" {...register('name_en')} error={errors.name_en?.message} />
        <Input label="الاسم (العربية)" {...register('name_ar')} error={errors.name_ar?.message} dir="rtl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Description (English)" {...register('description_en')} />
        <Input label="الوصف (العربية)" {...register('description_ar')} dir="rtl" />
      </div>
      <Input label="Slug" {...register('slug')} error={errors.slug?.message} placeholder="burgers" />
      <Input label="Sort Order" type="number" {...register('sort_order')} error={errors.sort_order?.message} />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('is_active')} className="rounded" />
        <span className="text-sm text-text-secondary">Active</span>
      </label>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
