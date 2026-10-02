/* ============================================================================
   Procedural Web Audio Synthesizer (Zero External Audio Files)
   Generates crisp, futuristic UI haptics using native Web Audio API oscillators.
   ========================================================================= */

let audioCtx: AudioContext | null = null
let soundEnabled = false

export function isAudioEnabled(): boolean {
  return soundEnabled
}

export function toggleAudio(force?: boolean): boolean {
  soundEnabled = force !== undefined ? force : !soundEnabled
  if (soundEnabled && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = new AudioContextClass()
    } catch {
      soundEnabled = false
    }
  }
  if (soundEnabled && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return soundEnabled
}

function getContext(): AudioContext | null {
  if (!soundEnabled) return null
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = new AudioContextClass()
    } catch {
      return null
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/** Subtle high-tech click */
export function playClickSound() {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04)

  gain.gain.setValueAtTime(0.06, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.045)
}

/** Soft cyber tick on hover / slider scrub */
export function playHoverSound() {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.02)

  gain.gain.setValueAtTime(0.03, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.03)
}

/** Resonant futuristic power pulse */
export function playActivateSound() {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(220, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)

  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.13)
}
