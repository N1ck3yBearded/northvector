import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this project under /northvector/ in production.
  // Dev server stays at / so local preview is unaffected.
  base: command === 'build' ? '/northvector/' : '/',
}))
