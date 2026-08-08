import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api, type DashboardStats } from '../../lib/api'
import { StatCard } from '../../components/StatCard'
import { Skeleton } from '../../components/Skeleton'
import { useLang } from '../../i18n/context'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/admin/')({
  component: DashboardPage,
})

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
        <h1 className="font-heading text-2xl tracking-wide mb-6">{t('admin.dashboard')}</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Categories" value={stats.totalCategories} icon={'\u{1F4CB}'} />
            <StatCard label="Menu Items" value={stats.totalItems} icon={'\u{1F354}'} />
            <StatCard label="Available" value={stats.availableItems} icon={'\u{2705}'} />
            <StatCard label="Unavailable" value={stats.unavailableItems} icon={'\u{274C}'} />
            <StatCard label="Featured" value={stats.featuredItems} icon={'\u{2B50}'} />
          </div>
        ) : null}
      </div>
    </>
  )
}
