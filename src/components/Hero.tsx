import { useState } from 'react'
import { motion } from 'framer-motion'
import { OFFER } from '../data'
import { useT } from '../lib/i18n'
import { CAPS } from '../lib/caps'

/**
 * Landing-first hero: the offer and the price on the first screen — the one
 * thing the audit found missing. A single optimized cinematic poster sits
 * behind the type (23 KB WebP, no 34 MB scroll-scrub, no Ken Burns). The
 * autoplay loop is an ultra-tier enhancement added later; the poster carries
 * the mood on its own and stays inside the perf budget.
 */

const ease = [0.16, 1, 0.3, 1] as const

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: 0.1 + i * 0.09 },
  }),
}

export default function Hero() {
  const t = useT()
  // Cinema loop is an ultra-tier enhancement only: it never touches the LCP /
  // initial budget (poster carries the first paint), and lite / reduced-motion
  // visitors — most of the referral-mobile traffic — get the static poster.
  const showVideo = CAPS.tier === 'ultra' && !CAPS.reduced
  const [videoIn, setVideoIn] = useState(false)

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900">
      {/* Cinematic poster — LCP-critical, so eager + high priority, never lazy. */}
      <img
        src="/film/hero-poster.webp"
        srcSet="/film/hero-poster-sm.webp 1200w, /film/hero-poster.webp 2560w"
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        style={{ opacity: videoIn ? 0 : 0.45 }}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
      />
      {showVideo && (
        <video
          src="/film/hero-loop.mp4"
          poster="/film/hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setVideoIn(true)}
          style={{ opacity: videoIn ? 0.45 : 0 }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        />
      )}
      {/* Legibility grade on the text side. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/75 to-ink-900/25" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent" />

      <div className="container-px relative z-10 mx-auto w-full max-w-[1200px]">
        <div className="max-w-2xl pt-20">
          <motion.span
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="eyebrow block text-amber"
          >
            {t(OFFER.kicker)}
          </motion.span>

          <motion.h1
            custom={1}
            variants={rise}
            initial="hidden"
            animate="show"
            className="display mt-5 text-[clamp(2.4rem,6.4vw,5.2rem)] font-medium leading-[0.98] text-mist-100"
          >
            {t(OFFER.lead)}
          </motion.h1>

          {/* Price band — the qualify-in-30-seconds signal, on the first screen. */}
          <motion.div
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-7 inline-flex items-baseline gap-3 rounded-full border border-amber/30 bg-amber/[0.07] px-5 py-2.5"
          >
            <span className="font-mono text-2xl font-medium tabular-nums text-amber sm:text-3xl">
              {OFFER.priceBand}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-mist-400">
              {t(OFFER.priceLabel)}
            </span>
          </motion.div>

          <motion.p
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-mist-300 sm:text-lg"
          >
            {t(OFFER.sub)}
          </motion.p>

          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-6 py-3.5 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t(OFFER.ctaPrimary)}
              <span aria-hidden>→</span>
            </a>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-mist-100 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.03]"
            >
              {t(OFFER.ctaSecondary)}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
