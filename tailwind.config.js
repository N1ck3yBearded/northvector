/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep-night base (mood 1) — warm-neutral, not pure black
        ink: {
          900: '#0a0b10',
          800: '#0f1117',
          700: '#161922',
          600: '#1e222e',
          500: '#272c3a',
        },
        // Light, airy editorial base (mood 2)
        paper: {
          50: '#f6f4ef',
          100: '#efece4',
          200: '#e2ddd1',
          900: '#15161c',
        },
        // Muted jewel + warm accents (mood 3) — sophisticated, never neon
        jade: '#6db7a0',
        amber: '#d6a86a',
        dusk: '#9a8fd6',
        teal: '#7fb1c4',
        // Text
        mist: {
          100: '#eceae3',
          300: '#b6b6c0',
          500: '#85858f',
          700: '#54555f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.32em',
      },
    },
  },
  plugins: [],
}
