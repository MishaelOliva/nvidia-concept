import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Cpu, Sparkles, Zap } from 'lucide-react'
import { useRef } from 'react'
import { GpuField } from './GpuField'
import { HERO_STATS } from '@/lib/data'
import { EXPO, EXPO_SLOW } from '@/lib/motion'
import { Counter, Reveal, SplitText } from './ui/Reveal'
import { MagneticButton } from './ui/Interactive'
import { Eyebrow } from './ui/Primitives'
import { usePrefersReducedMotion } from '@/lib/hooks'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '32%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0])
  const cueY = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-10"
    >
      {/* ------------------------------------------------------- backdrop */}
      <GpuField />

      {/* darkening wash so type always wins */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/25 to-ink-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,transparent,rgba(0,0,0,0.75))]"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-x relative"
      >
        <div className="max-w-5xl">
          <Reveal y={14}>
            <Eyebrow>Blackwell · RTX 50 Series · Now Shipping</Eyebrow>
          </Reveal>

          {/* headline */}
          <h1 className="mt-5 text-[clamp(2.35rem,6.2vw,4.8rem)] leading-[0.96] font-extrabold tracking-[-0.035em]">
            <SplitText text="The engine" className="block text-mist-100" delay={0.05} staggerS={0.045} />
            <SplitText
              text="of artificial"
              className="block text-mist-100"
              delay={0.22}
              staggerS={0.045}
            />
            <span className="relative block overflow-hidden">
              <motion.span
                className="text-gradient block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ ...EXPO_SLOW, delay: 0.44 }}
              >
                intelligence.
              </motion.span>
            </span>
          </h1>

          {/* lede */}
          <Reveal delay={0.5} y={22}>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-mist-300 sm:text-[1.1rem]">
              NVIDIA engineers the chips, systems and software behind the world's AI
              factories — and the platforms that turn parallel computing into a new
              industrial revolution.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.62} y={22}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <MagneticButton href="#rtx" icon={<ArrowDown className="size-4" />}>
                Explore RTX 50
              </MagneticButton>
              <MagneticButton href="#pillars" variant="outline">
                Watch Our Story
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* --------------------------------- mobile & tablet telemetry rail */}
        <div className="mt-8 lg:hidden">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <StatRail mobile />
          </div>
        </div>

        {/* --------------------------------------------------- floating HUD */}
        <div className="pointer-events-none mt-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EXPO, delay: 0.8 }}
            className="flex items-end justify-between gap-8"
          >
            <StatRail />
            <div className="relative" data-ambient>
              {/* orbiting chip */}
              <div className="animate-spin-slow relative grid size-40 place-items-center">
                <svg viewBox="0 0 160 160" className="absolute inset-0 size-full text-nv-400/45" aria-hidden>
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="3 7"
                  />
                  <circle cx="80" cy="8" r="3" fill="currentColor" />
                </svg>
                <div className="grid size-24 place-items-center rounded-2xl border border-nv-400/30 bg-ink-900/80 shadow-glow backdrop-blur-sm">
                  <Cpu className="size-9 text-nv-300" strokeWidth={1.4} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------ scroll cue */}
      <motion.a
        href="#pillars"
        style={reduced ? undefined : { y: cueY, opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-7 mx-auto flex w-max flex-col items-center gap-2 text-mist-400 transition-colors hover:text-nv-300"
        aria-label="Scroll to content"
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-nv-400/25">
          <span className="animate-sweep-y absolute inset-x-0 h-3 bg-nv-400" data-ambient />
        </span>
      </motion.a>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stat rail — four animated readouts                                         */
/* -------------------------------------------------------------------------- */
function StatRail({ mobile = false }: { mobile?: boolean }) {
  return (
    <dl
      className={
        mobile
          ? 'grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-x-6'
          : 'grid grid-cols-2 gap-x-10 gap-y-7 xl:grid-cols-4'
      }
    >
      {HERO_STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: mobile ? 10 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...EXPO, delay: (mobile ? 0.35 : 0.9) + i * 0.08 }}
          className="group relative"
        >
          <dt className="mb-1 flex items-center gap-1 font-mono text-[9px] tracking-[0.16em] text-mist-400 uppercase sm:text-[10px]">
            {i === 0 && <Zap className="size-2.5 text-nv-400 sm:size-3" />}
            {i === 1 && <Zap className="size-2.5 text-nv-400 sm:size-3" />}
            {i === 2 && <Cpu className="size-2.5 text-nv-400 sm:size-3" />}
            {i === 3 && <Sparkles className="size-2.5 text-nv-400 sm:size-3" />}
            {s.label}
          </dt>
          <dd className="tnum font-display text-xl leading-none font-bold text-mist-100 sm:text-2xl xl:text-[2rem]">
            <Counter value={s.value} duration={2200 + i * 220} />
            <span className="text-nv-400">{s.suffix}</span>
          </dd>
          <span className="mt-1.5 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-nv-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
        </motion.div>
      ))}
    </dl>
  )
}
