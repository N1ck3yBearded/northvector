import { motion } from 'framer-motion'
import stats from '../data/build-stats.json'
import { useT, type Loc } from '../lib/i18n'

const ease = [0.16, 1, 0.3, 1] as const

// Structural type mirroring build-stats.json — real numbers, generated from
// this repo's git history + the production build. Nothing here is hand-typed.
type BuildStats = {
  commit: string
  commits: number
  firstCommit: string
  lastCommit: string
  tsFiles: number
  components: number
  bundleJsGzipKb: number
  bundleCssGzipKb: number
  bundleTotalGzipKb: number
  stack: string[]
  runtime: string[]
  posture: {
    reducedMotion: boolean
    heavyMediaGatedToUltra: boolean
    noBackend: boolean
    bilingual: boolean
  }
}

const s = stats as BuildStats

// Days spent building — derived, but honestly so: git dates, browser Date math.
const daysBuilding = Math.round(
  (Date.parse(s.lastCommit) - Date.parse(s.firstCommit)) / 86400000,
)

const COPY = {
  kicker: { en: 'The proof', ru: 'Доказательство' } satisfies Loc,
  title: { en: 'Audited on itself', ru: 'Проверено на себе' } satisfies Loc,
  lead: {
    en: 'Every number below comes straight from this repo — its git history and the production build. Nothing hand-typed, nothing rounded up.',
    ru: 'Каждое число ниже взято прямо из этого репозитория — из его git-истории и продакшн-сборки. Ничего не вписано руками, ничего не округлено в свою пользу.',
  } satisfies Loc,
  stackLabel: { en: 'Stack', ru: 'Стек' } satisfies Loc,
  runtimeLabel: { en: 'In the browser', ru: 'В браузере' } satisfies Loc,
  postureLabel: { en: 'Posture', ru: 'Принципы' } satisfies Loc,
}

type Metric = { label: Loc; value: string; suffix?: Loc }

const METRICS: Metric[] = [
  {
    label: { en: 'Commits', ru: 'Коммитов' },
    value: String(s.commits),
  },
  {
    label: { en: 'Days building', ru: 'Дней в работе' },
    value: String(daysBuilding),
  },
  {
    label: { en: 'Source files', ru: 'Файлов исходников' },
    value: String(s.tsFiles),
    suffix: { en: '.ts / .tsx', ru: '.ts / .tsx' },
  },
  {
    label: { en: 'Components', ru: 'Компонентов' },
    value: String(s.components),
  },
  {
    label: { en: 'Bundle · JS', ru: 'Бандл · JS' },
    value: String(s.bundleJsGzipKb),
    suffix: { en: 'KB gzip', ru: 'КБ gzip' },
  },
  {
    label: { en: 'Bundle · total', ru: 'Бандл · всего' },
    value: String(s.bundleTotalGzipKb),
    suffix: { en: 'KB gzip', ru: 'КБ gzip' },
  },
]

const POSTURE: { flag: boolean; label: Loc }[] = [
  {
    flag: s.posture.reducedMotion,
    label: {
      en: 'prefers-reduced-motion respected',
      ru: 'prefers-reduced-motion уважается',
    },
  },
  {
    flag: s.posture.heavyMediaGatedToUltra,
    label: {
      en: 'heavy media gated to capable hardware',
      ru: 'тяжёлая графика — только на мощном железе',
    },
  },
  {
    flag: s.posture.noBackend,
    label: {
      en: 'no backend — fully static',
      ru: 'без бэкенда — полностью статичный',
    },
  },
  {
    flag: s.posture.bilingual,
    label: { en: 'bilingual EN · RU', ru: 'двуязычный EN · RU' },
  },
]

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-mist-300">
      {children}
    </span>
  )
}

export default function SelfAudit() {
  const t = useT()

  return (
    <section id="audit" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-jade">{t(COPY.kicker)}</span>
          <h2 className="display mt-6 text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.01em] text-mist-100">
            {t(COPY.title)}
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist-300">
            {t(COPY.lead)}
          </p>
        </motion.div>

        {/* Metrics — the spec sheet. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3"
        >
          {METRICS.map((m) => (
            <div key={m.label.en} className="bg-ink-900/40 p-6 sm:p-7">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-medium tabular-nums text-mist-100 sm:text-4xl">
                  {m.value}
                </span>
                {m.suffix && (
                  <span className="font-mono text-[11px] text-mist-500">{t(m.suffix)}</span>
                )}
              </div>
              <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-mist-500">
                {t(m.label)}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Stack + runtime chips. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease, delay: 0.14 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
          >
            <div className="font-mono text-[11px] uppercase tracking-ultra text-amber">
              {t(COPY.stackLabel)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.stack.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>

            <div className="mt-7 font-mono text-[11px] uppercase tracking-ultra text-teal">
              {t(COPY.runtimeLabel)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.runtime.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </motion.div>

          {/* Posture — honest checks, one ✓ per true flag. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
          >
            <div className="font-mono text-[11px] uppercase tracking-ultra text-jade">
              {t(COPY.postureLabel)}
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {POSTURE.filter((p) => p.flag).map((p) => (
                <li key={p.label.en} className="flex items-start gap-3 text-[14px] text-mist-300">
                  <span aria-hidden="true" className="mt-px font-mono text-jade">
                    ✓
                  </span>
                  <span className="leading-relaxed">{t(p.label)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* As-of stamp — dated snapshot, not a live-forever claim. */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
          className="mt-12 font-mono text-[11px] uppercase tracking-ultra text-mist-700"
        >
          as of {s.commit} · {s.lastCommit}
        </motion.p>
      </div>
    </section>
  )
}
