import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type MenuItem } from '../../lib/api'
import { MenuItemForm } from '../../features/admin/MenuItemForm'
import { showToast } from '../../components/Toast'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/menu-items/$id')({
  component: EditMenuItemPage,
})

function EditMenuItemPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: item } = useQuery<MenuItem>({
    queryKey: ['admin', 'menuItem', id],
    queryFn: () => api.admin.menuItems.getById(id),
  })

  const mutation = useMutation({
    mutationFn: (data: any) => api.admin.menuItems.update(id, data).then(() => {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'menuItems'] }); showToast('Item updated'); router.navigate({ to: '/admin/menu-items' }) },
    onError: (err: Error) => showToast(err.message, 'error'),
  })

  if (!item) return null

  return (
    <>
      <SEOHead title="Edit Menu Item" description="Edit Menu Item" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">Edit Menu Item</h1>
        <div className="max-w-2xl">
          <MenuItemForm initial={item} onSubmit={async (data) => mutation.mutateAsync(data)} onCancel={() => router.navigate({ to: '/admin/menu-items' })} />
        </div>
      </div>
    </>
  )
}
