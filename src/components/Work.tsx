import { motion } from 'framer-motion'
import { WORK, WORK_INTRO } from '../data'
import { useT } from '../lib/i18n'

const ease = [0.16, 1, 0.3, 1] as const

const TEXTURE = ['/articles/il-fe.webp', '/articles/il-data.webp', '/articles/il-ai.webp']

export default function Work() {
  const t = useT()
  return (
    <section id="work" className="relative overflow-hidden border-t border-white/5 py-20 sm:py-24">
      {/* Faint atmospheric texture — the disciplines I work in, kept quiet. Purely decorative. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.12 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 select-none sm:flex"
      >
        <div className="ml-auto flex h-full w-full items-center justify-end gap-4 pr-2">
          {TEXTURE.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-24 w-auto rounded-sm object-cover grayscale"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent" />
      </motion.div>

      <div className="container-px relative mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col gap-8 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <p className="max-w-xs text-[14px] leading-relaxed text-mist-500">{t(WORK_INTRO.lead)}</p>

          <ul className="flex flex-col gap-6 sm:max-w-md">
            {WORK.map((w) => (
              <li key={w.name} className="flex flex-col gap-1">
                {w.link ? (
                  <a
                    href={w.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-baseline gap-2 text-mist-300 transition-colors hover:text-amber"
                  >
                    <span className="text-[15px]">{w.name}</span>
                    <span className="font-mono text-[11px] text-mist-500 group-hover:text-amber/70">
                      {t(w.kind)} ↗
                    </span>
                  </a>
                ) : (
                  <span className="inline-flex items-baseline gap-2 text-mist-300">
                    <span className="text-[15px]">{w.name}</span>
                    <span className="font-mono text-[11px] text-mist-500">{t(w.kind)}</span>
                  </span>
                )}
                {w.note && (
                  <span className="text-[12px] leading-relaxed text-mist-500">{t(w.note)}</span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
