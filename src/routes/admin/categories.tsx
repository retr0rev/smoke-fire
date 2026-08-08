import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Category } from '../../lib/api'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { showToast } from '../../components/Toast'
import { CategoryForm } from '../../features/admin/CategoryForm'
import { SEOHead } from '../../components/SEOHead'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/categories')({ component: CategoriesPage })

function CategoriesPage() {
  const queryClient = useQueryClient()
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.admin.categories.getAll(),
  })

  const createM = useMutation({
    mutationFn: (d: any) => api.admin.categories.create(d).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setShowCreate(false); showToast('Category created') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })
  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.admin.categories.update(id, data).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setEditItem(null); showToast('Updated') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })
  const deleteM = useMutation({
    mutationFn: (id: string) => api.admin.categories.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); setDeleteId(null); showToast('Deleted') },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  return (
    <>
      <SEOHead title="Categories" description="Manage Categories" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Categories</h1><p className="text-sm text-gray-500 mt-0.5">Organize your menu</p></div>
          <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Category</Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">Failed to load categories.</div>
        ) : isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
        ) : !data?.length ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">No categories yet. Start by adding your first category.</p>
            <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Category</Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {['Name', 'Slug', 'Status', 'Sort', ''].map(h => <th key={h} className="px-6 py-3">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name_en} <span className="text-gray-400">{c.name_ar}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{c.slug}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{c.sort_order}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => setEditItem(c)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                          <button onClick={() => setDeleteId(c.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {data.map(c => (
                <div key={c.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{c.name_en}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-sm text-gray-500">{c.name_ar} · {c.slug}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => setEditItem(c)} className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"><Pencil size={14} className="inline mr-1" />Edit</button>
                    <button onClick={() => setDeleteId(c.id)} className="text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"><Trash2 size={14} className="inline mr-1" />Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Category">
          <CategoryForm onSubmit={async d => createM.mutateAsync(d)} onCancel={() => setShowCreate(false)} />
        </Modal>
        <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Category">
          {editItem && <CategoryForm initial={editItem} onSubmit={async d => updateM.mutateAsync({ id: editItem.id, data: d })} onCancel={() => setEditItem(null)} />}
        </Modal>
        <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteM.mutate(deleteId)} title="Delete Category" message="This will also delete all items in this category." confirmLabel="Delete" destructive />
      </div>
    </>
  )
}
