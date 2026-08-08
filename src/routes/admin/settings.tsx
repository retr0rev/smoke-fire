import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api, type Restaurant } from '../../lib/api'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

const settingsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  address_en: z.string().optional(),
  address_ar: z.string().optional(),
  google_maps_url: z.string().url().optional().or(z.literal('')),
  currency: z.string().min(1),
})

type SettingsData = z.infer<typeof settingsSchema>

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: restaurant } = useQuery<Restaurant>({ queryKey: ['restaurant'], queryFn: () => api.restaurant.get() })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    values: restaurant ? {
      name: restaurant.name, phone: restaurant.phone || '', whatsapp: restaurant.whatsapp || '',
      email: restaurant.email || '', description_en: restaurant.description_en || '', description_ar: restaurant.description_ar || '',
      address_en: restaurant.address_en || '', address_ar: restaurant.address_ar || '',
      google_maps_url: restaurant.google_maps_url || '', currency: restaurant.currency,
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: SettingsData) => api.admin.settings.update(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['restaurant'] }); showToast('Settings saved') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  return (
    <>
      <SEOHead title="Settings" description="Restaurant Settings" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.settings')}</h1>
        <form onSubmit={handleSubmit((data) => mutation.mutateAsync(data))} className="max-w-2xl space-y-4">
          <Input label="Restaurant Name" {...register('name')} error={errors.name?.message} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone" {...register('phone')} />
            <Input label="WhatsApp" {...register('whatsapp')} />
          </div>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Description (English)" {...register('description_en')} />
          <Input label="الوصف (العربية)" {...register('description_ar')} />
          <Input label="Address (English)" {...register('address_en')} />
          <Input label="العنوان (العربية)" {...register('address_ar')} />
          <Input label="Google Maps URL" {...register('google_maps_url')} />
          <Input label="Currency" {...register('currency')} placeholder="SAR" />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : t('common.save')}</Button>
        </form>
      </div>
    </>
  )
}
