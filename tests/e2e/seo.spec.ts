import { expect, test } from '@playwright/test'

// Search and sharing basics (milestone 6 PR A). The Playwright build includes
// drafts, so the sitemap lists the draft case studies here; a build without
// drafts is checked by `pnpm check:drafts`, which fails on any /work/ link.

const site = 'https://david-krapka.eu'

test('robots.txt allows everything and points to the sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const text = await response.text()
  expect(text).toContain('User-agent: *')
  expect(text).toContain('Allow: /')
  expect(text).toContain(`Sitemap: ${site}/sitemap.xml`)
})

test('sitemap lists every page in both languages, and each one exists', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('xml')
  const xml = await response.text()

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!)
  const paths = locs.map((loc) => {
    expect(loc.startsWith(`${site}/`)).toBe(true)
    return loc.slice(site.length)
  })
  expect(paths).toEqual(
    expect.arrayContaining([
      '/',
      '/cs/',
      '/privacy/',
      '/cs/privacy/',
      '/work/kultomat/',
      '/cs/work/kultomat/',
    ]),
  )
  expect(new Set(paths).size).toBe(paths.length)
  expect(paths).not.toContain('/specimen/')

  // Every <url> carries en, cs and x-default alternates.
  const urls = xml.match(/<url>[\s\S]*?<\/url>/g) ?? []
  expect(urls).toHaveLength(paths.length)
  for (const url of urls) {
    for (const lang of ['en', 'cs', 'x-default']) {
      expect(url).toContain(`hreflang="${lang}"`)
    }
  }

  for (const path of paths) {
    const page = await request.get(path)
    expect(page.status(), path).toBe(200)
  }
})

for (const { path, lang, ogLocale, alternate } of [
  { path: '/', lang: 'en', ogLocale: 'en_GB', alternate: 'cs_CZ' },
  { path: '/cs/', lang: 'cs', ogLocale: 'cs_CZ', alternate: 'en_GB' },
]) {
  test(`${path} has Open Graph tags and a Person schema`, async ({ page }) => {
    await page.goto(path)
    const og = (property: string) =>
      page.locator(`meta[property="${property}"]`)
    await expect(og('og:type')).toHaveAttribute('content', 'website')
    await expect(og('og:url')).toHaveAttribute('content', `${site}${path}`)
    await expect(og('og:locale')).toHaveAttribute('content', ogLocale)
    await expect(og('og:locale:alternate')).toHaveAttribute(
      'content',
      alternate,
    )
    await expect(og('og:title')).toHaveAttribute('content', await page.title())
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    await expect(og('og:description')).toHaveAttribute('content', description!)

    const schema = page.locator('script[type="application/ld+json"]')
    await expect(schema).toHaveCount(1)
    const person = JSON.parse((await schema.textContent())!)
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'David Křapka',
      url: `${site}${path}`,
    })
    expect(person.jobTitle).toBeTruthy()
    await expect(page.locator('html')).toHaveAttribute('lang', lang)
  })
}

test('case studies keep their article Open Graph tags', async ({ page }) => {
  await page.goto('/work/kultomat/')
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'article',
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    `${site}/work/kultomat/`,
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveCount(1)
})

test('the 404 page has no Open Graph or canonical tags', async ({ page }) => {
  await page.goto('/missing-page/')
  await expect(page.locator('meta[property^="og:"]')).toHaveCount(0)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})
