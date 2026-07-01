import { useState } from 'react'
import { motion } from 'framer-motion'
import { CAPABILITIES, CAPABILITIES_INTRO } from '../data'
import { getChapter } from '../lib/chapters'
import { CAPS } from '../lib/caps'
import { useT } from '../lib/i18n'

const ease = [0.16, 1, 0.3, 1] as const
// Hover motion loops are an ultra-tier enhancement only — never on coarse /
// lite / reduced-motion hardware, which only ever sees the static WebP.
const allowLoop = CAPS.tier === 'ultra' && !CAPS.reduced
const accentHex: Record<string, string> = {
  jade: '#6db7a0',
  amber: '#d6a86a',
  dusk: '#9a8fd6',
  teal: '#7fb1c4',
}

export default function Capabilities() {
  const t = useT()
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
            <span className="eyebrow text-amber">{t(CAPABILITIES_INTRO.kicker)}</span>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.01em] text-mist-100">
              {t(CAPABILITIES_INTRO.title)}
            </h2>
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-mist-500">
            {t(CAPABILITIES_INTRO.note)}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <Card key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

type Capability = (typeof CAPABILITIES)[number]

function Card({ c, i }: { c: Capability; i: number }) {
  const t = useT()
  const chapter = getChapter(c.id)
  const [hovered, setHovered] = useState(false)
  // Load the loop only on capable hardware, and only lazily after first hover —
  // it never touches the section's initial budget.
  const showLoop = allowLoop && !!chapter?.loop
  const loopIn = showLoop && hovered
  const [loopReady, setLoopReady] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: (i % 2) * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false)
        setLoopReady(false)
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800/60 p-8 transition-colors duration-300 hover:bg-ink-700 sm:p-10"
    >
      {/* Branded discipline texture — a quiet, restrained wash behind the type. */}
      {chapter && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src={chapter.img}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ opacity: loopReady ? 0 : undefined }}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.12] transition-opacity duration-700 group-hover:opacity-[0.16]"
          />
          {loopIn && (
            <video
              src={chapter.loop}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              aria-hidden
              tabIndex={-1}
              onCanPlay={() => setLoopReady(true)}
              style={{ opacity: loopReady ? 0.16 : 0 }}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />
          )}
          {/* Legibility scrim: keeps the copy fully readable over the texture. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/85 to-ink-800/60" />
        </div>
      )}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${accentHex[c.accent]}40` }}
      />
      <div className="relative flex items-center justify-between">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accentHex[c.accent] }} />
        <span className="font-mono text-[11px] uppercase tracking-widest text-mist-500">0{i + 1}</span>
      </div>
      <h3 className="relative mt-6 font-sans text-2xl font-semibold text-mist-100">{t(c.title)}</h3>
      <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-mist-300">{t(c.blurb)}</p>
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
  )
}
