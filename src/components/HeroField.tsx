import { useEffect, useMemo, useRef } from 'react'

// A living "north-vector" field. A grid of amber strokes points north by
// default and swings to face the cursor within a falloff radius — alive,
// interactive, on-brand. Position is static SVG; only rotation animates
// (CSS transform + transition), so it stays smooth. Reduced-motion = static.

const W = 1200
const H = 760
const COLS = 18
const ROWS = 11
const RADIUS = 200 // px (in viewBox units) of cursor influence

type Vec = { x: number; y: number; len: number; op: number }

function buildGrid(): Vec[] {
  let s = 20260621 >>> 0
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  const out: Vec[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = ((c + 0.5) / COLS) * W + (rnd() - 0.5) * 22
      const y = ((r + 0.5) / ROWS) * H + (rnd() - 0.5) * 22
      out.push({ x, y, len: 8 + rnd() * 8, op: 0.16 + rnd() * 0.5 })
    }
  }
  return out
}

function shortAngle(d: number): number {
  return (((d % 360) + 540) % 360) - 180
}

export default function HeroField({ reduced = false }: { reduced?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const vecs = useMemo(buildGrid, [])

  useEffect(() => {
    if (reduced) return
    const svg = ref.current
    if (!svg) return
    const lines = svg.querySelectorAll<SVGLineElement>('line[data-v]')
    let raf = 0
    let mx = -9999
    let my = -9999

    const apply = () => {
      raf = 0
      for (let i = 0; i < lines.length; i++) {
        const v = vecs[i]
        const dx = mx - v.x
        const dy = my - v.y
        const infl = Math.exp(-(dx * dx + dy * dy) / (2 * RADIUS * RADIUS))
        const toCursor = (Math.atan2(dy, dx) * 180) / Math.PI
        const angle = -90 + infl * shortAngle(toCursor - -90)
        lines[i].style.transform = `rotate(${angle.toFixed(1)}deg)`
      }
    }
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width) * W
      my = ((e.clientY - r.top) / r.height) * H
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      mx = -9999
      my = -9999
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced, vecs])

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
    >
      {vecs.map((v, i) => (
        <line
          key={i}
          data-v=""
          x1={v.x - v.len / 2}
          y1={v.y}
          x2={v.x + v.len / 2}
          y2={v.y}
          stroke="#d6a86a"
          strokeWidth={1.4}
          strokeLinecap="round"
          style={{
            opacity: v.op,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ))}
    </svg>
  )
}
