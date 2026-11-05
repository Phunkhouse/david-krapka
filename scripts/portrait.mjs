/* global console, document, Image */
// (document and Image run inside the page via page.evaluate.)
//
// Builds the About portrait assets from a source photo. Manual tool, not a
// pnpm script. The source photo is not committed (it carries camera
// metadata); only the generated files are, and they carry none (LEG-007).
//
//   node scripts/portrait.mjs <photo.jpg> [--x 0.052] [--y 0.2246] [--size 0.8333]
//
// --x, --y and --size place the square crop, as fractions of the photo's
// width (defaults: head and shoulders in David's 5 November 2026 photo).
//
// Writes to src/assets/portrait/:
//   portrait-ink.webp  640 × 640 (the crop's own resolution, 1.6× the 400 px
//                      portrait), the duotone ink layer: ink colour, its
//                      opacity taken from the photo's tone (dark = solid ink,
//                      the light wall = transparent, so the yellow paper shows)
//   portrait-pink.svg  the pink halftone copy (9 px dot grid on the 400 px
//                      design), misregistered behind the ink layer
// Both are used as CSS masks in About.astro; the colours come from tokens.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { extname } from 'node:path'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { chromium } from '@playwright/test'

const option = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? fallback : Number(process.argv[index + 1])
}
const photo = process.argv
  .slice(2)
  .find((arg, i, all) => !arg.startsWith('--') && !all[i - 1]?.startsWith('--'))
if (!photo) {
  console.error(
    'Usage: node scripts/portrait.mjs <photo.jpg> [--x] [--y] [--size]',
  )
  process.exit(2)
}

const crop = {
  x: option('x', 0.052),
  y: option('y', 0.2246),
  size: option('size', 0.8333),
}
const type = extname(photo).toLowerCase() === '.png' ? 'png' : 'jpeg'
const data = `data:image/${type};base64,${readFileSync(photo).toString('base64')}`
const out = 'src/assets/portrait'

const browser = await chromium.launch()
const page = await browser.newPage()
const result = await page.evaluate(
  async ({ data, crop }) => {
    const image = new Image()
    image.src = data
    await image.decode()
    const w = image.width
    const source = { x: crop.x * w, y: crop.y * w, size: crop.size * w }

    // Tone, read at the 400 px design size for the halftone and at 640 px
    // for the ink layer.
    const tone = (n) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = n
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(
        image,
        source.x,
        source.y,
        source.size,
        source.size,
        0,
        0,
        n,
        n,
      )
      const { data: px } = context.getImageData(0, 0, n, n)
      const lum = new Float32Array(n * n)
      for (let i = 0; i < n * n; i++) {
        lum[i] =
          (0.2126 * px[i * 4] +
            0.7152 * px[i * 4 + 1] +
            0.0722 * px[i * 4 + 2]) /
          255
      }
      return lum
    }
    // Levels: black and white points, then a gamma for the midtones.
    const level = (l, black, white, gamma) =>
      Math.pow(Math.min(1, Math.max(0, (l - black) / (white - black))), gamma)

    // Ink layer: ink colour, opacity = darkness.
    const N2 = 640
    const lum2 = tone(N2)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = N2
    const context = canvas.getContext('2d')
    const pixels = context.createImageData(N2, N2)
    for (let i = 0; i < N2 * N2; i++) {
      pixels.data[i * 4] = 27
      pixels.data[i * 4 + 1] = 47
      pixels.data[i * 4 + 2] = 122
      // 16 tone steps: WebP keeps alpha lossless, so fewer steps compress far
      // better, and the banding suits the print look.
      const alpha = 1 - level(lum2[i], 0.04, 0.84, 0.8)
      pixels.data[i * 4 + 3] = Math.round(alpha * 15) * 17
    }
    context.putImageData(pixels, 0, 0)
    const ink = canvas.toDataURL('image/webp', 0.82)

    // Pink copy: amplitude-modulated halftone on the 9 px design grid.
    const N = 400
    const grid = 9
    const lum = tone(N)
    let circles = ''
    for (let y = grid / 2; y < N; y += grid) {
      for (let x = grid / 2; x < N; x += grid) {
        let sum = 0
        let count = 0
        for (let yy = Math.floor(y - grid / 2); yy < y + grid / 2; yy++) {
          for (let xx = Math.floor(x - grid / 2); xx < x + grid / 2; xx++) {
            if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue
            sum += lum[yy * N + xx]
            count++
          }
        }
        const r = 5.6 * Math.sqrt(1 - level(sum / count, 0.05, 0.82, 0.7))
        if (r > 0.35)
          circles += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}"/>`
      }
    }
    const pink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N} ${N}">${circles}</svg>\n`
    return { ink, pink }
  },
  { data, crop },
)
await browser.close()

mkdirSync(out, { recursive: true })
writeFileSync(
  `${out}/portrait-ink.webp`,
  Buffer.from(result.ink.split(',')[1], 'base64'),
)
writeFileSync(`${out}/portrait-pink.svg`, result.pink)
console.log(`Wrote ${out}/portrait-ink.webp and ${out}/portrait-pink.svg`)
