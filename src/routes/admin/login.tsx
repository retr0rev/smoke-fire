import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { Button } from '../../components/Button'
import { LangSwitcher } from '../../components/LangSwitcher'
import { SEOHead } from '../../components/SEOHead'
import { useLang } from '../../i18n/context'
import { Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/admin/login')({ component: LoginPage })

function LoginPage() {
  const { t } = useLang()
  const { signIn, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) { router.navigate({ to: '/admin' }); return null }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      router.navigate({ to: '/admin' })
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Login" description="Admin Login" />
      <div className="min-h-dvh bg-gray-50 flex flex-col">
        <div className="flex justify-end p-4"><LangSwitcher /></div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl text-orange tracking-wider mb-2">SMOKE & FIRE</h1>
              <p className="text-gray-500 text-sm">Admin Dashboard</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30"
                  required autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 pr-10"
                    required autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full h-11 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
