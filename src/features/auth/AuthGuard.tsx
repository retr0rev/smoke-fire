import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from './AuthContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      if (window.location.pathname !== '/admin/login') {
        router.navigate({ to: '/admin/login' })
      }
    }
  }, [user, isLoading, router])

  if (isLoading) return <div className="flex items-center justify-center min-h-dvh text-text-secondary">Loading...</div>
  if (!user) return <>{children}</>

  return <>{children}</>
}
