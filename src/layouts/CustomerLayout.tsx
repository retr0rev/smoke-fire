import { Link, Outlet } from '@tanstack/react-router'
import { useLang } from '../i18n/context'
import { LangSwitcher } from '../components/LangSwitcher'

export function CustomerLayout() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-dvh bg-bg" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="font-heading text-xl text-orange tracking-wider">
            SMOKE & FIRE
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.home')}
            </Link>
            <Link to="/menu" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.menu')}
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.contact')}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <button className="sm:hidden flex flex-col gap-1 p-2" aria-label="Menu">
              <span className="w-5 h-0.5 bg-text-secondary" />
              <span className="w-5 h-0.5 bg-text-secondary" />
              <span className="w-5 h-0.5 bg-text-secondary" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-text-secondary">
          <p className="font-heading text-orange text-lg mb-2">SMOKE & FIRE</p>
          <p>&copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}.</p>
        </div>
      </footer>
    </div>
  )
}
