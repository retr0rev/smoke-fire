import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { showToast } from '../../components/Toast'
import { supabase } from '../../lib/supabase'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/account')({
  component: AccountPage,
})

function AccountPage() {
  const { t } = useLang()
  const { user, signOut } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      showToast('Password updated')
      setNewPassword('')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Account" description="Admin Account" />
      <div>
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.account')}</h1>
        <div className="max-w-md space-y-8">
          <div>
            <p className="text-sm text-text-secondary mb-1">Email</p>
            <p className="text-text-primary">{user?.email}</p>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Change Password</h3>
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
          </form>
          <div className="pt-4 border-t border-border">
            <Button variant="outline" onClick={signOut}>{t('admin.logout')}</Button>
          </div>
        </div>
      </div>
    </>
  )
}
