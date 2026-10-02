import { useCallback, useState } from 'react'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Ticker } from './components/Ticker'
import { Pillars } from './components/Pillars'
import { Rtx } from './components/Rtx'
import { Dlss } from './components/Dlss'
import { AiFactory } from './components/AiFactory'
import { CEO } from './components/Ceo'
import { Timeline } from './components/Timeline'
import { Newsroom } from './components/Newsroom'
import { CTA } from './components/Cta'
import { Footer } from './components/Footer'
import { useAmbientPause, useScrollProgressVar } from './lib/hooks'

export default function App() {
  const [booted, setBooted] = useState(false)
  const onBooted = useCallback(() => setBooted(true), [])

  useScrollProgressVar('--scroll-progress')
  useAmbientPause()

  return (
    <>
      <Preloader onDone={onBooted} />

      {/*
        `inert` (not just opacity-0) while booting: without it the whole page
        stays focusable and clickable behind the preloader, so keyboard users
        can tab into links they cannot see. The skip link lives inside this
        wrapper so it cannot be focused and painted over the preloader.
      */}
      <div
        inert={!booted}
        className={`transition-opacity duration-700 ${booted ? 'opacity-100' : 'opacity-0'}`}
      >
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-nv-400 focus:px-5 focus:py-2.5 focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>

        <Navbar />

        <main>
          <Hero />
          <Ticker />
          <Pillars />
          <CEO />
          <Rtx />
          <Dlss />
          <AiFactory />
          <Timeline />
          <Newsroom />
          <CTA />
        </main>

        <Footer />
      </div>

      {/* page-wide film grain */}
      <div
        aria-hidden
        className="bg-noise pointer-events-none fixed inset-0 z-[95] opacity-[0.035] mix-blend-overlay"
      />
    </>
  )
}
