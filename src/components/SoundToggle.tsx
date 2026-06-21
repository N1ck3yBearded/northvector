import { useEffect, useRef, useState } from 'react'

/**
 * @webloved staple: "Sound off rides the Web Audio API, gated behind one click
 * since browsers block autoplay sound." A tasteful ambient pad — off by default,
 * built lazily on the first click (the required user gesture), volume kept low.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<OscillatorNode[]>([])

  const build = () => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 720
    master.connect(lp).connect(ctx.destination)

    // soft detuned pad — a low root + fifth, gently drifting
    const freqs = [110, 164.81, 220]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      osc.detune.value = i === 1 ? 4 : -3
      const g = ctx.createGain()
      g.gain.value = i === 2 ? 0.4 : 1
      osc.connect(g).connect(master)
      osc.start()
      nodesRef.current.push(osc)
    })

    // slow tremolo so it breathes
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.015
    lfo.connect(lfoGain).connect(master.gain)
    lfo.start()
    nodesRef.current.push(lfo)

    ctxRef.current = ctx
    gainRef.current = master
  }

  const toggle = () => {
    if (!ctxRef.current) build()
    const ctx = ctxRef.current!
    const master = gainRef.current!
    if (ctx.state === 'suspended') ctx.resume()
    const next = !on
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.linearRampToValueAtTime(next ? 0.05 : 0, now + 0.6)
    setOn(next)
  }

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      ctxRef.current?.close()
    }
  }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      className="eyebrow group inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-2 text-mist-400 transition-colors duration-200 hover:border-amber/50 hover:text-amber"
    >
      <span className="relative flex h-2.5 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
              on ? 'animate-[eq_0.9s_ease-in-out_infinite]' : 'h-[3px] opacity-60'
            }`}
            style={on ? { height: '100%', animationDelay: `${i * 0.15}s` } : undefined}
          />
        ))}
      </span>
      {on ? 'sound on' : 'sound off'}
    </button>
  )
}
