import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type MenuItem } from '../../lib/api'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { showToast } from '../../components/Toast'
import { SEOHead } from '../../components/SEOHead'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/menu-items')({ component: MenuItemsPage })

function MenuItemsPage() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['admin', 'menuItems'],
    queryFn: () => api.admin.menuItems.getAll(),
  })

  const deleteM = useMutation({
    mutationFn: (id: string) => api.admin.menuItems.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); setDeleteId(null); showToast('Deleted') },
    onError: (e: Error) => showToast(e.message, 'error'),
  })

  const toggleM = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) => api.admin.menuItems.update(id, { is_available: available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }),
    onError: (e: Error) => showToast(e.message, 'error'),
  })

  return (
    <>
      <SEOHead title="Menu Items" description="Manage Menu Items" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Menu Items</h1><p className="text-sm text-gray-500 mt-0.5">Manage your food and drinks</p></div>
          <Link to="/admin/menu-items/new"><Button size="sm"><Plus size={16} className="mr-1" /> Add Item</Button></Link>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">Failed to load items.</div>
        ) : isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
        ) : !data?.length ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">No menu items yet.</p>
            <Link to="/admin/menu-items/new"><Button size="sm"><Plus size={16} className="mr-1" /> Add First Item</Button></Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {['Item', 'Category', 'Price', 'Status', ''].map(h => <th key={h} className="px-6 py-3">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url && <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                          <div><p className="text-sm font-medium text-gray-900">{item.name_en}</p><p className="text-xs text-gray-400">{item.name_ar}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.category?.name_en || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.price}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => toggleM.mutate({ id: item.id, available: !item.is_available })}
                          className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${item.is_available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Link to="/admin/menu-items/$id" params={{ id: item.id }} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></Link>
                          <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {data.map(item => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {item.image_url && <img src={item.image_url} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name_en}</p>
                      <p className="text-xs text-gray-400">{item.category?.name_en} · {item.price}</p>
                    </div>
                    <button onClick={() => toggleM.mutate({ id: item.id, available: !item.is_available })}
                      className={`text-xs px-2 py-1 rounded-full ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.is_available ? 'On' : 'Off'}
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <Link to="/admin/menu-items/$id" params={{ id: item.id }} className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"><Pencil size={14} className="inline mr-1" />Edit</Link>
                    <button onClick={() => setDeleteId(item.id)} className="text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"><Trash2 size={14} className="inline mr-1" />Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteM.mutate(deleteId)} title="Delete Item" message="Are you sure?" confirmLabel="Delete" destructive />
      </div>
    </>
  )
}
