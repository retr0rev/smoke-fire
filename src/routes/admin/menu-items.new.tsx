import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { MenuItemForm } from '../../features/admin/MenuItemForm'
import { showToast } from '../../components/Toast'
import { SEOHead } from '../../components/SEOHead'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/menu-items/new')({ component: CreateMenuItemPage })

function CreateMenuItemPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (d: any) => api.admin.menuItems.create(d).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); showToast('Item created'); router.navigate({ to: '/admin/menu-items' }) },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  return (
    <>
      <SEOHead title="New Item" description="Create Menu Item" />
      <div>
        <button onClick={() => router.navigate({ to: '/admin/menu-items' })} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Menu Items
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-6">New Menu Item</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl">
          <MenuItemForm onSubmit={async d => mutation.mutateAsync(d)} onCancel={() => router.navigate({ to: '/admin/menu-items' })} />
        </div>
      </div>
    </>
  )
}
