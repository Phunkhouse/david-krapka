import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const site = 'https://david-krapka.eu'

const pages = [
  { path: '/', lang: 'en' },
  { path: '/cs/', lang: 'cs' },
]

for (const { path, lang } of pages) {
  test.describe(`${path}`, () => {
    test(`has lang="${lang}" and one h1`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    })

    test('has canonical and hreflang alternates', async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${site}${path}`,
      )
      await expect(
        page.locator('link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute('href', `${site}/`)
      await expect(
        page.locator('link[rel="alternate"][hreflang="cs"]'),
      ).toHaveAttribute('href', `${site}/cs/`)
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute('href', `${site}/`)
    })

    test('makes no request outside its own origin', async ({
      page,
      baseURL,
    }) => {
      const origin = new URL(baseURL!).origin
      const foreign: string[] = []
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.protocol.startsWith('http') && url.origin !== origin) {
          foreign.push(request.url())
        }
      })
      await page.goto(path, { waitUntil: 'networkidle' })
      expect(foreign).toEqual([])
    })

    test('stores nothing on the device (LEG-005)', async ({
      page,
      context,
    }) => {
      const response = await page.goto(path, { waitUntil: 'networkidle' })
      expect(response?.headers()['set-cookie']).toBeUndefined()
      expect(await context.cookies()).toEqual([])
      const storage = await page.evaluate(async () => ({
        local: localStorage.length,
        session: sessionStorage.length,
        indexedDB: (await indexedDB.databases()).length,
      }))
      expect(storage).toEqual({ local: 0, session: 0, indexedDB: 0 })
    })

    test('has no horizontal scroll at 320 px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 })
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })

    test('has no axe violations', async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    })
  })
}

test('unknown path shows the bilingual 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/')
  expect(response?.status()).toBe(404)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Page not found',
  )
  await expect(
    page.getByRole('link', { name: 'Go to the English home page' }),
  ).toHaveAttribute('href', '/')
  await expect(
    page.getByRole('link', { name: 'Přejít na českou úvodní stránku' }),
  ).toHaveAttribute('href', '/cs/')
})

test('sends the security headers from public/_headers', async ({ page }) => {
  const response = await page.goto('/')
  const headers = response!.headers()
  expect(headers['x-robots-tag']).toBe('noindex')
  expect(headers['x-content-type-options']).toBe('nosniff')
})
