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
    expect(person.sameAs).toEqual([
      'https://www.linkedin.com/in/david-krapka/',
      'https://github.com/Phunkhouse',
    ])
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

for (const { path, file, alt } of [
  { path: '/', file: 'site-en.png', alt: 'product-minded engineer' },
  { path: '/cs/', file: 'site-cs.png', alt: 'inženýr s produktovým myšlením' },
  { path: '/privacy/', file: 'site-en.png', alt: 'product-minded engineer' },
]) {
  test(`${path} shares the site preview image for its language`, async ({
    page,
    request,
  }) => {
    await page.goto(path)
    const meta = (property: string) =>
      page.locator(`meta[property="${property}"]`).getAttribute('content')
    expect(await meta('og:image')).toBe(`${site}/og/${file}`)
    expect(await meta('og:image:width')).toBe('1200')
    expect(await meta('og:image:height')).toBe('630')
    expect(await meta('og:image:alt')).toContain(alt)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )

    // The file exists and really is a 1200 × 630 PNG (size from its IHDR).
    const response = await request.get(`/og/${file}`)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
    const png = await response.body()
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
  })
}

test('icons and the web manifest are served', async ({ page, request }) => {
  await page.goto('/')
  const links = await page
    .locator(
      'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]',
    )
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    )
  expect(links).toEqual(
    expect.arrayContaining([
      '/favicon.ico',
      '/favicon.svg',
      '/apple-touch-icon.png',
      '/site.webmanifest',
    ]),
  )
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    '#1B2F7A',
  )
  await expect(
    page.locator('meta[name="apple-mobile-web-app-title"]'),
  ).toHaveAttribute('content', 'David Křapka')

  for (const [path, type] of [
    ['/favicon.ico', 'image/'],
    ['/favicon.svg', 'image/svg+xml'],
    ['/apple-touch-icon.png', 'image/png'],
    ['/icon-192.png', 'image/png'],
    ['/icon-512.png', 'image/png'],
  ] as const) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()['content-type'], path).toContain(type)
  }

  const manifest = await (await request.get('/site.webmanifest')).json()
  expect(manifest.icons.map((icon: { src: string }) => icon.src)).toEqual([
    '/icon-192.png',
    '/icon-512.png',
  ])
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status()).toBe(200)
  }
})

test('the háček mark sits beside the name in the header and footer', async ({
  page,
}) => {
  await page.goto('/')
  const header = page.locator('.site-header .wordmark svg.mark')
  await expect(header).toHaveAttribute('aria-hidden', 'true')
  await expect(header).toHaveJSProperty('clientWidth', 48)
  await expect(page.locator('.site-footer svg.mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  // The link is still named by its text, not by the decoration.
  await expect(
    page.locator('.site-header').getByRole('link', { name: /David Křapka/ }),
  ).toHaveCount(1)

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(header).toHaveJSProperty('clientWidth', 40)
})

// Case studies use their project's preview image (src/assets/work/) as
// og:image, in both languages.
for (const slug of ['kultomat', 'eucal', 'vladan-vanek', 'upvideo']) {
  for (const prefix of ['', '/cs']) {
    test(`${prefix}/work/${slug}/ shares the project preview image`, async ({
      page,
      request,
    }) => {
      await page.goto(`${prefix}/work/${slug}/`)
      const meta = (property: string) =>
        page.locator(`meta[property="${property}"]`).getAttribute('content')
      const image = (await meta('og:image'))!
      expect(image).toMatch(
        new RegExp(`^${site}/_astro/${slug}\\.[\\w-]+\\.jpg$`),
      )
      expect(await meta('og:image:width')).toBe('1200')
      expect(await meta('og:image:height')).toBe('630')
      expect(await meta('og:image:alt')).toBeTruthy()

      const response = await request.get(image.slice(site.length))
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('image/jpeg')
      const jpeg = await response.body()
      // Size from the start-of-frame marker: height, then width.
      let offset = 2
      while (
        jpeg[offset] === 0xff &&
        ![0xc0, 0xc1, 0xc2].includes(jpeg[offset + 1]!)
      ) {
        offset += 2 + jpeg.readUInt16BE(offset + 2)
      }
      expect([
        jpeg.readUInt16BE(offset + 7),
        jpeg.readUInt16BE(offset + 5),
      ]).toEqual([1200, 630])
    })
  }
}
