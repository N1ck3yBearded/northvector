import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const
const PYODIDE_VERSION = 'v0.26.4'
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.js`

const PRESETS: Record<string, string> = {
  Primes: `# Real CPython, running in your browser.
def primes(n):
    sieve = [True] * n
    out = []
    for i in range(2, n):
        if sieve[i]:
            out.append(i)
            for j in range(i * i, n, i):
                sieve[j] = False
    return out

p = primes(80)
print("primes under 80:", p)
print("count:", len(p), "· sum:", sum(p))`,
  Stats: `# A tiny data pass — no libraries needed.
data = [12, 7, 22, 9, 31, 4, 18, 27, 15, 6]
data.sort()
n = len(data)
mean = sum(data) / n
median = (data[n//2] + data[~(n//2)]) / 2
spread = max(data) - min(data)
print("sorted :", data)
print(f"mean {mean:.1f} · median {median:.1f} · range {spread}")`,
  ASCII: `# Generative ASCII — Python drawing in text.
import math
W, H = 40, 16
for y in range(H):
    row = ""
    for x in range(W):
        v = math.sin(x / 5) + math.cos(y / 3)
        row += " .:-=+*#%@"[int((v + 2) / 4 * 9)]
    print(row)`,
}

type PyodideLike = { runPythonAsync: (code: string) => Promise<unknown> }

let pyodidePromise: Promise<PyodideLike> | null = null

function loadPyodide(): Promise<PyodideLike> {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = new Promise<PyodideLike>((resolve, reject) => {
    const w = window as unknown as { loadPyodide?: (o: { indexURL: string }) => Promise<PyodideLike> }
    const start = () => {
      w.loadPyodide?.({ indexURL: `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/` })
        .then(resolve)
        .catch(reject)
    }
    if (w.loadPyodide) return start()
    const s = document.createElement('script')
    s.src = PYODIDE_URL
    s.onload = start
    s.onerror = () => reject(new Error('Failed to load Pyodide'))
    document.head.appendChild(s)
  })
  return pyodidePromise
}

export default function PyLab() {
  const [code, setCode] = useState(PRESETS.Primes)
  const [output, setOutput] = useState('Press Run — the first run downloads the Python runtime (~6 MB), then it’s instant.')
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle')
  const pyRef = useRef<PyodideLike | null>(null)

  const run = async () => {
    try {
      if (!pyRef.current) {
        setStatus('loading')
        setOutput('Booting CPython (WebAssembly)…')
        pyRef.current = await loadPyodide()
      }
      setStatus('running')
      const py = pyRef.current
      // capture stdout/stderr
      const wrapped = `import sys, io
_buf = io.StringIO()
_old = sys.stdout
sys.stdout = _buf
try:
${code
  .split('\n')
  .map((l) => '    ' + l)
  .join('\n')}
except Exception as _e:
    print("Error:", _e)
finally:
    sys.stdout = _old
_buf.getvalue()`
      const result = (await py.runPythonAsync(wrapped)) as string
      setOutput(result || '(no output)')
    } catch (e) {
      setOutput('⚠ ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setStatus('idle')
    }
  }

  return (
    <section id="lab" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-px mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-teal">Live · not a screenshot</span>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.01em] text-mist-100">
            Real Python, <span className="italic text-teal">running right here.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-mist-300">
            This isn’t a video of a terminal. It’s actual CPython compiled to WebAssembly, executing in
            your browser. Edit the code, hit Run. When we say we build data &amp; Python features, this is
            the real thing — no backend required.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {/* editor */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d13]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex gap-2">
                {Object.keys(PRESETS).map((k) => (
                  <button
                    key={k}
                    onClick={() => setCode(PRESETS[k])}
                    className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-mist-300 transition-colors hover:border-teal/50 hover:text-teal"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mist-500">main.py</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              aria-label="Python code editor"
              className="h-72 w-full resize-none bg-transparent p-4 font-mono text-[12.5px] leading-relaxed text-mist-100 outline-none"
            />
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
              <span className="font-mono text-[11px] text-mist-500">
                {status === 'loading' ? 'loading runtime…' : status === 'running' ? 'running…' : 'CPython · WASM'}
              </span>
              <button
                onClick={run}
                disabled={status !== 'idle'}
                className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {status === 'idle' ? 'Run ▶' : '…'}
              </button>
            </div>
          </div>

          {/* output */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d13]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal/60" />
              <span className="ml-3 font-mono text-[11px] text-mist-500">output</span>
            </div>
            <pre className="h-[332px] overflow-auto whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-relaxed text-teal">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
