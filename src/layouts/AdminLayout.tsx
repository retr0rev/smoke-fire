import { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { useLang } from '../i18n/context'
import { LangSwitcher } from '../components/LangSwitcher'

const adminNavItems = [
  { to: '/admin', labelKey: 'admin.dashboard' },
  { to: '/admin/categories', labelKey: 'admin.categories' },
  { to: '/admin/menu-items', labelKey: 'admin.menuItems' },
  { to: '/admin/settings', labelKey: 'admin.settings' },
  { to: '/admin/socials', labelKey: 'admin.socials' },
  { to: '/admin/hours', labelKey: 'admin.hours' },
  { to: '/admin/media', labelKey: 'admin.media' },
  { to: '/admin/promotions', labelKey: 'admin.promotions' },
  { to: '/admin/account', labelKey: 'admin.account' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t, dir } = useLang()

  return (
    <div className="min-h-dvh bg-bg" dir={dir}>
      <div className="flex">
        <aside className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-64 bg-surface border-e border-border transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
          <div className="flex items-center justify-between h-14 px-4 border-b border-border">
            <Link to="/admin" className="font-heading text-lg text-orange tracking-wider">SMOKE & FIRE</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-secondary text-xl">&times;</button>
          </div>
          <nav className="p-2 space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-colors [&.active]:text-orange [&.active]:bg-orange/5"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </aside>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-bg/80 backdrop-blur border-b border-border">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary">
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
            <div className="flex items-center gap-3 ms-auto">
              <LangSwitcher />
              <Link to="/" className="text-sm text-text-secondary hover:text-text-primary">View Site</Link>
            </div>
          </header>
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
