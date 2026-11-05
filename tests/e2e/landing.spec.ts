import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  {
    path: '/',
    lang: 'en',
    workButton: 'See selected work',
    navWork: 'Work',
    navApproach: 'Approach',
    navAbout: 'About',
    navContact: 'Contact',
    subjects: ['Role: ', 'Project: '],
    headings: [
      'Selected work',
      'How I think & build',
      'Big team. Small team.',
      'Playful by design. Serious about the work.',
      "Let's work together.",
    ],
    contact: 'Get in touch',
  },
  {
    path: '/cs/',
    lang: 'cs',
    workButton: 'Prohlédnout práci',
    navWork: 'Práce',
    navApproach: 'Přístup',
    navAbout: 'O mně',
    navContact: 'Kontakt',
    subjects: ['Pozice: ', 'Projekt: '],
    headings: [
      'Vybraná práce',
      'Jak přemýšlím a tvořím',
      'Velký tým. Malý tým.',
      'Hravý v designu. Vážný v práci.',
      'Pojďme na to.',
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
  navAbout,
  navContact,
  subjects,
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
        lang === 'en' ? 'Hiring?' : 'Hledáte do týmu?',
        lang === 'en' ? 'Have a project?' : 'Máte projekt?',
      ])
    })

    test('hero buttons jump to the sections and move focus there', async ({
      page,
    }) => {
      await page.goto(path)
      await page.getByRole('link', { name: contact }).first().click()
      await expect(page).toHaveURL(/#contact$/)
      await expect(page.locator('#contact')).toBeFocused()

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

    test('header links About and Contact land in their sections', async ({
      page,
    }) => {
      const nav = () =>
        page.getByRole('navigation', {
          name: lang === 'en' ? 'Main' : 'Hlavní',
        })
      for (const [name, id] of [
        [navAbout, 'about'],
        [navContact, 'contact'],
      ]) {
        await page.goto(path)
        await nav().getByRole('link', { name }).click()
        await expect(page).toHaveURL(new RegExp(`#${id}$`))
        await expect(page.locator(`#${id}`)).toBeFocused()
      }
    })

    test('both contact cards open an email with a prefilled subject', async ({
      page,
    }) => {
      await page.goto(path)
      const links = page.locator('#contact .cards').getByRole('link')
      await expect(links).toHaveCount(2)
      for (const [index, subject] of subjects.entries()) {
        const href = (await links.nth(index).getAttribute('href')) ?? ''
        expect(href).toMatch(/^mailto:/)
        expect(href).toContain(`subject=${encodeURIComponent(subject)}`)
      }
    })

    test('states no prices, rates, terms or availability (LEG-001)', async ({
      page,
    }) => {
      await page.goto(path)
      // textContent, so the hidden .long/.short copy variants are covered too.
      const text = (await page.locator('main').textContent()) ?? ''
      const money = /[$€£]|\b(Kč|CZK|EUR|USD)\b/
      const words =
        /(?<!\p{L})(price|prices|pricing|fee|fees|budget|free|rate|rates|hourly|per hour|quote|availability|available|terms|honorář|rozpočet|zdarma|cena|ceny|ceník|sazba|sazby|hodinová|za hodinu|nabídka|dostupnost|volný|volná|podmínky)(?!\p{L})/iu
      expect(text).not.toMatch(money)
      expect(text).not.toMatch(words)
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

    test('the About portrait is an image with a name', async ({ page }) => {
      await page.goto(path)
      await expect(
        page.locator('#about').getByRole('img', {
          name:
            lang === 'en'
              ? 'Portrait of David Křapka'
              : 'Portrét Davida Křapky',
        }),
      ).toBeVisible()
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

    // The e2e build includes the draft Kultomat and Eucal case studies, so
    // their cards are the only links; case-study.spec.ts covers the links themselves.
    test('only published case studies are linked and Systerna says in progress', async ({
      page,
    }) => {
      await page.goto(path)
      const work = page.locator('#work')
      const prefix = lang === 'en' ? '/work/' : '/cs/work/'
      await expect(work.getByRole('link')).toHaveCount(2)
      await expect(work.getByRole('link').first()).toHaveAttribute(
        'href',
        `${prefix}kultomat/`,
      )
      await expect(work.getByRole('link').nth(1)).toHaveAttribute(
        'href',
        `${prefix}eucal/`,
      )
      await expect(work.getByRole('listitem')).toHaveCount(4)
      await expect(
        work.getByRole('listitem').filter({ hasText: 'Systerna' }),
      ).toContainText(lang === 'en' ? 'In progress' : 'Rozpracováno')
    })

    test('the drum and card art are hidden from assistive technology', async ({
      page,
    }) => {
      await page.goto(path)
      // The drum art and the cards' art carry no meaning of their own; the
      // pause control beside the drum stays outside the hidden part.
      await expect(
        page.locator('#top .drum > [aria-hidden="true"]'),
      ).toHaveCount(1)
      await expect(
        page.locator('#top [aria-hidden="true"] [data-pause]'),
      ).toHaveCount(0)
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
