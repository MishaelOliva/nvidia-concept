# NVIDIA Futuristic Concept — Modern WebGL & Neural Graphics Engine

An independent, production-grade frontend architecture concept exploring the convergence of custom WebGL shader pipelines, neural graphics simulations, and zero-dependency web performance. Engineered from scratch with React 19, TypeScript, and Tailwind CSS v4.

**Live Deployment:** [https://mishaeloliva.github.io/nvidia-concept/](https://mishaeloliva.github.io/nvidia-concept/)  
**Engineer:** Mishael Dioneda Oliva — *Bachelor of Engineering Technology in Computer Engineering Technology (Cum Laude, TUP Manila)*  
**Links:** [GitHub Profile](https://github.com/MishaelOliva) · [LinkedIn](https://www.linkedin.com/in/mishael-oliva-96a31b3a2)

---

## Technical Architecture & Engineering Decisions

### 1. Raw WebGL Fragment Shader (Zero 3D Library Bloat)
Rather than pulling in heavy third-party 3D runtimes (such as Three.js or Babylon.js, which add 600 KB+ of uncompressed vendor bloat), the hero background is rendered using a **custom GLSL fragment shader on an HTML5 canvas quad**:
* **Ray-Plane Grid & Horizon Plasma:** Computes an infinite perspective grid receding into a plasma horizon with a dynamic travelling energy pulse.
* **Zero Per-Frame Layout Reflows:** Canvas sizing is bound to a `ResizeObserver`, and scroll progress is read directly from CSS custom properties (`--scroll-progress`), ensuring scroll events never trigger DOM style recalculations.
* **Energy-Conscious Render Loop:** The WebGL render loop automatically pauses via `IntersectionObserver` when scrolled out of view or when the browser tab is backgrounded via the Page Visibility API.
* **Graceful Degradation:** Full `prefers-reduced-motion` support gracefully substitutes the active shader loop with a static, CSS-rendered gradient backdrop.

### 2. Interactive DLSS & Frame Generation Simulator
An interactive graphics laboratory allowing engineers to explore the mathematical trade-offs between conventional rasterization, temporal super-resolution, and optical multi-frame generation:
* **Mathematical Modeling:** Simulates scaling factors across Native (1.0x), Quality (0.66x), Balanced (0.50x), Performance (0.40x), and Multi-Frame Generation (MGF).
* **Real-Time Frametime & Latency Metrics:** Dynamically computes reciprocal frametimes ($ms = 1000 / FPS$) and optical flow vector overhead to demonstrate throughput gains vs. input latency stabilization.
* **Interactive Drag Comparator:** Smooth, hardware-accelerated slider allowing real-time inspection of resolution reconstruction.

### 3. Interactive CUDA & Tensor Workload Lab
An interactive high-performance computing telemetry deck allowing engineers to benchmark simulated hardware workloads in real time:
* **Architecture Selector:** Dynamic switching across consumer and datacenter architectures: RTX 5090 (GB202), RTX 5080 (GB203), RTX 5070 Ti (GB205), and rack-scale GB300 NVL72.
* **Workload Modeling:** Profiles LLM FP4 Inference (70B MoE), 4K Full Path Tracing (multi-bounce caustic dispatch), and Molecular Dynamics (AMBER/GROMACS FP64).
* **Interactive Modifiers:** Real-time scrubbing of batch concurrency streams (1 to 32) and tensor numerical precision formats (FP4, FP8, FP16) dynamically driving simulated compute throughput, memory bandwidth saturation, and P99 execution latency.

### 4. Zero-Asset Procedural Web Audio Engine
* **Synthesized Audio:** Implements a native Web Audio API synthesizer (`src/lib/audio.ts`) producing cybernetic UI clicks, frequency ticks, and activation hums with zero external audio assets or network requests.
* **Audio State Management:** Features a synchronized `[SFX: ON/OFF]` toggle across both desktop and mobile navigation bars.

### 5. 60 FPS GPU Efficiency & Cross-Device Optimization
* **Responsive DPR Capping:** Clamps canvas Device Pixel Ratio to 1.0 on mobile devices (<768px) and 1.5 on desktop, reducing mobile fragment shader fill-rate by 60%–75%.
* **Zero-Repaint Compositing:** Eliminates full-viewport scroll invalidations through GPU hardware-accelerated layers (`[transform:translateZ(0)]`) and optimized CSS glass backdrop filters.
* **Adaptive Mobile Telemetry:** Responsive 2x2 telemetry HUD on mobile screens and touch-ergonomic slider tracks (`touch-pan-x`).

### 6. Dual-Target Bundling & Build Pipeline
The repository features an intentional dual-target build system configured in `vite.config.ts` and `vite.single.config.ts`:
* **Target A — Cloud Edge / GitHub Pages:** Emits a code-split, ESM-native production bundle with hashed asset paths and relative base resolution (`base: './'`), automated via GitHub Actions CI/CD (`.github/workflows/deploy.yml`).
* **Target B — Portable Standalone (`index.html`):** A custom Node.js compilation script (`scripts/make-single.mjs`) bundles all JavaScript, CSS, and asset data-URIs into a single, self-contained `index.html` file that opens immediately by double-clicking under `file://` with zero CORS failures or local server requirements.

### 7. Accessibility & Performance Engineering (WCAG 2.1 AA)
* **Screen Reader Parity:** Animated kinetic text components expose full semantic text to assistive technology via `.sr-only` siblings, while animated character and word spans are flagged `aria-hidden` to eliminate choppy speech synthesis.
* **Accessible Roving Tab Navigation:** The RTX 50 hardware selector implements strict WAI-ARIA tab semantics with roving `tabindex` and arrow-key keyboard navigation.
* **Inert Modals & Focus Traps:** The responsive navigation drawer utilizes an `aria-modal` dialog that traps tab focus and returns focus deterministically to its trigger upon dismissal.
* **Robust Error Boundaries:** React `ErrorBoundary` isolates runtime exceptions, preventing whole-page teardowns.

---

## Project Structure

```text
├── dev.html                  # Vite development & ESM production entry point
├── index.html                # Compiled, self-contained standalone offline bundle
├── vite.config.ts            # ESM production configuration (code-split, relative base)
├── vite.single.config.ts     # Standalone bundle configuration (IIFE format)
├── scripts/
│   ├── capture_sections.mjs  # Automated Puppeteer viewport & audit capture
│   └── make-single.mjs       # Custom post-build inliner for standalone artifact
├── .github/workflows/
│   └── deploy.yml            # Automated GitHub Actions Pages deployment pipeline
├── src/
│   ├── App.tsx               # Root application layout & scroll progress coordinator
│   ├── main.tsx              # React 19 bootstrap & ErrorBoundary wrapper
│   ├── styles.css            # Tailwind CSS v4 design tokens & custom keyframes
│   ├── lib/
│   │   ├── audio.ts          # Native Web Audio API procedural sound engine
│   │   ├── data.ts           # Spec sheets, DLSS presets, and engineering metadata
│   │   ├── hooks.ts          # Media queries, IntersectionObserver, and scroll hooks
│   │   └── motion.ts         # Shared Framer Motion springs and stagger variants
│   └── components/
│       ├── BenchmarkLab.tsx  # Interactive CUDA & Tensor Workload telemetry suite
│       ├── GpuField.tsx      # Raw GLSL WebGL canvas shader & lifecycle manager
│       ├── Navbar.tsx        # Sticky glass navigation with SFX toggle and mobile drawer
│       ├── Hero.tsx          # Kinetic typography, stat tickers, and mobile HUD
│       ├── Dlss.tsx          # Interactive neural rendering & frame-gen simulator
│       ├── Rtx.tsx           # RTX 50 series architecture selector & procedural die art
│       ├── Ceo.tsx           # Concept Architecture & Lead Engineer showcase
│       └── ui/               # Modular primitives (Reveal, Counter, Tilt, Primitives)
```

---

## Getting Started

### Prerequisites
* Node.js 18.x or later (tested on Node v24 LTS)
* npm 9.x or later

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server with Hot Module Replacement (HMR)
npm run dev
# -> Opens at http://localhost:5173/dev.html
```

### Verification & Production Builds
```bash
# Typecheck TypeScript codebase with strict compiler rules
npm run typecheck

# Run full engineering check (typecheck + production ESM build + standalone inlined build)
npm run check

# Preview the production distribution locally
npm run preview
```

---

## Engineering Verification & Status

| Verification Gate | Command | Result |
| :--- | :--- | :--- |
| **TypeScript Strict Compilation** | `npm run typecheck` | ✅ **0 Errors (Clean Emit)** |
| **Vite Production Bundler** | `npm run build:prod` | ✅ **Passed (Code-Split ESM)** |
| **Standalone Inliner** | `npm run build:single` | ✅ **Passed (Self-Contained `index.html`)** |
| **Automated CI/CD** | GitHub Actions Workflow | ✅ **Deployed to GitHub Pages** |

---

*Notice: This project is an independent frontend engineering and graphics concept build designed to showcase modern web systems, custom WebGL shaders, and React 19 architecture.*
