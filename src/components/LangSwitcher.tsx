import { useLang } from '../i18n/context'

export function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="h-10 px-3 text-sm font-medium text-orange hover:text-amber transition-colors"
    >
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  )
}
