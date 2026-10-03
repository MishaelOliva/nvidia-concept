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
/*  Wordmark — neutral, text-only site mark styled in CSS.                    */
/*  Deliberately NOT a reproduction of the official NVIDIA logo: this is an   */
/*  unofficial fan concept, so no trademarked artwork is bundled.             */
/* -------------------------------------------------------------------------- */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-display text-[1.05em] leading-none font-extrabold tracking-[0.02em]">
        NVIDIA
      </span>
      <span className="font-mono text-[0.5em] leading-none font-medium tracking-[0.2em] text-nv-400 uppercase">
        Concept
      </span>
    </span>
  )
}
