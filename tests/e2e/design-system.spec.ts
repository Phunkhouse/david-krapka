import { expect, test } from '@playwright/test'

// Site-wide design system checks on real pages. Focus checks are in
// shell.spec.ts. The temporary /specimen/ page was removed in milestone 6.

test('self-hosted fonts load from the site itself', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
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
      // Space Mono 400 is not used on the landing page since the hero eyebrow
      // and the footer tagline were removed.
      'Space Mono 700',
    ]),
  )
})

test('the removed specimen page is a 404', async ({ request }) => {
  const response = await request.get('/specimen/')
  expect(response.status()).toBe(404)
})

test('font licences ship with the site (LEG-008)', async ({ request }) => {
  for (const family of ['Rubik', 'Sora', 'SpaceMono']) {
    const response = await request.get(`/fonts/licenses/${family}-OFL.txt`)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('SIL Open Font License')
  }
})

for (const path of [
  '/',
  '/cs/',
  '/privacy/',
  '/missing-page/',
  '/work/kultomat/',
  '/cs/work/kultomat/',
]) {
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
