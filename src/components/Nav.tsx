import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'

const LINKS = [
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Showreel', href: '#showreel' },
  { label: 'Lab', href: '#lab' },
  { label: 'Work', href: '#work' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      <nav
        className={`mt-4 flex w-[min(1200px,92vw)] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          scrolled ? 'border border-white/10 bg-ink-800/70 backdrop-blur-xl' : 'border border-transparent'
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-mist-300 transition-colors duration-200 hover:text-amber"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full border border-amber/40 bg-amber/10 px-4 py-2 text-[13px] font-medium text-amber transition-colors duration-200 hover:bg-amber/20 md:inline-block"
        >
          Start a project
        </a>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="grid h-8 w-8 place-items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber md:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-mist-100 transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-mist-100 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-mist-100 transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[68px] w-[92vw] rounded-2xl border border-white/10 bg-ink-800/90 p-5 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-mist-300 hover:text-amber"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full border border-amber/40 bg-amber/10 px-4 py-2.5 text-center text-sm font-medium text-amber"
            >
              Start a project
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
