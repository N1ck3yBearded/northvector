// Device capability, computed ONCE at module import and exported as a const.
// No React Context, no provider re-renders, no FPS-watchdog: just
//   import { CAPS } from '@/lib/caps'
// Two tiers only (ultra | lite). When in doubt we fall to lite — the cheap,
// always-smooth path — so the heavy cinema layer only ever loads on hardware
// that can clearly carry it.

export type Tier = 'ultra' | 'lite'

export type Caps = {
  tier: Tier
  reduced: boolean
  coarse: boolean
  dpr: number
}

function detect(): Caps {
  // SSR-safe defaults (this site is CSR, but keep it defensive).
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { tier: 'lite', reduced: false, coarse: false, dpr: 1 }
  }

  const n = navigator as Navigator & {
    deviceMemory?: number
    connection?: { effectiveType?: string; saveData?: boolean }
  }
  const mem = n.deviceMemory ?? 4
  const cores = n.hardwareConcurrency ?? 4
  const conn = n.connection ?? {}
  const et = conn.effectiveType ?? '4g'
  const save = !!conn.saveData
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = matchMedia('(pointer: coarse)').matches

  // One clear rule instead of three branches. Ultra = roomy desktop-class only.
  const ultra = mem >= 8 && cores >= 8 && !coarse && et === '4g' && !save
  const tier: Tier = ultra ? 'ultra' : 'lite'
  const dpr = Math.min(window.devicePixelRatio || 1, ultra ? 2 : 1.5)

  return { tier, reduced, coarse, dpr }
}

export const CAPS = detect()
