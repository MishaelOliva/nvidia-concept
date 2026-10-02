import { motion, useScroll, useTransform } from 'motion/react'
import { Boxes, Cpu, Factory, Leaf, Network } from 'lucide-react'
import { useRef } from 'react'
import { EXPO } from '@/lib/motion'
import { Counter, Reveal, Stagger, staggerItem } from './ui/Reveal'
import { SectionHeading } from './ui/Primitives'
import { usePrefersReducedMotion } from '@/lib/hooks'

const LAYERS = [
  {
    icon: <Cpu className="size-5" />,
    label: 'Silicon',
    detail: 'Blackwell & Vera Rubin — Tensor, RT and FP4/FP6 engines',
    items: ['B200', 'GB300 NVL72', 'Rubin', 'Grace'],
  },
  {
    icon: <Network className="size-5" />,
    label: 'Scale-up fabric',
    detail: 'NVLink and InfiniBand moving tokens between dies',
    items: ['NVLink 5', 'Quantum-X800', 'Spectrum-X', 'BlueField-4'],
  },
  {
    icon: <Boxes className="size-5" />,
    label: 'Systems',
    detail: 'Reference AI factories from a single box to a full rack',
    items: ['DGX', 'HGX', 'MGX', 'OVX', 'IGX'],
  },
  {
    icon: <Factory className="size-5" />,
    label: 'Software',
    detail: 'The CUDA-X stack that turns hardware into a platform',
    items: ['CUDA', 'NIM', 'NeMo', 'Dynamo', 'cuOpt', 'RAPIDS'],
  },
]

const METRICS = [
  { value: 1250, suffix: ' PFLOPS', label: 'FP4 inference per rack', sub: 'GB300 NVL72' },
  { value: 140, suffix: ' kW', label: 'Power envelope', sub: 'One NVL72 rack' },
  { value: 25, suffix: '×', label: 'Energy per token vs CPU', sub: 'Accelerated vs general purpose' },
  { value: 21760, suffix: '', label: 'CUDA cores · RTX 5090', sub: 'GeForce flagship' },
]

export function AiFactory() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineScale = useTransform(scrollYProgress, [0.05, 0.6], [0, 1])
  const glowY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="ai-factory"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      {/* deep green ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(75%_55%_at_50%_0%,rgba(118,185,0,0.14),transparent_62%)]"
      />
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]"
      />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="The AI Factory"
          title="Four layers. One platform."
          lede="NVIDIA's advantage is not a single chip — it is the vertical stack. Every layer is engineered to feed the next one, from transistor to trained model."
        />

        {/* ------------------------------------------------------ the stack */}
        <div ref={ref} className="relative mt-20">
          {/* connecting spine */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-6 w-px bg-nv-400/12 lg:left-1/2 lg:-translate-x-1/2"
          >
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-nv-300 via-nv-400 to-transparent shadow-[0_0_18px_var(--color-nv-400)]"
              style={reduced ? { height: '100%' } : { scaleY: lineScale }}
            />
          </div>

          <Stagger className="space-y-5 lg:space-y-8" gap={0.11} amount={0.1}>
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.label}
                variants={staggerItem}
                /* Percent padding resolves against the PARENT width, so
                   combining ml-[52%] with pl-[52%] pushed card content past
                   its own 48% column and clipped it. */
                className={`relative pl-16 lg:pl-0 ${
                  i % 2 === 0 ? 'lg:pr-[52%] lg:text-right' : 'lg:ml-[52%]'
                }`}
              >
                {/* node on the spine */}
                <span
                  aria-hidden
                  className={`absolute top-7 left-[1.06rem] size-3 -translate-x-1/2 rounded-full border-2 border-nv-400 bg-ink-950 shadow-[0_0_14px_var(--color-nv-400)] lg:left-1/2 ${
                    i % 2 === 0 ? 'lg:-translate-x-1/2' : ''
                  }`}
                />

                <div className="glass group rounded-2xl p-6 transition-colors duration-400 hover:border-nv-400/45">
                  <div
                    className={`flex items-start gap-4 ${
                      i % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''
                    }`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-nv-400/25 bg-nv-400/8 text-nv-300 transition-transform duration-500 group-hover:scale-110">
                      {layer.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`flex items-baseline gap-3 ${
                          i % 2 === 0 ? 'lg:justify-end' : ''
                        }`}
                      >
                        <span className="font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                          L{i + 1}
                        </span>
                        <h3 className="font-display text-xl font-extrabold text-mist-100">
                          {layer.label}
                        </h3>
                      </div>
                      <p className="mt-2 text-[0.93rem] leading-relaxed text-mist-300">
                        {layer.detail}
                      </p>

                      <div
                        className={`mt-4 flex flex-wrap gap-1.5 ${
                          i % 2 === 0 ? 'lg:justify-end' : ''
                        }`}
                      >
                        {layer.items.map((it) => (
                          <span
                            key={it}
                            className="rounded-md border border-nv-400/15 bg-ink-800/70 px-2 py-1 font-mono text-[10px] tracking-wide text-mist-300"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* ------------------------------------------------------- metrics */}
        <Reveal delay={0.1} className="mt-20">
          <div className="glass overflow-hidden rounded-3xl">
            {/* 1 col -> 2 -> 4. Per-item left borders rather than divide-x,
                which draws a spurious edge on the first item of row two. */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ ...EXPO, delay: i * 0.08 }}
                  /*
                    Rules per breakpoint, since which items need a vertical
                    rule changes with the column count:
                      1 col  — top rules only, never a left rule
                      2 cols — left rule on odd items (start of row 2)
                      4 cols — left rule on every item after the first
                  */
                  /*
                    Rules are scoped per column count so they cannot collide:
                      1 col  (<sm)   top rules only, never a left rule
                      2 cols (sm→lg) left rule on the items that start a row
                      4 cols (lg)    left rule on everything but the first

                    `sm:max-lg:` rather than `sm:` — an unscoped `sm:` rule
                    still applies at lg, where `lg:`'s equal-specificity
                    border-l-0 could not override it.
                  */
                  className="group relative p-7 max-sm:[&:not(:first-child)]:border-t max-sm:[&:not(:first-child)]:border-nv-400/10 sm:max-lg:[&:nth-child(2n+1)]:border-l sm:max-lg:[&:nth-child(2n+1)]:border-nv-400/10 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-nv-400/10"
                >
                  <div className="tnum font-display text-[2.1rem] leading-none font-extrabold text-mist-100">
                    <Counter value={m.value} duration={2000} />
                    <span className="text-nv-400">{m.suffix}</span>
                  </div>
                  <p className="mt-2.5 text-[0.9rem] leading-snug text-mist-300">{m.label}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-wider text-mist-400 uppercase">
                    {m.sub}
                  </p>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-nv-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------------------------------------------------- sustainability */}
        <Reveal delay={0.1} className="mt-6">
          <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full bg-nv-500/15 blur-[100px]"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-nv-400/25 bg-nv-400/8 text-nv-300">
                  <Leaf className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-mist-100">
                    Accelerated computing is sustainable computing
                  </h3>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-mist-300">
                    Data centres are already about 1–2% of global electricity and
                    growing. Acceleration is the most direct way to reclaim power —
                    running the same workload on purpose-built silicon instead of a
                    general-purpose CPU.
                  </p>
                </div>
              </div>

              <a
                href="#timeline"
                className="group shrink-0 font-semibold text-nv-300 transition-colors hover:text-nv-200"
              >
                Read the history
                <span className="mt-1 block h-px w-0 bg-nv-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
