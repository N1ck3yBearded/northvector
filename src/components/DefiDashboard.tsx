import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  fetchShowcasePortfolio,
  fetchPortfolio,
  resolveInput,
  SHOWCASE,
  type Holding,
  type Portfolio,
} from '../lib/defi'

const ease = [0.16, 1, 0.3, 1] as const

// On-brand muted segment colors: jade, amber, dusk, teal, rose, sage, slate.
const SEG = ['#6db7a0', '#d6a86a', '#9a8fd6', '#7fb1c4', '#c4929a', '#8bbf8b', '#54555f']

const EXAMPLES: { label: string; address: string }[] = [
  { label: SHOWCASE.label, address: SHOWCASE.address },
]

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`
  return `$${Math.round(n)}`
}

function Donut({ holdings }: { holdings: Holding[] }) {
  const r = 54
  const C = 2 * Math.PI * r
  const fracs = holdings.map((h) => Math.max(h.pct / 100, 0))
  const offsets = fracs.map((_, i) => fracs.slice(0, i).reduce((sum, f) => sum + f, 0))
  return (
    <svg viewBox="0 0 140 140" className="h-[136px] w-[136px] -rotate-90" aria-hidden="true">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={15} />
      {holdings.map((h, i) => {
        const dash = fracs[i] * C
        return (
          <circle
            key={h.symbol + i}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={SEG[i % SEG.length]}
            strokeWidth={15}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-offsets[i] * C}
          />
        )
      })}
    </svg>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-5">
        <div className="h-[136px] w-[136px] shrink-0 rounded-full border-[15px] border-white/[0.05]" />
        <div className="flex-1 space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-white/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DefiDashboard() {
  const [data, setData] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let alive = true
    fetchShowcasePortfolio().then((p) => {
      if (alive) {
        setData(p)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  async function loadAddress(address: string, label: string) {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchPortfolio(address, label))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      const { address, label } = await resolveInput(q)
      setData(await fetchPortfolio(address, label))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const badge = loading ? '…' : error ? '—' : data?.live ? '● live · on-chain' : 'sample'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_30%_0%,rgba(127,177,196,0.14),transparent_60%)] p-6 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-mist-500">Portfolio · Ethereum</div>
          <div className="mt-1 truncate text-[13px] text-mist-300">{data?.label ?? '—'}</div>
        </div>
        <span
          className="shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide"
          style={
            !loading && data?.live
              ? { borderColor: 'rgba(109,183,160,0.4)', color: '#6db7a0' }
              : { borderColor: 'rgba(133,133,143,0.4)', color: '#85858f' }
          }
        >
          {badge}
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste any address or ENS — vitalik.eth"
          spellCheck={false}
          autoComplete="off"
          aria-label="Wallet address or ENS name"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[12px] text-mist-100 outline-none transition-colors placeholder:text-mist-700 focus:border-amber/50"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-amber/40 bg-amber/10 px-4 py-2 text-[12px] font-medium text-amber transition-colors hover:bg-amber/20"
        >
          Load
        </button>
      </form>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-mist-700">try</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.address}
            onClick={() => {
              setQuery(ex.label)
              loadAddress(ex.address, ex.label)
            }}
            className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-mist-400 transition-colors hover:border-amber/40 hover:text-amber"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[150px]">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <p className="text-[13px] text-mist-300">{error}</p>
            <p className="mt-1 font-mono text-[11px] text-mist-600">try a 0x… address or a name.eth</p>
          </div>
        ) : data && data.holdings.length ? (
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Donut holdings={data.holdings} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-mist-500">total</span>
                <span className="text-lg font-semibold text-mist-100">{fmtUsd(data.totalUsd)}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {data.holdings.map((h, i) => (
                <div key={h.symbol + i} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SEG[i % SEG.length] }} />
                  <span className="truncate text-mist-200">{h.symbol}</span>
                  <span className="ml-auto font-mono text-mist-500">{h.pct.toFixed(1)}%</span>
                  <span className="w-14 text-right font-mono text-mist-300">{fmtUsd(h.usd)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <p className="text-[13px] text-mist-300">No major holdings found</p>
            <p className="mt-1 font-mono text-[11px] text-mist-600">no tracked blue-chip assets in this wallet</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-[10px] text-mist-500">on-chain · Blockscout · keyless</span>
        <span className="font-mono text-[10px] text-teal">read-only · no wallet connect</span>
      </div>
    </motion.div>
  )
}
