import Logo from './Logo'
import { BRAND } from '../data'
import { hasMedia } from '../lib/media'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="container-px mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 py-12 sm:flex-row sm:items-center">
        <Logo />
        <p className="max-w-xs font-mono text-[11px] uppercase tracking-ultra text-mist-700">
          {BRAND.tagline}
        </p>
        <a
          href={`mailto:${BRAND.contact}`}
          className="text-[13px] text-mist-500 transition-colors duration-200 hover:text-amber"
        >
          Start a project
        </a>
      </div>
      <div className="border-t border-white/5 py-5">
        <div className="container-px mx-auto flex max-w-[1200px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist-700">
            © 2026 {BRAND.name} — idea meets build
          </span>
          {hasMedia() && (
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-widest text-mist-700 transition-colors hover:text-mist-500"
            >
              footage via Pexels
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
