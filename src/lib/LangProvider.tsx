import { useEffect, useState, type ReactNode } from 'react'
import { LangContext, initialLang, STORAGE_KEY, type Lang } from './i18n'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  // Persist the choice and keep <html lang> honest for a11y + SEO.
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore disabled storage */
    }
  }, [lang])

  const toggle = () => setLang((p) => (p === 'en' ? 'ru' : 'en'))

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}
