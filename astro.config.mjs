// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

// Unicode ranges of the Fontsource "latin" and "latin-ext" subsets.
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'

/**
 * @typedef {{
 *   src: [string]
 *   weight: number
 *   style: 'normal'
 *   display: 'swap'
 *   unicodeRange: [string]
 * }} LocalVariant
 */

/**
 * Local font variants: one @font-face per weight and subset, files in
 * src/assets/fonts/ (decision 0009).
 * @param {string} file file name prefix, e.g. "sora"
 * @param {[number, ...number[]]} weights
 * @returns {[LocalVariant, ...LocalVariant[]]}
 */
function variants(file, weights) {
  const subsets = [
    ['latin', LATIN],
    ['latin-ext', LATIN_EXT],
  ]
  /** @type {LocalVariant[]} */
  const list = weights.flatMap((weight) =>
    subsets.map(([subset, range]) => ({
      src: /** @type {[string]} */ ([
        `./src/assets/fonts/${file}-${subset}-${weight}-normal.woff2`,
      ]),
      weight,
      style: /** @type {const} */ ('normal'),
      display: /** @type {const} */ ('swap'),
      unicodeRange: /** @type {[string]} */ ([range]),
    })),
  )
  return /** @type {[LocalVariant, ...LocalVariant[]]} */ (list)
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://david-krapka.eu',
  output: 'static',
  trailingSlash: 'always',
  // English at the root, Czech under /cs/ (decision 0005).
  i18n: {
    locales: ['en', 'cs'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // Content-Security-Policy <meta> with hashes for every inline style and
  // script Astro renders. Directives a <meta> CSP cannot carry
  // (frame-ancestors) are sent as a header from public/_headers.
  // No code blocks on the site; Shiki's inline styles would conflict with CSP.
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Rubik',
      cssVariable: '--font-display',
      fallbacks: ['sans-serif'],
      options: { variants: variants('rubik', [900]) },
    },
    {
      provider: fontProviders.local(),
      name: 'Sora',
      cssVariable: '--font-body',
      fallbacks: ['sans-serif'],
      options: { variants: variants('sora', [400, 600, 700]) },
    },
    {
      provider: fontProviders.local(),
      name: 'Space Mono',
      cssVariable: '--font-mono',
      fallbacks: ['monospace'],
      options: { variants: variants('space-mono', [400, 700]) },
    },
  ],
})
