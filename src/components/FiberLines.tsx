import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Animated "fiber bundle" background. Each line is a streamline traced through a
 * sum-of-sines flow-field — not a random sine wave — which is what gives the
 * coherent, woven look instead of noise. Framer's `pathLength` maps to
 * stroke-dashoffset, so every path draws itself in, staggered, on mount.
 */

const ease = [0.16, 1, 0.3, 1] as const
const W = 1280
const H = 800

type Props = {
  className?: string
  count?: number
  accent?: string
  accentIndices?: number[]
  monoColor?: string
  baseOpacity?: number
  strokeBase?: number
  delayBase?: number
  reduced?: boolean
  seed?: number
}

// flow-field angle (radians) — base sweep left→right, woven by layered sines.
// per-line phase `p` shifts the field slightly so streamlines cross = "woven".
function flowAngle(x: number, y: number, p: number) {
  const nx = x / W
  const ny = y / H
  return (
    -0.1 +
    0.62 * Math.sin(ny * 2.6 + nx * 1.1 + p) +
    0.34 * Math.sin(ny * 5.3 - nx * 1.9 + p * 1.3) +
    0.16 * Math.sin(nx * 3.4 + p * 0.6)
  )
}

function trace(y0: number, phase: number) {
  let x = -80
  let y = y0
  let d = `M${x.toFixed(1)} ${y.toFixed(1)}`
  for (let i = 0; i < 260 && x < W + 80; i++) {
    const a = flowAngle(x, y, phase)
    x += Math.cos(a) * 9
    y += Math.sin(a) * 9
    d += `L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

export default function FiberLines({
  className = '',
  count = 44,
  accent = '#d6a86a',
  accentIndices = [],
  monoColor = '#c9cad3',
  baseOpacity = 0.42,
  strokeBase = 1,
  delayBase = 0.15,
  reduced = false,
  seed = 1,
}: Props) {
  const lines = useMemo(() => {
    // deterministic jitter so the bundle is stable but organic
    let s = (seed * 2654435761) >>> 0
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
    const out: {
      d: string
      color: string
      op: number
      sw: number
      delay: number
      dur: number
    }[] = []
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const y0 = H * (0.02 + 0.96 * t) + (rnd() - 0.5) * 22
      const phase = i * 0.17 + seed * 0.9
      const isAccent = accentIndices.includes(i)
      out.push({
        d: trace(y0, phase),
        color: isAccent ? accent : monoColor,
        op: isAccent ? baseOpacity + 0.3 : baseOpacity * (0.45 + rnd() * 0.7),
        sw: isAccent ? strokeBase + 0.5 : strokeBase * (0.55 + rnd() * 0.7),
        delay: delayBase + t * 1.0 + rnd() * 0.22,
        dur: 1.5 + rnd() * 0.9,
      })
    }
    return out
  }, [count, accent, accentIndices, monoColor, baseOpacity, strokeBase, delayBase, seed])

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {lines.map((l, i) => (
        <motion.path
          key={i}
          d={l.d}
          stroke={l.color}
          strokeWidth={l.sw}
          strokeLinecap="round"
          style={{ opacity: l.op }}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : l.dur, delay: reduced ? 0 : l.delay, ease }}
        />
      ))}
    </svg>
  )
}
