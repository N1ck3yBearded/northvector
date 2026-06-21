// ── Northvector — all site copy lives here. ──────────────
// Voice is first-person: this is Nick's studio, and the site says so plainly.

export const BRAND = {
  name: 'Northvector',
  tagline: 'I build web products that actually ship.',
  // Brand inbox — placeholder. Point this at a real address, a form, or Calendly before launch.
  contact: 'hello@northvector.studio',
  location: 'Toronto · remote worldwide',
  founder: 'Nick',
}

// Hero: "I build ___" — the noun cycles to say "anything the web can be".
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
  sub: "I'm Nick. I design and build web products end to end: sites, dashboards, AI features. You bring the problem, I build the thing that solves it.",
}

export const MANIFESTO = {
  kicker: 'How I work',
  lines: [
    'An idea is only worth as much as what gets built from it.',
    'I keep the whole thing in one head: design, code, and the call on what actually matters. No handoffs, no telephone game between a designer and a dev who never talk.',
    'No house style I force onto everything. No "that’s not possible." I work out what the problem really needs, then build exactly that.',
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
    blurb: 'Full products: login, dashboards, the flows behind them. From a first MVP to something you run in production.',
    accent: 'jade',
    tags: ['React', 'Auth', 'Realtime'],
  },
  {
    id: 'landing',
    title: 'Landing & brand sites',
    blurb: 'Pages with a real point of view, built to convert. Not a template with your logo dropped on top.',
    accent: 'amber',
    tags: ['Conversion', 'Design', 'SEO'],
  },
  {
    id: 'immersive',
    title: 'Immersive & 3D',
    blurb: 'WebGL, shaders and scroll-driven scenes, for when the product deserves a stage instead of a page.',
    accent: 'jade',
    tags: ['WebGL', 'Three.js', 'Motion'],
  },
  {
    id: 'data',
    title: 'Data, Python & AI',
    blurb: 'Scrapers, pipelines and AI features wired into the product. The Python lab below runs in your browser right now.',
    accent: 'amber',
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
    body: 'Real-time WebGL: light, depth and motion, all rendered live in the browser as you scroll.',
    style: 'Dark · cinematic · GPU-drawn',
    accent: 'dusk',
  },
  {
    id: 'editorial',
    index: '02',
    kicker: 'Editorial',
    title: 'When the work speaks first.',
    body: 'Sometimes the best interface is type, space and restraint. I know when to step back and let the work talk.',
    style: 'Light · airy · serif',
    accent: 'amber',
  },
  {
    id: 'product',
    index: '03',
    kicker: 'Product',
    title: 'Interfaces that earn trust.',
    body: 'A live DeFi dashboard pulling real on-chain balances and prices, keyless, straight in the browser. The numbers are real.',
    style: 'Live · on-chain · keyless',
    accent: 'jade',
  },
]

// Work — kept deliberately understated: a quiet line of proof.
export const WORK = [
  { name: 'Knock', kind: 'home-services marketplace', link: null },
  { name: 'QuoteCannon', kind: 'AI quote SaaS', link: null },
  { name: 'Nails by Firs', kind: 'trilingual brand site', link: 'https://nailsbyfirs.netlify.app' },
  { name: 'Sable & Roll', kind: 'conversion site', link: null },
  { name: 'PaidFaster', kind: 'productized tool', link: null },
]

export const CONTACT = {
  kicker: 'Start something',
  title: 'Tell me the idea.',
  titleAccent: "I’ll build it.",
  body: "A couple of lines about what you’re imagining is enough. I’ll tell you straight whether it’s worth building, and how I’d do it.",
}
