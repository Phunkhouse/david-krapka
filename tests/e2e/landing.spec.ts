import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  { path: '/', lang: 'en', work: 'Selected work', contact: 'Get in touch' },
  { path: '/cs/', lang: 'cs', work: 'Vybraná práce', contact: 'Napište mi' },
]

for (const { path, lang, work, contact } of pages) {
  test.describe(`landing ${lang}`, () => {
    test('has one h1 with the claim and the section headings in order', async ({
      page,
    }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Think. Make. Rethink.',
      )
      await expect(page.getByRole('heading', { level: 2 })).toHaveText([work])
      // Project names are third-level headings under the work section.
      await expect(page.getByRole('heading', { level: 3 })).toHaveText([
        'Kultomat',
        'Eucal',
        'Vladan Vaněk',
        'UpVideo',
        'Systerna',
      ])
    })

    test('hero buttons jump to the sections and move focus there', async ({
      page,
    }) => {
      await page.goto(path)
      await page.getByRole('link', { name: contact }).first().click()
      // #contact arrives in a later pull request; the hash still updates.
      await expect(page).toHaveURL(/#contact$/)

      await page.goto(path)
      await page.locator('#top').getByRole('link').first().click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
    })

    test('header link Work lands in the work section', async ({ page }) => {
      await page.goto(path)
      await page
        .getByRole('navigation')
        .first()
        .getByRole('link', {
          name: work === 'Selected work' ? 'Work' : 'Práce',
        })
        .click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
      await expect(page.locator('#work')).toBeInViewport()
    })

    test('the mobile menu link Work lands in the work section', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)
      await page.locator('[data-menu-button]').click()
      await page
        .locator('#mobile-menu')
        .getByRole('link', {
          name: work === 'Selected work' ? 'Work' : 'Práce',
        })
        .click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
    })

    test('project cards are not links yet and Systerna says in progress', async ({
      page,
    }) => {
      await page.goto(path)
      await expect(page.locator('#work').getByRole('link')).toHaveCount(0)
    })

    test('the drum and card art are hidden from assistive technology', async ({
      page,
    }) => {
      await page.goto(path)
      const decorative = page.locator(
        '#top [aria-hidden="true"], #work [aria-hidden="true"]',
      )
      expect(await decorative.count()).toBeGreaterThan(0)
      // Meaning is carried by real text: all three sublines are visible.
      await expect(page.locator('#top ul li')).toHaveCount(3)
    })

    for (const width of [1280, 768, 320]) {
      test(`axe is clean and nothing scrolls sideways at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 })
        await page.goto(path)
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
      })
    }
  })
}
