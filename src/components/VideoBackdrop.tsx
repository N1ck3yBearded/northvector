import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getClip, FALLBACK_GRADIENT } from '../lib/media'

/**
 * Cinematic backdrop for a scene. Pexels clip for `sceneId` when the manifest
 * has it (run `npm run media`), else a gradient. Adds a slow Ken Burns push and
 * a scroll parallax drift so the plate moves slower than the foreground = depth.
 * Honors prefers-reduced-motion (still poster, no autoplay, no drift).
 */
export default function VideoBackdrop({
  sceneId,
  className = '',
  overlay = 0.55,
  tint = '#0a0b10',
  parallax = true,
}: {
  sceneId: string
  className?: string
  overlay?: number
  tint?: string
  parallax?: boolean
}) {
  const clip = getClip(sceneId)
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  const kb = reduced ? '' : 'kenburns'

  useEffect(() => {
    if (!clip || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [clip])

  useEffect(() => {
    if (near && !reduced) videoRef.current?.play().catch(() => {})
  }, [near, reduced])

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div style={parallax && !reduced ? { y } : undefined} className="absolute inset-[-10%]">
        {clip ? (
          <>
            <img src={clip.poster} alt="" className={`absolute inset-0 h-full w-full object-cover ${kb}`} />
            {near && !reduced && (
              <video
                ref={videoRef}
                src={clip.url}
                poster={clip.poster}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 h-full w-full object-cover ${kb}`}
              />
            )}
          </>
        ) : (
          <div className={`absolute inset-0 ${kb}`} style={{ background: FALLBACK_GRADIENT[sceneId] ?? FALLBACK_GRADIENT.hero }} />
        )}
      </motion.div>
      <div className="absolute inset-0" style={{ background: tint, opacity: overlay }} />
    </div>
  )
}
