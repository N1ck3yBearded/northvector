# Northvector — studio showreel

**Where the idea meets the build.** Not a personal portfolio — a studio showreel that
proves one thing: *we build whatever the web needs to be, in any style.* Voice is "we".

Built with Vite + React + TypeScript, Tailwind, Framer Motion, Lenis, Three.js
(react-three-fiber), and live in-browser Python via **Pyodide**. Cinematic footage via the
**Pexels** API (fetched at build time, never at runtime).

## The idea

The hero says it: *"You bring the idea. We build ___"* — the noun cycles through web apps,
dashboards, 3D, brand sites… to say **any** web product. The page is a showreel:

1. **Hero** — the statement + cinematic backdrop.
2. **Manifesto** — idea meets execution.
3. **Showreel** — three genuinely different styles, side by side: a dark real-time **WebGL**
   scene, a **light editorial** layout, and a **glass product/SaaS** mock. Range, demonstrated.
4. **Lab** — **real Python running in your browser** (Pyodide / WebAssembly). Edit the code,
   hit Run. Not a screenshot.
5. **Capabilities** — what we build.
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

Deploy: `netlify.toml` is set up — `git` import on Netlify, or drag `dist/` to
app.netlify.com/drop.

## Where things live

| What | File |
|------|------|
| Copy, capabilities, scenes, work, hero nouns | `src/data.ts` |
| Pexels storyboard / fetch | `scripts/fetch-pexels.mjs`, `src/lib/media.ts` |
| Colours / fonts | `tailwind.config.js`, `src/index.css` |
| Animated logo | `src/components/Logo.tsx` |
| Live Python lab | `src/components/PyLab.tsx` |
| WebGL scene | `src/components/ImmersiveCanvas.tsx` |

Accessibility: `prefers-reduced-motion` is respected throughout — Framer is wrapped in
`MotionConfig reducedMotion="user"`, video backdrops show a still, WebGL renders one static
frame, and the cycling hero noun holds still.
