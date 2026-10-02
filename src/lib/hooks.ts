import { useCallback, useEffect, useState } from 'react'

/* -------------------------------------------------------------------------- */
/*  Media queries                                                             */
/* -------------------------------------------------------------------------- */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/* -------------------------------------------------------------------------- */
/*  Scroll                                                                     */
/* -------------------------------------------------------------------------- */

/** Page scroll progress, 0 → 1. Written to a CSS variable, never to state. */
export function useScrollProgressVar(varName = '--scroll-progress') {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.body.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      root.style.setProperty(varName, String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [varName])
}

/* -------------------------------------------------------------------------- */
/*  Misc                                                                      */
/* -------------------------------------------------------------------------- */

/** Locks body scroll while `locked` is true (mobile nav). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

/** Adds `tab-hidden` to <html> so CSS can pause ambient loops in background tabs. */
export function useAmbientPause() {
  useEffect(() => {
    const onVisibility = () => {
      document.documentElement.classList.toggle('tab-hidden', document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
}

/** Reports the id of the section currently in view, for nav highlighting. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport.
        let best: IntersectionObserverEntry | null = null
        for (const e of entries) {
          if (!e.isIntersecting) continue
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e
        }
        if (best) setActive(best.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.6, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  return active
}

/**
 * Smooth-scrolls to a section, honouring reduced-motion.
 *
 * Also pushes the hash so in-page links are shareable and the Back button
 * works — without this the scroll is invisible to history.
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion()
  return useCallback(
    (hash: string) => {
      const el = document.querySelector(hash)
      if (!el) return
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash)
      }
    },
    [reduced],
  )
}
