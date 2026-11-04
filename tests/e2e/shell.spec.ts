import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ink = 'rgb(27, 47, 122)'
const yellow = 'rgb(255, 232, 0)'
const pages = ['/', '/cs/', '/privacy/', '/cs/privacy/', '/missing-page/']
const mobile = { width: 390, height: 844 }

async function storageIsEmpty(page: Page) {
  expect(await page.context().cookies()).toEqual([])
  const storage = await page.evaluate(async () => ({
    local: localStorage.length,
    session: sessionStorage.length,
    indexedDB: (await indexedDB.databases()).length,
  }))
  expect(storage).toEqual({ local: 0, session: 0, indexedDB: 0 })
}

test.describe('language switcher', () => {
  const pairs = [
    { from: '/', to: '/cs/', label: /Česky/ },
    { from: '/cs/', to: '/', label: /English/ },
    { from: '/privacy/', to: '/cs/privacy/', label: /Česky/ },
    { from: '/cs/privacy/', to: '/privacy/', label: /English/ },
  ]

  for (const { from, to, label } of pairs) {
    test(`links ${from} to ${to} and stores nothing`, async ({ page }) => {
      await page.goto(from)
      const header = page.getByRole('banner')
      const switcher = header.getByRole('group', {
        name: /Language|Jazyk/,
      })
      await expect(
        switcher.getByRole('link', { name: /EN|CS/, exact: false }),
      ).toHaveCount(2)
      await expect(switcher.locator('[aria-current="page"]')).toHaveCount(1)
      await switcher.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(to)
      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        to.startsWith('/cs/') ? 'cs' : 'en',
      )
      await storageIsEmpty(page)
    })
  }
})

test.describe('footer', () => {
  test('links to the privacy notice in the current language', async ({
    page,
  }) => {
    for (const [path, name, href] of [
      ['/', 'Privacy', '/privacy/'],
      ['/cs/', 'Soukromí', '/cs/privacy/'],
    ]) {
      await page.goto(path)
      await expect(
        page.getByRole('contentinfo').getByRole('link', { name }),
      ).toHaveAttribute('href', href)
    }
  })

  test('shows no business identification while it is empty (LEG-002)', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('.site-footer .business')).toHaveCount(0)
  })

  test('privacy pages are placeholders the launch check will catch', async ({
    page,
  }) => {
    for (const path of ['/privacy/', '/cs/privacy/']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.getByRole('main')).toContainText('[')
    }
  })
})

test.describe('focus ring', () => {
  test('is ink in the header and yellow in the footer', async ({ page }) => {
    await page.goto('/')
    const cases = [
      {
        link: page.getByRole('banner').getByRole('link', { name: 'Work' }),
        color: ink,
      },
      {
        link: page.getByRole('contentinfo').getByRole('link', { name: 'Work' }),
        color: yellow,
      },
    ]
    for (const { link, color } of cases) {
      await link.focus()
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Tab')
      await expect(link).toBeFocused()
      await expect(link).toHaveCSS('outline-color', color)
      await expect(link).toHaveCSS('outline-width', '3px')
    }
  })

  test('keyboard reaches the skip link, header and footer links', async ({
    page,
  }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('link', { name: 'Skip to content' }),
    ).toBeFocused()
    const reached = new Set<string>()
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const label = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        return el
          ? `${el.closest('header, footer, main')?.tagName}:${el.innerText.trim()}`
          : ''
      })
      reached.add(label)
    }
    for (const label of ['HEADER:Work', 'HEADER:Contact', 'FOOTER:PRIVACY']) {
      expect([...reached]).toContain(label)
    }
  })
})

test.describe('mobile menu', () => {
  test.use({ viewport: mobile })

  test('opens, closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: 'Open menu' })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    const close = page.getByRole('button', { name: 'Close menu' })
    await expect(close).toHaveAttribute('aria-expanded', 'true')
    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('link', { name: /Approach/ })).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(menu.getByRole('link', { name: /Work/ })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(button).toBeFocused()
    await storageIsEmpty(page)
  })

  test('closes when a menu link is chosen', async ({ page }) => {
    await page.goto('/cs/')
    await page.getByRole('button', { name: 'Otevřít menu' }).click()
    await page
      .locator('#mobile-menu')
      .getByRole('link', { name: /Kontakt/ })
      .click()
    await expect(page.locator('#mobile-menu')).toBeHidden()
    await expect(page).toHaveURL('/cs/#contact')
  })

  test('hides the desktop navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.desktop-nav')).toBeHidden()
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: mobile })

  test('the menu link jumps to the footer navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveCount(0)
    const fallback = page.getByRole('link', { name: 'Menu' })
    await expect(fallback).toHaveAttribute('href', '#footer-nav')
    await fallback.click()
    await expect(page).toHaveURL('/#footer-nav')
    await expect(
      page
        .getByRole('navigation', { name: 'Footer' })
        .getByRole('link', { name: 'Work' }),
    ).toBeVisible()
  })
})

for (const path of pages) {
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 320, height: 640 },
  ]) {
    test(`${path} at ${viewport.width} px: no axe violations, no horizontal scroll`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    })
  }
}

test('the open mobile menu has no axe violations', async ({ page }) => {
  await page.setViewportSize(mobile)
  await page.goto('/cs/')
  await page.getByRole('button', { name: 'Otevřít menu' }).click()
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
