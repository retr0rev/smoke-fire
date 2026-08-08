import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Category } from '../../lib/api'
import { Table } from '../../components/Table'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { showToast } from '../../components/Toast'
import { CategoryForm } from '../../features/admin/CategoryForm'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/admin/categories')({ component: CategoriesPage })

function CategoriesPage() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.admin.categories.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.admin.categories.create(data).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setShowCreate(false); showToast('Category created') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.admin.categories.update(id, data).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setEditCategory(null); showToast('Category updated') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.categories.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setDeleteId(null); showToast('Category deleted') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  const columns = [
    { key: 'name', header: 'Name', render: (c: Category) => <span>{c.name_en} / {c.name_ar}</span> },
    { key: 'slug', header: 'Slug', render: (c: Category) => <span className="text-text-secondary text-xs">{c.slug}</span> },
    { key: 'status', header: 'Status', render: (c: Category) => <span className={c.is_active ? 'text-success' : 'text-text-disabled'}>{c.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (c: Category) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => setEditCategory(c)}>{t('common.edit')}</Button>
        <Button size="sm" variant="ghost" className="!text-error" onClick={() => setDeleteId(c.id)}>{t('common.delete')}</Button>
      </div>
    )},
  ]

  return (
    <>
      <SEOHead title="Categories" description="Manage Categories" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">{t('admin.categories')}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{categories?.length || 0} categories</p>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> {t('common.create')}</Button>
        </div>
        <Table columns={columns} data={categories || []} keyExtractor={(c) => c.id} emptyMessage="No categories yet" />
        <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Category">
          <CategoryForm onSubmit={async (d) => createMutation.mutateAsync(d)} onCancel={() => setShowCreate(false)} />
        </Modal>
        <Modal open={!!editCategory} onClose={() => setEditCategory(null)} title="Edit Category">
          {editCategory && <CategoryForm initial={editCategory} onSubmit={async (d) => updateMutation.mutateAsync({ id: editCategory.id, data: d })} onCancel={() => setEditCategory(null)} />}
        </Modal>
        <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} title="Delete Category" message="This will also delete all items in this category." confirmLabel="Delete" destructive />
      </div>
    </>
  )
}
