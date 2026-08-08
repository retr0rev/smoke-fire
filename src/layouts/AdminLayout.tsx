import { useState } from 'react'
import { Link, Outlet, useRouter } from '@tanstack/react-router'
import { LangSwitcher } from '../../components/LangSwitcher'
import { useAuth } from '../../features/auth/AuthContext'
import { LayoutDashboard, UtensilsCrossed, Tag, Settings, Share2, Clock, Image, FileText, User, Menu, X, LogOut, Plus } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', ar: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Categories', ar: 'الأقسام', icon: Tag },
  { to: '/admin/menu-items', label: 'Menu Items', ar: 'عناصر القائمة', icon: UtensilsCrossed },
  { to: '/admin/settings', label: 'Settings', ar: 'الإعدادات', icon: Settings },
  { to: '/admin/socials', label: 'Socials', ar: 'التواصل', icon: Share2 },
  { to: '/admin/hours', label: 'Hours', ar: 'ساعات العمل', icon: Clock },
  { to: '/admin/media', label: 'Media', ar: 'الوسائط', icon: Image },
  { to: '/admin/promotions', label: 'Promos', ar: 'العروض', icon: FileText },
  { to: '/admin/account', label: 'Account', ar: 'الحساب', icon: User },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-dvh bg-gray-50" dir="ltr">
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-700">
          <Link to="/admin" onClick={() => setOpen(false)} className="font-heading text-lg text-orange tracking-wider">SMOKE & FIRE</Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, ar, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-gray-800 hover:text-white [&.active]:bg-orange/20 [&.active]:text-orange"
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-700">
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 rounded-lg transition-colors w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-gray-200">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <LangSwitcher />
            <Link to="/" className="text-sm text-gray-500 hover:text-orange transition-colors hidden sm:inline" target="_blank">View Site</Link>
          </div>
        </header>
        <main className="p-4 lg:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
