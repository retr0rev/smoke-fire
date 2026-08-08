import { createFileRoute } from '@tanstack/react-router'
import { useLang } from '../../i18n/context'
import { useRestaurant } from '../../hooks/useRestaurant'
import { SEOHead } from '../../components/SEOHead'

export const Route = createFileRoute('/_customer/about')({
  component: AboutPage,
})

function AboutPage() {
  const { t, lang } = useLang()
  const { data: restaurant } = useRestaurant()
  const description = lang === 'ar' ? restaurant?.description_ar : restaurant?.description_en

  return (
    <>
      <SEOHead title={t('about.title')} description={description || ''} />
      <div className="px-4 py-12 max-w-2xl mx-auto">
        <h1 className="font-heading text-3xl tracking-wide mb-6">{t('about.title')}</h1>
        {description && (
          <p className="text-text-secondary leading-relaxed text-lg">{description}</p>
        )}
      </div>
    </>
  )
}
