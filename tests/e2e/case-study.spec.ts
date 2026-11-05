import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The tests run on a build with drafts (playwright.config.ts), where the
// Kultomat entry exists as a draft with placeholder text.
const site = 'https://david-krapka.eu'
const lift = 'matrix(1, 0, 0, 1, -4, -4)'

const versions = [
  {
    lang: 'en',
    landing: '/',
    path: '/work/kultomat/',
    other: '/cs/work/kultomat/',
    switchTo: /Česky/,
    back: '← Selected work',
    more: 'Read the case study →',
  },
  {
    lang: 'cs',
    landing: '/cs/',
    path: '/cs/work/kultomat/',
    other: '/work/kultomat/',
    switchTo: /English/,
    back: '← Vybraná práce',
    more: 'Přečíst případovou studii →',
  },
]

for (const v of versions) {
  test.describe(`case study ${v.path}`, () => {
    test('is linked from the landing card and opens the page', async ({
      page,
    }) => {
      await page.goto(v.landing)
      const link = page
        .getByRole('region', { name: /Selected work|Vybraná práce/ })
        .getByRole('link', { name: 'Kultomat' })
      await expect(link).toHaveAttribute('href', v.path)
      await expect(page.getByText(v.more, { exact: true })).toBeVisible()
      await link.click()
      await expect(page).toHaveURL(v.path)
    })

    test('has the right language, one h1 and the project facts', async ({
      page,
    }) => {
      const response = await page.goto(v.path)
      expect(response?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', v.lang)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Kultomat',
      )
      // Required facts from the schema: role, collaborators and AI share.
      await expect(page.locator('dl dt')).toHaveCount(5)
      await expect(page.getByRole('link', { name: v.back })).toHaveAttribute(
        'href',
        `${v.landing}#work`,
      )
    })

    test('has canonical and hreflang alternates', async ({ page }) => {
      await page.goto(v.path)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${site}${v.path}`,
      )
      await expect(
        page.locator('link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute('href', `${site}/work/kultomat/`)
      await expect(
        page.locator('link[rel="alternate"][hreflang="cs"]'),
      ).toHaveAttribute('href', `${site}/cs/work/kultomat/`)
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute('href', `${site}/work/kultomat/`)
    })

    test('the language switcher goes to the same case study', async ({
      page,
    }) => {
      await page.goto(v.path)
      await page
        .getByRole('banner')
        .getByRole('link', { name: v.switchTo })
        .click()
      await expect(page).toHaveURL(v.other)
    })

    test('stores nothing and makes no foreign request', async ({
      page,
      baseURL,
      context,
    }) => {
      const origin = new URL(baseURL!).origin
      const foreign: string[] = []
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.protocol.startsWith('http') && url.origin !== origin) {
          foreign.push(request.url())
        }
      })
      const response = await page.goto(v.path, { waitUntil: 'networkidle' })
      expect(response?.headers()['set-cookie']).toBeUndefined()
      expect(foreign).toEqual([])
      expect(await context.cookies()).toEqual([])
      const storage = await page.evaluate(async () => ({
        local: localStorage.length,
        session: sessionStorage.length,
        indexedDB: (await indexedDB.databases()).length,
      }))
      expect(storage).toEqual({ local: 0, session: 0, indexedDB: 0 })
    })

    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 768, height: 1024 },
      { width: 320, height: 640 },
    ]) {
      test(`at ${viewport.width} px: no axe violations, no horizontal scroll`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport)
        await page.goto(v.path)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
      })
    }

    test('works without JavaScript', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()
      await page.goto(v.landing)
      await page
        .getByRole('region', { name: /Selected work|Vybraná práce/ })
        .getByRole('link', { name: 'Kultomat' })
        .click()
      await expect(page).toHaveURL(v.path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Kultomat',
      )
      await context.close()
    })

    test('the landing card lifts on hover and on keyboard focus', async ({
      page,
    }) => {
      await page.goto(v.landing)
      const card = page.locator('article.featured')
      const link = card.getByRole('link', { name: 'Kultomat' })
      await expect(card).not.toHaveCSS('transform', lift)

      await card.hover()
      await expect(card).toHaveCSS('transform', lift)

      await page.mouse.move(0, 0)
      await expect(card).not.toHaveCSS('transform', lift)

      await page.keyboard.press('Tab') // make focus-visible apply
      await link.focus()
      await expect(card).toHaveCSS('transform', lift)
    })

    test('the card lift has no transition under reduced motion', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(v.landing)
      const card = page.locator('article.featured')
      await expect(card).toHaveCSS('transition-property', 'none')
      await card.hover()
      await expect(card).toHaveCSS('transform', lift)
    })
  })
}

test('the other cards without a published case study are not links', async ({
  page,
}) => {
  await page.goto('/')
  const work = page.getByRole('region', { name: 'Selected work' })
  for (const name of ['Eucal', 'Vladan Vaněk', 'UpVideo', 'Systerna']) {
    await expect(work.getByRole('link', { name })).toHaveCount(0)
    await expect(work.getByRole('heading', { name })).toBeVisible()
  }
})

test('an unknown case study is a 404', async ({ page }) => {
  for (const path of ['/work/not-a-project/', '/cs/work/not-a-project/']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
  }
})
