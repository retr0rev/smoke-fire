import { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { LangSwitcher } from '../components/LangSwitcher'
import { LayoutDashboard, UtensilsCrossed, Tag, Settings, Share2, Clock, Image, FileText, User, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/menu-items', label: 'Menu Items', icon: UtensilsCrossed },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/socials', label: 'Socials', icon: Share2 },
  { to: '/admin/hours', label: 'Hours', icon: Clock },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/promotions', label: 'Promos', icon: FileText },
  { to: '/admin/account', label: 'Account', icon: User },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-bg">
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-60 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <Link to="/admin" onClick={() => setOpen(false)} className="font-heading text-lg text-orange tracking-wider">SMOKE & FIRE</Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-text-secondary hover:text-text-primary"><X size={20} /></button>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface-elevated rounded-lg transition-colors [&.active]:text-orange [&.active]:bg-orange/10"
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:ml-60">
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-bg/90 backdrop-blur border-b border-border">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <LangSwitcher />
            <Link to="/" className="text-sm text-text-secondary hover:text-orange transition-colors hidden sm:inline">View Site</Link>
          </div>
        </header>
        <main className="p-3 lg:p-6 max-w-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
