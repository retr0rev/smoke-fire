import { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { useLang } from '../i18n/context'
import { LangSwitcher } from '../components/LangSwitcher'
import { LayoutDashboard, UtensilsCrossed, FileText, Settings, Share2, Clock, Image, Tag, User } from 'lucide-react'

const adminNavItems = [
  { to: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { to: '/admin/categories', labelKey: 'admin.categories', icon: Tag },
  { to: '/admin/menu-items', labelKey: 'admin.menuItems', icon: UtensilsCrossed },
  { to: '/admin/settings', labelKey: 'admin.settings', icon: Settings },
  { to: '/admin/socials', labelKey: 'admin.socials', icon: Share2 },
  { to: '/admin/hours', labelKey: 'admin.hours', icon: Clock },
  { to: '/admin/media', labelKey: 'admin.media', icon: Image },
  { to: '/admin/promotions', labelKey: 'admin.promotions', icon: FileText },
  { to: '/admin/account', labelKey: 'admin.account', icon: User },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useLang()

  return (
    <div className="min-h-dvh bg-bg flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0d0d0d] border-r border-border flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center gap-2 h-14 px-4 border-b border-border shrink-0">
          <Link to="/admin" className="font-heading text-lg text-orange tracking-wider">SMOKE & FIRE</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-text-secondary">&times;</button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {adminNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-[#1a1a1a] rounded-lg transition-colors [&.active]:text-orange [&.active]:bg-orange/10"
            >
              <item.icon size={18} />
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-bg/90 backdrop-blur border-b border-border shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-text-secondary">
            <span className="block w-5 h-0.5 bg-current mb-1 rounded" />
            <span className="block w-5 h-0.5 bg-current mb-1 rounded" />
            <span className="block w-5 h-0.5 bg-current rounded" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <LangSwitcher />
            <Link to="/" className="text-sm text-text-secondary hover:text-orange transition-colors">View Site</Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
