// ── Northvector — all site copy lives here. ──────────────
// Voice: honest solo, first-person. Falsifiable claims, verbs over adjectives,
// no slop-bravado. New offer copy is bilingual ({ en, ru }); older sections
// still hold English strings and get migrated in their own build phase.

import type { Loc } from './lib/i18n'

export const BRAND = {
  name: 'Northvector',
  tagline: {
    en: 'One person. The whole product. Idea to live.',
    ru: 'Один человек. Весь продукт. От идеи до live.',
  } as Loc,
  // Brand inbox — placeholder. Point this at a real address, a form, or Cal.com before launch.
  contact: 'hello@northvector.studio',
  location: { en: 'Toronto · remote worldwide', ru: 'Торонто · удалённо по миру' } as Loc,
  founder: 'Nick',
}

// ── OFFER (bilingual) ─────────────────────────────────────
// The one thing the audit found missing: what I sell, and for how much,
// on the first screen. Price band is $3–6k — the real ceiling of the three
// packages below (showing $3–8k when nothing costs $8k would be a tell).

export const OFFER = {
  kicker: { en: 'Full-stack · AI · Data — Toronto, solo', ru: 'Full-stack · AI · данные — Торонто, соло' } as Loc,
  priceBand: '$3–6k',
  priceLabel: { en: 'fixed, named up front', ru: 'фикс, названа сразу' } as Loc,
  lead: {
    en: 'Full-stack, AI, and data. A fixed price you can read before the call.',
    ru: 'Full-stack, AI и данные. Фикс-цена, которую видно до звонка.',
  } as Loc,
  sub: {
    en: 'You bring a scoped problem and a budget. I come back with it designed and coded end to end — one person, no handoffs, live and running.',
    ru: 'Приносишь задачу с рамками и бюджетом. Возвращаю спроектированной и собранной от идеи до деплоя — один человек, без передач, live.',
  } as Loc,
  ctaPrimary: { en: 'Describe the task', ru: 'Описать задачу' } as Loc,
  ctaSecondary: { en: 'See the packages', ru: 'Смотреть пакеты' } as Loc,
}

// ── PACKAGES (bilingual) ──────────────────────────────────
// Three fixed-scope packages, explicit bounds, price on screen. Web3/DeFi and
// Security are deliberately not here.

export type Accent = 'jade' | 'amber' | 'teal'

export type Package = {
  id: string
  letter: string
  price: string
  disciplines: string
  title: Loc
  summary: Loc
  includes: Loc[]
  excludes: Loc[]
  accent: Accent
}

export const PACKAGES: Package[] = [
  {
    id: 'fullstack',
    letter: 'A',
    price: '$3–4k',
    disciplines: 'FE · BE',
    accent: 'amber',
    title: { en: 'Full-stack web MVP', ru: 'Full-stack веб-MVP' },
    summary: {
      en: 'One product, idea to deploy: 4–6 screens, auth, the core logic, responsive, live on a host.',
      ru: 'Один продукт, от идеи до деплоя: 4–6 экранов, auth, основная логика, адаптив, live на хостинге.',
    },
    includes: [
      { en: 'React/TS front end + back end + database', ru: 'React/TS фронт + бэк + база данных' },
      { en: 'Auth, the main flows, responsive layout', ru: 'Auth, основные флоу, адаптив' },
      { en: 'Deployed and running, not a repo', ru: 'Задеплоено и работает, не репозиторий' },
    ],
    excludes: [
      { en: 'Native mobile apps', ru: 'Нативные моб-приложения' },
      { en: 'Enterprise-grade payment integrations', ru: 'Платёжные интеграции enterprise-уровня' },
      { en: 'Endless revisions after handoff', ru: 'Бесконечные правки после сдачи' },
    ],
  },
  {
    id: 'ai',
    letter: 'B',
    price: '$4–6k',
    disciplines: 'AI',
    accent: 'jade',
    title: { en: 'AI integration', ru: 'AI-интеграции' },
    summary: {
      en: 'RAG, chat, agents or automation wired into a product you already have — pipeline, prompts, retriever, UI and API hooks.',
      ru: 'RAG, чат, агенты или автоматизация в уже существующий продукт — пайплайн, промпты, ретривер, встройка в UI и API.',
    },
    includes: [
      { en: 'Retrieval / pipeline built and tuned', ru: 'Ретривер / пайплайн собран и настроен' },
      { en: 'Prompts and the eval loop around them', ru: 'Промпты и цикл их проверки' },
      { en: 'Wired into your existing UI and API', ru: 'Встроено в ваш UI и API' },
    ],
    excludes: [
      { en: 'Training your own models from scratch', ru: 'Обучение своих моделей с нуля' },
      { en: 'MLOps infrastructure', ru: 'MLOps-инфраструктура' },
      { en: "Guarantees on someone else's data quality", ru: 'Гарантии по качеству чужих данных' },
    ],
  },
  {
    id: 'data',
    letter: 'C',
    price: '$4–6k',
    disciplines: 'Data',
    accent: 'teal',
    title: { en: 'Data & analytics', ru: 'Data / аналитика' },
    summary: {
      en: 'Python pipelines, processing, dashboards, live visualization — from raw data to a picture you can actually read.',
      ru: 'Python-пайплайны, обработка, дашборды, live-визуализация — от сырых данных до читаемой картины.',
    },
    includes: [
      { en: 'Ingest + processing pipeline in Python', ru: 'Пайплайн сбора и обработки на Python' },
      { en: 'Dashboards and live visualization', ru: 'Дашборды и live-визуализация' },
      { en: 'Readable output, not a raw dump', ru: 'Читаемый результат, не сырой дамп' },
    ],
    excludes: [
      { en: 'Ongoing warehouse maintenance', ru: 'Постоянное сопровождение хранилищ' },
      { en: 'A full-time data-engineer seat', ru: 'Роль штатного дата-инженера' },
      { en: 'Guarantees on third-party sources', ru: 'Гарантии по чужим источникам' },
    ],
  },
]

export const PACKAGES_INTRO = {
  kicker: { en: 'The offer', ru: 'Оффер' } as Loc,
  title: {
    en: 'Three packages. Fixed scope. Price on screen.',
    ru: 'Три пакета. Фикс-скоуп. Цена на экране.',
  } as Loc,
  note: {
    en: 'No hourly, no “it depends,” no call just to learn the budget. Clear bounds up front — you know in thirty seconds whether we fit.',
    ru: 'Не почасовка, не «зависит», не звонок ради выяснения бюджета. Явные рамки сразу — за тридцать секунд понятно, подходим ли мы друг другу.',
  } as Loc,
}

export const PACKAGE_META = {
  includes: { en: 'Includes', ru: 'Входит' } as Loc,
  excludes: { en: 'Not included', ru: 'Не входит' } as Loc,
  priceLabel: { en: 'typical', ru: 'порядок' } as Loc,
}

// ── NAV (bilingual) ───────────────────────────────────────
export const NAV = {
  links: [
    { href: '#packages', label: { en: 'Packages', ru: 'Пакеты' } as Loc },
    { href: '#manifesto', label: { en: 'How I work', ru: 'Как работаю' } as Loc },
    { href: '#work', label: { en: 'Work', ru: 'Работы' } as Loc },
  ],
  cta: { en: 'Describe the task', ru: 'Описать задачу' } as Loc,
}

// ── MANIFESTO (bilingual) ─────────────────────────────────

export const MANIFESTO = {
  kicker: { en: 'How I work', ru: 'Как я работаю' } as Loc,
  lines: [
    {
      en: 'An idea is only worth as much as what gets built from it.',
      ru: 'Идея стоит ровно столько, сколько из неё собрано.',
    },
    {
      en: 'I keep the whole thing in one head: design, code, and the call on what actually matters. No handoffs, no telephone game between a designer and a dev who never talk.',
      ru: 'Держу весь продукт в одной голове: дизайн, код и решение о том, что действительно важно. Без передач, без испорченного телефона между дизайнером и разработчиком, которые не общаются.',
    },
    {
      en: 'Four disciplines under one roof — front-end, back-end, AI, data. I work out what the problem really needs, then build exactly that.',
      ru: 'Четыре дисциплины под одной крышей — фронтенд, бэкенд, AI, данные. Разбираюсь, что задаче нужно на самом деле, и собираю ровно это.',
    },
  ] as Loc[],
}

// ── CAPABILITIES (bilingual) ──────────────────────────────
// The four disciplines, honest craft — not a menu of templates.

export type Capability = {
  id: string
  title: Loc
  blurb: Loc
  accent: 'jade' | 'amber' | 'dusk' | 'teal'
  tags: string[]
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'webapps',
    title: { en: 'Front-end', ru: 'Фронтенд' },
    blurb: {
      en: 'The interface people actually touch: login, dashboards, the flows behind them. React and TypeScript, built to run in production, not just demo well.',
      ru: 'Интерфейс, с которым реально работают: логин, дашборды, флоу за ними. React и TypeScript, собранные под продакшн, а не под красивую демку.',
    },
    accent: 'jade',
    tags: ['React', 'TypeScript', 'Motion'],
  },
  {
    id: 'landing',
    title: { en: 'Back-end', ru: 'Бэкенд' },
    blurb: {
      en: 'The half users never see: API, auth, database, the logic that has to hold. Front and back from the same head, so the seams line up.',
      ru: 'Половина, которую не видно: API, auth, база, логика, которая обязана держать. Фронт и бэк из одной головы — швы сходятся.',
    },
    accent: 'amber',
    tags: ['API', 'Auth', 'Postgres'],
  },
  {
    id: 'immersive',
    title: { en: 'AI', ru: 'AI' },
    blurb: {
      en: 'RAG, agents and AI features wired into a real product — pipeline, prompts, and the eval loop that keeps them honest. Not a demo bolted on the side.',
      ru: 'RAG, агенты и AI-фичи, встроенные в живой продукт — пайплайн, промпты и цикл проверки, который держит их честными. Не демка, приделанная сбоку.',
    },
    accent: 'jade',
    tags: ['RAG', 'Agents', 'Evals'],
  },
  {
    id: 'data',
    title: { en: 'Data', ru: 'Данные' },
    blurb: {
      en: 'Python pipelines, scrapers and live visualization — from raw input to a picture you can read. The lab below runs in your browser right now.',
      ru: 'Python-пайплайны, скраперы и live-визуализация — от сырых данных до читаемой картины. Лаборатория ниже прямо сейчас крутится в вашем браузере.',
    },
    accent: 'amber',
    tags: ['Python', 'Pipelines', 'Viz'],
  },
]

// ── SCENES (bilingual) ────────────────────────────────────
// Three live demos, each proving one discipline — front-end, design, full-stack.
// Not "any style": these are real components running on this page.

export type Scene = {
  id: string
  index: string
  kicker: Loc
  title: Loc
  body: Loc
  style: Loc
  accent: 'jade' | 'amber' | 'dusk' | 'teal'
}

export const SCENES: Scene[] = [
  {
    id: 'immersive',
    index: '01',
    kicker: { en: 'Front-end', ru: 'Фронтенд' },
    title: { en: 'Rendered live on the GPU.', ru: 'Отрисовано вживую на GPU.' },
    body: {
      en: 'Real-time WebGL — a field of contour and light, drawn on the GPU and flowing around your cursor as you move it. This is running now, not a video.',
      ru: 'WebGL в реальном времени — поле контура и света, отрисованное на GPU и текущее за курсором, пока вы его двигаете. Это крутится прямо сейчас, не видео.',
    },
    style: { en: 'Dark · real-time · GPU-drawn', ru: 'Тёмное · реалтайм · на GPU' },
    accent: 'dusk',
  },
  {
    id: 'editorial',
    index: '02',
    kicker: { en: 'Design', ru: 'Дизайн' },
    title: { en: 'When restraint is the interface.', ru: 'Когда сдержанность и есть интерфейс.' },
    body: {
      en: 'Type, space and hierarchy doing the work — no effects to hide behind. Knowing when to step back is a discipline of its own.',
      ru: 'Работают шрифт, воздух и иерархия — без эффектов, за которыми можно спрятаться. Уметь отойти в сторону — отдельное ремесло.',
    },
    style: { en: 'Light · editorial · typographic', ru: 'Светлое · редакторское · типографика' },
    accent: 'amber',
  },
  {
    id: 'product',
    index: '03',
    kicker: { en: 'Full-stack', ru: 'Full-stack' },
    title: { en: 'Real data, front to back.', ru: 'Живые данные, от фронта до бэка.' },
    body: {
      en: 'A DeFi dashboard pulling real on-chain balances and prices, keyless, straight in the browser. The numbers are real — front end, data layer and API, all one build.',
      ru: 'DeFi-дашборд, тянущий реальные on-chain балансы и цены — без ключей, прямо в браузере. Цифры настоящие: фронт, слой данных и API — всё одна сборка.',
    },
    style: { en: 'Live · on-chain · keyless', ru: 'Live · on-chain · без ключей' },
    accent: 'jade',
  },
]

// ── WORK (bilingual) ──────────────────────────────────────
// Kept deliberately understated: a quiet line of proof. `note` says one true
// thing about a real engineering decision — no invented metrics or dates.

export type Work = {
  name: string
  kind: Loc
  link: string
  note?: Loc
}

export const WORK: Work[] = [
  {
    name: 'QuoteCannon',
    kind: { en: 'quoting tool for painters', ru: 'инструмент расчёта смет для маляров' },
    link: 'https://quotecannon.vercel.app',
    note: {
      en: 'Turns a painter’s rough measurements into a priced, sendable quote. Shipped solo, front to back.',
      ru: 'Превращает грубые замеры маляра в посчитанную смету, готовую к отправке. Собрано в одиночку, от фронта до бэка.',
    },
  },
  {
    name: 'Knock',
    kind: { en: 'home-services marketplace', ru: 'маркетплейс бытовых услуг' },
    link: 'https://knock-lyart.vercel.app',
    note: {
      en: 'Two-sided marketplace — clients on one side, tradespeople on the other, matching between them. Built solo, front to back.',
      ru: 'Двусторонний маркетплейс — клиенты с одной стороны, мастера с другой, матчинг между ними. Собрано в одиночку, от фронта до бэка.',
    },
  },
]

// ── CONTACT (bilingual) ───────────────────────────────────

export const CONTACT = {
  kicker: { en: 'Start something', ru: 'Начать' } as Loc,
  title: { en: 'Tell me the idea.', ru: 'Расскажите идею.' } as Loc,
  titleAccent: { en: 'I’ll build it.', ru: 'Соберу её.' } as Loc,
  body: {
    en: 'A couple of lines about what you’re imagining is enough. I’ll tell you straight whether it’s worth building, and how I’d do it.',
    ru: 'Пары строк о том, что вы задумали, достаточно. Скажу прямо, стоит ли это собирать и как бы я это сделал.',
  } as Loc,
  sla: {
    en: 'I reply personally, usually within a day or two.',
    ru: 'Отвечаю лично — обычно в течение дня-двух.',
  } as Loc,
}

// ── CONTACT_FORM (bilingual) ──────────────────────────────
// Labels the lead-flow agent wires into the form. Package options reuse
// PACKAGES titles (A/B/C) — resolve them there, not here.

export const CONTACT_FORM = {
  taskLabel: { en: 'The task or idea', ru: 'Задача или идея' } as Loc,
  taskPlaceholder: {
    en: 'A couple of lines about what you want built.',
    ru: 'Пара строк о том, что нужно собрать.',
  } as Loc,
  packageLabel: { en: 'Closest package', ru: 'Ближайший пакет' } as Loc,
  packagePlaceholder: { en: 'Not sure yet', ru: 'Пока не знаю' } as Loc,
  timelineLabel: { en: 'Timeline', ru: 'Сроки' } as Loc,
  timelinePlaceholder: { en: 'When you’d need it', ru: 'Когда нужно' } as Loc,
  budgetLabel: { en: 'Budget', ru: 'Бюджет' } as Loc,
  budgetPlaceholder: { en: 'A range is fine', ru: 'Достаточно вилки' } as Loc,
  submit: { en: 'Send it', ru: 'Отправить' } as Loc,
  booking: { en: 'Or book a call', ru: 'Или назначить звонок' } as Loc,
  privacy: {
    en: 'Goes straight to me, nobody else. No list, no spam.',
    ru: 'Приходит напрямую мне, больше никому. Ни рассылок, ни спама.',
  } as Loc,
}

// ── SECTION INTROS (bilingual) ────────────────────────────
// Copy that used to be hardcoded in the section components. Centralized here so
// all site text lives in one file. Same honest, terse, first-person voice.

export const SHOWREEL_INTRO = {
  kicker: { en: 'Proof', ru: 'Пруф' } as Loc,
  title: {
    en: 'Three proofs, running on this page.',
    ru: 'Три пруфа — прямо на этой странице.',
  } as Loc,
  body: {
    en: 'Not a portfolio of screenshots. Three live builds — real-time WebGL, editorial design, a full-stack dashboard on live data — each running right here, right now.',
    ru: 'Не портфолио из скриншотов. Три живых сборки — WebGL в реальном времени, редакторский дизайн, full-stack-дашборд на живых данных — каждая работает прямо здесь и сейчас.',
  } as Loc,
}

// Support copy for the editorial scene (02). Kept off the Scene type since only
// this one scene needs it; the "any style" tell is gone.
export const EDITORIAL = {
  lineA: {
    en: 'Type that carries the brand. Measured columns, real hierarchy, whitespace used on purpose.',
    ru: 'Шрифт, несущий бренд. Выверенные колонки, настоящая иерархия, воздух не случайный.',
  } as Loc,
  lineB: {
    en: 'Knowing when to step back and let the work breathe is a discipline of its own.',
    ru: 'Знать, когда отойти и дать работе дышать, — отдельное ремесло.',
  } as Loc,
  tags: { en: ['Serif', 'Editorial', 'Whitespace'], ru: ['Шрифт', 'Редактура', 'Воздух'] },
}

export const CAPABILITIES_INTRO = {
  kicker: { en: 'What I do', ru: 'Что я делаю' } as Loc,
  title: {
    en: 'Four disciplines, one person.',
    ru: 'Четыре дисциплины, один человек.',
  } as Loc,
  note: {
    en: 'Front-end, back-end, AI, data — the whole stack in one head. Bring the problem; I build the part that solves it.',
    ru: 'Фронтенд, бэкенд, AI, данные — весь стек в одной голове. Приносите задачу — соберу ту часть, что её решает.',
  } as Loc,
}

export const WORK_INTRO = {
  lead: {
    en: 'A few other things I’ve shipped. Quietly, but they’re real and running.',
    ru: 'Ещё пара вещей, что я собрал. Тихо, но всё реально и работает.',
  } as Loc,
}

// Small standalone UI strings that don't belong to a section export.
export const UI = {
  footerCta: { en: 'Got an idea?', ru: 'Есть идея?' } as Loc,
  contactCta: { en: 'Start a project', ru: 'Начать проект' } as Loc,
}
