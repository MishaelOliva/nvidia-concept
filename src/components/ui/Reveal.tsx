import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, Fragment, type ReactNode } from 'react'
import { EXPO, EXPO_SLOW, fadeUp, stagger } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Reveal — scroll-triggered fade + rise                                     */
/* -------------------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  amount = 0.25,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : y }}
      transition={{ ...EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stagger — parent that cascades children                                    */
/* -------------------------------------------------------------------------- */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = fadeUp

/* -------------------------------------------------------------------------- */
/*  SplitText — word-by-word mask reveal                                       */
/* -------------------------------------------------------------------------- */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerS = 0.035,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  staggerS?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()

  if (reduced) return <span className={className}>{text}</span>

  const words = text.split(' ')

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: staggerS, delayChildren: delay } } }}
    >
      {/* The animated words are per-word spans; screen readers would otherwise
          read the heading as a stream of disconnected fragments. Expose the
          whole string once instead and hide the decorative copy. */}
      <span className="sr-only">{text}</span>

      {/*
        `display: contents` so the word wrappers and the inter-word spaces are
        laid out directly by the parent.

        The space MUST live outside the mask. Each word is wrapped in an
        overflow-hidden element, and whitespace inside such a box is trimmed —
        putting the trailing space inside it collapsed every gap and rendered
        "Seven things we're rebuilding" as "Seventhingswe'rerebuilding".
        pb + negative mb keeps descenders (g, y, p) from being clipped by
        overflow-hidden without inflating the line box.
      */}
      <span aria-hidden="true" className="contents">
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
              <motion.span
                className={wordClassName}
                variants={{
                  hidden: { y: '110%', opacity: 0 },
                  show: { y: '0%', opacity: 1, transition: EXPO_SLOW },
                }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </motion.span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Counter — counts up when scrolled into view                               */
/* -------------------------------------------------------------------------- */
export function Counter({
  value,
  duration = 1900,
  decimals = 0,
  className,
}: {
  value: number
  duration?: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  /* The count-up plays exactly once, on first entry into view. Afterwards
     live values (e.g. the DLSS slider) are written straight through.

     Both `value` and `played` are held in refs and the effect depends only on
     `inView`: if `value` were a dependency then every slider input would tear
     down and restart the RAF, snapping the readout back to 0 ~60x/second.
     `played` is set in the terminal tick, not on mount, so a StrictMode
     remount still gets the full animation in dev. */
  const played = useRef(false)
  const targetRef = useRef(value)

  useEffect(() => {
    targetRef.current = value
    if (played.current) setDisplay(value)
  }, [value])

  useEffect(() => {
    if (!inView) return
    if (played.current || reduced) {
      setDisplay(targetRef.current)
      return
    }

    const target = targetRef.current
    let raf = 0
    let t0: number | null = null

    const tick = (t: number) => {
      if (t0 === null) t0 = t
      const p = Math.min(1, (t - t0) / duration)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p) // easeOutExpo
      setDisplay(target * eased)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        played.current = true
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, duration, reduced])

  const text = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
