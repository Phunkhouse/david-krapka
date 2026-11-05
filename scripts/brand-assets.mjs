/* global console, document */
// Builds the favicons and the site-wide social preview images from the
// canvas design (page "Logo & favicon": boards Favicon-Set and OG-Site,
// OG-Site-CS). Manual tool, not a pnpm script; run it again when the mark,
// the name, the role or the claim changes.
//
//   node scripts/brand-assets.mjs
//
// Writes to public/:
//   favicon.svg            the mark, vector
//   favicon.ico            16, 32 and 48 px PNGs inside one icon file
//   apple-touch-icon.png   180 px, square (iOS rounds the corners itself and
//                          would turn transparent corners black)
//   icon-192.png, icon-512.png   for site.webmanifest
//   og/site-en.png, og/site-cs.png   1200 × 630 social preview images
//
// Text comes from the dictionaries and the fonts from the committed subset
// files, so the images match the site. Chromium writes PNGs without camera
// or location metadata (LEG-007).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import { chromium } from '@playwright/test'
import { en } from '../src/i18n/en.ts'
import { cs } from '../src/i18n/cs.ts'

const ink = '#1B2F7A'
const yellow = '#FFE800'
const pink = '#FF48B0'
const paper = '#FAFAF7'
const hacek = 'M22 38 L50 66 L78 38'

/** The favicon drawing (Favicon-Set board). `rounded: false` for iOS. */
const markSvg = ({ rounded = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
  `<rect width="100" height="100"${rounded ? ' rx="22"' : ''} fill="${yellow}"/>` +
  `<path d="${hacek}" transform="translate(5 5)" stroke="${pink}" stroke-width="20" fill="none"/>` +
  `<path d="${hacek}" stroke="${ink}" stroke-width="20" fill="none"/>` +
  `</svg>\n`

const font = (file) =>
  `data:font/woff2;base64,${readFileSync(`src/assets/fonts/${file}`).toString('base64')}`

/** The social preview image (OG-Site board), one per language. */
const ogHtml = (lang, copy) => {
  const [think, make, rethink] = copy.home.hero.heading
  const highlight = copy.home.hero.highlight
  const rest = rethink.slice(highlight.length)
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:Rubik;font-weight:900;src:url(${font('rubik-site-900-normal.woff2')})}
@font-face{font-family:Sora;font-weight:700;src:url(${font('sora-site-700-normal.woff2')})}
@font-face{font-family:'Space Mono';font-weight:700;src:url(${font('space-mono-site-700-normal.woff2')})}
*{box-sizing:border-box}
body{margin:0}
.og{width:1200px;height:630px;background:${paper};color:${ink};font-family:Sora;display:grid;grid-template-columns:520px minmax(0,1fr);border:6px solid ${ink}}
.art{border-right:3px solid ${ink};background-color:${yellow};background-image:radial-gradient(rgba(27,47,122,.10) 2px,transparent 2.4px);background-size:12px 12px;display:flex;align-items:center;justify-content:center}
.art svg{width:470px;height:470px;margin-top:-40px}
.text{padding:56px;display:flex;flex-direction:column;justify-content:space-between}
.mono{font-family:'Space Mono';font-weight:700}
.role{font-size:16px;letter-spacing:.08em;text-transform:uppercase}
.middle{display:flex;flex-direction:column;gap:26px}
.name{display:flex;flex-direction:column;font-family:Rubik;font-weight:900;font-size:112px;line-height:.98;text-transform:uppercase;letter-spacing:-.035em;text-shadow:6px 5px 0 rgba(255,72,176,.55)}
.claim{font-size:30px;font-weight:700;line-height:1.3}
.claim span{background:${yellow};padding:0 3px}
.url{font-size:18px}
</style></head><body>
<div class="og">
  <div class="art"><svg viewBox="0 0 100 100">
    <defs><pattern id="ht" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r="1.3" fill="${ink}"/></pattern></defs>
    <path d="${hacek}" transform="translate(4 4)" stroke="${pink}" stroke-width="18" fill="none" stroke-opacity="0.8"/>
    <path d="${hacek}" stroke="url(#ht)" stroke-width="18" fill="none"/>
  </svg></div>
  <div class="text">
    <span class="mono role">${copy.site.role}</span>
    <div class="middle">
      <span class="name">${copy.site.name
        .split(' ')
        .map((word) => `<span>${word}</span>`)
        .join('')}</span>
      <span class="claim">${think} ${make} <span>${highlight}</span>${rest}</span>
    </div>
    <span class="mono url">david-krapka.eu</span>
  </div>
</div></body></html>`
}

/**
 * An .ico file with PNG images inside (supported by every current browser).
 * Layout: 6-byte header, one 16-byte entry per image, then the PNG data.
 */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // no palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)])
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function renderSvg(svg, size) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<!doctype html><style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  )
  return page.screenshot({ omitBackground: true, type: 'png' })
}

mkdirSync('public/og', { recursive: true })

writeFileSync('public/favicon.svg', markSvg())
const small = []
for (const size of [16, 32, 48]) {
  small.push({ size, png: await renderSvg(markSvg(), size) })
}
writeFileSync('public/favicon.ico', ico(small))
writeFileSync(
  'public/apple-touch-icon.png',
  await renderSvg(markSvg({ rounded: false }), 180),
)
for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, await renderSvg(markSvg(), size))
}

await page.setViewportSize({ width: 1200, height: 630 })
for (const [lang, copy] of [
  ['en', en],
  ['cs', cs],
]) {
  await page.setContent(ogHtml(lang, copy))
  await page.evaluate(() => document.fonts.ready)
  writeFileSync(
    `public/og/site-${lang}.png`,
    await page.screenshot({ type: 'png' }),
  )
}

await browser.close()
console.log('Wrote favicons, app icons and social preview images to public/.')
