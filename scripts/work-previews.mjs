/* global console, document */
// Builds the project preview images from the canvas design (page "Selected
// work previews": boards Prev-Kultomat, Prev-Eucal, Prev-VladanVanek and
// Prev-UpVideo). Manual tool, not a pnpm script.
//
//   node scripts/work-previews.mjs <screenshot-dir>
//
// <screenshot-dir> holds one screenshot of each project's home page, named
// kultomat.jpg, eucal.jpg, vladan-vanek.jpg and upvideo.jpg (the canvas has
// them as uploaded assets). The screenshots are not committed; only the
// composed images are.
//
// Writes src/assets/work/<slug>.jpg, 1200 × 630: the project's letter art,
// with the screenshot in a print-style browser window on top. The landing
// cards show them (cropped to the card) and the case study pages use them as
// their social preview image. Chromium writes JPEGs without camera or
// location metadata (LEG-007); run `exiftool` on a screenshot first if you
// start from a phone capture.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { chromium } from '@playwright/test'

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node scripts/work-previews.mjs <screenshot-dir>')
  process.exit(2)
}

const ink = '#1B2F7A'
const paper = '#FAFAF7'
const yellow = '#FFE800'
const pink = '#FF48B0'
const tint = '#E9ECF7'

// Per project, as on the canvas boards: background, extra shape, the colour
// behind the screenshot (shows only if it does not cover the window).
const projects = [
  {
    slug: 'kultomat',
    letter: 'K',
    url: 'kultomat.cz',
    background: 'paper',
    windowBackground: ink,
    // Kultomat keeps its pink misregistered copy of the letter.
    back: `<span class="letter" style="left:44px;top:-120px;color:${pink};mix-blend-mode:multiply;opacity:.5">K</span>`,
    front: { left: 30, top: -130 },
  },
  {
    slug: 'eucal',
    letter: 'E',
    url: 'eucal.cz/en',
    background: 'tint',
    windowBackground: paper,
    shape: `<span style="position:absolute;right:48px;top:26px;width:230px;height:230px;border-radius:50%;background:${yellow}"></span>`,
    front: { left: 30, top: -130 },
  },
  {
    slug: 'vladan-vanek',
    letter: 'V',
    url: 'vladanvanek.cz',
    background: 'paper',
    windowBackground: paper,
    front: { left: 30, top: -130 },
  },
  {
    slug: 'upvideo',
    letter: 'U',
    url: 'upvideo.cz',
    background: 'tint',
    windowBackground: ink,
    shape: `<span style="position:absolute;right:40px;bottom:34px;width:0;height:0;border-left:150px solid ${pink};border-top:90px solid transparent;border-bottom:90px solid transparent;mix-blend-mode:multiply;opacity:.8"></span>`,
    front: { left: 30, top: -130 },
  },
]

const font = (file) =>
  `data:font/woff2;base64,${readFileSync(`src/assets/fonts/${file}`).toString('base64')}`

const html = (project, screenshot) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:Rubik;font-weight:900;src:url(${font('rubik-site-900-normal.woff2')})}
@font-face{font-family:'Space Mono';font-weight:700;src:url(${font('space-mono-site-700-normal.woff2')})}
*{box-sizing:border-box}
body{margin:0}
.scene{position:relative;width:1200px;height:630px;overflow:hidden;color:${ink};${
  project.background === 'paper'
    ? `background-color:${yellow};background-image:radial-gradient(rgba(27,47,122,.10) 2px,transparent 2.4px);background-size:12px 12px`
    : `background:${tint}`
}}
.letter{position:absolute;font-family:Rubik;font-weight:900;text-transform:uppercase;font-size:780px;line-height:1}
.halftone{color:transparent;-webkit-background-clip:text;background-clip:text;background-image:radial-gradient(${ink} 3.4px,transparent 3.8px);background-size:11px 11px}
.window{position:absolute;left:190px;top:82px;width:820px;height:466px;border:3px solid ${ink};background:${project.windowBackground};box-shadow:14px 14px 0 ${pink};display:flex;flex-direction:column;overflow:hidden}
.bar{flex:0 0 auto;height:44px;border-bottom:3px solid ${ink};background:${paper};display:flex;align-items:center;gap:8px;padding:0 16px}
.dot{width:12px;height:12px;border-radius:50%;border:2.5px solid ${ink}}
.dot.on{background:${pink};border:0}
.address{margin-left:18px;width:360px;height:26px;border:2px solid ${ink};border-radius:999px;display:flex;align-items:center;padding:0 14px;font-family:'Space Mono';font-weight:700;font-size:14px}
.page{flex:1 1 auto;position:relative;min-height:0}
.page img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
</style></head><body>
<div class="scene">
${project.back ?? ''}
<span class="letter halftone" style="left:${project.front.left}px;top:${project.front.top}px">${project.letter}</span>
${project.shape ?? ''}
<div class="window">
  <div class="bar"><span class="dot on"></span><span class="dot"></span><span class="dot"></span><span class="address">${project.url}</span></div>
  <div class="page"><img alt="" src="${screenshot}"></div>
</div>
</div></body></html>`

mkdirSync('src/assets/work', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})
for (const project of projects) {
  const file = join(dir, `${project.slug}.jpg`)
  const screenshot = `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`
  await page.setContent(html(project, screenshot))
  await page.evaluate(() => document.fonts.ready)
  const out = `src/assets/work/${project.slug}.jpg`
  writeFileSync(out, await page.screenshot({ type: 'jpeg', quality: 90 }))
  console.log(`Wrote ${out}`)
}
await browser.close()
