import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api, type DashboardStats } from '../../lib/api'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'
import { Tag, UtensilsCrossed, CheckCircle, XCircle, Star, Settings, Share2, Clock, Image, FileText, Plus, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/admin/')({ component: DashboardPage })

const statItems = [
  { key: 'totalCategories' as const, label: 'Categories', icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'totalItems' as const, label: 'Menu Items', icon: UtensilsCrossed, color: 'text-orange', bg: 'bg-orange-50' },
  { key: 'availableItems' as const, label: 'Available', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'featuredItems' as const, label: 'Featured', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
]

const managementCards = [
  { to: '/admin/categories', label: 'Categories', desc: 'Organize your menu categories', icon: Tag, color: 'text-indigo-600' },
  { to: '/admin/menu-items', label: 'Menu Items', desc: 'Manage all food and drink items', icon: UtensilsCrossed, color: 'text-orange' },
  { to: '/admin/settings', label: 'Settings', desc: 'Restaurant info, contact, currency', icon: Settings, color: 'text-blue-600' },
  { to: '/admin/socials', label: 'Social Media', desc: 'Instagram, WhatsApp, TikTok, more', icon: Share2, color: 'text-pink-500' },
  { to: '/admin/hours', label: 'Opening Hours', desc: 'Set your weekly schedule', icon: Clock, color: 'text-green-600' },
  { to: '/admin/media', label: 'Media Library', desc: 'Upload and manage images', icon: Image, color: 'text-purple-600' },
  { to: '/admin/promotions', label: 'Promotions', desc: 'Create special offers', icon: FileText, color: 'text-red-500' },
]

function DashboardPage() {
  const { t } = useLang()
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.admin.dashboard(),
  })

  return (
    <>
      <SEOHead title="Dashboard" description="Admin Dashboard" />
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back{'\u{1F44B}'}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your menu today.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map(({ key, label, icon: Icon, color, bg }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '...' : (stats?.[key] ?? 0)}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Management</h2>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {managementCards.map(({ to, label, desc, icon: Icon, color }) => (
              <Link key={to} to={to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-orange/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-orange group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-4">Jump directly to common tasks</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/menu-items/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <Plus size={16} /> Add Menu Item
            </Link>
            <Link to="/admin/categories" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <Tag size={16} /> Add Category
            </Link>
            <Link to="/admin/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <Settings size={16} /> Edit Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
