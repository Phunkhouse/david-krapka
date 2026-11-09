// Fails when a draft case study leaked into a build made without drafts.
//
//   pnpm build && pnpm check:drafts
//
// Draft case studies (`draft: true`) are built only with SHOW_DRAFTS=1 or on a
// Cloudflare Workers Builds branch other than main (src/content/load.ts). A
// normal build, as in `pnpm verify` and CI, must contain no page of a draft and
// no mention of one anywhere in the built pages. Published case studies are
// expected in the build. With drafts switched on the check does nothing.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
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

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

// A project is a draft when any of its language files says so; load.ts fails
// the build when the languages disagree, so either file decides.
const root = 'src/content/case-studies'
const drafts = readdirSync(root).filter((slug) =>
  files(join(root, slug)).some(
    (file) =>
      file.endsWith('.mdx') &&
      /^draft:\s*true\s*$/m.test(
        readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '',
      ),
  ),
)

const problems = []
for (const slug of drafts) {
  for (const dir of [`dist/work/${slug}`, `dist/cs/work/${slug}`]) {
    if (existsSync(dir)) problems.push(`${dir}/ exists`)
  }
}
// Any page, sitemap or text file in the build that mentions a draft's path.
for (const file of files('dist')) {
  if (!/\.(html|xml|txt)$/.test(file)) continue
  const text = readFileSync(file, 'utf8')
  for (const slug of drafts) {
    if (text.includes(`/work/${slug}`)) {
      problems.push(`${file} mentions /work/${slug}`)
    }
  }
}

if (problems.length > 0) {
  process.stderr.write(
    `check:drafts: a draft case study leaked into the build:\n${problems.map((p) => `  ${p}\n`).join('')}`,
  )
  process.exit(1)
}
process.stdout.write(
  `check:drafts: no draft case study pages or links in this build (${drafts.length} draft${drafts.length === 1 ? '' : 's'}).\n`,
)
