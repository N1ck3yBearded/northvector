// Live on-chain portfolio for the studio's DeFi dashboard flagship.
// Keyless by design: balances + prices from Blockscout's public API —
// no API key, no wallet connection, no cost. Read-only public data only.
//
// Spam-proof: a mainnet wallet holds thousands of junk airdrops, many with
// faked exchange rates. So we don't trust "all tokens" — we intersect the
// wallet's balances with a curated allowlist of blue-chip contracts. Real
// data, but spam physically cannot appear.

export type Holding = {
  symbol: string
  name: string
  usd: number
  pct: number
}

export type Portfolio = {
  label: string
  address: string
  chain: string
  totalUsd: number
  holdings: Holding[]
  live: boolean
}

const SHOWCASE_LABEL = 'vitalik.eth'
const SHOWCASE_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const TOP_N = 6
const MIN_USD = 20

// Curated blue-chip ERC-20 allowlist, keyed by lowercased contract address.
const ALLOWLIST: Record<string, { symbol: string; name: string }> = {
  [WETH]: { symbol: 'WETH', name: 'Wrapped Ether' },
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': { symbol: 'stETH', name: 'Lido Staked ETH' },
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': { symbol: 'wstETH', name: 'Wrapped stETH' },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { symbol: 'USDC', name: 'USD Coin' },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT', name: 'Tether' },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { symbol: 'DAI', name: 'Dai' },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { symbol: 'UNI', name: 'Uniswap' },
  '0x514910771af9ca656af840dff83e8264ecf986ca': { symbol: 'LINK', name: 'Chainlink' },
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': { symbol: 'AAVE', name: 'Aave' },
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': { symbol: 'MKR', name: 'Maker' },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': { symbol: 'ENS', name: 'Ethereum Name Service' },
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32': { symbol: 'LDO', name: 'Lido DAO' },
}

// Clearly-labeled sample so the widget never renders broken if the public
// endpoint is down or CORS-blocked. Shown as "sample" — never as "live".
const FALLBACK_ITEMS: { symbol: string; name: string; usd: number }[] = [
  { symbol: 'ETH', name: 'Ethereum', usd: 9_700 },
  { symbol: 'ENS', name: 'Ethereum Name Service', usd: 5_400 },
  { symbol: 'WETH', name: 'Wrapped Ether', usd: 2_500 },
  { symbol: 'USDT', name: 'Tether', usd: 290 },
  { symbol: 'USDC', name: 'USD Coin', usd: 60 },
]

function build(items: { symbol: string; name: string; usd: number }[], live: boolean): Portfolio {
  const sorted = [...items].sort((a, b) => b.usd - a.usd)
  const total = sorted.reduce((s, i) => s + i.usd, 0)
  const top = sorted.slice(0, TOP_N)
  const rest = sorted.slice(TOP_N)
  const holdings: Holding[] = top.map((i) => ({
    ...i,
    pct: total ? (i.usd / total) * 100 : 0,
  }))
  if (rest.length) {
    const restUsd = rest.reduce((s, i) => s + i.usd, 0)
    holdings.push({
      symbol: 'Other',
      name: `${rest.length} more`,
      usd: restUsd,
      pct: total ? (restUsd / total) * 100 : 0,
    })
  }
  return {
    label: SHOWCASE_LABEL,
    address: SHOWCASE_ADDRESS,
    chain: 'Ethereum',
    totalUsd: total,
    holdings,
    live,
  }
}

export async function fetchShowcasePortfolio(): Promise<Portfolio> {
  try {
    const base = 'https://eth.blockscout.com/api/v2'
    const [balRes, addrRes] = await Promise.all([
      fetch(`${base}/addresses/${SHOWCASE_ADDRESS}/token-balances`),
      fetch(`${base}/addresses/${SHOWCASE_ADDRESS}`),
    ])
    if (!balRes.ok || !addrRes.ok) throw new Error('blockscout unavailable')

    const balances = (await balRes.json()) as Array<{
      value: string
      token: { address_hash?: string; decimals?: string; exchange_rate?: string | null }
    }>
    const addr = (await addrRes.json()) as { coin_balance?: string }

    const items: { symbol: string; name: string; usd: number }[] = []
    let ethPrice = 0

    for (const b of Array.isArray(balances) ? balances : []) {
      const key = (b?.token?.address_hash || '').toLowerCase()
      const allow = ALLOWLIST[key]
      const rate = Number(b?.token?.exchange_rate || 0)
      if (!allow || !rate) continue
      if (key === WETH) ethPrice = rate // WETH tracks the ETH price
      const decimals = Number(b.token.decimals || 18)
      const usd = (Number(b.value) / Math.pow(10, decimals)) * rate
      if (usd >= MIN_USD) items.push({ symbol: allow.symbol, name: allow.name, usd })
    }

    // Native ETH — price it from WETH, or fall back to DeFiLlama if WETH absent.
    if (!ethPrice) {
      try {
        const pr = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum')
        const pj = (await pr.json()) as { coins: Record<string, { price: number }> }
        ethPrice = pj?.coins?.['coingecko:ethereum']?.price || 0
      } catch {
        ethPrice = 0
      }
    }
    const ethAmt = Number(addr?.coin_balance || 0) / 1e18
    const ethUsd = ethAmt * ethPrice
    if (ethUsd >= MIN_USD) items.unshift({ symbol: 'ETH', name: 'Ethereum', usd: ethUsd })

    if (!items.length) throw new Error('no priced holdings')
    return build(items, true)
  } catch {
    return build(FALLBACK_ITEMS, false)
  }
}
