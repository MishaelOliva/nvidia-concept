import type { Transition, Variants } from 'motion/react'

/** Signature easing — matches the --ease-out-expo token in styles.css. */
export const EXPO: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
}

export const EXPO_SLOW: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1],
}

/** Standard spring for micro-interactions (tab pills, progress bars). */
export const SPRING: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.7,
}

/** Fade + rise, the workhorse reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: EXPO },
}

/** Parent that staggers its children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})
