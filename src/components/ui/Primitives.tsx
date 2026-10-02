import type { ReactNode } from 'react'
import { Reveal, SplitText } from './Reveal'

/* -------------------------------------------------------------------------- */
/*  Eyebrow — small green technical label                                     */
/* -------------------------------------------------------------------------- */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.22em] text-nv-300 uppercase ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nv-400 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-nv-400" />
      </span>
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  SectionHeading — eyebrow + big display title + optional lede              */
/* -------------------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  className = '',
}: {
  eyebrow?: string
  title: string
  lede?: string
  align?: 'left' | 'center'
  className?: string
}) {
  const center = align === 'center'

  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'} ${className}`}>
      {eyebrow && (
        <Reveal y={14}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}

      <h2
        className={`mt-5 text-[clamp(2.1rem,5.2vw,4.1rem)] leading-[1.02] font-extrabold ${
          center ? 'text-center' : ''
        }`}
      >
        <SplitText text={title} />
      </h2>

      {lede && (
        <Reveal delay={0.12} className="mt-6">
          <p
            className={`text-[1.02rem] leading-relaxed text-mist-300 sm:text-[1.1rem] ${
              center ? 'mx-auto max-w-2xl' : 'max-w-2xl'
            }`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Logo — the NVIDIA wordmark, drawn rather than hot-linked so it themes     */
/* -------------------------------------------------------------------------- */
export function NvidiaLogo({
  className = '',
  showEye = true,
}: {
  className?: string
  showEye?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {/* the "eye" — a rotated square, echoing the real mark */}
      {showEye && (
        <svg viewBox="0 0 24 24" className="size-[1.05em] shrink-0" aria-hidden>
          <g fill="currentColor">
            <path d="M12 3.6c3.3 0 6.3 1.4 8.5 3.7A20.6 20.6 0 0 1 12 20.4 20.6 20.6 0 0 1 3.5 7.3C5.7 5 8.7 3.6 12 3.6Zm0 4.3a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Z" />
          </g>
        </svg>
      )}
      <span className="font-display text-[1.05em] leading-none font-extrabold tracking-[0.02em]">
        NVIDIA
      </span>
    </span>
  )
}
