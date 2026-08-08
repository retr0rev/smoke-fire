import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type MenuItem } from '../../lib/api'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { showToast } from '../../components/Toast'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/menu-items')({
  component: MenuItemsPage,
})

function MenuItemsPage() {
  const { t, lang } = useLang()
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: items } = useQuery<MenuItem[]>({
    queryKey: ['admin', 'menuItems'],
    queryFn: () => api.admin.menuItems.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.menuItems.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); setDeleteId(null); showToast('Item deleted') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const columns = [
    { key: 'name', header: 'Name', render: (item: MenuItem) => <span>{lang === 'ar' ? item.name_ar : item.name_en}</span> },
    { key: 'category', header: 'Category', render: (item: MenuItem) => <span className="text-text-secondary">{item.category ? (lang === 'ar' ? item.category.name_ar : item.category.name_en) : '-'}</span> },
    { key: 'price', header: 'Price', render: (item: MenuItem) => <span>{item.price}</span> },
    { key: 'status', header: 'Status', render: (item: MenuItem) => <span className={item.is_available ? 'text-success' : 'text-error'}>{item.is_available ? t('common.available') : t('common.unavailable')}</span> },
    { key: 'actions', header: '', render: (item: MenuItem) => (
      <div className="flex gap-2">
        <Link to="/admin/menu-items/$id" params={{ id: item.id }}><Button size="sm" variant="ghost">{t('common.edit')}</Button></Link>
        <Button size="sm" variant="ghost" className="!text-error" onClick={() => setDeleteId(item.id)}>{t('common.delete')}</Button>
      </div>
    )},
  ]

  return (
    <>
      <SEOHead title="Menu Items" description="Manage Menu Items" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl tracking-wide">{t('admin.menuItems')}</h1>
          <Link to="/admin/menu-items/new"><Button size="sm">{t('common.create')}</Button></Link>
        </div>
        <Table columns={columns} data={items || []} keyExtractor={(item) => item.id} emptyMessage="No menu items yet" />
        <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} title="Delete Menu Item" message="Are you sure?" confirmLabel="Delete" destructive />
      </div>
    </>
  )
}
