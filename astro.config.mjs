// @ts-check
import mdx from '@astrojs/mdx'
import { defineConfig, fontProviders } from 'astro/config'

/**
 * @typedef {{
 *   src: [string]
 *   weight: number
 *   style: 'normal'
 *   display: 'swap'
 * }} LocalVariant
 */

/**
 * Local font variants: one @font-face per weight, one small file each with
 * only the characters the site can show (src/assets/fonts/README.md,
 * decision 0010). A character outside the file falls back to the next font.
 * @param {string} file file name prefix, e.g. "sora"
 * @param {[number, ...number[]]} weights
 * @returns {[LocalVariant, ...LocalVariant[]]}
 */
function variants(file, weights) {
  /** @type {LocalVariant[]} */
  const list = weights.map((weight) => ({
    src: /** @type {[string]} */ ([
      `./src/assets/fonts/${file}-site-${weight}-normal.woff2`,
    ]),
    weight,
    style: /** @type {const} */ ('normal'),
    display: /** @type {const} */ ('swap'),
  }))
  return /** @type {[LocalVariant, ...LocalVariant[]]} */ (list)
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://david-krapka.eu',
  output: 'static',
  trailingSlash: 'always',
  // Inline the small stylesheets so first paint does not wait for them.
  build: { inlineStylesheets: 'always' },
  // Case studies are MDX files in a content collection (decision 0011).
  integrations: [mdx()],
  // English at the root, Czech under /cs/ (decision 0005).
  i18n: {
    locales: ['en', 'cs'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // Content-Security-Policy <meta> with hashes for every inline style and
  // script Astro renders. Directives a <meta> CSP cannot carry
  // (frame-ancestors) are sent as a header from public/_headers, which also
  // repeats object-src and base-uri on purpose, so they apply even without
  // the <meta>. Scripts injected by Cloudflare (Web Analytics, Rocket Loader,
  // email obfuscation) would be blocked silently: keep those features off or
  // add their hashes or origins here.
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
        // No forms on the site; loosen this if a contact form is ever added.
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
