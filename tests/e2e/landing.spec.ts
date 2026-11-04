import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  {
    path: '/',
    lang: 'en',
    workButton: 'See selected work',
    navWork: 'Work',
    navApproach: 'Approach',
    headings: ['Selected work', 'How I think & build', 'Big team. Small team.'],
    contact: 'Get in touch',
  },
  {
    path: '/cs/',
    lang: 'cs',
    workButton: 'Prohlédnout práci',
    navWork: 'Práce',
    navApproach: 'Přístup',
    headings: [
      'Vybraná práce',
      'Jak přemýšlím a tvořím',
      'Velký tým. Malý tým.',
    ],
    contact: 'Napište mi',
  },
]

for (const {
  path,
  lang,
  workButton,
  navWork,
  navApproach,
  headings,
  contact,
} of pages) {
  test.describe(`landing ${lang}`, () => {
    test('has one h1 with the claim and the section headings in order', async ({
      page,
    }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Think. Make. Rethink.',
      )
      await expect(page.getByRole('heading', { level: 2 })).toHaveText(headings)
      // Project names are third-level headings under the work section.
      await expect(page.getByRole('heading', { level: 3 })).toHaveText([
        'Kultomat',
        'Eucal',
        'Vladan Vaněk',
        'UpVideo',
        'Systerna',
        'Think',
        'Make',
        'Rethink',
        'Emplifi',
        'Freelance',
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
      await page.locator('#top').getByRole('link', { name: workButton }).click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
    })

    test('header link Work lands in the work section', async ({ page }) => {
      await page.goto(path)
      await page
        .getByRole('navigation', { name: lang === 'en' ? 'Main' : 'Hlavní' })
        .getByRole('link', {
          name: navWork,
        })
        .click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
      await expect(page.locator('#work')).toBeInViewport()
    })

    test('header link Approach lands in the approach section', async ({
      page,
    }) => {
      await page.goto(path)
      await page
        .getByRole('navigation', { name: lang === 'en' ? 'Main' : 'Hlavní' })
        .getByRole('link', { name: navApproach })
        .click()
      await expect(page).toHaveURL(/#approach$/)
      await expect(page.locator('#approach')).toBeFocused()
      await expect(page.locator('#approach')).toBeInViewport()
    })

    test('the English claim is marked as English on the Czech page', async ({
      page,
    }) => {
      await page.goto(path)
      const claims = page.locator('h1, #approach h3')
      expect(await claims.count()).toBe(4)
      for (const claim of await claims.all()) {
        if (lang === 'cs') await expect(claim).toHaveAttribute('lang', 'en')
        else await expect(claim).not.toHaveAttribute('lang')
      }
    })

    test('opening a section by its address focuses it', async ({ page }) => {
      for (const id of ['approach', 'experience']) {
        await page.goto(`${path}#${id}`)
        await expect(page.locator(`#${id}`)).toBeFocused()
      }
    })

    test('approach has three ordered steps and the AI disclosure', async ({
      page,
    }) => {
      await page.goto(path)
      const steps = page.locator('#approach').getByRole('listitem')
      await expect(steps).toHaveCount(3)
      await expect(steps.first()).toContainText('1/3')
      await expect(steps.last()).toContainText('3/3')
      await expect(page.locator('#approach')).toContainText(
        lang === 'en' ? 'AI + me' : 'AI a já',
      )
    })

    test('experience links back to the projects', async ({ page }) => {
      await page.goto(path)
      await page
        .locator('#experience')
        .getByRole('link', {
          name: lang === 'en' ? 'See the projects' : 'Prohlédnout projekty',
        })
        .click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
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
          name: navWork,
        })
        .click()
      await expect(page).toHaveURL(/#work$/)
      await expect(page.locator('#work')).toBeFocused()
    })

    test('project cards are not links yet and Systerna says in progress', async ({
      page,
    }) => {
      await page.goto(path)
      const work = page.locator('#work')
      await expect(work.getByRole('link')).toHaveCount(0)
      await expect(work.getByRole('listitem')).toHaveCount(4)
      await expect(
        work.getByRole('listitem').filter({ hasText: 'Systerna' }),
      ).toContainText(lang === 'en' ? 'In progress' : 'Rozpracováno')
    })

    test('the drum and card art are hidden from assistive technology', async ({
      page,
    }) => {
      await page.goto(path)
      // The drum panel and the cards' art carry no meaning of their own.
      await expect(page.locator('#top [aria-hidden="true"].drum')).toHaveCount(
        1,
      )
      await expect(
        page.locator('#work [aria-hidden="true"]').first(),
      ).toBeAttached()
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
