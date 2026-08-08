import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api, type Social } from '../../lib/api'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

const ALL_PLATFORMS = ['instagram', 'facebook', 'tiktok', 'whatsapp', 'phone', 'email', 'website'] as const

export const Route = createFileRoute('/admin/socials')({
  component: SocialsPage,
})

function SocialsPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: existing } = useQuery<Social[]>({ queryKey: ['admin', 'socials'], queryFn: () => api.admin.socials.getAll() })

  const [formData, setFormData] = useState<Record<string, { url: string; enabled: boolean }>>({})

  if (existing && Object.keys(formData).length === 0) {
    const init: Record<string, { url: string; enabled: boolean }> = {}
    ALL_PLATFORMS.forEach((p) => {
      const found = existing.find((s) => s.platform === p)
      init[p] = { url: found?.url || '', enabled: found?.is_enabled ?? false }
    })
    setFormData(init)
  }

  const mutation = useMutation({
    mutationFn: (data: any[]) => api.admin.socials.update(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'socials'] }); queryClient.invalidateQueries({ queryKey: ['socials'] }); showToast('Socials saved') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const handleSave = () => {
    const data = ALL_PLATFORMS.map((platform, i) => ({
      ...(existing?.find((s) => s.platform === platform) || {}),
      platform,
      url: formData[platform]?.url || '',
      is_enabled: formData[platform]?.enabled ?? false,
      sort_order: i + 1,
    }))
    mutation.mutate(data)
  }

  if (Object.keys(formData).length === 0) return null

  return (
    <>
      <SEOHead title="Social Media" description="Manage Social Media" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.socials')}</h1>
        <div className="max-w-xl space-y-4">
          {ALL_PLATFORMS.map((platform) => (
            <div key={platform} className="flex items-center gap-3">
              <span className="w-24 text-sm text-text-secondary capitalize">{platform}</span>
              <Input className="flex-1" value={formData[platform]?.url || ''} onChange={(e) => setFormData({ ...formData, [platform]: { ...formData[platform], url: e.target.value } })} placeholder={`${platform} URL`} />
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData[platform]?.enabled ?? false} onChange={(e) => setFormData({ ...formData, [platform]: { ...formData[platform], enabled: e.target.checked } })} className="rounded" />
                <span className="text-xs text-text-secondary">Show</span>
              </label>
            </div>
          ))}
          <Button onClick={handleSave} disabled={mutation.isPending}>{t('common.save')}</Button>
        </div>
      </div>
    </>
  )
}
