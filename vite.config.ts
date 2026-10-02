import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite names the emitted HTML after its input file, so building `dev.html`
 * produces `dist/dev.html`. GitHub Pages (and any static host) serves
 * `index.html`, so rename it during the build rather than adding a separate
 * copy step to every consumer of this config.
 */
function emitIndexHtml(): Plugin {
  return {
    name: 'emit-index-html',
    apply: 'build',
    // `post` so this runs after Vite's own HTML emitter has added dev.html
    // to the bundle — otherwise there is nothing to rename yet.
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entry = bundle['dev.html']
      if (entry && entry.type === 'asset') {
        delete bundle['dev.html']
        entry.fileName = 'index.html'
        bundle['index.html'] = entry
      }
    },
  }
}

/**
 * The Vite entry document is `dev.html`, NOT the root `index.html`.
 *
 * `index.html` is generated build output: a self-contained single-file bundle
 * that opens by double-clicking (see scripts/make-single.mjs). ES modules are
 * blocked by CORS under `file://`, so a Vite-style entry can never run from
 * the filesystem — hence the split.
 */
export default defineConfig({
  // Relative base so the bundle works from any subpath, not just a domain
  // root. GitHub Pages serves this at /<repo>/, where absolute /assets/...
  // paths would 404.
  base: './',
  plugins: [react(), tailwindcss(), emitIndexHtml()],
  resolve: {
    // '/src' is resolved against the project root by Vite, so no node APIs needed.
    alias: { '@': '/src' },
  },
  server: { port: 5173 },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: 'dev.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['motion'],
        },
      },
    },
  },
})
