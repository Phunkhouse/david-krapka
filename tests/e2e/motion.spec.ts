import { expect, test, type Page } from '@playwright/test'

// Milestone 4, PR A: hero print drum and the pause control.
// Animation state is read from the Web Animations API; waits are on
// conditions (expect.poll), never on fixed time.

const pages = [
  { path: '/', stop: 'Stop the press', start: 'Start the press' },
  { path: '/cs/', stop: 'Zastavit tisk', start: 'Spustit tisk' },
]

const running = (page: Page) =>
  page.evaluate(
    () =>
      document.getAnimations().filter((a) => a.playState === 'running').length,
  )

/** Running animations whose target is inside the element `selector`. */
const runningIn = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.playState === 'running' &&
            (a.effect as KeyframeEffect | null)?.target?.closest(sel),
        ).length,
    selector,
  )

const animated = (page: Page) =>
  page.evaluate(() => document.getAnimations().length)

async function storageIsEmpty(page: Page) {
  expect(await page.context().cookies()).toEqual([])
  const storage = await page.evaluate(async () => ({
    local: localStorage.length,
    session: sessionStorage.length,
    indexedDB: (await indexedDB.databases()).length,
  }))
  expect(storage).toEqual({ local: 0, session: 0, indexedDB: 0 })
}

for (const { path, stop, start } of pages) {
  test.describe(`motion ${path}`, () => {
    test.describe('with motion allowed', () => {
      test('the drum, words and counter loop', async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('html')).toHaveClass(/motion/)
        // turn, 3 kicks, sheet, 3 heading lines, 3 sublines
        await expect.poll(() => running(page)).toBeGreaterThanOrEqual(11)
      })

      test('the pause control stops and restarts every loop, by keyboard', async ({
        page,
      }) => {
        await page.goto(path)
        const control = page.getByRole('button', { name: stop })
        await expect(control).toBeVisible()
        await control.focus()
        await page.keyboard.press('Enter')

        await expect(page.getByRole('button', { name: start })).toBeVisible()
        await expect.poll(() => running(page)).toBe(0)
        // Held in place, not removed.
        expect(await animated(page)).toBeGreaterThan(0)

        await page.keyboard.press('Space')
        await expect(page.getByRole('button', { name: stop })).toBeVisible()
        await expect.poll(() => running(page)).toBeGreaterThan(0)
      })

      test('the pause control comes before the hero text and buttons', async ({
        page,
      }) => {
        await page.goto(path)
        const before = await page.evaluate(() => {
          const control = document.querySelector('[data-pause]')!
          const hero = document.querySelector('#top .text')!
          return !!(
            control.compareDocumentPosition(hero) &
            Node.DOCUMENT_POSITION_FOLLOWING
          )
        })
        expect(before).toBe(true)
      })

      test('using the control stores nothing on the device', async ({
        page,
      }) => {
        await page.goto(path)
        await page.getByRole('button', { name: stop }).click()
        await page.getByRole('button', { name: start }).click()
        await storageIsEmpty(page)
      })

      test('loops hold while the hero is off-screen', async ({ page }) => {
        await page.goto(path)
        await expect.poll(() => runningIn(page, '#top')).toBeGreaterThan(0)
        await page.evaluate(() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'instant',
          }),
        )
        await expect.poll(() => runningIn(page, '#top')).toBe(0)
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        )
        await expect.poll(() => runningIn(page, '#top')).toBeGreaterThan(0)
      })

      test('scrolling back does not restart a press the visitor stopped', async ({
        page,
      }) => {
        await page.goto(path)
        await page.getByRole('button', { name: stop }).click()
        await page.evaluate(() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'instant',
          }),
        )
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        )
        await expect(page.getByRole('button', { name: start })).toBeVisible()
        await expect.poll(() => running(page)).toBe(0)
      })

      // The motion hero reserves one heading line and two subline lines.
      // A longer copy or a narrow screen must not overflow that space.
      for (const width of [320, 390, 1100]) {
        test(`headline and sublines fit their reserved space at ${width} px`, async ({
          page,
        }) => {
          await page.setViewportSize({ width, height: 800 })
          await page.goto(path)
          const fit = await page.evaluate(() => {
            const box = (el: Element) => el.getBoundingClientRect()
            const h1 = box(document.querySelector('#top h1')!)
            const sub = box(document.querySelector('#top .sublines')!)
            const lines = [...document.querySelectorAll('#top .line')]
            const items = [...document.querySelectorAll('#top .sublines li')]
            return {
              // Compare layout boxes: transforms of the cross-fade are ignored
              // by offset sizes, so read those.
              lineHeights: lines.map((el) => (el as HTMLElement).offsetHeight),
              lineRight: Math.max(
                ...lines.map(
                  (el) =>
                    (el as HTMLElement).offsetLeft +
                    (el as HTMLElement).offsetWidth,
                ),
              ),
              itemHeights: items.map((el) => (el as HTMLElement).offsetHeight),
              h1: { width: h1.width, height: h1.height },
              subHeight: sub.height,
              viewport: window.innerWidth,
              scrollX: document.documentElement.scrollWidth,
            }
          })
          for (const height of fit.lineHeights) {
            expect(height).toBeLessThanOrEqual(fit.h1.height + 1)
          }
          expect(fit.lineRight).toBeLessThanOrEqual(fit.viewport)
          for (const height of fit.itemHeights) {
            expect(height).toBeLessThanOrEqual(fit.subHeight + 1)
          }
          expect(fit.scrollX).toBeLessThanOrEqual(fit.viewport)
        })
      }

      test('the claim is still whole text for assistive technology', async ({
        page,
      }) => {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          'Think. Make. Rethink.',
        )
        await expect(page.locator('#top .sublines li')).toHaveCount(3)
      })
    })

    test.describe('with reduced motion', () => {
      test.use({ reducedMotion: 'reduce' })

      test('nothing runs and the static hero is shown', async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('html')).not.toHaveClass(/motion/)
        await expect(page.getByRole('button', { name: start })).toBeVisible()
        expect(await running(page)).toBe(0)
        // The static hero shows all three words and sublines.
        const opacities = await page.$$eval(
          '#top .line, #top .sublines li',
          (els) => els.map((el) => getComputedStyle(el).opacity),
        )
        expect(opacities).toHaveLength(6)
        expect(new Set(opacities)).toEqual(new Set(['1']))
      })

      test('the visitor can start the press for this page view', async ({
        page,
      }) => {
        await page.goto(path)
        await page.getByRole('button', { name: start }).click()
        await expect(page.getByRole('button', { name: stop })).toBeVisible()
        await expect.poll(() => running(page)).toBeGreaterThan(0)
        await storageIsEmpty(page)

        await page.getByRole('button', { name: stop }).click()
        await expect.poll(() => running(page)).toBe(0)
      })
    })

    test.describe('without JavaScript', () => {
      test.use({ javaScriptEnabled: false })

      test('the page is static and offers no pause control', async ({
        page,
      }) => {
        await page.goto(path)
        await expect(page.locator('html')).not.toHaveClass(/motion/)
        await expect(page.locator('[data-pause]')).toBeHidden()
        expect(await running(page)).toBe(0)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          'Think. Make. Rethink.',
        )
      })
    })
  })
}
