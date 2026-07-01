import { motion } from 'framer-motion'
import { PACKAGES, PACKAGES_INTRO, PACKAGE_META, type Accent } from '../data'
import { useT } from '../lib/i18n'

const ease = [0.16, 1, 0.3, 1] as const

// Accent hex per package. Colour is decorative here — meaning is carried by the
// letter, the discipline tag and the price, so it reads without relying on hue.
const ACC: Record<Accent, string> = { jade: '#6db7a0', amber: '#d6a86a', teal: '#7fb1c4' }

export default function Packages() {
  const t = useT()

  return (
    <section id="packages" className="relative border-t border-white/5 py-24 sm:py-32">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-amber">{t(PACKAGES_INTRO.kicker)}</span>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.04] text-mist-100">
            {t(PACKAGES_INTRO.title)}
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-mist-300">
            {t(PACKAGES_INTRO.note)}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p, i) => {
            const accent = ACC[p.accent]
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm" style={{ color: accent }}>
                    {p.letter}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mist-500">
                    {p.disciplines}
                  </span>
                </div>

                <h3 className="mt-4 text-[19px] font-medium leading-snug text-mist-100">
                  {t(p.title)}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-medium tabular-nums" style={{ color: accent }}>
                    {p.price}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mist-500">
                    {t(PACKAGE_META.priceLabel)}
                  </span>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-mist-300">{t(p.summary)}</p>

                <div className="mt-6 space-y-4 border-t border-white/5 pt-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-mist-500">
                      {t(PACKAGE_META.includes)}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {p.includes.map((it, k) => (
                        <li key={k} className="flex gap-2 text-[13px] leading-snug text-mist-300">
                          <span aria-hidden style={{ color: accent }}>
                            +
                          </span>
                          <span>{t(it)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-mist-600">
                      {t(PACKAGE_META.excludes)}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {p.excludes.map((it, k) => (
                        <li key={k} className="flex gap-2 text-[13px] leading-snug text-mist-500">
                          <span aria-hidden className="text-mist-700">
                            −
                          </span>
                          <span>{t(it)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
