import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api, type DashboardStats } from '../../lib/api'
import { Skeleton } from '../../components/Skeleton'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'
import { Tag, UtensilsCrossed, CheckCircle, XCircle, Star } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: DashboardPage,
})

const statCards = [
  { key: 'totalCategories' as const, label: 'Categories', icon: Tag, color: 'text-blue-400' },
  { key: 'totalItems' as const, label: 'Menu Items', icon: UtensilsCrossed, color: 'text-orange' },
  { key: 'availableItems' as const, label: 'Available', icon: CheckCircle, color: 'text-green-400' },
  { key: 'unavailableItems' as const, label: 'Unavailable', icon: XCircle, color: 'text-red-400' },
  { key: 'featuredItems' as const, label: 'Featured', icon: Star, color: 'text-amber' },
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
      <div>
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-text-primary">{t('admin.dashboard')}</h1>
          <p className="text-sm text-text-secondary mt-1">Overview of your restaurant</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statCards.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="bg-surface border border-border rounded-xl p-4 hover:border-orange/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
                  <Icon size={20} className={color} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{stats[key]}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
