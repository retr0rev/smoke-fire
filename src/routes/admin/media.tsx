import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type MediaItem } from '../../lib/api'
import { Button } from '../../components/Button'
import { ImageUpload } from '../../components/ImageUpload'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/media')({
  component: MediaPage,
})

function MediaPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: media } = useQuery<MediaItem[]>({ queryKey: ['admin', 'media'], queryFn: () => api.admin.media.getAll() })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.media.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }); showToast('Deleted') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  return (
    <>
      <SEOHead title="Media" description="Manage Media" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.media')}</h1>
        <div className="mb-8 max-w-md">
          <ImageUpload label="Upload new image" onUpload={async (file) => { const result = await api.admin.media.upload(file); queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }); showToast('Uploaded'); return result.url }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media?.map((m) => (
            <div key={m.id} className="relative group">
              <img src={m.url} alt={m.alt_text || ''} className="w-full aspect-square object-cover rounded" />
              <button onClick={() => deleteMutation.mutate(m.id)} className="absolute top-2 right-2 bg-black/70 text-error text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{t('common.delete')}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
