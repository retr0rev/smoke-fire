import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '../layouts/AdminLayout'
import { AuthGuard } from '../features/auth/AuthGuard'

export const Route = createFileRoute('/admin')({
  component: () => (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  ),
})
