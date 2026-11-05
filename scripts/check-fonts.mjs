// Fails when a built page shows a character the site fonts were not built for.
// Such a character would silently render in a fallback font. Run after
// `pnpm build` (it is part of `pnpm verify`):
//
//   pnpm check:fonts
//
// The allowed set is src/assets/fonts/charset.json, written by
// scripts/subset-fonts.py. To fix a failure, run that script again (steps in
// src/assets/fonts/README.md), commit the new font files and charset.json.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'

const root = 'dist'
const allowed = new Set(
  JSON.parse(readFileSync('src/assets/fonts/charset.json', 'utf8')).characters,
)

const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body) => {
    if (body[0] === '#') {
      const code =
        body[1].toLowerCase() === 'x'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10)
      return String.fromCodePoint(code)
    }
    return named[body.toLowerCase()] ?? whole
  })
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory()
      ? htmlFiles(path)
      : name.endsWith('.html')
        ? [path]
        : []
  })
}

// Text a visitor can see, plus data-text (drawn with CSS content).
function shownText(html) {
  const body = html
    .replace(/<head[\s\S]*?<\/head>/, ' ')
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
  const dataText = [...body.matchAll(/data-text="([^"]*)"/g)].map((m) => m[1])
  return decode(body.replace(/<[^>]*>/g, ' ') + ' ' + dataText.join(' '))
}

let problems = 0
let files
try {
  files = htmlFiles(root).sort()
} catch {
  process.stderr.write('No dist/ directory: run `pnpm build` first.\n')
  process.exit(2)
}

for (const file of files) {
  const missing = new Map()
  for (const char of new Set(shownText(readFileSync(file, 'utf8')))) {
    if (/\s/.test(char) && char !== ' ') continue
    // Headings are uppercased by CSS: the upper and lower case forms must be
    // covered too.
    for (const form of new Set([
      char,
      char.toUpperCase(),
      char.toLowerCase(),
    ])) {
      if (form.length === 1 && !allowed.has(form)) {
        missing.set(
          form,
          `U+${form.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
        )
      }
    }
  }
  if (missing.size === 0) continue
  problems += missing.size
  process.stderr.write(
    `${relative(root, file)}: not in the site fonts: ${[...missing].map(([c, u]) => `${c} (${u})`).join(', ')}\n`,
  )
}

if (problems > 0) {
  process.stderr.write(
    '\nThese characters would render in a fallback font. Regenerate the fonts: see src/assets/fonts/README.md (scripts/subset-fonts.py).\n',
  )
  process.exit(1)
}
process.stdout.write(
  `Fonts cover every character in ${files.length} built pages.\n`,
)
