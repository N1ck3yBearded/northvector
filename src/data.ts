// ── Northvector — a studio where the idea meets the build ──────────────
// Voice is "we". No personal names — this is the brand.

export const BRAND = {
  name: 'Northvector',
  tagline: 'Where the idea meets the build.',
  // Brand inbox — placeholder. Point this at your real address, a form, or Calendly.
  // No personal email on the site: this is the studio, not a person.
  contact: 'hello@northvector.studio',
  location: 'Toronto · remote worldwide',
}

// Hero: "We build ___" — the noun cycles to say "anything the web can be".
export const BUILD_NOUNS = [
  'web apps',
  'landing pages',
  'dashboards',
  '3D experiences',
  'brand sites',
  'data tools',
  'storefronts',
  'AI features',
]

export const HERO = {
  lead: 'You bring the idea.',
  leadAccent: 'We build it.',
  sub: 'Northvector is a studio where human intent meets machine-grade execution. Tell us what the web should do — we make it real, in whatever form it needs to take.',
}

export const MANIFESTO = {
  kicker: 'The idea',
  lines: [
    'An idea is only worth as much as its execution.',
    'So we pair the two: a mind that imagines, and a craft that builds — fast, precise, without the usual back-and-forth.',
    'No fixed house style. No “that’s not possible.” Just the right thing, built right.',
  ],
}

export type Capability = {
  id: string
  title: string
  blurb: string
  accent: 'jade' | 'amber' | 'dusk' | 'teal'
  tags: string[]
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'webapps',
    title: 'Web apps & SaaS',
    blurb: 'Full products with auth, dashboards and flows — from MVP to production.',
    accent: 'jade',
    tags: ['React', 'Auth', 'Realtime'],
  },
  {
    id: 'landing',
    title: 'Landing & brand sites',
    blurb: 'Conversion-minded pages with a point of view — designed, not generated.',
    accent: 'amber',
    tags: ['Conversion', 'Design', 'SEO'],
  },
  {
    id: 'immersive',
    title: 'Immersive & 3D',
    blurb: 'WebGL, shaders and scroll-driven worlds when the product deserves a stage.',
    accent: 'dusk',
    tags: ['WebGL', 'Three.js', 'Motion'],
  },
  {
    id: 'data',
    title: 'Data, Python & AI',
    blurb: 'Scrapers, pipelines, in-browser compute and AI features wired into the product.',
    accent: 'teal',
    tags: ['Python', 'Pipelines', 'AI'],
  },
]

export type Scene = {
  id: string
  index: string
  kicker: string
  title: string
  body: string
  style: string
  accent: 'jade' | 'amber' | 'dusk' | 'teal'
}

export const SCENES: Scene[] = [
  {
    id: 'immersive',
    index: '01',
    kicker: 'Immersive',
    title: 'Worlds you scroll through.',
    body: 'Real-time WebGL — light, depth and motion rendered live in the browser. No video loop faking it.',
    style: 'Dark · cinematic · GPU-drawn',
    accent: 'dusk',
  },
  {
    id: 'editorial',
    index: '02',
    kicker: 'Editorial',
    title: 'Quiet, confident, light.',
    body: 'When the work is the message: generous space, a real typographic voice, nothing shouting.',
    style: 'Light · airy · serif',
    accent: 'amber',
  },
  {
    id: 'product',
    index: '03',
    kicker: 'Product',
    title: 'Interfaces that earn trust.',
    body: 'A live DeFi dashboard — real on-chain balances and prices, pulled keyless straight in the browser. Not a mock: the data is real.',
    style: 'Live · on-chain · keyless',
    accent: 'jade',
  },
]

// Work — kept deliberately understated: a single quiet line of proof.
export const WORK = [
  { name: 'Knock', kind: 'home-services marketplace', link: null },
  { name: 'QuoteCannon', kind: 'AI quote SaaS', link: null },
  { name: 'Nails by Firs', kind: 'trilingual brand site', link: 'https://nailsbyfirs.netlify.app' },
  { name: 'Sable & Roll', kind: 'conversion site', link: null },
  { name: 'PaidFaster', kind: 'productized tool', link: null },
]

export const CONTACT = {
  kicker: 'Start something',
  title: 'Bring the idea.',
  titleAccent: 'We’ll build it.',
  body: 'A line about what you’re imagining is enough. We’ll tell you straight whether it’s worth building — and how we’d do it.',
}
