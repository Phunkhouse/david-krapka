import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  globalIgnores([
    'dist/**',
    '.astro/**',
    '.wrangler/**',
    'docs/**',
    'playwright-report/**',
    'test-results/**',
    'blob-report/**',
  ]),
])
