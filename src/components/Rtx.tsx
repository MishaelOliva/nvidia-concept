import { AnimatePresence, motion } from 'motion/react'
import { Cpu, Gauge, MemoryStick, Zap } from 'lucide-react'
import { useRef, useState } from 'react'
import { GPUS, type Gpu } from '@/lib/data'
import { EXPO, SPRING } from '@/lib/motion'
import { Counter, Reveal } from './ui/Reveal'
import { MagneticButton, Tilt } from './ui/Interactive'
import { SectionHeading } from './ui/Primitives'
import { playClickSound, playHoverSound } from '@/lib/audio'

export function Rtx() {
  const [sel, setSel] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const gpu = GPUS[sel]

  return (
    <section id="rtx" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(65%_55%_at_50%_50%,#000,transparent)]" />
      <div
        aria-hidden
        className="absolute right-0 bottom-0 size-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-nv-500/10 blur-[130px]"
      />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="GeForce RTX 50 Series"
          title="Blackwell, on the desktop"
          lede="Fifth-generation RT Cores, fourth-generation Tensor Cores and DLSS 4 frame generation. The most capable GeForce architecture we have ever shipped."
        />

        {/* ------------------------------------------------- selector strip */}
        <Reveal delay={0.1}>
          <div className="mt-14 -mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="GeForce RTX 50 Series models"
              className="flex min-w-max gap-2"
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                e.preventDefault()
                const next =
                  e.key === 'ArrowRight'
                    ? (sel + 1) % GPUS.length
                    : (sel - 1 + GPUS.length) % GPUS.length
                setSel(next)
                tabRefs.current[next]?.focus()
              }}
            >
              {GPUS.map((g, i) => (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  type="button"
                  id={`gpu-tab-${g.id}`}
                  aria-selected={i === sel}
                  aria-controls="gpu-panel"
                  tabIndex={i === sel ? 0 : -1}
                  onClick={() => {
                    playClickSound()
                    setSel(i)
                  }}
                  onMouseEnter={() => playHoverSound()}
                  className={`relative rounded-xl px-5 py-3 text-left transition-colors duration-300 ${
                    i === sel ? 'text-ink-950' : 'text-mist-300 hover:text-mist-100'
                  }`}
                >
                  {i === sel && (
                    <motion.span
                      layoutId="gpu-tab"
                      className="absolute inset-0 rounded-xl bg-nv-400"
                      transition={SPRING}
                    />
                  )}
                  <span className="relative block font-display text-[0.95rem] font-bold whitespace-nowrap">
                    {g.name.replace('GeForce ', '')}
                  </span>
                  <span
                    className={`relative mt-0.5 block font-mono text-[10px] tracking-wider ${
                      i === sel ? 'text-ink-950/70' : 'text-mist-400'
                    }`}
                  >
                    {g.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ spec panel */}
        <div
          className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr]"
          role="tabpanel"
          id="gpu-panel"
          aria-labelledby={`gpu-tab-${gpu.id}`}
          tabIndex={-1}
        >
          {/* visual */}
          <Reveal y={30}>
            <Tilt className="h-full" max={7}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={gpu.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={EXPO}
                  className="glass relative h-full overflow-hidden rounded-3xl p-8"
                >
                  {/* rendered die + fan visual, drawn in SVG */}
                  <DieArt gpu={gpu} />

                  <div className="relative mt-8">
                    <h3 className="font-display text-2xl font-extrabold text-mist-100">
                      {gpu.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-nv-300">{gpu.tagline}</p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <MagneticButton href="#dlss" className="px-5 py-2.5 text-sm">
                        See DLSS impact
                      </MagneticButton>
                      <MagneticButton href="#cta" variant="outline" className="px-5 py-2.5 text-sm">
                        Configure
                      </MagneticButton>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tilt>
          </Reveal>

          {/* numbers */}
          <Reveal y={30} delay={0.08}>
            <div className="grid h-full grid-cols-2 gap-4">
              <Metric icon={<Cpu className="size-4" />} label="CUDA Cores" value={gpu.cudaCores} bar={gpu.tier} />
              <Metric
                icon={<Gauge className="size-4" />}
                label="Boost Clock"
                value={gpu.boostGHz}
                decimals={2}
                unit=" GHz"
                bar={(gpu.boostGHz / 2.8) * 100}
              />
              <Metric
                icon={<MemoryStick className="size-4" />}
                label={`VRAM · ${gpu.memoryType}`}
                value={gpu.vramGB}
                unit=" GB"
                bar={(gpu.vramGB / 32) * 100}
              />
              <Metric
                icon={<Zap className="size-4" />}
                label="Total Board Power"
                value={gpu.tgpWatts}
                unit=" W"
                bar={(gpu.tgpWatts / 600) * 100}
              />
              <Metric
                icon={<Zap className="size-4" />}
                label="AI Performance"
                value={gpu.aiTops}
                unit=" TOPS"
                bar={(gpu.aiTops / 3400) * 100}
              />
              <Metric
                icon={<MemoryStick className="size-4" />}
                label="Memory Interface"
                value={gpu.busWidth}
                unit="-bit"
                bar={(gpu.busWidth / 512) * 100}
              />
            </div>
          </Reveal>
        </div>

        {/* disclaimer */}
        <p className="mt-8 font-mono text-[11px] leading-relaxed text-mist-400">
          Specifications are reference design figures for the NVIDIA Blackwell
          architecture. Boost clocks vary by board partner and thermal solution.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Metric tile                                                               */
/* -------------------------------------------------------------------------- */
function Metric({
  icon,
  label,
  value,
  unit = '',
  decimals = 0,
  bar,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit?: string
  decimals?: number
  bar: number
}) {
  return (
    <div className="glass group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-colors hover:border-nv-400/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-nv-400/0 blur-2xl transition-all duration-500 group-hover:bg-nv-400/20"
      />

      <div className="relative flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-mist-400 uppercase">
        <span className="text-nv-400">{icon}</span>
        <span className="truncate">{label}</span>
      </div>

      <div className="relative mt-5">
        <div className="tnum font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-extrabold text-mist-100">
          <Counter value={value} decimals={decimals} duration={900} />
          <span className="text-nv-400">{unit}</span>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink-700">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-nv-600 to-nv-300"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, bar)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  DieArt — procedural GPU die visual                                        */
/* -------------------------------------------------------------------------- */
function DieArt({ gpu }: { gpu: Gpu }) {
  // SM block grid scales with core count so bigger dies look denser.
  // (The previous expression mis-parenthesised into 14x52 = 728 rects.)
  const cols = gpu.cudaCores > 12000 ? 14 : gpu.cudaCores > 7000 ? 12 : 10
  const rows = 6
  const t = Math.min(1, gpu.tier / 100)
  // Gradient ids must be unique per instance or the AnimatePresence
  // crossfade resolves every <linearGradient> to the outgoing card's paint.
  const uid = `die-${gpu.id}`

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-nv-400/15 bg-ink-950/60">
      <svg viewBox="0 0 320 240" className="size-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d1410" />
            <stop offset="100%" stopColor="#05080a" />
          </linearGradient>
          <linearGradient id={`${uid}-sm`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8f542" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4c7f00" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id={`${uid}-halo`}>
            <stop offset="0%" stopColor="#76b900" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#76b900" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo */}
        <circle cx="160" cy="120" r="112" fill={`url(#${uid}-halo)`} />

        {/* substrate */}
        <rect x="40" y="26" width="240" height="188" rx="14" fill={`url(#${uid}-face)`} stroke="#1f3320" />

        {/* die package */}
        <rect x="86" y="64" width="148" height="112" rx="8" fill="#0a1208" stroke="#2c4a1a" />

        {/* SM blocks */}
        <g>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              // deterministic pseudo-random lit pattern, denser for bigger dies
              const n = (r * cols + c) * 2654435761
              const lit = ((n >>> 7) % 100) / 100 < 0.35 + t * 0.4
              const x = 90 + c * (140 / cols)
              const y = 68 + r * (104 / rows)
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={140 / cols - 2}
                  height={104 / rows - 2}
                  rx="1.5"
                  fill={lit ? `url(#${uid}-sm)` : '#16210f'}
                  opacity={lit ? 0.28 + t * 0.5 : 0.5}
                />
              )
            }),
          )}
        </g>

        {/* memory packages around the die */}
        <g fill="#132414" stroke="#274a17" strokeWidth="0.75">
          {[
            [52, 40],
            [104, 40],
            [156, 40],
            [208, 40],
            [52, 172],
            [104, 172],
            [156, 172],
            [208, 172],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="44" height="26" rx="3" />
          ))}
        </g>

        {/* I/O edge connector fingers */}
        <g fill="#1d3316">
          {Array.from({ length: 34 }).map((_, i) => (
            <rect key={i} x={92 + i * 4} y={204} width="2.2" height="7" />
          ))}
        </g>

        {/* die label */}
        <text
          x="160"
          y="112"
          textAnchor="middle"
          fill="#a8f542"
          fontSize="15"
          fontFamily="Archivo, Inter, sans-serif"
          fontWeight="800"
          letterSpacing="0.5"
        >
          {gpu.name.replace('GeForce RTX ', 'RTX ')}
        </text>
        <text
          x="160"
          y="128"
          textAnchor="middle"
          fill="#bbf7d0"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="1.6"
          opacity="0.9"
        >
          GB20{cols - 4} · {gpu.memoryType} · {gpu.vramGB}GB
        </text>

        {/* corner ticks */}
        <g stroke="#76b900" strokeWidth="1.4" opacity="0.75">
          <path d="M40 44 L40 26 L58 26" fill="none" />
          <path d="M280 44 L280 26 L262 26" fill="none" />
          <path d="M40 196 L40 214 L58 214" fill="none" />
          <path d="M280 196 L280 214 L262 214" fill="none" />
        </g>
      </svg>

      {/* live scan sweep */}
      <div
        aria-hidden
        className="animate-sweep-y absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-nv-400/12 to-transparent"
        data-ambient
      />
      <div aria-hidden className="absolute inset-0 bg-scanlines opacity-25" />
    </div>
  )
}
