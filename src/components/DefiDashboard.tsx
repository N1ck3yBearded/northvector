import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchShowcasePortfolio, type Holding, type Portfolio } from '../lib/defi'

const ease = [0.16, 1, 0.3, 1] as const

// On-brand muted segment colors: jade, amber, dusk, teal, rose, sage, slate.
const SEG = ['#6db7a0', '#d6a86a', '#9a8fd6', '#7fb1c4', '#c4929a', '#8bbf8b', '#54555f']

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`
  return `$${Math.round(n)}`
}

function Donut({ holdings }: { holdings: Holding[] }) {
  const r = 54
  const C = 2 * Math.PI * r
  // Pre-compute fractions and their running offsets without mutating outer state during render.
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
    <div className="mt-6 animate-pulse">
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

  useEffect(() => {
    let alive = true
    fetchShowcasePortfolio().then((p) => alive && setData(p))
    return () => {
      alive = false
    }
  }, [])

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
          <div className="font-mono text-[10px] uppercase tracking-widest text-mist-500">
            Portfolio · {data?.chain ?? 'Ethereum'}
          </div>
          <div className="mt-1 text-[13px] text-mist-300">{data?.label ?? 'vitalik.eth'}</div>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide"
          style={
            data?.live
              ? { borderColor: 'rgba(109,183,160,0.4)', color: '#6db7a0' }
              : { borderColor: 'rgba(133,133,143,0.4)', color: '#85858f' }
          }
        >
          {data ? (data.live ? '● live · on-chain' : 'sample') : '…'}
        </span>
      </div>

      {!data ? (
        <Skeleton />
      ) : (
        <>
          <div className="mt-5 flex items-center gap-5">
            <div className="relative shrink-0">
              <Donut holdings={data.holdings} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-mist-500">
                  total
                </span>
                <span className="text-lg font-semibold text-mist-100">{fmtUsd(data.totalUsd)}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {data.holdings.map((h, i) => (
                <div key={h.symbol + i} className="flex items-center gap-2 text-[12px]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: SEG[i % SEG.length] }}
                  />
                  <span className="truncate text-mist-200">{h.symbol}</span>
                  <span className="ml-auto font-mono text-mist-500">{h.pct.toFixed(1)}%</span>
                  <span className="w-14 text-right font-mono text-mist-300">{fmtUsd(h.usd)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-mono text-[10px] text-mist-500">
              {data.live ? 'on-chain · Blockscout · keyless' : 'sample data · live fetches on-chain'}
            </span>
            <span className="font-mono text-[10px] text-teal">no wallet connect · read-only</span>
          </div>
        </>
      )}
    </motion.div>
  )
}
