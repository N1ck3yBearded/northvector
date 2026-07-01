import manifest from '../data/media.json'

export type Clip = {
  url: string
  urlMobile?: string
  poster: string
  width: number
  height: number
}

type Manifest = {
  scenes: Record<string, Clip>
  attribution: string
}

const data = manifest as Manifest

export function getClip(id: string): Clip | null {
  return data.scenes?.[id] ?? null
}

export function hasMedia(): boolean {
  return Object.keys(data.scenes ?? {}).length > 0
}

// Distinct fallback gradient per scene so the storyboard reads even if a
// local backdrop clip fails to load.
export const FALLBACK_GRADIENT: Record<string, string> = {
  hero: 'radial-gradient(120% 120% at 70% 20%, rgba(214,168,106,0.22), transparent 55%), radial-gradient(100% 100% at 20% 90%, rgba(109,183,160,0.16), transparent 60%)',
  idea: 'radial-gradient(120% 120% at 30% 30%, rgba(154,143,214,0.20), transparent 60%)',
  build: 'radial-gradient(120% 120% at 50% 0%, rgba(127,177,196,0.16), transparent 60%)',
  immersive: 'radial-gradient(120% 120% at 80% 50%, rgba(154,143,214,0.22), transparent 60%)',
  closing: 'radial-gradient(120% 120% at 50% 100%, rgba(214,168,106,0.20), transparent 55%)',
}
