import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The tests run on a build with drafts (playwright.config.ts), where
// Kultomat (long form) and Eucal (short form) exist as drafts with
// placeholder text only.
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
      await expect(
        page.locator('article.featured').getByText(v.more, { exact: true }),
      ).toBeVisible()
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
      // Facts panel: the schema's required facts, plus stack and live site.
      const facts = page.getByRole('region', {
        name: /Project facts|Fakta o projektu/,
      })
      await expect(facts.locator('dt')).toHaveCount(7)
      await expect(
        facts.getByRole('link', { name: 'kultomat.cz ↗' }),
      ).toHaveAttribute('href', 'https://kultomat.cz')
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

test('cards without a built case study are not links', async ({ page }) => {
  await page.goto('/')
  const work = page.getByRole('region', { name: 'Selected work' })
  await expect(work.getByRole('link', { name: 'Eucal' })).toHaveAttribute(
    'href',
    '/work/eucal/',
  )
  for (const name of ['Vladan Vaněk', 'UpVideo', 'Systerna']) {
    await expect(work.getByRole('link', { name })).toHaveCount(0)
    await expect(work.getByRole('heading', { name })).toBeVisible()
  }
})

test.describe('case study template', () => {
  test('long form: numbered sections and an "On this page" list on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/work/kultomat/')
    const toc = page.getByRole('navigation', { name: 'On this page' })
    await expect(toc.getByRole('link')).toHaveCount(8)
    const sections = page.locator('.prose > h2')
    await expect(sections).toHaveCount(8)
    // The chip is CSS-generated: 01 … 08.
    const chip = await sections
      .nth(7)
      .evaluate((h) => getComputedStyle(h, '::before').content)
    expect(chip).toBe('counter(section, decimal-leading-zero)')
    await toc.getByRole('link', { name: /What I would rethink/ }).click()
    await expect(page).toHaveURL(/#what-i-would-rethink$/)
    await expect(sections.nth(7)).toBeInViewport()
  })

  test('long form: no "On this page" list below 1100 px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/work/kultomat/')
    await expect(
      page.getByRole('navigation', { name: 'On this page' }),
    ).toBeHidden()
  })

  test('short form: no contents list and no stack row', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/work/eucal/')
    await expect(
      page.getByRole('navigation', { name: 'On this page' }),
    ).toHaveCount(0)
    const facts = page.getByRole('region', { name: 'Project facts' })
    await expect(facts.getByText('Built with')).toHaveCount(0)
    await expect(page.locator('.prose > h2')).toHaveCount(5)
  })

  test('content blocks render with their labels', async ({ page }) => {
    await page.goto('/cs/work/kultomat/')
    await expect(
      page.getByRole('region', { name: /^Rozhodnutí 1:/ }),
    ).toContainText('Zvolil jsem')
    await expect(page.getByRole('region', { name: 'AI + me' })).toContainText(
      'S čím pomohla AI',
    )
    await expect(page.locator('figcaption').first()).toContainText('Obr. 1 ·')
    await expect(page.getByText(/^Zdroj:/)).toHaveCount(1)
  })

  const order = [
    ['/work/kultomat/', '/work/eucal/', 'Eucal'],
    ['/work/eucal/', '/work/kultomat/', 'Kultomat'],
    ['/cs/work/kultomat/', '/cs/work/eucal/', 'Eucal'],
  ] as const
  for (const [from, to, name] of order) {
    test(`"Next project" on ${from} goes to ${to}`, async ({ page }) => {
      await page.goto(from)
      const next = page.getByRole('region', {
        name: /Next project|Další projekt/,
      })
      await next.getByRole('link', { name }).click()
      await expect(page).toHaveURL(to)
    })
  }

  test('images have fixed dimensions and alternative text', async ({
    page,
  }) => {
    for (const path of ['/work/kultomat/', '/work/eucal/']) {
      await page.goto(path)
      for (const img of await page.locator('main img').all()) {
        await expect(img).toHaveAttribute('width', /\d+/)
        await expect(img).toHaveAttribute('height', /\d+/)
        await expect(img).toHaveAttribute('alt', /\S/)
      }
      for (const figure of await page.locator('[role="img"]').all()) {
        await expect(figure).toHaveAttribute('aria-label', /\S/)
      }
    }
  })

  test('no layout shift while the page loads', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/work/kultomat/', { waitUntil: 'networkidle' })
    const shift = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              total += (entry as unknown as { value: number }).value
            }
          }).observe({ type: 'layout-shift', buffered: true })
          requestAnimationFrame(() =>
            requestAnimationFrame(() => resolve(total)),
          )
        }),
    )
    expect(shift).toBeLessThanOrEqual(0.05)
  })

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/cs/work/kultomat/')
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${site}/cs/work/kultomat/`,
    )
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'cs_CZ',
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Kultomat',
    )
  })

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 320, height: 640 },
  ]) {
    test(`/work/eucal/ at ${viewport.width} px: no axe violations, no horizontal scroll`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/work/eucal/')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    })
  }
})

test('an unknown case study is a 404', async ({ page }) => {
  for (const path of ['/work/not-a-project/', '/cs/work/not-a-project/']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
  }
})
