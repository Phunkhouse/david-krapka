// Fails when a draft case study leaked into a build made without drafts.
//
//   pnpm build && pnpm check:drafts
//
// Draft case studies are built only with SHOW_DRAFTS=1 or on a Cloudflare
// Workers Builds branch other than main (src/content/load.ts). A normal
// build, as in `pnpm verify` and CI, must contain no case study page and no
// link to one. With drafts switched on the check does nothing.
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

const { SHOW_DRAFTS, WORKERS_CI_BRANCH } = process.env
if (
  SHOW_DRAFTS === '1' ||
  (WORKERS_CI_BRANCH && WORKERS_CI_BRANCH !== 'main')
) {
  process.stdout.write(
    'check:drafts: drafts are switched on for this build; skipped.\n',
  )
  process.exit(0)
}

const problems = []
for (const dir of ['dist/work', 'dist/cs/work']) {
  if (existsSync(dir)) problems.push(`${dir}/ exists`)
}
for (const [file, prefix] of [
  ['dist/index.html', '/work/'],
  ['dist/cs/index.html', '/cs/work/'],
]) {
  if (readFileSync(file, 'utf8').includes(`href="${prefix}`)) {
    problems.push(`${file} links to ${prefix}`)
  }
}

if (problems.length > 0) {
  process.stderr.write(
    `check:drafts: a draft case study leaked into the build:\n${problems.map((p) => `  ${p}\n`).join('')}`,
  )
  process.exit(1)
}
process.stdout.write(
  'check:drafts: no case study pages or links in this build.\n',
)
