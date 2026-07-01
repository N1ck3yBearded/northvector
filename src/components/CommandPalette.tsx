import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLang, useT, type Loc } from '../lib/i18n'
import { BRAND, WORK } from '../data'

// ⌘K command palette — the accessibility axis of the site. Fully keyboard-
// operable, ARIA-wired listbox, focus-trapped dialog, reduced-motion aware.
// Mounted once globally by App.tsx. No props.

type Command = {
  id: string
  label: Loc
  hint?: Loc
  run: () => void
}

// Bilingual, self-contained labels. Section anchors first, then actions.
const NAV_HINT: Loc = { en: 'Go to section', ru: 'К разделу' }

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const t = useT()
  const { lang, setLang } = useLang()
  const reduced = useReducedMotion()

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])
  // Element focused before the palette opened — restored on close.
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const baseId = useId()
  const listboxId = `${baseId}-listbox`
  const optionId = (i: number) => `${baseId}-option-${i}`

  // Smooth-scroll to an anchor, respecting reduced-motion.
  const goTo = useCallback(
    (anchor: string) => {
      const el = document.getElementById(anchor.replace(/^#/, ''))
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  const copyEmail = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(BRAND.contact).catch(() => {})
    }
  }, [])

  // The full command set. Rebuilt when language/callbacks change so labels and
  // the toggle target stay in sync.
  const commands = useMemo<Command[]>(() => {
    const sections: Array<{ anchor: string; label: Loc }> = [
      { anchor: '#top', label: { en: 'Home', ru: 'В начало' } },
      { anchor: '#packages', label: { en: 'Packages', ru: 'Пакеты' } },
      { anchor: '#manifesto', label: { en: 'How I work', ru: 'Как я работаю' } },
      { anchor: '#showreel', label: { en: 'Showreel', ru: 'Шоурил' } },
      { anchor: '#lab', label: { en: 'Python lab', ru: 'Python-лаборатория' } },
      { anchor: '#capabilities', label: { en: 'Capabilities', ru: 'Возможности' } },
      { anchor: '#work', label: { en: 'Work', ru: 'Работы' } },
      { anchor: '#audit', label: { en: 'Self-audit', ru: 'Самоаудит' } },
      { anchor: '#contact', label: { en: 'Contact', ru: 'Контакты' } },
    ]

    const list: Command[] = sections.map((s) => ({
      id: `nav${s.anchor}`,
      label: s.label,
      hint: NAV_HINT,
      run: () => goTo(s.anchor),
    }))

    list.push({
      id: 'lang',
      label:
        lang === 'en'
          ? { en: 'Switch to Russian', ru: 'Переключить на русский' }
          : { en: 'Switch to English', ru: 'Переключить на английский' },
      hint: { en: 'Language', ru: 'Язык' },
      run: () => setLang(lang === 'en' ? 'ru' : 'en'),
    })

    for (const w of WORK) {
      list.push({
        id: `work-${w.name}`,
        label: { en: `Open ${w.name}`, ru: `Открыть ${w.name}` },
        hint: w.kind,
        run: () => window.open(w.link, '_blank', 'noopener'),
      })
    }

    list.push({
      id: 'copy-email',
      label: { en: 'Copy email', ru: 'Скопировать e-mail' },
      hint: { en: BRAND.contact, ru: BRAND.contact },
      run: copyEmail,
    })

    return list
  }, [lang, setLang, goTo, copyEmail])

  // Case-insensitive filter on the current-language label.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => t(c.label).toLowerCase().includes(q))
  }, [commands, query, t])

  // No clamp effect needed: every query change resets `active` to 0 (onChange),
  // arrow keys wrap with modulo, and the command count is language-invariant —
  // so `active` can never fall out of range.

  const close = useCallback(() => setOpen(false), [])

  // Open + reset in one place, so the reset never lives in an effect body.
  const openPalette = useCallback(() => {
    setQuery('')
    setActive(0)
    setOpen(true)
  }, [])

  const runAt = useCallback(
    (index: number) => {
      const cmd = filtered[index]
      if (!cmd) return
      cmd.run()
      close()
    },
    [filtered, close],
  )

  // ── Global open triggers: Cmd/Ctrl+K, and "/" when not typing. ──
  useEffect(() => {
    const isTyping = (el: EventTarget | null) => {
      const node = el as HTMLElement | null
      if (!node) return false
      const tag = node.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || node.isContentEditable
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const cmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')
      if (cmdK) {
        e.preventDefault()
        if (open) close()
        else openPalette()
        return
      }
      if (e.key === '/' && !open && !isTyping(e.target)) {
        e.preventDefault()
        openPalette()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close, openPalette])

  // ── Focus management: capture, move to input, restore on close. ──
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      // Focus after the dialog paints. (Query/active are reset in openPalette,
      // not here — no setState in an effect body.)
      const id = window.requestAnimationFrame(() => inputRef.current?.focus())
      return () => window.cancelAnimationFrame(id)
    }
    // On close, restore focus to whatever had it before.
    const prev = restoreFocusRef.current
    if (prev && typeof prev.focus === 'function') prev.focus()
  }, [open])

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) return
    optionRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  // ── Dialog-scoped keyboard handling: nav, run, esc, focus trap. ──
  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filtered.length) setActive((i) => (i + 1) % filtered.length)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filtered.length) setActive((i) => (i - 1 + filtered.length) % filtered.length)
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      if (filtered.length) setActive(filtered.length - 1)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      runAt(active)
      return
    }

    // Focus trap: only the input is tabbable inside, so Tab loops to it.
    if (e.key === 'Tab') {
      e.preventDefault()
      inputRef.current?.focus()
    }
  }

  const activeId = filtered.length ? optionId(active) : undefined

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink-900/70 px-4 pt-[18vh] backdrop-blur"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
          onMouseDown={(e) => {
            // Backdrop click (not a click inside the panel) closes.
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'en' ? 'Command palette' : 'Командная палитра'}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-800/90 shadow-2xl shadow-black/40 backdrop-blur-xl"
            initial={reduced ? false : { opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onDialogKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span aria-hidden className="font-mono text-xs text-mist-500">
                ⌘K
              </span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                aria-label={lang === 'en' ? 'Type a command' : 'Введите команду'}
                spellCheck={false}
                autoComplete="off"
                placeholder={lang === 'en' ? 'Type a command…' : 'Введите команду…'}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                className="w-full bg-transparent text-sm text-mist-100 placeholder:text-mist-500 focus:outline-none"
              />
            </div>

            {/* Command list */}
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={lang === 'en' ? 'Commands' : 'Команды'}
              className="max-h-[46vh] overflow-y-auto py-2"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-mist-500" role="presentation">
                  {lang === 'en' ? 'No matching commands' : 'Ничего не найдено'}
                </li>
              )}

              {filtered.map((cmd, i) => {
                const isActive = i === active
                return (
                  <li
                    key={cmd.id}
                    ref={(node) => {
                      optionRefs.current[i] = node
                    }}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(i)}
                    onClick={() => runAt(i)}
                    className={[
                      'mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm',
                      isActive
                        ? 'bg-amber/15 text-amber ring-1 ring-amber/40'
                        : 'text-mist-300 hover:text-mist-100',
                    ].join(' ')}
                  >
                    <span className="truncate">{t(cmd.label)}</span>
                    {cmd.hint && (
                      <span
                        className={[
                          'shrink-0 truncate text-[11px]',
                          isActive ? 'text-amber/70' : 'text-mist-500',
                        ].join(' ')}
                      >
                        {t(cmd.hint)}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Legend */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[11px] text-mist-500">
              <span>↑↓ · Enter · Esc</span>
              <span>{lang === 'en' ? 'Command palette' : 'Палитра команд'}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
