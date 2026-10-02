import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, Check, Github, Linkedin, Twitter, Youtube } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NAV, TIMELINE } from '@/lib/data'
import { EXPO } from '@/lib/motion'
import { useSmoothScroll } from '@/lib/hooks'
import { NvidiaLogo } from './ui/Primitives'
import { Reveal } from './ui/Reveal'

const SOCIALS = [
  { icon: <Twitter className="size-4" />, label: 'X / Twitter', href: 'https://x.com/NVIDIA' },
  { icon: <Linkedin className="size-4" />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/nvidia' },
  { icon: <Youtube className="size-4" />, label: 'YouTube', href: 'https://www.youtube.com/user/nvidia' },
  { icon: <Github className="size-4" />, label: 'GitHub', href: 'https://github.com/NVIDIA' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const timer = useRef<number | null>(null)
  // Route in-page links through JS so the hash is not rewritten and
  // prefers-reduced-motion is honoured, matching the navbar.
  const scrollTo = useSmoothScroll()

  // Clear the pending reset so it cannot fire after unmount.
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSent(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setSent(false)
      setEmail('')
      timer.current = null
    }, 2600)
  }

  return (
    <footer className="relative overflow-hidden border-t border-nv-400/12 bg-ink-900/60 pt-20">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_top,#000,transparent)]" />

      <div className="container-x relative">
        {/* ------------------------------------------------------- newsletter */}
        <Reveal y={22}>
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-3xl p-8 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-xl font-extrabold text-mist-100">
                Stay on the leading edge
              </h3>
              <p className="mt-1.5 max-w-md text-[0.92rem] text-mist-300">
                Platform releases, developer news and GTC announcements — monthly.
              </p>
            </div>

            <form onSubmit={submit} className="w-full max-w-sm">
              <div className="flex items-center gap-2 rounded-full border border-nv-400/20 bg-ink-950/60 p-1.5 focus-within:border-nv-400/60">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-mist-100 placeholder:text-mist-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="relative shrink-0 overflow-hidden rounded-full bg-nv-400 px-5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-nv-300"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {sent ? (
                      <motion.span
                        key="ok"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={EXPO}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="size-3.5" />
                        Done
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={EXPO}
                      >
                        Subscribe
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <p className="mt-2 px-4 font-mono text-[10px] tracking-wide text-mist-400">
                No spam. Unsubscribe any time.
              </p>
            </form>
          </div>
        </Reveal>

        {/* ----------------------------------------------------------- links */}
        {/* 4 NAV columns + Legal = 5. Previously 4 columns for 5 children,
            which orphaned "Legal" onto a second row. */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {NAV.map((group) => (
            <div key={group.label}>
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                {group.label}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.groups
                  .flatMap((g) => g.links)
                  .slice(0, 6)
                  .map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollTo(l.href)
                        }}
                        className="group inline-flex items-center gap-1.5 text-[0.9rem] text-mist-400 transition-colors hover:text-nv-300"
                      >
                        <span className="h-px w-0 bg-nv-400 transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">Legal</h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { l: 'Privacy', h: 'https://www.nvidia.com/en-us/privacy/' },
                { l: 'Terms of use', h: 'https://www.nvidia.com/en-us/terms/' },
                { l: 'Accessibility', h: 'https://www.nvidia.com/en-us/accessibility/' },
                { l: 'Security', h: 'https://www.nvidia.com/en-us/security/' },
              ].map((x) => (
                <li key={x.l}>
                  <a
                    href={x.h}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="group inline-flex items-center gap-1.5 text-[0.9rem] text-mist-400 transition-colors hover:text-nv-300"
                  >
                    <span className="h-px w-0 bg-nv-400 transition-all duration-300 group-hover:w-3" />
                    {x.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --------------------------------------------------------- wordmark */}
        <div className="relative mt-16 overflow-hidden">
          <motion.p
            aria-hidden
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...EXPO, duration: 1.1 }}
            className="shimmer-text select-none text-center text-[clamp(3.5rem,17vw,15rem)] leading-[0.8] font-black tracking-tighter"
          >
            NVIDIA
          </motion.p>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent"
          />
        </div>

        {/* ------------------------------------------------------- bottom bar */}
        <div className="flex flex-col items-center gap-6 border-t border-nv-400/12 py-8 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8rem] text-mist-400 md:justify-start">
            <NvidiaLogo className="text-[0.95rem] text-mist-300" />
            <span>© {new Date().getFullYear()} NVIDIA Corporation</span>
            <span className="text-mist-400">A fan-made concept build.</span>
          </div>

          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-full border border-nv-400/15 text-mist-400 transition-colors hover:border-nv-400/50 hover:text-nv-300"
              >
                {s.icon}
              </a>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid size-9 place-items-center rounded-full border border-nv-400/15 text-mist-400 transition-colors hover:border-nv-400/50 hover:text-nv-300"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* faint "since 1993" echo */}
      <p
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-24 hidden font-mono text-[10px] tracking-[0.2em] text-mist-400/25 uppercase xl:block"
      >
        {TIMELINE.length} milestones · est. 1993
      </p>
    </footer>
  )
}
