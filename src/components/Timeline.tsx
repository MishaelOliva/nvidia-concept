import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { TIMELINE } from '@/lib/data'
import { EXPO } from '@/lib/motion'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/Primitives'
import { usePrefersReducedMotion } from '@/lib/hooks'

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 65%'] })
  const scale = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 })

  return (
    <section id="timeline" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)]" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="1993 →"
          title="A timeline of acceleration"
          lede="Three decades of choosing the harder, earlier bet on parallel computing — and being right often enough to keep doing it."
        />

        <div ref={ref} className="relative mt-16">
          {/* spine */}
          <div
            aria-hidden
            className="absolute top-0 left-[7px] h-full w-px bg-nv-400/12 md:left-1/2 md:-translate-x-1/2"
          >
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-nv-300 via-nv-400 to-nv-600 shadow-[0_0_20px_var(--color-nv-400)]"
              style={reduced ? { height: '100%' } : { scaleY: scale }}
            />
          </div>

          <ol className="space-y-10 md:space-y-0">
            {TIMELINE.map((item, i) => {
              const right = i % 2 === 1
              const card = (
                  <div className={`group glass rounded-2xl p-6 transition-colors hover:border-nv-400/45 ${right ? '' : 'md:ml-auto'} max-w-md`}>
                    <div className={right ? '' : 'md:flex md:flex-row-reverse md:items-center md:justify-between'}>
                      <h3 className="font-display text-lg font-extrabold text-mist-100">
                        {item.title}
                      </h3>
                      <span className="mt-1.5 block h-px w-8 shrink-0 bg-nv-400/60 md:mt-0" />
                    </div>
                    <p className="mt-3 text-[0.93rem] leading-relaxed text-mist-300">
                      {item.body}
                    </p>
                  </div>
              )
              return (
                <motion.li
                  key={item.year}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ ...EXPO, delay: 0.05 }}
                  className="relative pl-9 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
                >
                  {/* node */}
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="absolute top-1.5 left-0 z-10 size-[15px] -translate-x-px rounded-full border-[3px] border-ink-950 bg-nv-400 shadow-[0_0_16px_var(--color-nv-400)] md:left-1/2 md:-translate-x-1/2"
                  />

                  {/* Year chip. Centred on the spine at every breakpoint —
                      left-6 here desynced it from the 7px mobile spine. */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border border-nv-400/30 bg-ink-950 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-nv-300 tabular-nums">
                    {item.year}
                  </span>

                  {/* card */}
                  <div className={`md:pt-10 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}>
                    {card}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-mist-400 uppercase">
            1993 — 2026 — next
          </p>
        </Reveal>
      </div>
    </section>
  )
}
