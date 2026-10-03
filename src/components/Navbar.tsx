import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ChevronDown, Menu, Search, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NAV } from '@/lib/data'
import { EXPO, SPRING } from '@/lib/motion'
import { useActiveSection, useScrollLock, useSmoothScroll } from '@/lib/hooks'
import { isAudioEnabled, toggleAudio, playActivateSound } from '@/lib/audio'
import { MagneticButton } from './ui/Interactive'
import { Wordmark } from './ui/Primitives'

/* Document order — must match the order sections are composed in App.tsx,
   otherwise the side rail labels jump around as you scroll. */
const SECTION_IDS = ['hero', 'pillars', 'architect', 'rtx', 'dlss', 'benchmark-lab', 'ai-factory', 'timeline', 'news']

const ANCHORS = [
  { label: 'Body of Work', href: '#pillars' },
  { label: 'Concept Architect', href: '#architect' },
  { label: 'GeForce RTX', href: '#rtx' },
  { label: 'Compute Lab', href: '#benchmark-lab' },
  { label: 'AI Factory', href: '#ai-factory' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [soundOn, setSoundOn] = useState(() => isAudioEnabled())
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)

  const active = useActiveSection(SECTION_IDS)
  const scrollTo = useSmoothScroll()
  useScrollLock(mobileOpen)

  // Contain focus inside the mobile overlay, and return it to the trigger on
  // close — otherwise Tab walks behind a visually hidden panel.
  useEffect(() => {
    if (!mobileOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)

    // Move focus into the panel on open.
    focusables()[0]?.focus()

    // Escape is handled here (not on window) so focus can be restored to the
    // trigger in the same pass, and so the two handlers cannot double-fire.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        mobileTriggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    overlay.addEventListener('keydown', onKeyDown)
    return () => overlay.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  // `aria-modal` only describes intent — make it true. The page content behind
  // the overlay is inerted so pointer clicks and programmatic focus cannot
  // reach it while the menu is open.
  useEffect(() => {
    const behind = [document.querySelector('main'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    )
    for (const el of behind) {
      if (mobileOpen) el.setAttribute('inert', '')
      else el.removeAttribute('inert')
    }
    return () => {
      for (const el of behind) el.removeAttribute('inert')
    }
  }, [mobileOpen])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the desktop mega-menu. The mobile overlay handles its own
  // Escape (above) so it can also restore focus to the trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenGroup(null)
      if (!mobileOpen) setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Close the mobile panel when resizing up to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setMobileOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = (href: string) => {
    const wasMobile = mobileOpen
    setOpenGroup(null)
    setMobileOpen(false)
    setMobileGroup(null)
    // Let the overlay unmount before scrolling, and hand focus back to the
    // trigger so keyboard users are not dropped onto <body>.
    requestAnimationFrame(() => {
      scrollTo(href)
      if (wasMobile) mobileTriggerRef.current?.focus()
    })
  }

  return (
    <>
      {/* ------------------------------------------------------------ header */}
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container-x">
          <div
            className={`relative flex items-center justify-between rounded-full transition-all duration-500 ${
              scrolled
                ? 'glass-strong px-4 py-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]'
                : 'border border-transparent px-2 py-2'
            }`}
          >
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                go('#hero')
              }}
              className="shrink-0 pl-2 text-[1.35rem] text-mist-100 transition-colors hover:text-nv-300"
              aria-label="NVIDIA concept home"
            >
              <Wordmark />
            </a>

            {/* ------------------------------------------------- desktop nav */}
            <nav ref={navRef} className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onPointerEnter={() => setOpenGroup(item.label)}
                  onPointerLeave={() => {
                    // Keep the panel open while focus is inside it, so a
                    // keyboard user tabbing into the links is not closed out.
                    if (!navRef.current?.contains(document.activeElement)) setOpenGroup(null)
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={openGroup === item.label}
                    aria-controls={`menu-${item.label.toLowerCase()}`}
                    onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setOpenGroup(item.label)
                      }
                    }}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-[0.86rem] font-medium transition-colors ${
                      openGroup === item.label
                        ? 'bg-nv-400/10 text-nv-200'
                        : 'text-mist-200 hover:text-mist-100'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-300 ${
                        openGroup === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openGroup === item.label && (
                      <motion.div
                        id={`menu-${item.label.toLowerCase()}`}
                        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                        transition={EXPO}
                        className="absolute top-full left-1/2 w-max -translate-x-1/2 pt-3"
                      >
                        <div className="glass-strong rounded-2xl p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)]">
                          <div className="flex gap-7">
                            {item.groups.map((g) => (
                              <div key={g.title} className="min-w-[10rem]">
                                <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                                  {g.title}
                                </p>
                                <ul className="space-y-0.5">
                                  {g.links.map((l) => (
                                    <li key={l.label}>
                                      <a
                                        href={l.href}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          go(l.href)
                                        }}
                                        className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-mist-300 transition-colors hover:bg-nv-400/10 hover:text-mist-100"
                                      >
                                        <span className="h-px w-0 bg-nv-400 transition-all duration-300 group-hover:w-3" />
                                        {l.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* ------------------------------------------------- desktop acts */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <button
                type="button"
                onClick={() => {
                  const next = toggleAudio()
                  setSoundOn(next)
                  if (next) playActivateSound()
                }}
                aria-label={soundOn ? 'Disable sound FX' : 'Enable procedural audio'}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] transition-all ${
                  soundOn
                    ? 'border border-nv-400/40 bg-nv-400/15 text-nv-300 shadow-[0_0_12px_rgba(118,185,0,0.3)]'
                    : 'border border-white/5 bg-ink-900/60 text-mist-400 hover:text-mist-200'
                }`}
              >
                {soundOn ? <Volume2 className="size-3.5 text-nv-400" /> : <VolumeX className="size-3.5" />}
                <span className="tracking-wider uppercase">{soundOn ? 'SFX ON' : 'SFX'}</span>
              </button>

              <button
                type="button"
                aria-label="Search"
                className="grid size-9 place-items-center rounded-full text-mist-300 transition-colors hover:bg-nv-400/10 hover:text-nv-300"
              >
                <Search className="size-4" />
              </button>
              <MagneticButton href="#cta" variant="solid" className="px-5 py-2.5 text-sm">
                Shop
              </MagneticButton>
            </div>

            {/* ---------------------------------------------- mobile controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  const next = toggleAudio()
                  setSoundOn(next)
                  if (next) playActivateSound()
                }}
                aria-label={soundOn ? 'Disable sound FX' : 'Enable procedural audio'}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] transition-all ${
                  soundOn
                    ? 'border border-nv-400/40 bg-nv-400/15 text-nv-300 shadow-[0_0_10px_rgba(118,185,0,0.3)]'
                    : 'border border-white/10 bg-ink-900/60 text-mist-400'
                }`}
              >
                {soundOn ? <Volume2 className="size-3 text-nv-400" /> : <VolumeX className="size-3" />}
                <span className="uppercase">{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
              </button>

              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="grid size-10 place-items-center rounded-full text-mist-100 transition-colors hover:bg-nv-400/10"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>

            {/* reading-progress rail */}
            <motion.div
              aria-hidden
              className={`absolute inset-x-4 bottom-0 h-px origin-left bg-gradient-to-r from-nv-600 via-nv-300 to-nv-400 transition-opacity duration-500 ${
                scrolled ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </header>

      {/* --------------------------------------------------- mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] bg-ink-950/98 backdrop-blur-md lg:hidden"
          >
            <div className="container-x flex h-full flex-col overflow-y-auto pt-28 pb-10">
              <nav className="space-y-1" aria-label="Mobile">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...EXPO, delay: 0.05 + i * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileGroup((g) => (g === item.label ? null : item.label))
                      }
                      aria-expanded={mobileGroup === item.label}
                      className="flex w-full items-center justify-between border-b border-nv-400/12 py-4 text-left font-display text-2xl font-bold tracking-tight text-mist-100"
                    >
                      {item.label}
                      <ChevronDown
                        className={`size-5 text-nv-400 transition-transform duration-300 ${
                          mobileGroup === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileGroup === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={SPRING}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 py-4 pl-1">
                            {item.groups.map((g) => (
                              <div key={g.title}>
                                <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-nv-400 uppercase">
                                  {g.title}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {g.links.map((l) => (
                                    <a
                                      key={l.label}
                                      href={l.href}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        go(l.href)
                                      }}
                                      className="rounded-full border border-nv-400/20 px-3 py-1.5 text-sm text-mist-300 transition-colors hover:border-nv-400/60 hover:text-nv-200"
                                    >
                                      {l.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 space-y-2 border-t border-nv-400/12 pt-6">
                {ANCHORS.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    onClick={(e) => {
                      e.preventDefault()
                      go(a.href)
                    }}
                    className="block py-1.5 text-mist-400 transition-colors hover:text-nv-300"
                  >
                    {a.label}
                  </a>
                ))}
                <a
                  href="#cta"
                  onClick={(e) => {
                    e.preventDefault()
                    go('#cta')
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-nv-400 px-6 py-3.5 font-semibold text-ink-950"
                >
                  Shop NVIDIA
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* side rail — shows which section you're in (desktop only) */}
      {/* Section rail. Not aria-hidden: it holds real, focusable controls. */}
      <nav
        aria-label="Page sections"
        className="fixed top-1/2 right-6 z-[60] hidden -translate-y-1/2 flex-col items-end gap-3 2xl:flex"
      >
        {SECTION_IDS.filter((id) => id !== 'hero').map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => go(`#${id}`)}
            className="group -my-1 flex items-center gap-2.5 py-1.5"
            aria-label={`Go to ${id}`}
          >
            <span
              className={`font-mono text-[10px] tracking-[0.16em] uppercase transition-all duration-300 ${
                active === id
                  ? 'text-nv-300 opacity-100'
                  : 'text-mist-400 opacity-0 group-hover:opacity-100'
              }`}
            >
              {id.replace('-', ' ')}
            </span>
            <span
              className={`block h-px transition-all duration-400 ${
                active === id
                  ? 'w-8 bg-nv-400 shadow-[0_0_10px_var(--color-nv-400)]'
                  : 'w-4 bg-mist-400/40 group-hover:w-6 group-hover:bg-nv-600'
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  )
}
