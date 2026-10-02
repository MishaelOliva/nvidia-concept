/**
 * Folds the built app.js + app.css into one self-contained HTML document.
 *
 * Run via `npm run build` (which chains `vite build` for both configs).
 *
 * Writes two identical files:
 *   dist-single/nvidia-standalone.html
 *   index.html                     <- the double-clickable entry point
 *
 * Why a script and not a Vite plugin: the output document must be written to
 * the project root as well as the build dir, and it has to be a plain classic
 * <script> (no `type="module"`) or Chrome's file:// CORS rules will block it.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dir = join(root, 'dist-single')

const js = readFileSync(join(dir, 'app.js'), 'utf8')
const css = readFileSync(join(dir, 'app.css'), 'utf8')

// Fail loudly rather than shipping a file that 404s offline.
const dangling = [...js.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g)].map((m) => m[1])
if (dangling.length > 0) {
  console.error(
    'make-single: these assets were not inlined, the page will break under file://:\n  ' +
      dangling.join('\n  '),
  )
  process.exit(1)
}

/* Lift the document head straight out of the Vite entry rather than
   hand-copying it. A hand-maintained copy had already drifted out of sync
   (losing og:image and the twitter tags) and dropped the fonts.gstatic.com
   preconnect, which is render-blocking for the webfont. */
const entry = readFileSync(join(dir, 'dev.html'), 'utf8')

const headOf = (html) => {
  const m = html.match(/<head>([\s\S]*?)<\/head>/i)
  if (!m) throw new Error('make-single: no <head> found in dist-single/dev.html')
  return m[1]
}

const takeLinks = (head, pattern) => (head.match(pattern) || []).join('\n    ')

// Preconnects + webfont stylesheet. Includes both googleapis and gstatic.
const headLinks = takeLinks(
  headOf(entry),
  /<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g,
)

/* NOTE: og:image is deliberately NOT copied. Vite rewrites the entry's
   `/assets/ceo-portrait-900.jpg` to the full inlined data URI (~142 kB of
   base64), so carrying it over duplicated the entire portrait in the output.
   The standalone is a local file where social previews are moot anyway. */
const metaTags = takeLinks(
  headOf(entry),
  /<meta\s+(?:name|property)="(?!og:image)[^"]+"[^>]*>/g,
)

const title = entry.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? 'NVIDIA'

if (!/fonts\.googleapis\.com/.test(headLinks)) {
  console.error(
    'make-single: no Google Fonts <link> found in dist-single/dev.html.\n' +
      '  The standalone file would render in system-ui instead of Archivo/Inter.',
  )
  process.exit(1)
}

const doc = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#000000" />
    <title>${title}</title>
    ${metaTags}
    ${headLinks}
    <style>${css}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${js}</script>
  </body>
</html>
`

for (const out of [join(dir, 'nvidia-standalone.html'), join(root, 'index.html')]) {
  writeFileSync(out, doc, 'utf8')
  const kb = (Buffer.byteLength(doc, 'utf8') / 1024).toFixed(0)
  console.log(`standalone build: ${out.replace(root + '\\', '')}  (${kb} kB)`)
}
