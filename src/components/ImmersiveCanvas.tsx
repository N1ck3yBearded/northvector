import { useEffect, useRef } from 'react'

// A living "north-vector" field, drawn on the GPU in raw WebGL — no three.js.
// Flowing topographic contour lines (think an animated navigation chart) in the
// brand palette, bending around the cursor. Honest "real-time WebGL", bespoke,
// and ~880KB lighter than the old torus-knot scene. Reduced-motion = one frame.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;   // 0..1, y-up
uniform float u_mouseOn; // 0..1

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = uv; p.x *= aspect;

  float t = u_time * 0.05;

  // domain warp -> the field flows
  vec2 q = vec2(
    fbm(p * 2.2 + vec2(0.0, t)),
    fbm(p * 2.2 + vec2(5.2, -t))
  );

  // the cursor pulls the field toward itself
  vec2 mp = u_mouse; mp.x *= aspect;
  vec2 toM = mp - p;
  float halo = exp(-dot(toM, toM) * 6.0) * u_mouseOn;
  q += toM * halo * 1.4;

  float f = fbm(p * 2.6 + q * 1.7 + vec2(t * 0.5, -t * 0.35));

  // topographic contour lines
  float band = abs(fract(f * 7.0) - 0.5);
  float contour = smoothstep(0.06, 0.0, band);

  // brand palette across the field
  vec3 ink   = vec3(0.043, 0.043, 0.055);
  vec3 amber = vec3(0.839, 0.659, 0.416);
  vec3 jade  = vec3(0.427, 0.718, 0.627);
  vec3 dusk  = vec3(0.604, 0.561, 0.839);

  vec3 col = mix(jade, amber, smoothstep(0.30, 0.72, f));
  col = mix(col, dusk, smoothstep(0.62, 0.96, f));

  vec3 outc = ink;
  outc += col * contour;                            // glowing lines
  outc += col * 0.06 * smoothstep(0.15, 0.95, f);   // faint field wash
  outc += amber * halo * 0.30;                      // warm cursor bloom

  vec2 d = uv - 0.5;                                // gentle vignette
  outc *= 1.0 - dot(d, d) * 0.55;

  gl_FragColor = vec4(outc, 1.0);
}
`

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('shader:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ImmersiveCanvas({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const kickRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('link:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uMouseOn = gl.getUniformLocation(prog, 'u_mouseOn')

    const reduced = prefersReduced()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let start = 0
    let mx = 0.5
    let my = 0.5
    let targetOn = 0
    let on = 0

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        mx = x
        my = 1 - y
        targetOn = 1
      } else {
        targetOn = 0
      }
    }
    const onLeave = () => {
      targetOn = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    const render = (ts: number) => {
      if (!start) start = ts
      on += (targetOn - on) * 0.06
      gl.uniform1f(uTime, (ts - start) / 1000)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uMouseOn, on)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = activeRef.current && !reduced ? requestAnimationFrame(render) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    kickRef.current = kick
    kick() // draw at least one frame immediately; loops only while active

    return () => {
      kickRef.current = null
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      // NB: do NOT loseContext() here — a canvas only ever returns its one
      // context, so under StrictMode/HMR remounts the next getContext() would
      // hand back a dead context and every shader compile would fail silently.
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (active) kickRef.current?.()
  }, [active])

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
}
