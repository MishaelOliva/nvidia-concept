import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PILLARS } from '@/lib/data'
import { EXPO } from '@/lib/motion'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/Primitives'

/* ============================================================================
   Our Body of Work — a sticky index column with the pillar detail beside it.
   The active pillar is driven by scroll position; the mobile version becomes a
   plain accordion.
   ========================================================================= */

export function Pillars() {
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Map scroll position within the section to the active pillar.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 62%', 'end 78%'],
  })

  // Snap through the pillar indices as the section scrolls past. The
  // subscription lives in an effect so it is torn down on unmount — calling
  // .on() during render leaks a listener under StrictMode's double-render.
  const raw = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })

  useEffect(() => {
    const onChange = (v: number) => {
      const idx = Math.min(
        PILLARS.length - 1,
        Math.max(0, Math.round(v * (PILLARS.length - 1))),
      )
      setActive((prev) => (prev === idx ? prev : idx))
    }
    // MotionValue#on returns its own unsubscribe function.
    const unsubscribe = raw.on('change', onChange)
    return () => {
      unsubscribe()
    }
  }, [raw])

  const p = PILLARS[active]

  return (
    <section id="pillars" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(75%_60%_at_50%_50%,#000,transparent)]" />
      <div
        aria-hidden
        className="absolute top-1/3 -left-40 size-[28rem] rounded-full bg-nv-400/8 blur-[120px]"
      />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Our Body of Work"
          title="Seven things we're rebuilding"
          lede="NVIDIA pioneered accelerated computing to tackle problems no one else can solve. Our work in AI and digital twins is reshaping the largest industries on earth."
        />

        {/* ---------------------------------------------------- desktop split */}
        <div ref={wrapRef} className="mt-16 hidden lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          {/* index */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal y={20}>
              <ul className="space-y-1">
                {PILLARS.map((item, i) => {
                  const on = i === active
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        className="group relative flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors"
                        aria-current={on}
                      >
                        {/* progress rail */}
                        <span className="relative h-8 w-px shrink-0 bg-nv-400/15">
                          <motion.span
                            className="absolute inset-x-0 top-0 bg-nv-400"
                            animate={{ height: on ? '100%' : '0%' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </span>

                        <span
                          className={`font-mono text-[11px] tabular-nums transition-colors ${
                            on ? 'text-nv-400' : 'text-mist-400 group-hover:text-nv-300'
                          }`}
                        >
                          {item.index}
                        </span>

                        <span
                          className={`text-[0.95rem] leading-snug transition-all duration-300 ${
                            on
                              ? 'font-semibold text-mist-100'
                              : 'text-mist-400 group-hover:translate-x-0.5 group-hover:text-mist-200'
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>

          {/* detail */}
          <div className="relative min-h-[30rem]">
            <AnimatePresence mode="wait">
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                transition={{ ...EXPO, duration: 0.6 }}
                className="glass ring-aurora relative overflow-hidden rounded-3xl p-9 xl:p-12"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full opacity-40 blur-[90px]"
                  style={{ background: p.accent }}
                />
                <div aria-hidden className="absolute inset-0 bg-scanlines opacity-40" />

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-display text-5xl leading-none font-extrabold tabular-nums"
                      style={{ color: p.accent }}
                    >
                      {p.index}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-nv-400/50 to-transparent" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-mist-400 uppercase">
                      {p.kicker}
                    </span>
                  </div>

                  <h3 className="mt-7 text-[clamp(1.7rem,3.4vw,2.7rem)] leading-[1.06] font-extrabold text-mist-100">
                    {p.title}
                  </h3>

                  <p className="mt-6 max-w-xl text-[1.03rem] leading-relaxed text-mist-300">
                    {p.body}
                  </p>

                  <a
                    href="#ai-factory"
                    className="group mt-9 inline-flex items-center gap-1.5 font-semibold text-nv-300 transition-colors hover:text-nv-200"
                  >
                    Dive deeper
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* ----------------------------------------------------- mobile stack */}
        <div className="mt-14 space-y-4 lg:hidden">
          {PILLARS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <details className="glass group rounded-2xl">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span
                    className="font-display text-2xl font-extrabold tabular-nums"
                    style={{ color: item.accent }}
                  >
                    {item.index}
                  </span>
                  <span className="flex-1 text-[0.98rem] font-semibold text-mist-100">
                    {item.title}
                  </span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-nv-400/30 text-nv-400 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-nv-400/12 px-5 py-5">
                  <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                    {item.kicker}
                  </p>
                  <p className="text-[0.95rem] leading-relaxed text-mist-300">{item.body}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
