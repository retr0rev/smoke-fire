import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api, type Social } from '../../lib/api'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/socials')({
  component: SocialsPage,
})

function SocialsPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: socials } = useQuery<Social[]>({ queryKey: ['admin', 'socials'], queryFn: () => api.admin.socials.getAll() })
  const [formData, setFormData] = useState<Record<string, { url: string; enabled: boolean }>>({})

  if (socials && Object.keys(formData).length === 0) {
    const init: Record<string, { url: string; enabled: boolean }> = {}
    socials.forEach((s) => { init[s.platform] = { url: s.url, enabled: s.is_enabled } })
    setFormData(init)
  }

  const mutation = useMutation({
    mutationFn: (data: any[]) => api.admin.socials.update(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'socials'] }); queryClient.invalidateQueries({ queryKey: ['socials'] }); showToast('Socials saved') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const handleSave = () => {
    const data = socials!.map((s) => ({ ...s, url: formData[s.platform]?.url || s.url, is_enabled: formData[s.platform]?.enabled ?? s.is_enabled }))
    mutation.mutate(data)
  }

  if (!socials || Object.keys(formData).length === 0) return null

  return (
    <>
      <SEOHead title="Social Media" description="Manage Social Media" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.socials')}</h1>
        <div className="max-w-xl space-y-4">
          {socials.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="w-24 text-sm text-text-secondary capitalize">{s.platform}</span>
              <Input className="flex-1" value={formData[s.platform]?.url || ''} onChange={(e) => setFormData({ ...formData, [s.platform]: { ...formData[s.platform], url: e.target.value } })} />
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData[s.platform]?.enabled ?? false} onChange={(e) => setFormData({ ...formData, [s.platform]: { ...formData[s.platform], enabled: e.target.checked } })} className="rounded" />
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
