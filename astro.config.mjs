// @ts-check
import { defineConfig } from 'astro/config'

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
})
