import { Suspense, lazy, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SCENES } from '../data'
import DefiDashboard from './DefiDashboard'

const ImmersiveCanvas = lazy(() => import('./ImmersiveCanvas'))
const ease = [0.16, 1, 0.3, 1] as const

const accentHex: Record<string, string> = {
  jade: '#6db7a0',
  amber: '#d6a86a',
  dusk: '#9a8fd6',
  teal: '#7fb1c4',
}

function SceneHeader({ scene, dark = true }: { scene: (typeof SCENES)[number]; dark?: boolean }) {
  const sub = dark ? 'text-mist-500' : 'text-paper-900/60'
  const body = dark ? 'text-mist-300' : 'text-paper-900/75'
  const title = dark ? 'text-mist-100' : 'text-paper-900'
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs" style={{ color: accentHex[scene.accent] }}>
          {scene.index}
        </span>
        <span className="eyebrow" style={{ color: accentHex[scene.accent] }}>
          {scene.kicker}
        </span>
      </div>
      <h3 className={`display mt-5 text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-[1.04] tracking-[-0.01em] ${title}`}>
        {scene.title}
      </h3>
      <p className={`mt-5 max-w-md text-[15px] leading-relaxed ${body}`}>{scene.body}</p>
      <p className={`mt-6 font-mono text-[11px] uppercase tracking-ultra ${sub}`}>{scene.style}</p>
    </div>
  )
}

/* 01 — Immersive: real-time WebGL, dark */
function ImmersiveScene() {
  const scene = SCENES[0]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  return (
    <div ref={ref} className="relative grid items-center gap-10 lg:grid-cols-2">
      <SceneHeader scene={scene} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
        className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_70%_20%,rgba(154,143,214,0.16),transparent_60%)]"
      >
        <Suspense fallback={null}>
          <ImmersiveCanvas active={inView} />
        </Suspense>
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-ultra text-mist-500">
          live · webgl · 60fps
        </span>
      </motion.div>
    </div>
  )
}

/* 02 — Editorial: light, airy, serif */
function EditorialScene() {
  const scene = SCENES[1]
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-paper-50 p-10 sm:p-16">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SceneHeader scene={scene} dark={false} />
        <div className="relative">
          <div className="display text-[clamp(3rem,9vw,7rem)] font-medium leading-[0.9] tracking-[-0.02em] text-paper-900">
            Aa
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-paper-900/10 pt-6">
            <p className="text-[13px] leading-relaxed text-paper-900/70">
              Type that carries the brand. Measured columns, real hierarchy, and white space used on purpose.
            </p>
            <p className="text-[13px] leading-relaxed text-paper-900/70">
              The same person who builds the dark, kinetic stuff also knows when to step back and let the work breathe.
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            {['Serif', 'Editorial', 'Whitespace'].map((t) => (
              <span key={t} className="rounded-full border border-paper-900/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-900/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* 03 — Product: a real, live DeFi dashboard (no mock) */
function ProductScene() {
  const scene = SCENES[2]
  return (
    <div className="relative grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <SceneHeader scene={scene} />
      <DefiDashboard />
    </div>
  )
}

export default function Showreel() {
  return (
    <section id="showreel" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-jade">Showreel</span>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.01em] text-mist-100">
            One person. <span className="italic text-amber">Any</span> style.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-mist-300">
            I don’t have one signature look. Below are three builds in three different styles — dark 3D,
            quiet editorial, a live product UI — all running right here, not screenshots.
          </p>
        </motion.div>

        <div className="mt-20 space-y-24">
          <ImmersiveScene />
          <EditorialScene />
          <ProductScene />
        </div>
      </div>
    </section>
  )
}
