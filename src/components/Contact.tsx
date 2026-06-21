import { motion } from 'framer-motion'
import VideoBackdrop from './VideoBackdrop'
import { BRAND, CONTACT } from '../data'

const ease = [0.16, 1, 0.3, 1] as const

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/5 py-32 sm:py-44">
      <VideoBackdrop sceneId="closing" overlay={0.72} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_50%,transparent_30%,rgba(10,11,16,0.85)_100%)]" />

      <div className="container-px relative z-10 mx-auto max-w-[1000px] text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="eyebrow text-amber"
        >
          {CONTACT.kicker}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="display mx-auto mt-7 max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.01em] text-mist-100"
        >
          {CONTACT.title} <span className="shimmer-text italic">{CONTACT.titleAccent}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.16 }}
          className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-mist-300 sm:text-base"
        >
          {CONTACT.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.24 }}
          className="mt-12"
        >
          <a
            href={`mailto:${BRAND.contact}?subject=Project%20idea%20—%20Northvector`}
            className="group inline-flex items-center gap-2 rounded-full bg-mist-100 px-8 py-4 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start a project
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <p className="mt-7 font-mono text-[11px] uppercase tracking-ultra text-mist-500">
            usually replies within a day · {BRAND.location}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
