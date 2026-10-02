> The root `index.html` is a **generated, self-contained bundle** — open it by
> double-clicking to view the site offline. It is rebuilt by `npm run build` and
> committed so the repository can be opened directly without a build step.
>
> The live site is served from `dist/`, produced by `.github/workflows/deploy.yml`
> and published to GitHub Pages.

# NVIDIA — Futuristic Concept Site

A modern, NVIDIA-themed marketing site: WebGL hero, scroll-linked animation, an
interactive DLSS lab and a "Meet our CEO" section built around a portrait.

**Live:** https://mishaeloliva.github.io/nvidia-concept/

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · lucide-react

> A fan-made concept build. Not affiliated with or endorsed by NVIDIA.
> The "Meet our CEO" biography is a fictional persona, not a real executive.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/dev.html
```

### Opening `index.html` directly

`index.html` is **generated build output**, not the source entry — it is a
single self-contained document that works by double-clicking:

```
index.html                             <- double-click this
dist-single/nvidia-standalone.html     <- identical copy
```

It is regenerated on every `npm run build`. Editing the site's markup means
editing the React source, not this file.

Because ES modules are blocked by CORS under `file://`, the source entry is
`dev.html` (used by Vite) while `index.html` is emitted as a classic inline
`<script>`. See `vite.single.config.ts` and `scripts/make-single.mjs`.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR at `/dev.html` |
| `npm run build` | Typecheck, then both builds, then writes standalone `index.html` |
| `npm run build:prod` | Typecheck + normal chunked production build only |
| `npm run build:single` | Standalone single-file build only |
| `npm run preview` | Serve `dist/` (entry is `dev.html`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Alias for typecheck — the strict TS config is the linter here |
| `npm run check` | Typecheck + full build, i.e. what CI should run |

---

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, builds
`dist/`, and publishes it to GitHub Pages at
**https://mishaeloliva.github.io/nvidia-concept/**.

Two details make this work:

- `base: './'` in `vite.config.ts`, because Pages serves from the `/nvidia-concept/`
  subpath and absolute `/assets/...` URLs would 404.
- The site routes with URL hashes (`#ceo`, `#rtx`), so it is a pure client-side
  SPA — no SPA rewrite rules required.

---

## Project layout

```
dev.html               Vite entry (dev + chunked production build)
index.html             generated standalone bundle — the double-clickable entry
vite.config.ts         normal build (ESM, code-split, relative base)
vite.single.config.ts  standalone build (IIFE, assets inlined as data URIs)
.github/workflows/     GitHub Pages deployment
scripts/make-single.mjs  inlines JS + CSS into one document
assets/                image assets
src/
  App.tsx              section composition, boot state
  main.tsx             root render + ErrorBoundary
  styles.css           Tailwind v4 theme tokens, effects, keyframes
  lib/
    data.ts            all copy + product spec tables
    hooks.ts           media queries, scroll progress, smooth scroll
    motion.ts          shared easing/stagger variants
  components/
    GpuField.tsx       WebGL hero (raw GLSL, no 3D library)
    Preloader.tsx      boot sequence
    Navbar.tsx         sticky glass nav, mega-menu, section rail
    Hero.tsx           headline, CTAs, animated stat rail
    Ticker.tsx         infinite platform marquee
    Pillars.tsx        "Our Body of Work", scroll-driven index
    Rtx.tsx            RTX 50 series selector + procedural die art
    Dlss.tsx           DLSS lab (draggable pipeline slider)
    AiFactory.tsx      four-layer stack + metrics
    Ceo.tsx            Meet our CEO
    Timeline.tsx       company timeline
    Newsroom.tsx       news cards
    Cta.tsx / Footer.tsx
    ui/                Reveal, SplitText, Counter, Tilt, Magnetic, primitives
```

---

## Notable implementation details

**The WebGL hero** is one full-screen quad and a fragment program — no 3D
library. It draws a perspective floor grid receding to a plasma horizon with a
travelling energy pulse. Sizing is driven by a `ResizeObserver` (not polled per
frame), scroll progress is read from the CSS variable the app already maintains
so no scroll handler touches layout, and it pauses when off-screen or
backgrounded. Falls back to a CSS gradient under `prefers-reduced-motion`.

**The CEO portrait** is not matted out of its background. The source photo's
studio backdrop is near-black (`~#0e0f18`), so a radial `mask-dissolve` plus an
inner vignette blends it into the section with no cut-out — and therefore no
haloing. The frame is locked to the photo's own 4:5 aspect at every viewport
width — width-capped on small screens, and its grid track capped on large ones
— so `object-cover` never crops the face. Letting the frame stretch to the
full column height (a 0.43 aspect) cropped ~46% of the image's width.

**No external image or font dependency is required for layout.** The die art,
news covers and icons are SVG; the only bitmap is the portrait.

## Accessibility

- Every animated heading exposes its full text via an `sr-only` sibling; the
  per-word animated copy is `aria-hidden` so headings are not read as fragments.
- `prefers-reduced-motion` is honoured across reveals, parallax, the WebGL
  field, magnetic/tilt interactions and the scroll-driven reveals.
- The page is `inert` during boot, so nothing behind the preloader is focusable.
  The mobile menu is a focus-trapped `aria-modal` dialog that returns focus to
  its trigger on close.
- The RTX 50 selector is a real tab pattern: roving tabindex, arrow-key
  navigation, and a matching `role="tabpanel"`.
- `ErrorBoundary` wraps the app: a render throw shows a message instead of a
  blank page.
- The WebGL teardown path is safe at every exit point — GL handles are held in
  nullable variables so a shader-link failure degrades instead of throwing a
  temporal-dead-zone error.
