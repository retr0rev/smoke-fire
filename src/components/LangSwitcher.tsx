import { useLang } from '../i18n/context'

export function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="h-10 px-3 text-sm font-medium text-text-secondary hover:text-orange border border-border rounded transition-colors"
    >
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  )
}
