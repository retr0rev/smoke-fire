import { createFileRoute } from '@tanstack/react-router'
import { useLang } from '../../i18n/context'
import { useRestaurant } from '../../hooks/useRestaurant'
import { useSocials } from '../../hooks/useSocials'
import { useOpeningHours } from '../../hooks/useOpeningHours'
import { SocialIcon } from '../../components/SocialIcon'
import { Card } from '../../components/Card'
import { SEOHead } from '../../components/SEOHead'

const platformIcons: Record<string, string> = {
  instagram: '\u{1F4F7}',
  facebook: '\u{1F4D8}',
  tiktok: '\u{1F3B5}',
  whatsapp: '\u{1F4AC}',
  phone: '\u{1F4DE}',
  email: '\u{2709}',
  website: '\u{1F310}',
}

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

function formatTime(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export const Route = createFileRoute('/_customer/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { t, lang } = useLang()
  const { data: restaurant } = useRestaurant()
  const { data: socials } = useSocials()
  const { data: hours } = useOpeningHours()
  const days = lang === 'ar' ? DAYS_AR : DAYS_EN
  const address = lang === 'ar' ? restaurant?.address_ar : restaurant?.address_en

  return (
    <>
      <SEOHead title={t('contact.title')} description="Contact Smoke & Fire" />
      <div className="px-4 py-12 max-w-2xl mx-auto space-y-8">
        <h1 className="font-heading text-3xl tracking-wide">{t('contact.title')}</h1>

        {socials && socials.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <SocialIcon
                key={s.id}
                platform={s.platform as any}
                url={s.url}
                icon={<span>{platformIcons[s.platform] || '?'}</span>}
              />
            ))}
          </div>
        )}

        {address && (
          <Card>
            <h3 className="text-sm font-medium text-text-secondary mb-2">{t('contact.address')}</h3>
            <p className="text-text-primary">{address}</p>
            {restaurant?.google_maps_url && (
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-orange hover:underline"
              >
                View on Google Maps
              </a>
            )}
          </Card>
        )}

        {restaurant?.phone && (
          <Card>
            <h3 className="text-sm font-medium text-text-secondary mb-2">{t('contact.phone')}</h3>
            <a href={`tel:${restaurant.phone}`} className="text-text-primary hover:text-orange transition-colors">
              {restaurant.phone}
            </a>
          </Card>
        )}

        {restaurant?.whatsapp && (
          <Card>
            <h3 className="text-sm font-medium text-text-secondary mb-2">{t('contact.whatsapp')}</h3>
            <a href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-green-500 transition-colors">
              {restaurant.whatsapp}
            </a>
          </Card>
        )}

        {restaurant?.email && (
          <Card>
            <h3 className="text-sm font-medium text-text-secondary mb-2">{t('contact.email')}</h3>
            <a href={`mailto:${restaurant.email}`} className="text-text-primary hover:text-orange transition-colors">
              {restaurant.email}
            </a>
          </Card>
        )}

        {hours && hours.length > 0 && (
          <Card>
            <h3 className="font-heading text-lg tracking-wide mb-4">{t('hours.title')}</h3>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{days[h.day_of_week]}</span>
                  <span className={h.is_closed ? 'text-error' : 'text-text-primary'}>
                    {h.is_closed
                      ? t('hours.closed')
                      : `${formatTime(h.open_time)} - ${formatTime(h.close_time)}`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  )
}
