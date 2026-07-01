import { createContext, useCallback, useContext } from 'react'

// Lightweight bilingual layer. All site copy lives as { en, ru } pairs in
// data.ts; components resolve them with useT(). No heavy i18n library — this
// is a two-language landing, not a localization platform.
// The <LangProvider> component lives in ./LangProvider (kept separate so this
// module exports only hooks/constants — good for HMR fast-refresh).

export type Lang = 'en' | 'ru'
export type Loc = { en: string; ru: string }

export const STORAGE_KEY = 'nv-lang'

export function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ru') return saved
  } catch {
    /* private-mode / disabled storage — fall through to navigator */
  }
  const nav = window.navigator.language?.toLowerCase() ?? ''
  return nav.startsWith('ru') ? 'ru' : 'en'
}

export type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void }

export const LangContext = createContext<LangCtx | null>(null)

export function useLang(): LangCtx {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within <LangProvider>')
  return ctx
}

/** Returns a resolver `t(loc)` bound to the current language. */
export function useT() {
  const { lang } = useLang()
  return useCallback((loc: Loc) => loc[lang], [lang])
}
