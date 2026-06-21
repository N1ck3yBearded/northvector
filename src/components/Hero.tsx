import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import FiberLines from './FiberLines'
import { BRAND, BUILD_NOUNS, HERO } from '../data'

const ease = [0.16, 1, 0.3, 1] as const

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function CyclingNoun() {
  const [i, setI] = useState(0)
  const reduced = reducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((v) => (v + 1) % BUILD_NOUNS.length), 2400)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '0.5em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.5em', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="whitespace-nowrap italic text-amber"
        >
          {BUILD_NOUNS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Masked line reveal — type rises into frame. */
function Rise({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span className={`block overflow-hidden pb-[0.14em] ${className}`}>
      <motion.span
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, ease, delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const reduced = reducedMotion()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 110])
  const linesY = useTransform(scrollYProgress, [0, 0.3], [0, -70])
  const opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* monochrome base — a single faint warm vignette, nothing else */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(110% 90% at 62% 38%, rgba(214,168,106,0.08), transparent 58%)',
        }}
      />

      {/* woven fibers — bulk of the bundle, BEHIND the headline */}
      <motion.div
        style={{ y: linesY }}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <FiberLines className="h-full w-full" count={26} reduced={reduced} seed={7} />
      </motion.div>

      {/* legibility scrims */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-ink-900 via-ink-900/40 to-ink-900/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44 bg-gradient-to-t from-ink-900 to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="container-px relative z-10 mx-auto w-full max-w-[1280px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="eyebrow text-amber">[ {BRAND.location} ]</span>
          <span className="eyebrow text-mist-500">[ web · studio ]</span>
        </motion.div>

        <h1 className="display text-[clamp(3.2rem,12vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.03em] text-mist-100">
          <Rise delay={0.12}>{HERO.lead}</Rise>
          <Rise delay={0.26} className="mt-0.5">
            We build <CyclingNoun />
          </Rise>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.62 }}
          className="mt-9 max-w-xl text-pretty text-base leading-relaxed text-mist-300 sm:text-lg"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.74 }}
          className="mt-11 flex flex-wrap items-center gap-4"
        >
          <a
            href="#showreel"
            className="group inline-flex items-center gap-2 rounded-full bg-mist-100 px-6 py-3.5 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5"
          >
            See the showreel
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm text-mist-300 transition-colors duration-200 hover:border-amber/60 hover:text-amber"
          >
            Start a project
          </a>
        </motion.div>
      </motion.div>

      {/* a few accent strands woven OVER the type via blend — the "woven" read */}
      <motion.div
        style={{ y: linesY }}
        className="pointer-events-none absolute inset-0 z-[20] mix-blend-soft-light"
      >
        <FiberLines
          className="h-full w-full"
          count={7}
          accent="#d6a86a"
          accentRatio={1}
          baseOpacity={0.6}
          strokeBase={1.2}
          delayBase={0.6}
          reduced={reduced}
          seed={31}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="eyebrow text-mist-500">scroll</span>
          <div className="h-9 w-px bg-gradient-to-b from-amber to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
