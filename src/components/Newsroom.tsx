import { ArrowUpRight } from 'lucide-react'
import { NEWS } from '@/lib/data'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/Primitives'
import { Tilt } from './ui/Interactive'

export function Newsroom() {
  return (
    <section id="news" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(118,185,0,0.1),transparent_65%)]"
      />

      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Newsroom"
            title="What's shipping"
            lede="Platform announcements from the teams building the AI factories."
          />

          <Reveal delay={0.14}>
            <a
              href="#cta"
              className="group inline-flex items-center gap-1.5 font-semibold text-nv-300 transition-colors hover:text-nv-200"
            >
              All news
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="h-full">
              <Tilt className="h-full" max={6}>
                {/* The whole card is the affordance, so it is one link —
                    not a non-interactive article with a "Read more" span. */}
                <a
                  href="#news"
                  className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl"
                  aria-label={`Read: ${item.title}`}
                >
                  {/* procedural cover */}
                  <div className="relative aspect-16/10 overflow-hidden border-b border-nv-400/12">
                    <NewsCover accent={item.accent} seed={i} />

                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase"
                        style={{ background: `${item.accent}22`, color: item.accent }}
                      >
                        {item.tag}
                      </span>
                      <span className="rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-mist-300 uppercase backdrop-blur-sm">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[1.08rem] leading-snug font-bold text-mist-100 transition-colors group-hover:text-nv-200">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-mist-300">{item.body}</p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-nv-300">
                      Read more
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* hover sweep */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-nv-400/8 to-transparent transition-transform duration-900 group-hover:translate-x-full"
                  />
                </a>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  NewsCover — generated art, no external images                             */
/* -------------------------------------------------------------------------- */
function NewsCover({ accent, seed }: { accent: string; seed: number }) {
  return (
    <svg viewBox="0 0 400 250" className="size-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`g${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1208" />
          <stop offset="100%" stopColor="#04060a" />
        </linearGradient>
        <radialGradient id={`h${seed}`} cx="0.7" cy="0.25" r="0.8">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="250" fill={`url(#g${seed})`} />
      <rect width="400" height="250" fill={`url(#h${seed})`} />

      {/* concentric "die" rings */}
      <g stroke={accent} fill="none" opacity="0.5">
        {[26, 52, 78, 104].map((r, i) => (
          <circle
            key={r}
            cx={285}
            cy={105}
            r={r}
            strokeWidth="0.8"
            strokeDasharray={i % 2 ? '2 6' : '14 8'}
            opacity={0.7 - i * 0.13}
          />
        ))}
      </g>

      {/* data lanes */}
      <g stroke={accent} opacity="0.45">
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 24 + i * 13
          const h = 20 + ((i * 37) % 70)
          return <rect key={i} x={x} y={210 - h} width="3" height={h} rx="1.5" opacity={0.3 + (i % 4) * 0.15} />
        })}
      </g>

      {/* matrix cells */}
      <g>
        {Array.from({ length: 26 }).map((_, i) => {
          const col = i % 13
          const row = Math.floor(i / 13)
          const lit = ((i * 2654435761 + seed) >>> 9) % 100 < 34
          return (
            <rect
              key={i}
              x={24 + col * 22}
              y={26 + row * 20}
              width="16"
              height="14"
              rx="2"
              fill={lit ? accent : 'transparent'}
              opacity={lit ? 0.16 : 0.09}
              stroke={accent}
              strokeWidth="0.5"
              strokeOpacity={lit ? 0.35 : 0.16}
            />
          )
        })}
      </g>
    </svg>
  )
}
