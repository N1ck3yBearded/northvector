# Northvector — studio showreel

**Where the idea meets the build.** A showreel that proves one thing: *I build whatever the
web needs to be, in any style.* First-person voice — this is Nick's studio, and the site says so.

Built with Vite + React + TypeScript, Tailwind, Framer Motion, GSAP, Lenis, raw **WebGL**
(hand-written GLSL — no 3D library), and live in-browser Python via **Pyodide**. Cinematic
footage via the **Pexels** API (fetched at build time, never at runtime).

## The idea

The hero says it: *"You bring the idea. I build ___"* — the noun cycles through web apps,
dashboards, 3D, brand sites… to say **any** web product. The page is a showreel:

1. **Hero** — the statement + a living "north-vector" field that follows the cursor.
2. **Manifesto** — idea meets execution.
3. **Showreel** — three genuinely different styles, side by side: a dark real-time **WebGL**
   contour field, a **light editorial** layout, and a **live on-chain DeFi dashboard**
   (real balances, keyless, no mock). Range, demonstrated.
4. **Lab** — **real Python running in your browser** (Pyodide / WebAssembly). Edit the code,
   hit Run. Not a screenshot.
5. **Capabilities** — what I build.
6. **Work** — one quiet line of proof, deliberately understated.
7. **Contact** — bring the idea.

## Cinematic footage (Pexels)

Footage is pulled at **build time** so the runtime only ever loads CDN URLs (fast, no key
exposure, no per-visit rate limits).

1. Get a free key at https://www.pexels.com/api/
2. `cp .env.example .env` and paste it as `PEXELS_API_KEY=...` (`.env` is gitignored).
3. `npm run media` — fetches one themed clip per storyboard scene into `src/data/media.json`.

Without a key the site still runs — each scene falls back to a tasteful gradient. Edit the
storyboard searches in `scripts/fetch-pexels.mjs`.

## Run / build / deploy

```bash
npm install
npm run media   # optional — pull Pexels clips (needs .env key)
npm run dev      # local
npm run build    # -> dist/
```

Deploy: pushed to `main` auto-deploys to **GitHub Pages** via the Actions workflow in
`.github/workflows/deploy.yml`. Live at https://n1ck3ybearded.github.io/northvector/.

## Where things live

| What | File |
|------|------|
| Copy, capabilities, scenes, work, hero nouns | `src/data.ts` |
| Pexels storyboard / fetch | `scripts/fetch-pexels.mjs`, `src/lib/media.ts` |
| Colours / fonts | `tailwind.config.js`, `src/index.css` |
| Cursor-reactive hero field | `src/components/HeroField.tsx` |
| Live on-chain DeFi dashboard | `src/components/DefiDashboard.tsx`, `src/lib/defi.ts` |
| Live Python lab | `src/components/PyLab.tsx` |
| WebGL contour field | `src/components/ImmersiveCanvas.tsx` |

Accessibility: `prefers-reduced-motion` is respected throughout — Framer is wrapped in
`MotionConfig reducedMotion="user"`, video backdrops show a still, WebGL renders one static
frame, and the cycling hero noun holds still.
