import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The specimen page is temporary (removed before launch, milestone 6).
// Focus checks now run against the real shell (shell.spec.ts).

test('self-hosted fonts load from the site itself', async ({ page }) => {
  await page.goto('/specimen/', { waitUntil: 'networkidle' })
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts]
      .filter((font) => font.status === 'loaded')
      .map((font) => `${font.family.split('-')[0]} ${font.weight}`)
  })
  expect(loaded).toEqual(
    expect.arrayContaining([
      'Rubik 900',
      'Sora 400',
      'Sora 600',
      'Sora 700',
      'Space Mono 400',
      'Space Mono 700',
    ]),
  )
})

test('specimen is noindex and has no axe violations', async ({ page }) => {
  await page.goto('/specimen/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  )
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('font licences ship with the site (LEG-008)', async ({ request }) => {
  for (const family of ['Rubik', 'Sora', 'SpaceMono']) {
    const response = await request.get(`/fonts/licenses/${family}-OFL.txt`)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('SIL Open Font License')
  }
})

for (const path of ['/', '/cs/', '/specimen/', '/missing-page/']) {
  test(`no Content-Security-Policy violations on ${path}`, async ({ page }) => {
    const violations: string[] = []
    page.on('console', (message) => {
      if (message.text().includes('Content Security Policy')) {
        violations.push(message.text())
      }
    })
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (event) => {
        console.error(
          `Content Security Policy: ${event.violatedDirective} ${event.blockedURI}`,
        )
      })
    })
    const response = await page.goto(path, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    expect(response?.headers()['content-security-policy']).toContain(
      "frame-ancestors 'none'",
    )
    await expect(
      page.locator('meta[http-equiv="content-security-policy"]'),
    ).toHaveCount(1)
    expect(violations).toEqual([])
  })
}
