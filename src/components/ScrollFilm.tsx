import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * Scroll-film: the Northvector story as one continuous, scroll-scrubbed film.
 * A tall section pins a full-bleed <video>; a self-managed progress value
 * (read from the section's rect each frame — robust under Lenis + a tall sticky)
 * drives currentTime, RAF-lerped so seeking stays buttery. Nine text beats fade
 * in on the calm middle of each scene.
 *
 * A persistent frame ties the scenes into one film: cinematic letterbox bars, a
 * vertical "north vector" progress rail, and a 01–09 chapter index. v2 —
 * photoreal cinematic: a client's idea (a warm spark) comes to life through one
 * builder, in Toronto, into a living product. Honors reduced-motion.
 */

const FILM_SRC = '/film/master_v2_scrub.mp4'
const POSTER = '/film/v2/F1.png'

const A = { amber: '#d6a86a', jade: '#6db7a0', dusk: '#9a8fd6', teal: '#7fb1c4' }

type Beat = {
  eyebrow: string
  title: string
  sub?: string
  accent: string
  cta?: boolean
}

const BEATS: Beat[] = [
  { eyebrow: 'Northvector · Toronto', title: 'You bring the idea.', sub: 'And I take it from there — designed and coded, end to end.', accent: A.amber },
  { eyebrow: 'One head, no handoffs', title: 'One mind. The whole product.', sub: 'Design, code, and the call on what matters — in one place.', accent: A.amber },
  { eyebrow: 'Toronto · remote worldwide', title: 'Built where the lights stay on.', sub: 'From Toronto, for the web.', accent: A.teal },
  { eyebrow: 'The craft', title: 'Made by hand, end to end.', sub: 'No template. No telephone game.', accent: A.dusk },
  { eyebrow: 'For people', title: 'For the people who’ll use it.', sub: 'Real problems, real interfaces.', accent: A.jade },
  { eyebrow: 'Engineered', title: 'Hardened into a product.', sub: 'Your idea, given real structure.', accent: A.amber },
  { eyebrow: 'Live', title: 'Your idea — alive.', sub: 'Designed, coded, live and running.', accent: A.jade },
  { eyebrow: 'Shipped', title: 'Out in the world.', sub: 'Live, in production, doing its job.', accent: A.amber },
  { eyebrow: 'Start something', title: 'Tell me the idea. I’ll build it.', sub: 'A couple of lines about what you’re imagining is enough.', accent: A.amber, cta: true },
]

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function BeatText({
  beat,
  t,
  isFirst,
  isLast,
  progress,
}: {
  beat: Beat
  t: number
  isFirst: boolean
  isLast: boolean
  progress: MotionValue<number>
}) {
  const w = 0.05
  const p = 0.02
  let range: number[]
  let opa: number[]
  let yv: number[]
  if (isFirst) {
    range = [0, t + p, t + w]
    opa = [1, 1, 0]
    yv = [0, 0, -30]
  } else if (isLast) {
    range = [t - w, t - p, 1]
    opa = [0, 1, 1]
    yv = [30, 0, 0]
  } else {
    range = [t - w, t - p, t + p, t + w]
    opa = [0, 1, 1, 0]
    yv = [30, 0, 0, -30]
  }
  const opacity = useTransform(progress, range, opa)
  const y = useTransform(progress, range, yv)

  return (
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-0 flex items-center">
      <div className="container-px mx-auto w-full max-w-[1200px]">
        <div className="max-w-2xl">
          <span className="eyebrow" style={{ color: beat.accent }}>
            {beat.eyebrow}
          </span>
          <p className="display mt-5 text-[clamp(2.4rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-mist-100">
            {beat.title}
          </p>
          {beat.sub && (
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-mist-300 sm:text-lg">
              {beat.sub}
            </p>
          )}
          {beat.cta && (
            <a
              href="#contact"
              className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-mist-100 px-6 py-3.5 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start a project
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ScrollFilm() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReduced] = useState(prefersReduced)
  const [ready, setReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const progress = useMotionValue(0)
  const durationRef = useRef(0)

  const hintFade = useTransform(progress, [0, 0.04], [1, 0])

  // Drive the 01–09 chapter index from scroll (only re-renders on a change).
  useMotionValueEvent(progress, 'change', (v) => {
    const c = Math.max(0, Math.min(BEATS.length - 1, Math.floor(v * BEATS.length)))
    setChapter((prev) => (prev === c ? prev : c))
  })

  useEffect(() => {
    if (isReduced) return
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    const onMeta = () => {
      durationRef.current = video.duration || 0
      // Kick the browser into buffering frame data so scrubbing has frames to
      // show (a muted, paused, preload video can otherwise stall at metadata).
      const pp = video.play()
      if (pp && typeof pp.then === 'function') pp.then(() => video.pause()).catch(() => {})
      setReady(true)
    }
    if (video.readyState >= 1) onMeta()
    else video.addEventListener('loadedmetadata', onMeta)

    let raf = 0
    const loop = () => {
      const rect = wrap.getBoundingClientRect()
      const dist = rect.height - window.innerHeight
      const pr = dist > 0 ? Math.min(1, Math.max(0, -rect.top / dist)) : 0
      progress.set(pr)

      const v = videoRef.current
      if (v && durationRef.current && v.readyState >= 1) {
        const target = pr * durationRef.current
        const diff = target - v.currentTime
        if (Math.abs(diff) > 0.02) v.currentTime = v.currentTime + diff * 0.18
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      cancelAnimationFrame(raf)
    }
  }, [isReduced, progress])

  if (isReduced) {
    return (
      <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900">
        <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-ink-900/30" />
        <div className="container-px relative z-10 mx-auto w-full max-w-[1200px]">
          <div className="max-w-2xl">
            <span className="eyebrow text-amber">Northvector · Toronto</span>
            <h1 className="display mt-5 text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.92] tracking-[-0.03em] text-mist-100">
              You bring the idea.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-mist-300 sm:text-lg">
              And I take it from there — one head, the whole product, designed and coded end to end.
            </p>
            <a
              href="#contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-mist-100 px-6 py-3.5 text-sm font-medium text-ink-900"
            >
              Start a project
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="top" ref={wrapRef} className="relative h-[1000vh] bg-ink-900">
      <h1 className="sr-only">
        Northvector — you bring the idea, I build it. A one-person web studio in Toronto.
      </h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={videoRef}
          src={FILM_SRC}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        {/* legibility grade on the text side */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/35 to-transparent" />

        {BEATS.map((b, i) => (
          <BeatText
            key={i}
            beat={b}
            t={(i + 0.5) / BEATS.length}
            isFirst={i === 0}
            isLast={i === BEATS.length - 1}
            progress={progress}
          />
        ))}

        {/* ── persistent film frame: ties every scene into one structured film ── */}

        {/* cinematic letterbox bars */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[5.5vh] bg-ink-900" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[5.5vh] bg-ink-900" />

        {/* the north-vector progress rail — one line threading all nine scenes */}
        <div className="pointer-events-none absolute left-6 top-[8vh] bottom-[8vh] w-px bg-white/10 sm:left-10">
          <motion.div
            style={{ scaleY: progress }}
            className="absolute inset-0 origin-top bg-gradient-to-b from-amber via-jade to-teal"
          />
        </div>

        {/* chapter index 01 – 09 */}
        <div className="pointer-events-none absolute bottom-[7.5vh] left-6 font-mono text-[11px] tracking-ultra text-mist-500 sm:left-10">
          <span className="text-amber">{String(chapter + 1).padStart(2, '0')}</span>
          <span className="mx-1 text-mist-700">/</span>
          {String(BEATS.length).padStart(2, '0')}
        </div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintFade }}
          className="pointer-events-none absolute bottom-[7.5vh] left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="eyebrow text-mist-500">scroll</span>
            <div className="h-9 w-px bg-gradient-to-b from-amber to-transparent" />
          </div>
        </motion.div>

        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-ink-900">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-amber" />
          </div>
        )}
      </div>
    </section>
  )
}
