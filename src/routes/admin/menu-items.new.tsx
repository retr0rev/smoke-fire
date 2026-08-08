import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { MenuItemForm } from '../../features/admin/MenuItemForm'
import { showToast } from '../../components/Toast'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/menu-items/new')({
  component: CreateMenuItemPage,
})

function CreateMenuItemPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: any) => api.admin.menuItems.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); showToast('Item created'); router.navigate({ to: '/admin/menu-items' }) },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  return (
    <>
      <SEOHead title="New Menu Item" description="Create Menu Item" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">New Menu Item</h1>
        <div className="max-w-2xl">
          <MenuItemForm onSubmit={async (data) => mutation.mutateAsync(data)} onCancel={() => router.navigate({ to: '/admin/menu-items' })} />
        </div>
      </div>
    </>
  )
}
