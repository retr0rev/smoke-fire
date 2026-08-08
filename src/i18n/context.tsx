import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Language, Translations } from './types'
import en from './en.json'
import ar from './ar.json'

const dictionaries: Record<Language, Translations> = { en, ar }

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  dir: 'ltr' | 'rtl'
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'ar') return stored
    return 'en'
  })

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }, [])

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    document.documentElement.style.fontFamily =
      lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-body)'
  }, [dir, lang])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const dict = dictionaries[lang]
    let value = dict[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }
    return value
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, dir, t }), [lang, setLang, dir, t])

  return (
    <LanguageContext value={value}>
      {children}
    </LanguageContext>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
