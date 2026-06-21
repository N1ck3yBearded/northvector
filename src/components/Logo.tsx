import { motion } from 'framer-motion'

/**
 * Northvector mark — a vector heading north. Monoline "N" whose diagonal is an
 * upward arrow. Draws itself on mount, carries a soft accent shimmer, and nudges
 * up on hover. It is just a link home — no hidden behaviour.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5" aria-label="Northvector — home">
      <span className="relative grid h-8 w-8 place-items-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8 overflow-visible">
          <defs>
            <linearGradient id="nv-grad" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6db7a0" />
              <stop offset="50%" stopColor="#d6a86a" />
              <stop offset="100%" stopColor="#9a8fd6" />
            </linearGradient>
          </defs>
          {/* N left stem */}
          <motion.line
            x1="6" y1="26" x2="6" y2="6"
            stroke="url(#nv-grad)" strokeWidth="2.4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
          {/* N right stem */}
          <motion.line
            x1="26" y1="26" x2="26" y2="6"
            stroke="url(#nv-grad)" strokeWidth="2.4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
          />
          {/* diagonal vector = upward arrow */}
          <motion.g
            className="transition-transform duration-300 group-hover:-translate-y-[2px]"
          >
            <motion.line
              x1="6" y1="6" x2="26" y2="26"
              stroke="url(#nv-grad)" strokeWidth="2.4" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.2 }}
            />
            {/* arrowhead pointing north (up-right tip) */}
            <motion.path
              d="M26 6 L26 14 M26 6 L18 6"
              stroke="url(#nv-grad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
            />
          </motion.g>
        </svg>
      </span>
      {!compact && (
        <span className="font-mono text-sm font-medium tracking-wide text-mist-100">
          Northvector
        </span>
      )}
    </a>
  )
}
