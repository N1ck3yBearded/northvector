import { motion } from 'framer-motion'
import { WORK } from '../data'

const ease = [0.16, 1, 0.3, 1] as const

export default function Work() {
  return (
    <section id="work" className="relative border-t border-white/5 py-20 sm:py-24">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col gap-8 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <p className="max-w-xs text-[14px] leading-relaxed text-mist-500">
            <span className="text-mist-300">A few other things I’ve shipped.</span> Quietly, but they’re
            real and running.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {WORK.map((w) =>
              w.link ? (
                <li key={w.name}>
                  <a
                    href={w.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-baseline gap-2 text-mist-300 transition-colors hover:text-amber"
                  >
                    <span className="text-[15px]">{w.name}</span>
                    <span className="font-mono text-[11px] text-mist-500 group-hover:text-amber/70">
                      {w.kind} ↗
                    </span>
                  </a>
                </li>
              ) : (
                <li key={w.name} className="inline-flex items-baseline gap-2 text-mist-300">
                  <span className="text-[15px]">{w.name}</span>
                  <span className="font-mono text-[11px] text-mist-500">{w.kind}</span>
                </li>
              )
            )}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
