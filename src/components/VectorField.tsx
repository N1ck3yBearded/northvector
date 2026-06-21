import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#6db7a0', '#d6a86a', '#9a8fd6', '#7fb1c4']
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Concept 08 → 01, animated. A field of scattered little vectors that rotate to
 * all point north and converge — chaos resolving into one direction. The brand
 * idea (idea → execution) as ambient motion behind the hero.
 */
export default function VectorField({ className = '' }: { className?: string }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const arrows = useMemo(() => {
    const cols = 7
    const rows = 8
    const out: { x: number; y: number; r0: number; op: number; c: string; delay: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let cI = 0; cI < cols; cI++) {
        const jitterX = (Math.random() - 0.5) * 14
        const jitterY = (Math.random() - 0.5) * 14
        const x = 30 + cI * 40 + jitterX
        const y = 24 + r * 40 + jitterY
        // arrows nearer the central "spine" are brighter — they form the vector
        const spine = 1 - Math.min(1, Math.abs(x - 170) / 150)
        out.push({
          x,
          y,
          r0: (Math.random() - 0.5) * 320,
          op: 0.12 + spine * 0.5,
          c: COLORS[(r + cI) % COLORS.length],
          delay: 0.2 + (r / rows) * 0.6 + Math.random() * 0.2,
        })
      }
    }
    return out
  }, [])

  return (
    <svg
      viewBox="0 0 320 360"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {arrows.map((a, i) => (
        <g key={i} transform={`translate(${a.x} ${a.y})`}>
          <motion.g
            initial={reduced ? { rotate: 0, opacity: a.op } : { rotate: a.r0, opacity: 0 }}
            animate={{ rotate: 0, opacity: a.op }}
            transition={{ duration: 1.2, delay: reduced ? 0 : a.delay, ease }}
          >
            <line x1="0" y1="6" x2="0" y2="-6" stroke={a.c} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M0 -6 L-3 -2 M0 -6 L3 -2" stroke={a.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </g>
      ))}
    </svg>
  )
}
