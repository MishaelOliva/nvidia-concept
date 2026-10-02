import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Single-file (standalone) build — input is the same `dev.html` entry.
 *
 *   vite build --config vite.single.config.ts
 *
 * Differences from the production build:
 *   - `format: 'iife'` because ES modules are blocked by CORS on file://
 *   - a huge assetsInlineLimit so the CEO portrait becomes a data URI
 *   - es2019 target for maximum standalone compatibility
 *   - a flat, deterministic output name that make-single.mjs can find
 */
export default defineConfig({
  // Matches vite.config.ts — everything here is inlined anyway, but keeping
  // them consistent avoids surprise if an asset ever exceeds the limit.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
    target: 'es2019',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: 'dev.html',
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
})
