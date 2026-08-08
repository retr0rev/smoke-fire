import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { LangSwitcher } from '../../components/LangSwitcher'
import { SEOHead } from '../../components/SEOHead'
import { useLang } from '../../i18n/context'

export const Route = createFileRoute('/admin/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useLang()
  const { signIn, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    router.navigate({ to: '/admin' })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      router.navigate({ to: '/admin' })
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Admin Login" description="Smoke & Fire Admin Login" />
      <div className="min-h-dvh bg-bg flex flex-col">
        <div className="flex justify-end p-4">
          <LangSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <h1 className="font-heading text-3xl text-orange text-center mb-2 tracking-wider">
              SMOKE & FIRE
            </h1>
            <p className="text-text-secondary text-sm text-center mb-8">{t('admin.login')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              {error && <p className="text-error text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('admin.login')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
