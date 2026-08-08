import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '../../i18n/context'
import { useCategories } from '../../hooks/useCategories'
import { useMenuItems } from '../../hooks/useMenuItems'
import { useRestaurant } from '../../hooks/useRestaurant'
import { MenuItemCard } from '../../components/MenuItemCard'
import { Skeleton } from '../../components/Skeleton'
import { EmptyState } from '../../components/EmptyState'
import { SEOHead } from '../../components/SEOHead'
import type { MenuItem } from '../../lib/api'
import { ItemDetail } from '../../features/menu/ItemDetail'

export const Route = createFileRoute('/_customer/menu')({
  component: MenuPage,
})

function MenuPage() {
  const { t, lang } = useLang()
  const { data: restaurant } = useRestaurant()
  const { data: categories, isLoading: catsLoading } = useCategories()
  const { data: items, isLoading: itemsLoading } = useMenuItems()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const currency = restaurant?.currency || 'SAR'

  return (
    <>
      <SEOHead title={t('nav.menu')} description="Browse our full menu" />
      <div className="sticky top-14 z-30 bg-bg/90 backdrop-blur border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide gap-0 px-4">
          <Link
            to="/menu"
            className="shrink-0 h-12 px-4 text-sm font-medium border-b-2 border-orange text-orange flex items-center"
          >
            {t('menu.all')}
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to="/menu/$category"
              params={{ category: cat.slug }}
              className="shrink-0 h-12 px-4 text-sm font-medium border-b-2 border-transparent text-text-secondary hover:text-text-primary flex items-center transition-colors [&.active]:border-orange [&.active]:text-orange"
            >
              {lang === 'ar' ? cat.name_ar : cat.name_en}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {itemsLoading || catsLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency={currency}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState title={t('menu.noItems')} />
        )}
      </div>

      <ItemDetail
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        currency={currency}
      />
    </>
  )
}
