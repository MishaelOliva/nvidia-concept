import { useState } from 'react'
import { motion } from 'motion/react'
import { Activity, Cpu, Gauge, Layers, Sparkles, Terminal, Zap, ShieldCheck } from 'lucide-react'
import { Counter, Reveal } from './ui/Reveal'
import { Eyebrow } from './ui/Primitives'
import { playClickSound, playHoverSound, playActivateSound } from '@/lib/audio'

type WorkloadId = 'llm' | 'raytracing' | 'hpc'
type HardwareId = '5090' | '5080' | '5070ti' | 'nvl72'

interface HardwareProfile {
  id: HardwareId
  name: string
  arch: string
  cudaCores: number
  tensorTops: number
  bandwidthGBs: number
  tgpWatts: number
  efficiencyIndex: number
}

const HARDWARE: Record<HardwareId, HardwareProfile> = {
  '5090': {
    id: '5090',
    name: 'RTX 5090',
    arch: 'Blackwell GB202',
    cudaCores: 21760,
    tensorTops: 3352,
    bandwidthGBs: 1792,
    tgpWatts: 575,
    efficiencyIndex: 9.8,
  },
  '5080': {
    id: '5080',
    name: 'RTX 5080',
    arch: 'Blackwell GB203',
    cudaCores: 10752,
    tensorTops: 1840,
    bandwidthGBs: 960,
    tgpWatts: 360,
    efficiencyIndex: 9.4,
  },
  '5070ti': {
    id: '5070ti',
    name: 'RTX 5070 Ti',
    arch: 'Blackwell GB205',
    cudaCores: 8960,
    tensorTops: 1406,
    bandwidthGBs: 672,
    tgpWatts: 285,
    efficiencyIndex: 9.2,
  },
  'nvl72': {
    id: 'nvl72',
    name: 'GB300 NVL72',
    arch: 'Rack-Scale Blackwell',
    cudaCores: 1566720,
    tensorTops: 1440000,
    bandwidthGBs: 240000,
    tgpWatts: 120000,
    efficiencyIndex: 12.0,
  },
}

interface WorkloadProfile {
  id: WorkloadId
  title: string
  tagline: string
  unit: string
  baseMetric: Record<HardwareId, number>
  bandwidthFactor: number
  latencyMs: Record<HardwareId, number>
}

const WORKLOADS: Record<WorkloadId, WorkloadProfile> = {
  llm: {
    id: 'llm',
    title: 'LLM FP4 Inference (70B MoE)',
    tagline: 'DeepSeek-V3 / LLaMA 3.3 tokens/sec synthesis',
    unit: ' tok/s',
    baseMetric: {
      '5090': 284,
      '5080': 168,
      '5070ti': 124,
      'nvl72': 42500,
    },
    bandwidthFactor: 0.88,
    latencyMs: {
      '5090': 14.2,
      '5080': 22.8,
      '5070ti': 31.4,
      'nvl72': 2.1,
    },
  },
  raytracing: {
    id: 'raytracing',
    title: '4K Full Path Tracing',
    tagline: 'Multi-bounce specular GI and volume caustic dispatch',
    unit: ' GigaRays/s',
    baseMetric: {
      '5090': 382,
      '5080': 214,
      '5070ti': 162,
      'nvl72': 26400,
    },
    bandwidthFactor: 0.76,
    latencyMs: {
      '5090': 8.6,
      '5080': 14.2,
      '5070ti': 19.5,
      'nvl72': 0.8,
    },
  },
  hpc: {
    id: 'hpc',
    title: 'Molecular Dynamics (AMBER/GROMACS)',
    tagline: 'FP64 accelerated particle trajectory simulation',
    unit: ' ns/day',
    baseMetric: {
      '5090': 1140,
      '5080': 640,
      '5070ti': 480,
      'nvl72': 185000,
    },
    bandwidthFactor: 0.94,
    latencyMs: {
      '5090': 5.4,
      '5080': 9.2,
      '5070ti': 12.8,
      'nvl72': 0.4,
    },
  },
}

export function BenchmarkLab() {
  const [activeWorkload, setActiveWorkload] = useState<WorkloadId>('llm')
  const [activeHardware, setActiveHardware] = useState<HardwareId>('5090')
  const [batchSize, setBatchSize] = useState<number>(8)
  const [precision, setPrecision] = useState<'FP4' | 'FP8' | 'FP16'>('FP4')

  const hw = HARDWARE[activeHardware]
  const wl = WORKLOADS[activeWorkload]

  // Dynamic calculations based on batch and precision
  const precisionMultiplier = precision === 'FP4' ? 1.0 : precision === 'FP8' ? 0.65 : 0.38
  const batchMultiplier = Math.sqrt(batchSize / 8)
  const throughput = Math.round(wl.baseMetric[activeHardware] * precisionMultiplier * batchMultiplier)
  const effectiveBandwidth = Math.round(hw.bandwidthGBs * wl.bandwidthFactor * (precision === 'FP4' ? 0.85 : 0.98))
  const latency = Number((wl.latencyMs[activeHardware] / precisionMultiplier * Math.pow(batchSize / 8, 0.4)).toFixed(1))

  return (
    <section
      id="benchmark-lab"
      className="relative scroll-mt-24 overflow-hidden border-t border-nv-400/10 py-24 sm:py-32"
      aria-labelledby="benchmark-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_40%,rgba(118,185,0,0.08),transparent_70%)]"
      />

      <div className="container-x relative">
        <div className="flex flex-col items-center text-center">
          <Reveal y={20}>
            <Eyebrow>Interactive Compute Telemetry</Eyebrow>
          </Reveal>

          <Reveal y={24} delay={0.06}>
            <h2
              id="benchmark-heading"
              className="mt-4 font-display text-[clamp(2.1rem,4.5vw,3.6rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-mist-100"
            >
              CUDA &amp; Tensor Workload Lab
            </h2>
          </Reveal>

          <Reveal y={24} delay={0.1}>
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-mist-300 sm:text-[1.08rem]">
              Select high-performance computing workloads and architectures to inspect simulated kernel throughput, memory bandwidth saturation, and real-time execution telemetry.
            </p>
          </Reveal>
        </div>

        {/* Workload Selector Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {(Object.keys(WORKLOADS) as WorkloadId[]).map((wId) => {
            const w = WORKLOADS[wId]
            const active = activeWorkload === wId
            return (
              <button
                key={wId}
                type="button"
                onClick={() => {
                  playClickSound()
                  setActiveWorkload(wId)
                }}
                onMouseEnter={() => playHoverSound()}
                className={`group relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-nv-400 text-ink-950 shadow-[0_0_20px_rgba(118,185,0,0.4)]'
                    : 'glass text-mist-300 hover:text-mist-100 hover:border-nv-400/30'
                }`}
              >
                <Activity className={`size-3.5 ${active ? 'text-ink-950' : 'text-nv-400'}`} />
                <span>{w.title.split(' ')[0]} {w.title.split(' ')[1]}</span>
              </button>
            )
          })}
        </div>

        {/* Main Telemetry Deck */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Controls & Hardware Panel */}
          <div className="glass rounded-3xl p-6 lg:col-span-4 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-nv-300 uppercase">
                <Cpu className="size-4" />
                <span>Target Architecture</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
                {(Object.keys(HARDWARE) as HardwareId[]).map((hId) => {
                  const item = HARDWARE[hId]
                  const isSel = activeHardware === hId
                  return (
                    <button
                      key={hId}
                      type="button"
                      onClick={() => {
                        playActivateSound()
                        setActiveHardware(hId)
                      }}
                      onMouseEnter={() => playHoverSound()}
                      className={`relative flex flex-col items-start rounded-xl p-3 text-left transition-all ${
                        isSel
                          ? 'border border-nv-400/60 bg-nv-400/12 shadow-[0_0_15px_rgba(118,185,0,0.15)]'
                          : 'border border-white/5 bg-ink-900/50 hover:border-nv-400/20'
                      }`}
                    >
                      <span className="font-display text-sm font-bold text-mist-100">{item.name}</span>
                      <span className="mt-0.5 font-mono text-[10px] text-mist-400">{item.arch.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Workload Modifiers */}
              <div className="mt-8 border-t border-nv-400/10 pt-6">
                <div className="flex items-center justify-between text-xs font-medium text-mist-200">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-nv-300 uppercase">
                    <Layers className="size-3.5" /> Batch Concurrency
                  </span>
                  <span className="font-mono font-bold text-nv-400">{batchSize} streams</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  step="1"
                  value={batchSize}
                  onChange={(e) => {
                    playHoverSound()
                    setBatchSize(Number(e.target.value))
                  }}
                  className="mt-3 h-6 w-full cursor-pointer appearance-none rounded-lg bg-transparent accent-nv-400 touch-pan-x [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-ink-800 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-ink-800 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-nv-300 [&::-webkit-slider-thumb]:shadow-[0_0_12px_var(--color-nv-400)] [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-nv-300 [&::-moz-range-thumb]:border-0"
                />
                <div className="mt-1 flex justify-between font-mono text-[9px] text-mist-400">
                  <span>1 (Latency)</span>
                  <span>16 (Balanced)</span>
                  <span>32 (Throughput)</span>
                </div>
              </div>

              {/* Precision Picker */}
              <div className="mt-6">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-nv-300 uppercase">
                  <Sparkles className="size-3.5" /> Tensor Numerical Format
                </span>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {(['FP4', 'FP8', 'FP16'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playClickSound()
                        setPrecision(p)
                      }}
                      className={`rounded-lg py-1.5 font-mono text-xs font-semibold transition-all ${
                        precision === p
                          ? 'bg-nv-400 text-ink-950 font-bold'
                          : 'border border-white/5 bg-ink-800/60 text-mist-300 hover:text-mist-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-nv-400/15 bg-ink-950/60 p-4 font-mono text-[11px] text-mist-400">
              <div className="flex items-center gap-2 text-nv-400">
                <Terminal className="size-3.5" />
                <span>Kernel Telemetry: ACTIVE</span>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-mist-400">
                Profiling {hw.name} across {wl.title}. Utilizing Blackwell 5th-gen Tensor Cores with microscopic scaling factors.
              </p>
            </div>
          </div>

          {/* Real-time Display Gauges */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Primary Big Metric Card */}
            <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs tracking-wider text-nv-300 uppercase">
                    Calculated Compute Throughput
                  </span>
                  <div className="mt-2 flex items-baseline gap-2 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] leading-none font-extrabold text-mist-100">
                    <Counter value={throughput} duration={750} />
                    <span className="text-xl font-bold text-nv-400 sm:text-3xl">{wl.unit}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-nv-400/20 bg-nv-400/10 px-4 py-3 text-right">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-nv-300 uppercase">
                    <ShieldCheck className="size-3.5" /> Hardware Spec
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-mist-100">{hw.arch}</div>
                  <div className="font-mono text-xs text-mist-300">{hw.cudaCores.toLocaleString()} CUDA Cores</div>
                </div>
              </div>

              {/* Progress gauge */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-mono text-mist-300">
                  <span>Memory Bandwidth Saturation</span>
                  <span className="text-nv-300 font-bold">{effectiveBandwidth} GB/s ({Math.round(wl.bandwidthFactor * 100)}%)</span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink-900">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-nv-600 via-nv-400 to-accent-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(wl.bandwidthFactor * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Sub Metric Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-mist-400 uppercase">
                  <Gauge className="size-3.5 text-nv-400" />
                  <span>Execution Latency</span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-mist-100 sm:text-3xl">
                  {latency} <span className="text-sm font-normal text-nv-400">ms</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-mist-400">P99 response envelope</p>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-mist-400 uppercase">
                  <Zap className="size-3.5 text-nv-400" />
                  <span>Power Draw</span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-mist-100 sm:text-3xl">
                  {hw.tgpWatts} <span className="text-sm font-normal text-nv-400">Watts</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-mist-400">Target thermal design</p>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-mist-400 uppercase">
                  <Activity className="size-3.5 text-nv-400" />
                  <span>Efficiency Index</span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-mist-100 sm:text-3xl">
                  {hw.efficiencyIndex} <span className="text-sm font-normal text-nv-400">x</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-mist-400">Tokens / Watt vs Hopper</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
