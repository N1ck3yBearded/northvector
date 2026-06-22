import { motion } from 'framer-motion'
import { CAPABILITIES } from '../data'

const ease = [0.16, 1, 0.3, 1] as const
const accentHex: Record<string, string> = {
  jade: '#6db7a0',
  amber: '#d6a86a',
  dusk: '#9a8fd6',
  teal: '#7fb1c4',
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-xl">
            <span className="eyebrow text-amber">What I build</span>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.01em] text-mist-100">
              Whatever the web needs to be.
            </h2>
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-mist-500">
            Not a menu of templates — a way of working. Bring the problem; I pick the form that fits.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: (i % 2) * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/60 p-8 transition-colors duration-300 hover:bg-ink-700 sm:p-10"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `${accentHex[c.accent]}40` }}
              />
              <div className="relative flex items-center justify-between">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accentHex[c.accent] }} />
                <span className="font-mono text-[11px] uppercase tracking-widest text-mist-500">
                  0{i + 1}
                </span>
              </div>
              <h3 className="relative mt-6 font-sans text-2xl font-semibold text-mist-100">{c.title}</h3>
              <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-mist-300">{c.blurb}</p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-mist-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
