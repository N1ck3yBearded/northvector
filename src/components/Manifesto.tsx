import { motion } from 'framer-motion'
import { MANIFESTO } from '../data'

const ease = [0.16, 1, 0.3, 1] as const

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative border-t border-white/5 py-32 sm:py-44">
      <div className="container-px mx-auto max-w-[1100px]">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="eyebrow text-amber"
        >
          {MANIFESTO.kicker}
        </motion.span>

        <div className="mt-10 space-y-6">
          {MANIFESTO.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.12 }}
              className={`display max-w-4xl text-balance leading-[1.12] tracking-[-0.01em] ${
                i === 0
                  ? 'text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium text-mist-100'
                  : 'text-[clamp(1.3rem,2.6vw,2.1rem)] font-normal text-mist-300'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mt-16 h-px w-40 origin-left bg-gradient-to-r from-amber/60 to-transparent"
        />
      </div>
    </section>
  )
}
