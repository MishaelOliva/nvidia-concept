import { TICKER } from '@/lib/data'

/** Infinite marquee of platform names. Duplicated once for a seamless loop. */
export function Ticker({ reverse = false }: { reverse?: boolean }) {
  const row = [...TICKER, ...TICKER]

  return (
    <div
      className="group relative flex overflow-hidden border-y border-nv-400/12 bg-ink-900/60 py-4"
      data-ambient
      aria-hidden
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent md:w-40" />

      <div
        className="animate-marquee flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
        style={
          reverse
            ? { ['--dur' as string]: '52s', animationDirection: 'reverse' }
            : { ['--dur' as string]: '52s' }
        }
      >
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-10">
            <span className="font-mono text-[12px] tracking-[0.22em] whitespace-nowrap text-mist-400 uppercase transition-colors hover:text-nv-300 sm:text-[13px]">
              {t}
            </span>
            <span className="size-1 shrink-0 rotate-45 bg-nv-400/60" />
          </span>
        ))}
      </div>
    </div>
  )
}
