import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Reveal, SplitText } from './ui/Reveal'
import { MagneticButton } from './ui/Interactive'
import { Eyebrow } from './ui/Primitives'
import { useSmoothScroll } from '@/lib/hooks'

export function CTA() {
  const scrollTo = useSmoothScroll()

  return (
    <section id="cta" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(118,185,0,0.18),transparent_68%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(65%_60%_at_50%_50%,#000,transparent)]" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal y={14}>
            <div className="flex justify-center">
              <Eyebrow>Get started</Eyebrow>
            </div>
          </Reveal>

          <h2 className="mt-7 text-[clamp(2.2rem,6vw,4.6rem)] leading-[1] font-extrabold tracking-[-0.035em]">
            <SplitText text="Build the" className="block text-mist-100" />
            <span className="relative block overflow-hidden">
              <motion.span
                className="text-gradient block"
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                next thing.
              </motion.span>
            </span>
          </h2>

          <Reveal delay={0.2} y={20}>
            <p className="mx-auto mt-7 max-w-xl text-[1.04rem] leading-relaxed text-mist-300">
              Four million developers build on NVIDIA every day. Start with a GPU, start
              with the platform, or start with a job — the stack is the same either way.
            </p>
          </Reveal>

          <Reveal delay={0.28} y={20}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="#rtx" icon={<ArrowRight className="size-4" />}>
                Shop GeForce
              </MagneticButton>
              <MagneticButton href="#ai-factory" variant="outline" icon={<Sparkles className="size-4" />}>
                Build on the platform
              </MagneticButton>
            </div>
          </Reveal>

          {/* mini feature grid */}
          <Reveal delay={0.36} y={20}>
            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-nv-400/12 bg-nv-400/10 sm:grid-cols-3">
              {[
                { k: 'NVIDIA App', v: 'One place for drivers, settings and Game Ready updates.' },
                { k: 'CUDA & cuDNN', v: 'The parallel programming model behind every model.' },
                { k: 'GeForce NOW', v: 'RTX on any device, streamed to yours.' },
              ].map((f) => (
                <div key={f.k} className="group bg-ink-950 p-6 text-left transition-colors hover:bg-ink-900">
                  <h3 className="font-display text-[0.98rem] font-bold text-mist-100 transition-colors group-hover:text-nv-300">
                    {f.k}
                  </h3>
                  <p className="mt-2 text-[0.87rem] leading-relaxed text-mist-400">{f.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 text-center">
          <button
            type="button"
            onClick={() => scrollTo('#hero')}
            className="-mx-2 -my-1 inline-block px-2 py-1 font-mono text-[11px] tracking-[0.2em] text-mist-400 uppercase transition-colors hover:text-nv-300"
          >
            ↑ Back to top
          </button>
        </Reveal>
      </div>
    </section>
  )
}
