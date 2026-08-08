import { useLang } from '../../i18n/context'
import { BottomSheet } from '../../components/BottomSheet'
import { Badge } from '../../components/Badge'
import type { MenuItem } from '../../lib/api'

interface ItemDetailProps {
  item: MenuItem | null
  open: boolean
  onClose: () => void
  currency?: string
}

export function ItemDetail({ item, open, onClose, currency = 'SAR' }: ItemDetailProps) {
  const { lang, t } = useLang()

  if (!item) return null

  const name = lang === 'ar' ? item.name_ar : item.name_en
  const description = lang === 'ar' ? item.description_ar : item.description_en
  const ingredients = lang === 'ar' ? item.ingredients_ar : item.ingredients_en
  const allergens = lang === 'ar' ? item.allergens_ar : item.allergens_en

  return (
    <BottomSheet open={open} onClose={onClose}>
      {item.image_url && (
        <div className="-mx-4 -mt-4 mb-4">
          <img
            src={item.image_url}
            alt={name}
            className="w-full aspect-video object-cover rounded-t-xl"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading text-2xl tracking-wide text-text-primary">{name}</h2>
          <span className="shrink-0 text-xl font-medium text-orange">
            {t('item.price', { price: item.price })}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.is_popular && <Badge variant="popular">{t('badge.popular')}</Badge>}
          {item.is_new && <Badge variant="new">{t('badge.new')}</Badge>}
          {item.is_spicy && <Badge variant="spicy">{t('badge.spicy')}</Badge>}
        </div>

        <p className="text-text-secondary leading-relaxed">{description}</p>

        {ingredients && ingredients.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{t('item.ingredients')}</h4>
            <p className="text-sm text-text-secondary">{ingredients.join(', ')}</p>
          </div>
        )}

        {allergens && allergens.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{t('item.allergens')}</h4>
            <p className="text-sm text-text-secondary">{allergens.join(', ')}</p>
          </div>
        )}

        {item.calories && (
          <div>
            <p className="text-sm text-text-secondary">{t('item.calories', { cal: item.calories })}</p>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
