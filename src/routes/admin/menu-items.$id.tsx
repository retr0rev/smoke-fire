import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { MenuItemForm } from '../../features/admin/MenuItemForm'
import { showToast } from '../../components/Toast'
import { SEOHead } from '../../components/SEOHead'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/menu-items/$id')({ component: EditMenuItemPage })

function EditMenuItemPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: item } = useQuery({
    queryKey: ['admin', 'menuItem', id],
    queryFn: () => api.admin.menuItems.getById(id),
  })

  const mutation = useMutation({
    mutationFn: (d: any) => api.admin.menuItems.update(id, d).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); showToast('Updated'); router.navigate({ to: '/admin/menu-items' }) },
    onError: (e: Error) => showToast(e.message, 'error'),
  })

  if (!item) return <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />

  return (
    <>
      <SEOHead title="Edit Item" description="Edit Menu Item" />
      <div>
        <button onClick={() => router.navigate({ to: '/admin/menu-items' })} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Menu Items
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit {item.name_en}</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl">
          <MenuItemForm initial={item} onSubmit={async d => mutation.mutateAsync(d)} onCancel={() => router.navigate({ to: '/admin/menu-items' })} />
        </div>
      </div>
    </>
  )
}
