import { expect, test, type Page } from '@playwright/test'

// Milestone 4, PR C: portrait glitch (G4) and the drifting dot circle.
// Waits are on conditions, never on time.

const pages = [
  { path: '/', stop: 'Stop the press', start: 'Start the press' },
  { path: '/cs/', stop: 'Zastavit tisk', start: 'Spustit tisk' },
]

/** Running animations whose target is inside the About portrait section. */
const running = (page: Page) =>
  page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.playState === 'running' &&
            (a.effect as KeyframeEffect | null)?.target?.closest('#about'),
        ).length,
  )

const display = (page: Page, selector: string) =>
  page.evaluate(
    (sel) => getComputedStyle(document.querySelector(sel)!).display,
    selector,
  )

const scrollToPortrait = (page: Page) =>
  page.evaluate(() =>
    document
      .querySelector('#about .portrait')!
      .scrollIntoView({ behavior: 'instant', block: 'center' }),
  )

for (const { path, stop, start } of pages) {
  test.describe(`portrait motion ${path}`, () => {
    test('the glitch layers loop and replace the static portrait', async ({
      page,
    }) => {
      await page.goto(path)
      await scrollToPortrait(page)
      expect(await display(page, '#about .glitch')).toBe('block')
      expect(await display(page, '#about svg')).toBe('none')
      // 6 strips × (strip + 2 inks) + scan bar + dot circle drift = 20; at
      // least 19 so one layer more or less does not break the test.
      await expect.poll(() => running(page)).toBeGreaterThanOrEqual(19)
    })

    test('loops hold while the portrait is off-screen', async ({ page }) => {
      await page.goto(path)
      // At the top of the page the About section is far below the viewport.
      await expect.poll(() => running(page)).toBe(0)
      await scrollToPortrait(page)
      await expect.poll(() => running(page)).toBeGreaterThan(0)
    })

    test('the one pause control stops the portrait too', async ({ page }) => {
      await page.goto(path)
      await page.getByRole('button', { name: stop }).click()
      await scrollToPortrait(page)
      await expect(page.locator('html')).toHaveClass(/paused/)
      await expect.poll(() => running(page)).toBe(0)

      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' }),
      )
      await page.getByRole('button', { name: start }).click()
      await scrollToPortrait(page)
      await expect.poll(() => running(page)).toBeGreaterThan(0)
    })

    test.describe('with reduced motion', () => {
      test.use({ reducedMotion: 'reduce' })

      test('the calm static portrait shows, with no scan bar', async ({
        page,
      }) => {
        await page.goto(path)
        await scrollToPortrait(page)
        expect(await display(page, '#about svg')).toBe('block')
        expect(await display(page, '#about .glitch')).toBe('none')
        expect(await running(page)).toBe(0)
      })

      test('starting the press switches to the glitch portrait', async ({
        page,
      }) => {
        await page.goto(path)
        await page.getByRole('button', { name: start }).click()
        await scrollToPortrait(page)
        expect(await display(page, '#about .glitch')).toBe('block')
        await expect.poll(() => running(page)).toBeGreaterThan(0)
      })
    })

    test.describe('without JavaScript', () => {
      test.use({ javaScriptEnabled: false })

      test('the portrait is the calm static one', async ({ page }) => {
        await page.goto(path)
        expect(await display(page, '#about svg')).toBe('block')
        expect(await display(page, '#about .glitch')).toBe('none')
      })
    })
  })
}
