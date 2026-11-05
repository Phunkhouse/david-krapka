// Lists every square-bracket placeholder ("[Role]", "[20XX – 20XX]") in the
// built pages, per page. Run after `pnpm build`:
//
//   pnpm placeholders          report only, exit 0
//   pnpm placeholders --fail   exit 1 when any remain (the milestone 6
//                              production check will use this)
//
// It reads the visible text and link addresses of each HTML file in dist/.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'

const root = 'dist'
const fail = process.argv.includes('--fail')
const pattern = /\[[^\][]{2,}\]/g

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

function found(html) {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
  const hrefs = [...text.matchAll(/href="([^"]*)"/g)].map((m) => m[1])
  const visible = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
  return [
    ...visible.matchAll(pattern),
    ...hrefs.join(' ').matchAll(pattern),
  ].map((m) => m[0].replace(/\s+/g, ' '))
}

let total = 0
let files
try {
  files = htmlFiles(root).sort()
} catch {
  process.stderr.write('No dist/ directory: run `pnpm build` first.\n')
  process.exit(2)
}

for (const file of files) {
  const items = found(readFileSync(file, 'utf8'))
  if (items.length === 0) continue
  total += items.length
  const counts = new Map()
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1)
  process.stdout.write(`\n${relative(root, file)} (${items.length})\n`)
  for (const [item, count] of counts) {
    process.stdout.write(`  ${item}${count > 1 ? `  ×${count}` : ''}\n`)
  }
}

process.stdout.write(
  `\n${total} placeholder${total === 1 ? '' : 's'} in ${files.length} pages.\n`,
)
if (fail && total > 0) process.exit(1)
