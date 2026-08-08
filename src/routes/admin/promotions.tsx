import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Promotion } from '../../lib/api'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Input } from '../../components/Input'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/promotions')({
  component: PromotionsPage,
})

function PromotionsPage() {
  const { t, lang } = useLang()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editPromo, setEditPromo] = useState<Promotion | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title_en: '', title_ar: '', link_url: '', is_active: true, sort_order: 0 })

  const { data: promos } = useQuery<Promotion[]>({ queryKey: ['admin', 'promotions'], queryFn: () => api.admin.promotions.getAll() })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.admin.promotions.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] }); setShowForm(false); showToast('Created') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.admin.promotions.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] }); setEditPromo(null); showToast('Updated') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.promotions.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] }); setDeleteId(null); showToast('Deleted') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const openEdit = (p: Promotion) => { setEditPromo(p); setForm({ title_en: p.title_en, title_ar: p.title_ar, link_url: p.link_url || '', is_active: p.is_active, sort_order: p.sort_order }) }

  const columns = [
    { key: 'title', header: 'Title', render: (p: Promotion) => <span>{lang === 'ar' ? p.title_ar : p.title_en}</span> },
    { key: 'status', header: 'Status', render: (p: Promotion) => <span className={p.is_active ? 'text-success' : 'text-text-disabled'}>{p.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (p: Promotion) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>{t('common.edit')}</Button>
        <Button size="sm" variant="ghost" className="!text-error" onClick={() => setDeleteId(p.id)}>{t('common.delete')}</Button>
      </div>
    )},
  ]

  const promoFormEl = (
    <form onSubmit={(e) => { e.preventDefault(); (editPromo ? updateMutation.mutate({ id: editPromo.id, data: form }) : createMutation.mutate(form)) }} className="space-y-3">
      <Input label="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
      <Input label="العنوان (العربية)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
      <Input label="Link URL" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
      <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /><span className="text-sm text-text-secondary">Active</span></label>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" type="button" onClick={() => { setShowForm(false); setEditPromo(null) }}>{t('common.cancel')}</Button>
        <Button type="submit">{t('common.save')}</Button>
      </div>
    </form>
  )

  return (
    <>
      <SEOHead title="Promotions" description="Manage Promotions" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl tracking-wide">{t('admin.promotions')}</h1>
          <Button size="sm" onClick={() => setShowForm(true)}>{t('common.create')}</Button>
        </div>
        <Table columns={columns} data={promos || []} keyExtractor={(p) => p.id} emptyMessage="No promotions" />
        <Modal open={showForm} onClose={() => setShowForm(false)} title="New Promotion">{promoFormEl}</Modal>
        <Modal open={!!editPromo} onClose={() => setEditPromo(null)} title="Edit Promotion">{promoFormEl}</Modal>
        <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} title="Delete Promotion" message="Are you sure?" confirmLabel="Delete" destructive />
      </div>
    </>
  )
}
