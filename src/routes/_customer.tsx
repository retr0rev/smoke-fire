import { Suspense, lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CustomerLayout } from '../layouts/CustomerLayout'

const EmberBackground = lazy(() => import('../components/EmberBackground').then(m => ({ default: m.EmberBackground })))

export const Route = createFileRoute('/_customer')({
  component: () => (
    <>
      <Suspense fallback={null}>
        <EmberBackground />
      </Suspense>
      <CustomerLayout />
    </>
  ),
})
