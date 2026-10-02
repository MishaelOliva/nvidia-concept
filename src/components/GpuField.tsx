import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/* ============================================================================
   GPU field — a raw WebGL fragment shader.

   No 3D library: a single full-screen quad and a fragment program is all this
   needs, which keeps the payload tiny and the frame budget healthy. The scene
   is a perspective floor grid receding to a plasma horizon with a travelling
   energy pulse — the "accelerated computing" visual language.

   Falls back to a static CSS gradient when WebGL is unavailable or the user
   prefers reduced motion.
   ========================================================================= */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;

// ---------- hash / value noise ----------
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

// crisp anti-aliased grid line.
// fract(x) in [0,1); d = |fract(x) - 0.5| is 0 mid-cell and 0.5 AT the cell
// boundary — so the lines live where d is large.
float gridLine(float x, float w) {
  float d = abs(fract(x) - 0.5);
  return smoothstep(0.5 - w, 0.5, d);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // pointer parallax + a gentle drift tied to page scroll
  uv.x += uMouse.x * 0.055;
  uv.y -= uMouse.y * 0.030;
  uv.y += uScroll * 0.22;

  float t = uTime * 0.14;
  float horizon = 0.18;

  vec3 col = vec3(0.0);

  // base wash
  col += vec3(0.008, 0.024, 0.005) * smoothstep(-0.7, 0.5, uv.y);

  if (uv.y < horizon) {
    // ---------------------------------------------------------------- floor
    float d = horizon - uv.y;
    float z = 1.0 / (d * 3.2 + 0.05);
    float x = uv.x * z;

    // keep line width roughly constant on screen under perspective
    float w = clamp(d * 1.7, 0.004, 0.5);

    float gx = gridLine(x, w);
    float gz = gridLine(z * 0.42 - t * 1.0, w * 1.2);

    float grid = max(gx, gz * 0.8);
    float fade = exp(-d * 4.2);

    col += vec3(0.24, 0.74, 0.05) * grid * fade * 0.85;

    // travelling energy pulse along the depth axis
    float ph = fract(z * 0.09 - t * 0.5);
    float pulse = exp(-pow(ph - 0.5, 2.0) * 160.0);
    col += vec3(0.42, 0.95, 0.18) * pulse * fade * 0.55;

    // ground haze
    col += vec3(0.020, 0.062, 0.010) * fade;

  } else {
    // ----------------------------------------------------------------- sky
    float band = exp(-max(uv.y - horizon, 0.0) * 9.0);
    if (band > 0.005) {
      float p1 = fbm(vec2(uv.x * 2.1, uv.y * 2.6 - t * 1.15));
      float glow = smoothstep(0.55, 1.0, p1) * 0.45 * band;
      col += vec3(0.12, 0.36, 0.035) * glow;

      // thin vertical light streaks — reads as data lanes
      float lanes = hash21(vec2(floor(uv.x * 46.0), 3.0));
      float lane = step(0.962, lanes) *
                   smoothstep(0.0, 0.30, band) *
                   (0.4 + 0.6 * sin(uTime * 1.7 + lanes * 40.0));
      col += vec3(0.32, 0.85, 0.16) * lane * 0.16;

      // horizon bloom
      col += vec3(0.20, 0.56, 0.09) * exp(-abs(uv.y - horizon) * 30.0) * 0.5;
    }
  }

  // ------------------------------------------------------------- post stack
  // centre bloom
  float r = length(uv * vec2(0.85, 1.0));
  col += vec3(0.07, 0.19, 0.03) * exp(-r * 2.1) * 0.9;

  // scanlines
  col *= 0.94 + 0.06 * sin(gl_FragCoord.y * 1.6);

  // vignette
  col *= smoothstep(1.4, 0.3, r);

  // gamma lift so the black floor never crushes to a flat block
  col = pow(max(col, 0.0), vec3(0.88));

  // dither to kill banding in the dark gradients
  col += (hash21(gl_FragCoord.xy + uTime) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[gpu-field] shader compile failed:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function GpuField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return

    // One context only — a second getContext call with different attributes
    // returns null, and 'experimental-webgl' is long dead.
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    // Declared before `dispose` and nullable, so the cleanup path is valid at
    // every exit point. (Holding `const`s declared further down would put them
    // in the temporal dead zone when dispose() runs on an early return.)
    let vs: WebGLShader | null = null
    let fs: WebGLShader | null = null
    let prog: WebGLProgram | null = null
    let buf: WebGLBuffer | null = null
    let disposed = false

    /** Free every GL object created below. Safe to call more than once. */
    const dispose = () => {
      if (disposed) return
      disposed = true
      if (prog) gl.deleteProgram(prog)
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      if (buf) gl.deleteBuffer(buf)
    }

    vs = compile(gl, gl.VERTEX_SHADER, VERT)
    fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      dispose()
      return
    }

    prog = gl.createProgram()
    if (!prog) {
      dispose()
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[gpu-field] link failed:', gl.getProgramInfoLog(prog))
      dispose()
      return
    }
    gl.useProgram(prog)

    // full-screen triangle-strip quad
    buf = gl.createBuffer()
    if (!buf) {
      dispose()
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uScroll = gl.getUniformLocation(prog, 'uScroll')

    // ---- sizing (DPR-aware, capped to keep fill-rate sane) ----
    // Driven by a ResizeObserver rather than polled per frame: reading
    // clientWidth inside the RAF forces a layout on every single frame.
    const resize = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const maxDpr = isMobile ? 1.0 : 1.5
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    const ro = new ResizeObserver(resize)

    // ---- pointer ----
    const mouse = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    // Scroll progress is read from the CSS variable App already maintains, so
    // this handler never touches layout (no scrollHeight read per event).
    let scroll = 0
    let scrollRaf = 0
    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        const v = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress'),
        )
        scroll = Number.isFinite(v) ? v : 0
      })
    }

    let raf = 0
    let running = true
    let alive = true
    const start = performance.now()

    // Declared as a const arrow (not a hoisted `function`) so TypeScript keeps
    // the null-narrowing of `canvas`/`gl` inside the closure.
    const frame = (now: number) => {
      if (!running) return
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.uniform1f(uScroll, scroll)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }

    const resume = () => {
      if (!alive || running || document.hidden) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const pause = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    // A lost context (GPU reset, driver update, tab suspension) would otherwise
    // leave a dead canvas; restore by rebuilding on the next frame.
    const onContextLost = (e: Event) => {
      e.preventDefault()
      pause()
    }
    const onContextRestored = () => {
      window.location.reload()
    }
    canvas.addEventListener('webglcontextlost', onContextLost, false)
    canvas.addEventListener('webglcontextrestored', onContextRestored, false)

    // pause entirely when off-screen or in a background tab
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? resume() : pause()), {
      threshold: 0,
    })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? pause() : resume())

    resize()
    ro.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      alive = false
      pause()
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      dispose()
    }
  }, [reduced])

  if (reduced) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            'radial-gradient(120% 70% at 50% 62%, rgba(118,185,0,0.16), transparent 60%), linear-gradient(#05070a, #000)',
        }}
      />
    )
  }

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />
}
