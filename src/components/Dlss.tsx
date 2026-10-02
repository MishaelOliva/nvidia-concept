import { AnimatePresence, motion } from 'motion/react'
import { Activity, Gauge, Timer, Zap } from 'lucide-react'
import { useState } from 'react'
import { DLSS_PRESETS } from '@/lib/data'
import { EXPO, SPRING } from '@/lib/motion'
import { Counter, Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/Primitives'

/* ============================================================================
   DLSS lab — drag a slider to move continuously through the DLSS pipeline
   and watch generated frames, latency and image quality respond in real time.
   ========================================================================= */

export function Dlss() {
  /* `pos` is the slider's own 0..4 value, i.e. a position along the four
     intervals between the five presets.
       pos 0    -> Native        (idx 0, frac 0)
       pos 1    -> Quality       (idx 1, frac 0)
       pos 1.5  -> halfway Quality -> Balanced
       pos 4    -> Frame Gen     (idx 4, frac 0)

     The previous version did `Math.round(t * (len - 1))`, multiplying the
     slider value by 4 a second time, so anything past the first notch snapped
     straight to the last preset. */
  const [pos, setT] = useState(0)
  const last = DLSS_PRESETS.length - 1
  const t = Number.isFinite(pos) ? Math.min(last, Math.max(0, pos)) : 0

  const idx = Math.min(last, Math.floor(t))
  const frac = t - idx

  const lo = DLSS_PRESETS[idx] ?? DLSS_PRESETS[0]
  const hi = DLSS_PRESETS[Math.min(last, idx + 1)] ?? lo
  const preset = lo
  const lerp = (a: number, b: number) => a + (b - a) * frac

  const frames = lerp(lo.frames, hi.frames)
  const input = lerp(lo.input, hi.input)
  const latency = lerp(lo.latencyMs, hi.latencyMs)
  const gain = frames / input

  // Upscaling presets produce no extra frames — the uplift comes from drawing
  // fewer pixels. Only Frame Generation synthesises output frames, so the
  // "synthesised" split is gated on genFactor rather than frames - input.
  const genFactor = lerp(lo.genFactor, hi.genFactor)
  const isGenerating = genFactor > 0.001
  const synthesised = isGenerating ? frames - input : 0
  const upscaled = isGenerating ? 0 : Math.max(0, frames - input)

  const internalRes = Math.round(lerp(lo.internalRes, hi.internalRes) * 100)

  // Two bars whose meaning depends on the active mode.
  const barRows = [
    { label: 'Rendered by GPU', value: input, color: 'bg-nv-600' },
    isGenerating
      ? { label: 'Synthesised by Frame Gen', value: synthesised, color: 'bg-nv-300' }
      : { label: 'Upscaled by DLSS', value: upscaled, color: 'bg-nv-300' },
  ]

  return (
    <section id="dlss" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)]" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="DLSS 4 · Neural Rendering"
          title="Draw less. Render more."
          lede="Deep Learning Super Sampling reconstructs frames from a neural model and synthesises entirely new ones from motion vectors. Drag the control to see throughput climb while input latency stays flat."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* ------------------------------------------------- visual + slider */}
          <Reveal y={28}>
            <div className="glass overflow-hidden rounded-3xl">
              {/* frame visualiser */}
              <div className="relative aspect-16/10 overflow-hidden bg-ink-950">
                <FrameGrid density={internalRes / 100} generating={isGenerating} />

                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-start justify-between">
                    <Badge label={preset.name} />
                    <Badge
                      label={
                        isGenerating
                          ? `${internalRes}% internal res + frame gen`
                          : `${internalRes}% internal res`
                      }
                      muted
                    />
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="tnum font-display text-5xl leading-none font-extrabold text-mist-100 sm:text-6xl">
                        <Counter value={frames} duration={260} />
                        <span className="text-2xl text-nv-400"> fps</span>
                      </div>
                      <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-mist-400 uppercase">
                        {preset.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tnum font-display text-2xl leading-none font-bold text-nv-300">
                        {gain.toFixed(2)}×
                      </p>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-mist-400 uppercase">
                        vs native
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* slider */}
              <div className="border-t border-nv-400/12 p-6">
                <label htmlFor="dlss-slider" className="sr-only">
                  DLSS quality preset
                </label>

                <div className="relative mb-5 h-1.5 rounded-full bg-ink-700">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-nv-600 via-nv-400 to-nv-200"
                    style={{ width: `${t * 100}%` }}
                  />
                  {/* preset ticks */}
                  {DLSS_PRESETS.map((p, i) => (
                    <span
                      key={p.id}
                      aria-hidden
                      className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors ${
                        i <= idx ? 'border-nv-200 bg-nv-400' : 'border-ink-500 bg-ink-800'
                      }`}
                      style={{ left: `${(i / (DLSS_PRESETS.length - 1)) * 100}%` }}
                    />
                  ))}
                  <input
                    id="dlss-slider"
                    type="range"
                    min={0}
                    max={DLSS_PRESETS.length - 1}
                    step={0.01}
                    value={t}
                    onChange={(e) => setT(Number(e.target.value))}
                    aria-valuetext={preset.name}
                    className="absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 cursor-grab appearance-none bg-transparent active:cursor-grabbing touch-pan-x [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-nv-300 [&::-moz-range-thumb]:shadow-[0_0_18px_var(--color-nv-400)] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-nv-300 [&::-webkit-slider-thumb]:shadow-[0_0_18px_var(--color-nv-400)]"
                  />
                </div>

                <div className="-mx-1 mt-1 flex flex-wrap justify-between gap-x-1 font-mono text-[10px] tracking-[0.14em] uppercase">
                  {DLSS_PRESETS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setT(i)}
                      aria-pressed={i === idx}
                      /* min 2.25rem tall for comfortable touch */
                      className={`-mx-1 inline-flex min-h-9 items-center rounded-lg px-2 py-1.5 transition-colors ${
                        i === idx ? 'text-nv-300' : 'text-mist-400 hover:text-mist-200'
                      }`}
                    >
                      {p.name.replace('DLSS ', '').replace('Native / No DLSS', 'Native')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* --------------------------------------------------------- readout */}
          <Reveal y={28} delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                  <Activity className="size-3.5" />
                  Frame composition
                </div>

                {/* Bars have stable keys, so animate the widths directly —
                    an AnimatePresence wrapper here could never fire. */}
                <div className="mt-6 space-y-4">
                  {barRows.map((row) => (
                    <motion.div key={row.label}>
                      <div className="mb-1.5 flex justify-between font-mono text-[11px] text-mist-300">
                        <span>{row.label}</span>
                        <span className="tabular-nums">{Math.round(row.value)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                        <motion.div
                          className={`h-full rounded-full ${row.color}`}
                          animate={{ width: `${(row.value / Math.max(frames, 1)) * 100}%` }}
                          transition={SPRING}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Stat
                  icon={<Timer className="size-4" />}
                  label="Input latency"
                  value={latency}
                  decimals={1}
                  unit=" ms"
                />
                <Stat
                  icon={<Zap className="size-4" />}
                  label="Frames / input"
                  value={gain}
                  decimals={2}
                  unit="×"
                />
              </div>

              <div className="glass flex-1 rounded-3xl p-6">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                  <Gauge className="size-3.5" />
                  How it works
                </div>
                {/* Crossfade, not mode="wait": the panel is re-keyed on every
                    preset boundary, which blanks it while dragging. */}
                <AnimatePresence initial={false}>
                  <motion.p
                    key={preset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={EXPO}
                    className="mt-4 text-[0.95rem] leading-relaxed text-mist-300"
                  >
                    {preset.note}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Badge / Stat                                                              */
/* -------------------------------------------------------------------------- */
function Badge({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span
      className={`glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase ${
        muted ? 'text-mist-400' : 'text-nv-300'
      }`}
    >
      {label}
    </span>
  )
}

function Stat({
  icon,
  label,
  value,
  unit,
  decimals = 0,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string
  decimals?: number
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-mist-400 uppercase">
        <span className="text-nv-400">{icon}</span>
        {label}
      </div>
      <div className="tnum mt-3 font-display text-3xl leading-none font-extrabold text-mist-100">
        <Counter value={value} decimals={decimals} duration={260} />
        <span className="text-nv-400">{unit}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  FrameGrid — the visual proxy for the pipeline                              */
/* -------------------------------------------------------------------------- */
function FrameGrid({ density, generating }: { density: number; generating: boolean }) {
  // Fewer tiles stay lit as internal resolution drops, and Frame Generation
  // adds a second overlaid layer to read as a synthesised frame.
  const cells = 14
  const t = Math.max(0, Math.min(1, density))

  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className="absolute inset-0 grid transition-opacity duration-300"
        style={{
          gridTemplateColumns: `repeat(${cells}, 1fr)`,
          opacity: 0.25 + t * 0.6,
        }}
      >
        {Array.from({ length: cells * Math.round(cells * 0.62) }).map((_, i) => {
          const n = i * 2654435761
          const on = ((n >>> 9) % 100) / 100 < 0.28 + t * 0.42
          return (
            <span
              key={i}
              className="border border-nv-400/8"
              style={{ background: on ? 'rgba(118,185,0,0.13)' : 'transparent' }}
            />
          )
        })}
      </div>

      {generating && (
        <div
          className="absolute inset-0 grid animate-pulse"
          style={{ gridTemplateColumns: `repeat(${cells}, 1fr)`, opacity: 0.28 }}
        >
          {Array.from({ length: cells * Math.round(cells * 0.62) }).map((_, i) => {
            const n = (i + 7) * 40503
            const on = ((n >>> 9) % 100) / 100 < 0.22
            return (
              <span
                key={i}
                className="border border-nv-300/12"
                style={{ background: on ? 'rgba(168,245,66,0.14)' : 'transparent' }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
