// Build-time Pexels fetcher. Reads PEXELS_API_KEY from .env, pulls one tasteful
// landscape clip per storyboard scene, and writes src/data/media.json with the
// CDN video URL + poster + attribution. The runtime only ever sees the CDN URLs,
// never the key. Re-run with `npm run media` whenever you want to refresh clips.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadEnv() {
  const out = {}
  for (const name of ['.env', '.env.local']) {
    const p = resolve(ROOT, name)
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }
  }
  return out
}

// Storyboard: scene id -> a curated, on-theme search. Tasteful, abstract,
// no stock-cliché people. Tweak freely.
const SCENES = [
  { id: 'hero', query: 'abstract ink black gold' },
  { id: 'idea', query: 'glowing particles dark' },
  { id: 'build', query: 'minimal architecture lines' },
  { id: 'immersive', query: 'liquid abstract flow' },
  { id: 'closing', query: 'aurora night sky' },
]

function pickFile(files) {
  // Prefer a landscape HD-ish mp4 around 1920w, else the largest mp4.
  const mp4 = files.filter((f) => f.file_type === 'video/mp4' && f.width >= f.height)
  if (!mp4.length) return null
  const ideal = mp4
    .filter((f) => f.width >= 1280 && f.width <= 2200)
    .sort((a, b) => Math.abs(1920 - a.width) - Math.abs(1920 - b.width))
  return (ideal[0] || mp4.sort((a, b) => b.width - a.width)[0]).link
}

async function searchVideo(key, query) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    query
  )}&per_page=8&orientation=landscape&size=medium`
  const res = await fetch(url, { headers: { Authorization: key } })
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`)
  const data = await res.json()
  for (const v of data.videos || []) {
    const link = pickFile(v.video_files || [])
    if (link)
      return {
        url: link,
        poster: v.image,
        width: v.width,
        height: v.height,
        credit: v.user?.name || 'Pexels',
        creditUrl: v.user?.url || v.url,
        pexelsUrl: v.url,
      }
  }
  return null
}

async function main() {
  const env = loadEnv()
  const key = process.env.PEXELS_API_KEY || env.PEXELS_API_KEY
  const outPath = resolve(ROOT, 'src/data/media.json')

  if (!key) {
    console.error(
      '\n⚠  No PEXELS_API_KEY found. Copy .env.example to .env and paste your free key\n   (https://www.pexels.com/api/). The site still runs — scenes fall back to gradients.\n'
    )
    if (!existsSync(outPath)) {
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, JSON.stringify({ scenes: {}, attribution: 'Pexels' }, null, 2))
    }
    process.exit(0)
  }

  const scenes = {}
  for (const s of SCENES) {
    try {
      const hit = await searchVideo(key, s.query)
      if (hit) {
        scenes[s.id] = hit
        console.log(`✓ ${s.id.padEnd(10)} ${hit.url.split('/').pop()}  · ${hit.credit}`)
      } else {
        console.log(`–  ${s.id.padEnd(10)} no result for "${s.query}"`)
      }
    } catch (e) {
      console.log(`✗  ${s.id.padEnd(10)} ${e.message}`)
    }
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify({ scenes, attribution: 'Pexels' }, null, 2))
  console.log(`\nWrote ${Object.keys(scenes).length} scenes → src/data/media.json\n`)
}

main()
