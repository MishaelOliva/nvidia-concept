import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Award, ChevronLeft, ChevronRight, Cpu, Lightbulb, Network, Quote, Sparkles, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import { CEO as CEO_DATA } from '@/lib/data'
import { EXPO } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { Reveal } from './ui/Reveal'
import { Eyebrow } from './ui/Primitives'
import { MagneticButton } from './ui/Interactive'
import ceoPortrait from '../../assets/ceo-portrait-900.jpg'

/* ============================================================================
   Meet our CEO — a full-width band laid out as three columns, following the
   NVIDIA homepage rhythm: portrait bleeding off the left edge, the biography
   in the middle, and a pillar list on the right.

   The portrait's own studio backdrop is near-black (rgb ~ #0e0f18), so an
   edge-dissolve mask plus an inner vignette blends it into the section with no
   cut-out matte required.
   ========================================================================= */

const PILLAR_ICONS = {
  spark: Sparkles,
  chip: Cpu,
  network: Network,
  users: Users,
} as const

type PillarIcon = keyof typeof PILLAR_ICONS

export function CEO() {
  const [quote, setQuote] = useState(0)
  const [dir, setDir] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['7%', '-7%'])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.15, 0.85])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 160])

  // pointer parallax + specular glare inside the portrait panel
  const mx = useSpring(0, { stiffness: 80, damping: 20 })
  const my = useSpring(0, { stiffness: 80, damping: 20 })
  const glareX = useTransform(mx, [-1, 1], [10, 90])
  const glareY = useTransform(my, [-1, 1], [8, 92])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(460px circle at ${gx}% ${gy}%, rgba(168,245,66,0.12), rgba(118,185,0,0.05) 38%, transparent 66%)`,
  )

  const onFrameMove = (e: React.PointerEvent) => {
    const el = frameRef.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const step = (n: number) => {
    setDir(n)
    setQuote((q) => (q + n + CEO_DATA.highlights.length) % CEO_DATA.highlights.length)
  }

  const firstName = CEO_DATA.name.split(' ')[0]

  return (
    <section
      ref={sectionRef}
      id="ceo"
      className="relative scroll-mt-24 overflow-hidden border-y border-nv-400/10"
      aria-labelledby="ceo-heading"
    >
      {/* ------------------------------------------------------ atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_80%_at_18%_50%,rgba(118,185,0,0.16),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#05070a,#070b08_45%,#05070a)]"
      />
      <motion.div
        aria-hidden
        style={reduced ? undefined : { scale: glowScale }}
        className="pointer-events-none absolute top-1/2 left-[10%] size-[26rem] -translate-y-1/2 rounded-full bg-nv-500/14 blur-[120px]"
      />

      {/* A stretch grid, not absolute positioning: the portrait column is
          sized by the biography beside it, so the two can never desync. */}
      {/*
        Track 1 is `min(44rem, 38%)` rather than a bare fraction: a plain
        0.95fr keeps growing on ultrawide, which opened an empty gutter
        between the portrait and the bio above ~1850px. Capping the *item*
        instead does nothing, because the track still outgrows it.
      */}
      <div className="relative grid lg:grid-cols-[minmax(0,min(44rem,38%))_minmax(0,1fr)]">
        {/* ================================================ column 1: portrait */}
        {/* The column is sized by the grid track above, which is already
            capped at 44rem, so no item-level max-width is needed. */}
        <div
          className="relative lg:flex lg:self-stretch lg:items-center"
          onPointerMove={onFrameMove}
          onPointerLeave={() => {
            mx.set(0)
            my.set(0)
          }}
        >
          {/* On mobile the portrait stacks first, so the eyebrow leads it.
              Extra top padding clears the fixed header. */}
          <div className="container-x pt-28 lg:hidden">
            <Eyebrow>Meet our CEO</Eyebrow>
          </div>

          {/* The source portrait is 900x1124 (aspect 4:5). The frame keeps that
              exact aspect at EVERY width — width-capped on small screens,
              track-capped on large ones — so object-cover never crops the
              face. Letting it stretch to the full column height (435x1005,
              aspect 0.43) cropped ~46% of the image's width, which is what
              used to cut the framing. */}
          <div
            ref={frameRef}
            className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden sm:max-w-lg lg:max-w-none"
          >
            {/* rotating technical ring */}
            <motion.svg
              aria-hidden
              viewBox="0 0 400 400"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 text-nv-400/20"
              style={reduced ? undefined : { rotate: ringRotate }}
            >
              <circle
                cx="200"
                cy="200"
                r="186"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="2 9"
              />
              <circle
                cx="200"
                cy="200"
                r="166"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="40 320"
                strokeLinecap="round"
              />
            </motion.svg>

            <motion.div style={reduced ? undefined : { y: portraitY }} className="absolute inset-0">
              <img
                src={ceoPortrait}
                alt={`${CEO_DATA.name}, ${CEO_DATA.role} at NVIDIA`}
                width={900}
                height={1124}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="mask-dissolve h-full w-full object-cover object-center select-none"
              />

              {/* green duotone grade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-color"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(118,185,0,0.34), rgba(74,125,0,0.14) 55%, rgba(118,185,0,0.26))',
                }}
              />

              {/* inner vignette: sinks the photo backdrop into the frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(76% 64% at 50% 38%, transparent 26%, rgba(4,8,6,0.5) 70%, rgba(4,8,6,0.92) 100%)',
                }}
              />

              {/* mouse-tracked specular glare */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: glareBg }}
              />

              {/* scanlines + travelling sweep */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-scanlines opacity-25" />
              <div
                aria-hidden
                className="animate-sweep-y pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-nv-300/12 to-transparent"
                data-ambient
              />
            </motion.div>

            {/* fade into the column seam on wide screens */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-l from-transparent to-[#06090a] lg:block"
            />

            {/* founding chip */}
            <div className="glass-strong absolute bottom-6 left-6 hidden rounded-xl px-4 py-2.5 sm:block">
              <p className="font-mono text-[9px] tracking-[0.2em] text-nv-400 uppercase">Founder</p>
              <p className="tnum font-display text-sm font-bold text-mist-100">
                Since {CEO_DATA.since}
              </p>
            </div>
          </div>
        </div>

        {/* ============================== column 2: biography & pillars */}
        <div className="container-x lg:flex lg:items-center lg:max-w-none lg:pt-0 lg:pb-0 lg:pl-12 lg:pr-16">
          <div className="-mt-10 w-full pb-20 lg:mt-0 lg:pb-0">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              {/* ------------------------------------------------- biography */}
              <div>
                <div className="hidden lg:block">
                  <Eyebrow>Meet our CEO</Eyebrow>
                </div>

                <h2
                  id="ceo-heading"
                  className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-mist-100"
                >
                  {CEO_DATA.name}
                </h2>

                <p className="mt-2 text-[1.02rem] font-medium text-mist-200 sm:text-[1.1rem]">
                  {CEO_DATA.role}
                </p>

                <blockquote className="mt-7 max-w-xl">
                  <p className="font-display text-[1.12rem] leading-snug font-semibold text-nv-300 italic sm:text-[1.3rem]">
                    &ldquo;{CEO_DATA.tagline}&rdquo;
                  </p>
                </blockquote>

                <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-mist-300">
                  {CEO_DATA.lede}
                </p>

                {/* highlights carousel — company statements, not attributed
                    personal quotations */}
                <div className="glass mt-8 max-w-xl rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Quote className="mt-0.5 size-4 shrink-0 text-nv-400" />
                    <div className="min-h-[5.5rem] flex-1">
                      <AnimatePresence mode="wait" custom={dir}>
                        <motion.p
                          key={quote}
                          custom={dir}
                          initial={{ opacity: 0, x: dir * 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: dir * -20 }}
                          transition={EXPO}
                          className="text-[0.9rem] leading-relaxed text-mist-200"
                        >
                          {CEO_DATA.highlights[quote].text}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex gap-1.5">
                      {CEO_DATA.highlights.map((h, i) => (
                        <button
                          key={h.source}
                          type="button"
                          onClick={() => {
                            setDir(i > quote ? 1 : -1)
                            setQuote(i)
                          }}
                          aria-label={`Show: ${h.source}`}
                          aria-current={i === quote}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i === quote ? 'w-7 bg-nv-400' : 'w-1.5 bg-nv-400/30 hover:bg-nv-400/60'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        aria-label="Previous highlight"
                        className="grid size-7 place-items-center rounded-full border border-nv-400/20 text-mist-300 transition-colors hover:border-nv-400/60 hover:text-nv-300"
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label="Next highlight"
                        className="grid size-7 place-items-center rounded-full border border-nv-400/20 text-mist-300 transition-colors hover:border-nv-400/60 hover:text-nv-300"
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 border-t border-nv-400/12 pt-3 font-mono text-[10px] tracking-[0.16em] text-nv-400 uppercase">
                    {CEO_DATA.highlights[quote].source}
                  </p>
                </div>

                {/* actions */}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <MagneticButton href="#timeline" icon={<ArrowRight className="size-4" />}>
                    Learn More About {firstName}
                  </MagneticButton>

                  <a
                    href="#pillars"
                    className="group inline-flex items-center gap-1.5 font-semibold text-nv-300 transition-colors hover:text-nv-200"
                  >
                    Our body of work
                    <span className="block h-px w-0 bg-nv-400 transition-all duration-300 group-hover:w-6" />
                  </a>
                </div>
              </div>

              {/* ---------------------------------------------------- pillars */}
              <div className="lg:pt-16">
                <ul className="space-y-5">
                  {CEO_DATA.pillars.map((p, i) => {
                    const Icon = PILLAR_ICONS[p.icon as PillarIcon] ?? Sparkles
                    return (
                      <motion.li
                        key={p.title}
                        initial={{ opacity: 0, x: 18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ ...EXPO, delay: i * 0.09 }}
                        className="group flex items-start gap-4"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-nv-400/25 bg-nv-400/8 text-nv-300 transition-all duration-500 group-hover:scale-110 group-hover:border-nv-400/60">
                          <Icon className="size-5" strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <h3 className="font-display text-[0.98rem] font-bold text-mist-100">
                            {p.title}
                          </h3>
                          <p className="mt-1 text-[0.87rem] leading-snug text-mist-400">{p.desc}</p>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>

                {/* signature */}
                <div className="mt-9 flex items-center gap-3 border-t border-nv-400/12 pt-6">
                  <Lightbulb className="size-4 shrink-0 text-nv-400" />
                  <p className="font-display text-[1.05rem] font-semibold text-mist-200 italic">
                    {CEO_DATA.name}
                  </p>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-mist-400 uppercase">
                    Founder &amp; CEO
                  </span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------- facts */}
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-nv-400/12 pt-8 sm:grid-cols-3 lg:grid-cols-6">
              {CEO_DATA.facts.map((f) => (
                <div key={f.k}>
                  <dt className="font-mono text-[9px] tracking-[0.16em] text-mist-400 uppercase">
                    {f.k}
                  </dt>
                  <dd className="tnum mt-1 font-display text-[0.95rem] font-bold text-mist-100">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* --------------------------------------- closing recognition band */}
      <div className="container-x relative py-14">
        <Reveal y={18}>
          <div className="glass flex flex-col items-start gap-5 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-nv-400/25 bg-nv-400/8 text-nv-300">
                <Award className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] font-extrabold text-mist-100">
                  &ldquo;Accelerated computing is sustainable computing.&rdquo;
                </h3>
                <p className="mt-1 text-[0.87rem] text-mist-400">
                  One of the seven pillars of our body of work
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-wider text-mist-400 uppercase">
              <Users className="size-4 text-nv-400" />
              Santa Clara &middot; 140+ countries
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
