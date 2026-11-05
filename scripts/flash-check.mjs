/* global console, document, window, Image */
// (document, window and Image run inside the page via page.evaluate.)
// Approximate WCAG 2.3.1 (three flashes or below threshold) check for looping
// motion. Manual tool, not a pnpm script, and not a certified analyser such as
// PEAT or IRIS: use it to find problems early and to record margins.
//
//   node scripts/flash-check.mjs <url> <selector> [--width 1440] [--seconds 14]
//   (options may come before or after the url and selector)
//
// Example (serve the site first, for example `pnpm preview:cloudflare`):
//   node scripts/flash-check.mjs http://127.0.0.1:8788/ "#about .portrait"
//
// How it works: it opens the page, scrolls the element into view, then steps
// every animation on the page to successive 1/60 s frames (animations are
// held, so timing is exact), captures the element's region for each frame and
// compares consecutive frames pixel by pixel in relative luminance (WCAG
// definition). A pixel counts as changed when its luminance moves by 0.1 or
// more. A frame step counts as a "change" in one direction when the changed
// area is at least the general flash area threshold (341 × 256 px, from the
// WCAG technique G176 reference of a 1024 × 768 screen). Opposing changes in
// a row are flashes. It prints the worst 1 s window, once with the area
// threshold and once with a quarter of it (a safety margin), plus the largest
// changed areas. Saturated red flashes (R / (R+G+B) ≥ 0.8) do not
// occur in the palette (pink is about 0.5), so they are not measured.
import process from 'node:process'
import { chromium } from '@playwright/test'

// Positional arguments are the ones that are not options or option values.
const positional = process.argv
  .slice(2)
  .filter(
    (arg, i, all) => !arg.startsWith('--') && !all[i - 1]?.startsWith('--'),
  )
const [url, selector] = positional
const option = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? fallback : Number(process.argv[index + 1])
}
const width = option('width', 1440)
const seconds = option('seconds', 14)
const fps = 60
const AREA = 341 * 256

if (!url || !selector) {
  console.error('Usage: node scripts/flash-check.mjs <url> <selector>')
  process.exit(2)
}

const browser = await chromium.launch()
const page = await (
  await browser.newContext({ viewport: { width, height: 900 } })
).newPage()
await page.goto(url)
if ((await page.locator(selector).count()) === 0) {
  console.error(`No element matches ${selector} on ${url}`)
  process.exit(2)
}
await page.evaluate((sel) => {
  document
    .querySelector(sel)
    .scrollIntoView({ behavior: 'instant', block: 'center' })
  // Hold everything so frames are exact (the page's own loops, not the clock).
  document.documentElement.classList.add('paused')
  window.__prev = null
  window.__ups = []
  window.__downs = []
  window.__luminance = async (dataUrl) => {
    const image = new Image()
    image.src = dataUrl
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(image, 0, 0)
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
    const linear = (c) => {
      const v = c / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    const lum = new Float32Array(data.length / 4)
    for (let i = 0; i < lum.length; i++) {
      lum[i] =
        0.2126 * linear(data[i * 4]) +
        0.7152 * linear(data[i * 4 + 1]) +
        0.0722 * linear(data[i * 4 + 2])
    }
    if (window.__prev) {
      let up = 0
      let down = 0
      for (let i = 0; i < lum.length; i++) {
        const d = lum[i] - window.__prev[i]
        if (d >= 0.1) up++
        else if (d <= -0.1) down++
      }
      window.__ups.push(up)
      window.__downs.push(down)
    }
    window.__prev = lum
  }
}, selector)

const box = await page.locator(selector).boundingBox()
const clip = {
  x: Math.max(0, box.x - 20),
  y: Math.max(0, box.y - 20),
  width: box.width + 40,
  height: box.height + 40,
}

const frames = seconds * fps
for (let frame = 0; frame <= frames; frame++) {
  await page.evaluate(
    (t) => {
      document.getAnimations().forEach((a) => {
        a.currentTime = t
      })
    },
    (frame * 1000) / fps,
  )
  const png = await page.screenshot({ clip })
  await page.evaluate(
    (b64) => window.__luminance(`data:image/png;base64,${b64}`),
    png.toString('base64'),
  )
}

const { ups, downs } = await page.evaluate(() => ({
  ups: window.__ups,
  downs: window.__downs,
}))
await browser.close()

/** Worst number of flashes (pairs of opposing changes) in any 1 s window. */
function worstFlashes(threshold) {
  const changes = ups.map((up, i) =>
    up >= threshold && up >= downs[i] ? 1 : downs[i] >= threshold ? -1 : 0,
  )
  const events = changes
    .map((sign, frame) => ({ sign, frame }))
    .filter((e) => e.sign !== 0)
  let worst = 0
  for (let start = 0; start < events.length; start++) {
    let opposing = 0
    let last = events[start].sign
    for (let i = start + 1; i < events.length; i++) {
      if (events[i].frame - events[start].frame >= fps) break
      if (events[i].sign !== last) {
        opposing++
        last = events[i].sign
      }
    }
    worst = Math.max(worst, opposing)
  }
  // A flash is a pair of opposing changes.
  return Math.ceil(worst / 2)
}

const max = (values) => values.reduce((a, b) => Math.max(a, b), 0)
console.log(
  JSON.stringify(
    {
      url,
      selector,
      viewportWidth: width,
      regionPx: `${Math.round(clip.width)} × ${Math.round(clip.height)}`,
      frames,
      fps,
      areaThresholdPx: AREA,
      largestAreaBrighterPx: max(ups),
      largestAreaDarkerPx: max(downs),
      worstFlashesPerSecondAtAreaThreshold: worstFlashes(AREA),
      worstFlashesPerSecondAtQuarterArea: worstFlashes(AREA / 4),
      limit: 3,
    },
    null,
    2,
  ),
)
