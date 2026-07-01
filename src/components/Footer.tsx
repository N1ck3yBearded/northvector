import Logo from './Logo'
import { BRAND, UI } from '../data'
import { useT } from '../lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="container-px mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 py-12 sm:flex-row sm:items-center">
        <Logo />
        <p className="max-w-xs font-mono text-[11px] uppercase tracking-ultra text-mist-500">
          {t(BRAND.tagline)}
        </p>
        <a
          href={`mailto:${BRAND.contact}`}
          className="text-[13px] text-mist-500 transition-colors duration-200 hover:text-amber"
        >
          {t(UI.footerCta)}
        </a>
      </div>
      <div className="border-t border-white/5 py-5">
        <div className="container-px mx-auto flex max-w-[1200px]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist-500">
            © 2026 {BRAND.name} · built by {BRAND.founder}
          </span>
        </div>
      </div>
    </footer>
  )
}
