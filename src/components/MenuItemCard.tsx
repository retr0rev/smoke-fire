import { Card } from './Card'
import { Badge } from './Badge'
import { useLang } from '../i18n/context'

interface MenuItem {
  id: string
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price: number
  image_url?: string | null
  is_available: boolean
  is_popular: boolean
  is_new: boolean
  is_spicy: boolean
  ingredients_en?: string[] | null
  ingredients_ar?: string[] | null
}

interface MenuItemCardProps {
  item: MenuItem
  currency?: string
  onClick?: () => void
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const { lang, t } = useLang()
  const name = lang === 'ar' ? item.name_ar : item.name_en
  const description = lang === 'ar' ? item.description_ar : item.description_en
  const ingredients = lang === 'ar' ? item.ingredients_ar : item.ingredients_en

  return (
    <Card
      className={`group cursor-pointer transition-colors hover:border-orange/30 ${!item.is_available ? 'opacity-50' : ''}`}
      onClick={onClick}
      as="article"
    >
      {item.image_url && (
        <div className="relative mb-3 -mx-4 -mt-4 overflow-hidden rounded-t">
          <img
            src={item.image_url}
            alt={name}
            loading="lazy"
            className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
          />
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-sm font-medium text-text-secondary">{t('common.unavailable')}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-lg tracking-wide text-text-primary truncate">{name}</h3>
        <span className="shrink-0 font-bold text-orange text-lg whitespace-nowrap">
          {t('item.price', { price: item.price })}
        </span>
      </div>
      {description && (
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{description}</p>
      )}
      {ingredients && ingredients.length > 0 && (
        <p className="text-xs text-text-disabled mt-1 line-clamp-1">{ingredients.join(', ')}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-2">
        {item.is_popular && <Badge variant="popular">{t('badge.popular')}</Badge>}
        {item.is_new && <Badge variant="new">{t('badge.new')}</Badge>}
        {item.is_spicy && <Badge variant="spicy">{t('badge.spicy')}</Badge>}
      </div>
    </Card>
  )
}
