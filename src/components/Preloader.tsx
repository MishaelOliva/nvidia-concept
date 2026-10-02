import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EXPO } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

/* ============================================================================
   Boot sequence. Counts a fake POST progress to 100, reveals the wordmark,
   then wipes away.
   ========================================================================= */

const PHASES = [
  'Initialising CUDA runtime',
  'Probing device fabric',
  'Compiling neural kernels',
  'Linking NVLink mesh',
  'Ready',
]

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduced) {
      setProgress(100)
      const t = setTimeout(() => {
        setVisible(false)
        onDone()
      }, 260)
      return () => clearTimeout(t)
    }

    let raf = 0
    const t0 = performance.now()
    const DURATION = 1900

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION)
      // ease-out, so the bar decelerates into 100 like a real POST resolving
      const eased = 1 - Math.pow(1 - p, 2.1)
      setProgress(eased * 100)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setVisible(false)
          onDone()
        }, 380)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [reduced, onDone])

  const pct = Math.round(progress)
  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((pct / 100) * PHASES.length))]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* sweeping vertical light bar */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nv-400 to-transparent" />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)]" />

          {/* Announce the milestones only. Text that mutated every frame would
              be spammed at ~60 announcements/second for two seconds. */}
          <p role="status" aria-live="polite" className="sr-only">
            {pct === 0 ? 'Loading site' : pct >= 100 ? 'Site loaded' : ''}
          </p>

          <motion.div
            className="relative w-[min(90vw,26rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EXPO, duration: 0.7 }}
          >
            <div className="mb-8 flex items-baseline justify-between">
              <span className="font-display text-2xl font-extrabold tracking-tight text-mist-100">
                NVIDIA
              </span>
              <span className="tnum font-mono text-sm text-nv-300">
                {String(pct).padStart(3, '0')}%
              </span>
            </div>

            {/* progress rail */}
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink-700">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-nv-600 via-nv-400 to-nv-200"
                style={{ width: `${pct}%` }}
              />
              <div
                aria-hidden
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ left: `calc(${pct}% - 4rem)` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-[11px] tracking-wider text-mist-400 uppercase">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-nv-400 animate-pulse-dot" />
                {phase}
              </span>
              <span className="hidden sm:inline">sm_000 · SM_120</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
