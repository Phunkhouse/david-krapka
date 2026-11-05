import { expect, test, type Page } from '@playwright/test'

// Milestone 4, PR B: approach section develops once on scroll and reacts to
// hover; smooth anchor scrolling. Waits are on conditions, never on time.

const paths = ['/', '/cs/']

const scrollTo = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      document
        .querySelector(sel)!
        .scrollIntoView({ behavior: 'instant', block: 'center' }),
    selector,
  )

/** Resolves when the approach's one-time animations have finished. */
const developed = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) =>
          (a.effect as KeyframeEffect | null)?.target?.closest('#approach'),
        )
        .map((a) => a.finished),
    ).then(() => true),
  )

const style = (page: Page, selector: string, property: string) =>
  page.evaluate(
    ([sel, prop]) =>
      getComputedStyle(document.querySelector(sel)!).getPropertyValue(prop),
    [selector, property] as const,
  )

for (const path of paths) {
  test.describe(`approach motion ${path}`, () => {
    test('starts undeveloped, develops once when scrolled into view', async ({
      page,
    }) => {
      await page.goto(path)
      const section = page.locator('#approach')
      await expect(section).toHaveAttribute('data-develop', 'armed')
      expect(await style(page, '#approach .letter--0', '--r')).toBe('0px')
      expect(await style(page, '#approach .col h3', 'opacity')).toBe('0')

      await scrollTo(page, '#approach .columns')
      await expect(section).toHaveAttribute('data-develop', 'play')
      await developed(page)
      // Dot radius reaches the design value (2.2 px at 1280 px) and the text shows.
      expect(await style(page, '#approach .letter--0', '--r')).toBe('2.2px')
      expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
      expect(await style(page, '#approach .letter--pink', 'opacity')).toBe(
        '0.3',
      )
    })

    test('plays only once per page view', async ({ page }) => {
      await page.goto(path)
      await scrollTo(page, '#approach .columns')
      await expect(page.locator('#approach')).toHaveAttribute(
        'data-develop',
        'play',
      )
      await developed(page)
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' }),
      )
      await scrollTo(page, '#approach .columns')
      await expect(page.locator('#approach')).toHaveAttribute(
        'data-develop',
        'play',
      )
      const running = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) =>
                a.playState === 'running' &&
                (a.effect as KeyframeEffect | null)?.target?.closest(
                  '#approach',
                ),
            ).length,
      )
      // Nothing in the approach restarts.
      expect(running).toBe(0)
      expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
    })

    test('landing on the section address shows it developed', async ({
      page,
    }) => {
      await page.goto(`${path}#approach`)
      await expect(page.locator('#approach')).toHaveAttribute(
        'data-develop',
        'play',
      )
      await developed(page)
      expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
    })

    test('the pause control does not stop the one-time develop', async ({
      page,
    }) => {
      await page.goto(path)
      await page.locator('[data-pause]').click()
      await scrollTo(page, '#approach .columns')
      await expect(page.locator('#approach')).toHaveAttribute(
        'data-develop',
        'play',
      )
      await developed(page)
      expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
    })

    test('hovering a column turns it yellow and lifts its letter', async ({
      page,
    }) => {
      await page.goto(path)
      await scrollTo(page, '#approach .columns')
      await developed(page)
      const cols = page.locator('#approach .col')
      await cols.nth(0).hover()
      await expect
        .poll(() =>
          cols.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor),
        )
        .toBe('rgb(255, 232, 0)')
      await expect
        .poll(() =>
          cols.nth(2).evaluate((el) => getComputedStyle(el).backgroundColor),
        )
        .toBe('rgb(250, 250, 247)')
      await expect
        .poll(() => style(page, '#approach .letter--0', 'translate'))
        .toBe('0px -36px')
    })

    test('smooth anchor scrolling is on', async ({ page }) => {
      await page.goto(path)
      expect(await style(page, 'html', 'scroll-behavior')).toBe('smooth')
    })

    test.describe('with reduced motion', () => {
      test.use({ reducedMotion: 'reduce' })

      test('shows the developed state with nothing animating', async ({
        page,
      }) => {
        await page.goto(path)
        await expect(page.locator('#approach')).not.toHaveAttribute(
          'data-develop',
          /.+/,
        )
        await scrollTo(page, '#approach .columns')
        expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
        expect(await style(page, '#approach .letter--0', '--r')).toBe('2.2px')
        expect(
          await page.evaluate(
            () =>
              document.getAnimations().filter((a) => a.playState === 'running')
                .length,
          ),
        ).toBe(0)
        expect(await style(page, 'html', 'scroll-behavior')).toBe('auto')
      })

      test('hover changes the colour but does not move the letter', async ({
        page,
      }) => {
        await page.goto(path)
        await scrollTo(page, '#approach .columns')
        await page.locator('#approach .col').nth(0).hover()
        await expect
          .poll(() =>
            page
              .locator('#approach .col')
              .nth(0)
              .evaluate((el) => getComputedStyle(el).backgroundColor),
          )
          .toBe('rgb(255, 232, 0)')
        expect(await style(page, '#approach .letter--0', 'translate')).toBe(
          'none',
        )
      })
    })

    test.describe('without JavaScript', () => {
      test.use({ javaScriptEnabled: false })

      test('the section is static and fully shown', async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('#approach')).not.toHaveAttribute(
          'data-develop',
          /.+/,
        )
        expect(await style(page, '#approach .col h3', 'opacity')).toBe('1')
      })
    })
  })
}
