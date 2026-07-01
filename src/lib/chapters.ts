// Discipline-chapter imagery for the Capabilities cards.
//
// Each capability id maps to one branded discipline visual (an abstract,
// atmospheric tech texture — fit is by mood, not by literal subject). Two of
// them ship a matching motion loop that the card cross-fades in on hover, but
// only on ultra-tier / non-reduced hardware (see Capabilities.tsx). Lite and
// reduced-motion visitors only ever load the static WebP.

export type Chapter = {
  /** Static, always-loaded branded still (WebP). */
  img: string
  /** Optional hover motion loop (MP4), ultra-tier enhancement only. */
  loop?: string
}

// Ids are historical; the titles were re-pointed to the four disciplines in
// data.ts, so the imagery follows the *discipline*, not the id name:
//   webapps   → Front-end → fe
//   landing   → Back-end  → be
//   immersive → AI        → ai
//   data      → Data      → data
const CHAPTERS: Record<string, Chapter> = {
  webapps: { img: '/disc/fe.webp', loop: '/disc/fe-loop.mp4' },
  landing: { img: '/disc/be.webp', loop: '/disc/be-loop.mp4' },
  immersive: { img: '/disc/ai.webp' },
  data: { img: '/disc/data.webp' },
}

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS[id]
}
