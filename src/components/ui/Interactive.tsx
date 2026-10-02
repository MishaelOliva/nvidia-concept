import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/* -------------------------------------------------------------------------- */
/*  Magnetic — element drifts toward the cursor while hovered                 */
/* -------------------------------------------------------------------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        mx.set((e.clientX - (r.left + r.width / 2)) * strength)
        my.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Tilt — 3D card that leans toward the cursor, with a specular glare         */
/* -------------------------------------------------------------------------- */
export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
  scale = 1.015,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
  scale?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 })
  const s = useSpring(useTransform(hover, [0, 1], [1, scale]), { stiffness: 200, damping: 22 })

  // Hoisted: hooks must not sit behind a conditional.
  const glareOpacity = useTransform(hover, [0, 1], [0, 1])
  const glareBg = useTransform(
    [px, py],
    ([gx, gy]: number[]) =>
      `radial-gradient(420px circle at ${gx * 100}% ${gy * 100}%, rgba(168,245,66,0.16), transparent 62%)`,
  )

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, scale: s, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width)
        py.set((e.clientY - r.top) / r.height)
      }}
      onPointerEnter={() => hover.set(1)}
      onPointerLeave={() => {
        hover.set(0)
        px.set(0.5)
        py.set(0.5)
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ opacity: glareOpacity, background: glareBg }}
        />
      )}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  MagneticButton — pill CTA with a glow that tracks the cursor               */
/* -------------------------------------------------------------------------- */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  icon,
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'outline'
  className?: string
  icon?: ReactNode
}) {
  const solid =
    variant === 'solid'
      ? 'bg-nv-400 text-ink-950 hover:bg-nv-300 shadow-glow hover:shadow-glow-lg'
      : 'glass text-mist-100 hover:border-nv-400/70 hover:bg-nv-400/10'

  const inner = (
    <span
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-semibold tracking-tight transition-all duration-300 ${solid} ${className}`}
    >
      {/* sheen */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">
        {children}
        {icon}
      </span>
    </span>
  )

  return (
    <Magnetic strength={0.28}>
      {href ? (
        <a href={href} className="inline-block">
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className="inline-block">
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
