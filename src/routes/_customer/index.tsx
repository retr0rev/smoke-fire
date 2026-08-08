import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '../../i18n/context'
import { Button } from '../../components/Button'
import { LangSwitcher } from '../../components/LangSwitcher'
import { SEOHead } from '../../components/SEOHead'
import { HeroFlame } from '../../components/HeroFlame'
import { useRestaurant } from '../../hooks/useRestaurant'

export const Route = createFileRoute('/_customer/')({
  component: LandingPage,
})

function LandingPage() {
  const { t, lang } = useLang()
  const { data: restaurant } = useRestaurant()
  const description = lang === 'ar' ? restaurant?.description_ar : restaurant?.description_en

  return (
    <>
      <SEOHead title="Home" description={description || ''} image={restaurant?.logo_url || undefined} />
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-3.5rem)] px-4 py-16 text-center overflow-hidden">
        <HeroFlame />
        <div className="relative z-10 max-w-md">
          {restaurant?.logo_url && (
            <img src={restaurant.logo_url} alt={restaurant.name} className="w-48 h-auto mx-auto mb-6" />
          )}
          <h1 className="font-heading text-5xl sm:text-6xl tracking-wider text-orange mb-4">
            SMOKE & FIRE
          </h1>
          {description && (
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">{description}</p>
          )}
          <div className="flex flex-col items-center gap-4">
            <Link to="/menu"><Button size="lg">{t('hero.cta')}</Button></Link>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
