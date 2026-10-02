/* ============================================================================
   Site content.
   Product names, platform names and the "Our Body of Work" pillars mirror
   NVIDIA's real public taxonomy so the copy stays credible.
   ========================================================================= */

export type NavLink = { label: string; href: string }

export type NavGroup = { title: string; links: NavLink[] }

export const NAV: { label: string; groups: NavGroup[] }[] = [
  {
    label: 'Products',
    groups: [
      {
        title: 'Cloud Services',
        links: [
          { label: 'DGX Cloud', href: '#ai-factory' },
          { label: 'NVIDIA APIs', href: '#ai-factory' },
          { label: 'Private Registry', href: '#ai-factory' },
          { label: 'GPU Cloud', href: '#ai-factory' },
        ],
      },
      {
        title: 'Data Center',
        links: [
          { label: 'DGX Platform', href: '#ai-factory' },
          { label: 'Grace CPU', href: '#ai-factory' },
          { label: 'HGX Platform', href: '#ai-factory' },
          { label: 'MGX Platform', href: '#ai-factory' },
          { label: 'OVX Systems', href: '#ai-factory' },
          { label: 'DSX Platform', href: '#ai-factory' },
        ],
      },
      {
        title: 'Embedded & Robotics',
        links: [
          { label: 'Jetson', href: '#pillars' },
          { label: 'DRIVE AGX', href: '#pillars' },
          { label: 'IGX Platform', href: '#pillars' },
          { label: 'Isaac', href: '#pillars' },
          { label: 'Cosmos', href: '#pillars' },
        ],
      },
    ],
  },
  {
    label: 'Solutions',
    groups: [
      {
        title: 'Artificial Intelligence',
        links: [
          { label: 'Overview', href: '#ai-factory' },
          { label: 'Agentic AI', href: '#ai-factory' },
          { label: 'Conversational AI', href: '#ai-factory' },
          { label: 'Cybersecurity', href: '#ai-factory' },
          { label: 'Data Science', href: '#ai-factory' },
        ],
      },
      {
        title: 'Domain',
        links: [
          { label: 'Digital Twins', href: '#pillars' },
          { label: 'Healthcare', href: '#pillars' },
          { label: 'Automotive', href: '#pillars' },
          { label: 'Higher Education', href: '#pillars' },
          { label: 'Sustainability', href: '#timeline' },
        ],
      },
    ],
  },
  {
    label: 'GeForce',
    groups: [
      {
        title: 'Graphics Cards',
        links: [
          { label: 'RTX 5090', href: '#rtx' },
          { label: 'RTX 5080', href: '#rtx' },
          { label: 'RTX 5070 Family', href: '#rtx' },
          { label: 'RTX 5060 Family', href: '#rtx' },
          { label: 'RTX 5050', href: '#rtx' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'DLSS', href: '#dlss' },
          { label: 'Reflex', href: '#dlss' },
          { label: 'G-SYNC', href: '#dlss' },
          { label: 'GeForce NOW', href: '#dlss' },
          { label: 'RTX AI PCs', href: '#rtx' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    groups: [
      {
        title: 'About',
        links: [
          { label: 'Our Body of Work', href: '#pillars' },
          { label: 'Concept Architect', href: '#architect' },
          { label: 'Timeline', href: '#timeline' },
          { label: 'Newsroom', href: '#news' },
          { label: 'Careers', href: '#cta' },
        ],
      },
    ],
  },
]

export const TICKER: string[] = [
  'BLACKWELL',
  'RTX 50 SERIES',
  'DLSS 4',
  'GB300 NVL72',
  'CUDNN',
  'DGX CLOUD',
  'NEMOTRON',
  'ISAAC GR00T',
  'OMNVERSE',
  'RTX REMIX',
  'G-SYNC',
  'GRACE BLACKWELL',
  'NIM',
  'CUDA-X',
  'JETSON',
  'DRIVE THOR',
]

/* --- hero ---------------------------------------------------------------- */
export const HERO_STATS = [
  { value: 1250, suffix: ' PFLOPS', label: 'FP4 AI per rack' },
  { value: 530, suffix: ' kW', label: 'GB300 NVL72 power' },
  { value: 21760, suffix: '', label: 'CUDA cores · RTX 5090' },
  { value: 1406, suffix: ' TOPS', label: 'RTX AI TOPS · 5070 Ti' },
]

/* --- "Our Body of Work" -------------------------------------------------- */
export type Pillar = {
  id: string
  index: string
  title: string
  kicker: string
  body: string
  accent: string
}

export const PILLARS: Pillar[] = [
  {
    id: 'iphone-moment',
    index: '01',
    title: 'The iPhone Moment for AI',
    kicker: 'A new computing platform',
    body: 'Accelerated computing and AI have fully arrived. The acceleration of deep learning ignited the Big Bang of AI. Now generative AI is a new computing platform — like the PC, the internet, and mobile cloud before it.',
    accent: '#76b900',
  },
  {
    id: 'engine-of-ai',
    index: '02',
    title: 'NVIDIA Is the Engine of AI',
    kicker: 'Chips, systems, software',
    body: 'We engineer the most advanced chips, systems and software for the AI factories of the future — and build the services that help every company create their own.',
    accent: '#8fd400',
  },
  {
    id: 'graphics',
    index: '03',
    title: 'Reinventing Modern Graphics',
    kicker: 'Neural rendering',
    body: 'RTX fuses AI with ray tracing to deliver a whole new level of realism. DLSS reconstructs frames from a neural model, and frame generation renders entirely new ones at high fidelity.',
    accent: '#a8f542',
  },
  {
    id: 'physical-digital',
    index: '04',
    title: 'Connecting Physical & Digital Worlds',
    kicker: 'Omniverse · Digital twins',
    body: 'Industries grounded in physical processes become software-defined. Physically accurate, OpenUSD-based digital twins let large, highly skilled teams iterate before a single part is cut.',
    accent: '#76b900',
  },
  {
    id: 'automotive',
    index: '05',
    title: 'Driving Automotive Growth',
    kicker: 'A $3T transformation',
    body: 'Generative AI and digitalisation are reshaping a three-trillion-dollar industry — from design and engineering to manufacturing, autonomous driving and the in-cabin experience.',
    accent: '#8fd400',
  },
  {
    id: 'healthcare',
    index: '06',
    title: 'Supercharging Healthcare',
    kicker: 'HPC meets medicine',
    body: 'Healthcare institutions harness AI and high-performance computing to define the future of medicine — from imaging and drug discovery to personalised treatment planning.',
    accent: '#a8f542',
  },
  {
    id: 'sustainable',
    index: '07',
    title: 'Accelerated Computing Is Sustainable Computing',
    kicker: 'The power equation',
    body: 'Data centres are already 1–2% of global electricity and growing. That is not sustainable for operating budgets or for the planet. Acceleration is the way to reclaim power and reach net zero.',
    accent: '#76b900',
  },
]

/* --- RTX 50 series ------------------------------------------------------- */
export type Gpu = {
  id: string
  name: string
  tagline: string
  cudaCores: number
  boostGHz: number
  vramGB: number
  memoryType: string
  busWidth: number
  tgpWatts: number
  aiTops: number
  price: string
  tier: number
}

export const GPUS: Gpu[] = [
  {
    id: '5090',
    name: 'GeForce RTX 5090',
    tagline: 'Flagship Blackwell. Everything, at once.',
    cudaCores: 21760,
    boostGHz: 2.41,
    vramGB: 32,
    memoryType: 'GDDR7',
    busWidth: 512,
    tgpWatts: 575,
    aiTops: 3352,
    price: 'From $1,999',
    tier: 100,
  },
  {
    id: '5080',
    name: 'GeForce RTX 5080',
    tagline: 'The performance-per-watt sweet spot.',
    cudaCores: 10752,
    boostGHz: 2.62,
    vramGB: 16,
    memoryType: 'GDDR7',
    busWidth: 256,
    tgpWatts: 360,
    aiTops: 1800,
    price: 'From $999',
    tier: 78,
  },
  {
    id: '5070ti',
    name: 'GeForce RTX 5070 Ti',
    tagline: '1440p and 4K, refined.',
    cudaCores: 8960,
    boostGHz: 2.45,
    vramGB: 16,
    memoryType: 'GDDR7',
    busWidth: 256,
    tgpWatts: 300,
    aiTops: 1406,
    price: 'From $749',
    tier: 62,
  },
  {
    id: '5070',
    name: 'GeForce RTX 5070',
    tagline: 'DLSS 4 at the midrange.',
    cudaCores: 6144,
    boostGHz: 2.51,
    vramGB: 12,
    memoryType: 'GDDR7',
    busWidth: 192,
    tgpWatts: 250,
    aiTops: 1250,
    price: 'From $549',
    tier: 49,
  },
  {
    id: '5060ti',
    name: 'GeForce RTX 5060 Ti',
    tagline: 'Blackwell, small footprint.',
    cudaCores: 4608,
    boostGHz: 2.45,
    vramGB: 16,
    memoryType: 'GDDR7',
    busWidth: 128,
    tgpWatts: 180,
    aiTops: 759,
    price: 'From $429',
    tier: 34,
  },
]

/* --- DLSS lab ------------------------------------------------------------ */
export type DlssPreset = {
  id: string
  name: string
  note: string
  frames: number
  input: number
  latencyMs: number
  /** 0 for upscaling presets; >0 only for Frame Generation. */
  genFactor: number
  /** Fraction of native resolution rendered internally. */
  internalRes: number
}

export const DLSS_PRESETS: DlssPreset[] = [
  {
    id: 'native',
    name: 'Native / No DLSS',
    note: 'Every pixel rendered by the rasteriser. The baseline the neural pipeline is measured against.',
    frames: 62,
    input: 62,
    latencyMs: 16.1,
    genFactor: 0,
    internalRes: 1,
  },
  {
    id: 'quality',
    name: 'DLSS Quality',
    note: 'Temporal upscaling at ~66% internal resolution, then reconstructed with detail intact. Fewer pixels are drawn; no extra frames are synthesised.',
    frames: 118,
    input: 62,
    latencyMs: 15.4,
    genFactor: 0,
    internalRes: 0.66,
  },
  {
    id: 'balanced',
    name: 'DLSS Balanced',
    note: '~50% internal resolution. The most common preset for competitive 1440p and 4K.',
    frames: 172,
    input: 62,
    latencyMs: 14.2,
    genFactor: 0,
    internalRes: 0.5,
  },
  {
    id: 'performance',
    name: 'DLSS Performance',
    note: '~40% internal resolution. Maximum throughput when fill rate is the bottleneck.',
    frames: 241,
    input: 62,
    latencyMs: 13.6,
    genFactor: 0,
    internalRes: 0.4,
  },
  {
    id: 'mgf',
    name: 'DLSS Frame Gen',
    note: 'Neural Frame Generation synthesises new frames from motion vectors — throughput doubles while input latency stays flat.',
    frames: 384,
    input: 192,
    latencyMs: 11.4,
    genFactor: 1,
    internalRes: 0.66,
  },
]

/* --- timeline ------------------------------------------------------------ */
export const TIMELINE = [
  { year: '1993', title: 'Founded', body: 'NVIDIA is founded on a thesis: the CPU is not the right engine for every problem.' },
  { year: '1999', title: 'GeForce', body: 'The first GeForce GPU turns a graphics card into a programmable parallel processor.' },
  { year: '2006', title: 'CUDA', body: 'A general-purpose computing platform is revealed — and the parallel programming era begins.' },
  { year: '2008', title: 'Tesla', body: 'The first CUDA GPU computing product brings HPC to industries that never needed a supercomputer.' },
  { year: '2012', title: 'Deep Learning', body: 'AlexNet trains on two GTX 580s. Neural networks become the killer app for parallel compute.' },
  { year: '2016', title: 'DGX-1', body: 'The first AI supercomputer ships — "a personal AI supercomputer", built on eight Pascal GPUs.' },
  { year: '2020', title: 'Ampere', body: 'A100 introduces Tensor Cores at scale and redefines what a training run costs.' },
  { year: '2022', title: 'Omniverse & Hopper', body: 'H100 lands, and the metaverse platform plus simulation stack begin connecting digital twins to the factory floor.' },
  { year: '2024', title: 'Blackwell', body: 'The Blackwell architecture debuts: two dies, 208 billion transistors, and a new era of AI factories.' },
  { year: '2026', title: 'Rubin', body: 'The next architecture arrives, extending the full-stack roadmap from datacenter to robotics.' },
]

/* --- newsroom ------------------------------------------------------------ */
export const NEWS = [
  {
    tag: 'Platform',
    date: '2026',
    title: 'GB300 NVL72 raises the rack to 1,250 PFLOPS of FP4 inference',
    body: 'Grace Blackwell at rack scale delivers a 1.3 GW AI factory that fits inside a single power envelope — and reshapes the cost per token.',
    accent: '#76b900',
  },
  {
    tag: 'Research',
    date: '2026',
    title: 'Cosmos world foundation models bring physical AI into simulation',
    body: 'Predictive, generative and transfer models let robots learn from impossible-to-capture scenarios before ever touching hardware.',
    accent: '#8fd400',
  },
  {
    tag: 'Gaming',
    date: '2025',
    title: 'RTX Remix brings neural remastering to every PC',
    body: 'Open-source models turn a 25-year-old disc into a ray-traced, frame-generated 4K experience — running on the hardware you already own.',
    accent: '#a8f542',
  },
]

/* --- Concept Architect & Engineer ---------------------------------------- */
export const CEO = {
  name: 'Mishael Oliva',
  role: 'Concept Architect & Lead Engineer',
  since: '2026',
  location: 'Taguig City, Philippines',
  tagline: 'Exploring the intersection of custom WebGL shaders, neural rendering concepts, and zero-overhead web performance.',
  lede: 'Mishael Oliva is a Computer Engineering graduate (Cum Laude, TUP Manila) specializing in systems architecture, AI pipelines, and modern frontend interfaces. This project was engineered from scratch as an interactive concept showcase exploring raw WebGL shaders, neural graphics simulations, and zero-dependency web performance.',
  body: [
    'Instead of relying on heavy third-party 3D runtimes like Three.js, this build implements a custom GLSL fragment shader directly on an HTML5 canvas quad, keeping runtime overhead minimal while achieving a locked 60 FPS rendering pipeline.',
    'The architecture combines dual-target bundling (code-split ESM plus an offline standalone HTML), accessible roving-tab navigation, and responsive motion primitives to prove how rich, hardware-accelerated interactive interfaces can remain lightweight and maintainable.',
  ],
  /* Right-hand architecture pillars */
  pillars: [
    {
      icon: 'spark',
      title: 'Custom WebGL Shader',
      desc: 'Zero Three.js bloat: raw GLSL fragment program on an HTML5 canvas',
    },
    {
      icon: 'chip',
      title: 'Neural Rendering Lab',
      desc: 'Interactive DLSS & Frame Gen simulator with mathematical latency models',
    },
    {
      icon: 'network',
      title: 'Dual-Target Bundling',
      desc: 'Custom Vite pipeline generating both CDN ESM and offline standalone bundles',
    },
    {
      icon: 'users',
      title: 'Engineering Rigor',
      desc: 'Strict TypeScript, accessible roving tabs, and automated GitHub CI/CD',
    },
  ],
  highlights: [
    {
      text: 'By writing raw GLSL shaders on a full-screen canvas quad, we eliminate 600KB+ of Three.js runtime overhead while achieving steady 60 FPS rendering.',
      source: 'WebGL Engineering Rationale',
    },
    {
      text: 'The DLSS lab reproduces temporal upscaling and optical multi-frame generation math with real-time frametime and latency modeling.',
      source: 'Neural Rendering Simulation',
    },
    {
      text: 'A custom Vite pipeline generates standard chunked ESM for GitHub Pages deployment and an inlined standalone bundle for offline portability.',
      source: 'Dual-Target Architecture',
    },
  ],
  focus: [
    { label: 'Raw GLSL & WebGL', value: 95 },
    { label: 'React 19 & TypeScript', value: 92 },
    { label: 'Motion & UI Kinetics', value: 90 },
    { label: 'Build & Bundling Pipelines', value: 94 },
  ],
  facts: [
    { k: 'Engineer', v: 'Mishael Oliva' },
    { k: 'Education', v: 'TUP Manila (Cum Laude)' },
    { k: 'Degree', v: 'B.Eng. Tech (CompEng)' },
    { k: 'Stack', v: 'React 19 · TS · WebGL' },
    { k: '3D Runtime', v: '0 KB (Raw GLSL)' },
    { k: 'Deployment', v: 'GitHub Pages CI/CD' },
  ],
}
