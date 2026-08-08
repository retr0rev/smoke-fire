import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api, type OpeningHour } from '../../lib/api'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const Route = createFileRoute('/admin/hours')({
  component: HoursPage,
})

function HoursPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: hours } = useQuery<OpeningHour[]>({ queryKey: ['admin', 'hours'], queryFn: () => api.admin.hours.getAll() })
  const [formData, setFormData] = useState<Record<number, { open: string; close: string; closed: boolean }>>({})

  if (hours && Object.keys(formData).length === 0) {
    const init: Record<number, any> = {}
    hours.forEach((h) => { init[h.day_of_week] = { open: h.open_time?.slice(0, 5) || '', close: h.close_time?.slice(0, 5) || '', closed: h.is_closed } })
    setFormData(init)
  }

  const mutation = useMutation({
    mutationFn: (data: any[]) => api.admin.hours.update(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'hours'] }); queryClient.invalidateQueries({ queryKey: ['openingHours'] }); showToast('Hours saved') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  if (!hours || Object.keys(formData).length === 0) return null

  const handleSave = () => {
    const data = hours.map((h) => ({ ...h, open_time: formData[h.day_of_week]?.closed ? null : (formData[h.day_of_week]?.open || null), close_time: formData[h.day_of_week]?.closed ? null : (formData[h.day_of_week]?.close || null), is_closed: formData[h.day_of_week]?.closed ?? h.is_closed }))
    mutation.mutate(data)
  }

  return (
    <>
      <SEOHead title="Opening Hours" description="Manage Opening Hours" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.hours')}</h1>
        <div className="max-w-lg space-y-3">
          {hours.map((h) => (
            <div key={h.id} className="flex items-center gap-3">
              <span className="w-24 text-sm text-text-secondary">{DAY_NAMES[h.day_of_week]}</span>
              {formData[h.day_of_week]?.closed ? (
                <span className="text-sm text-error flex-1">{t('hours.closed')}</span>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <Input type="time" value={formData[h.day_of_week]?.open || ''} onChange={(e) => setFormData({ ...formData, [h.day_of_week]: { ...formData[h.day_of_week], open: e.target.value } })} className="w-32" />
                  <span className="text-text-disabled">to</span>
                  <Input type="time" value={formData[h.day_of_week]?.close || ''} onChange={(e) => setFormData({ ...formData, [h.day_of_week]: { ...formData[h.day_of_week], close: e.target.value } })} className="w-32" />
                </div>
              )}
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={formData[h.day_of_week]?.closed || false} onChange={(e) => setFormData({ ...formData, [h.day_of_week]: { ...formData[h.day_of_week], closed: e.target.checked } })} className="rounded" />
                <span className="text-xs text-text-secondary">{t('hours.closed')}</span>
              </label>
            </div>
          ))}
          <Button onClick={handleSave} disabled={mutation.isPending}>{t('common.save')}</Button>
        </div>
      </div>
    </>
  )
}
