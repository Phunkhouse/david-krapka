# 0006. Build the site with Astro instead of Next.js

Date: 2026-11-04  
Status: accepted  
Supersedes: [0001](0001-starter-pack-and-nextjs.md) (framework choice only; the starter pack itself is still used)

## Context

[0001](0001-starter-pack-and-nextjs.md) chose the starter pack's Next.js recipe and named Astro as the alternative to revisit if performance targets were at risk. Before any design was built, the trade-off was reviewed again. The site is content-first and fully static. It has two languages and MDX case studies, and its expressive motion is mostly CSS. SPEC sets a strict budget: Lighthouse mobile performance of at least 95, INP of at most 200 ms, no third-party requests, and content and navigation that work without JavaScript. Next.js static export ships the React runtime on every page. When this was decided, the only code was a placeholder page in an unmerged PR, so switching was cheap.

## Decision

- Use **Astro** (7.x at setup) with `output: 'static'` and `trailingSlash: 'always'`, generated with `create astro` (minimal template, strict TypeScript).
- Ship no client JavaScript by default. Add small scripts or islands only where behaviour needs them, such as the motion pause control and the mobile menu.
- Keep from the starter pack: `AGENTS.md` and `CLAUDE.md` structure, `.editorconfig`, `.nvmrc` (Node 26), Prettier settings (`semi: false`, `singleQuote: true`, plus `prettier-plugin-astro`), the scripts contract (`format`, `format:check`, `lint`, `typecheck`, `build`, `verify`), the Budget-conscious CI workflow ([0002](0002-budget-conscious-ci.md)) and the docs structure.
- Replace the Next.js-specific parts: ESLint uses `@eslint/js`, `typescript-eslint` and `eslint-plugin-astro` instead of `eslint-config-next`. `typecheck` runs `astro check` instead of `next typegen && tsc`.
- Planned for later milestones (to be confirmed against the installed docs when used): the Astro Fonts API for self-hosted Latin and Latin Extended subsets, built-in i18n routing with `prefixDefaultLocale: false` ([0005](0005-bilingual-routing.md)), and content collections with schemas for case studies.

## Alternatives considered

- **Stay on Next.js with static export.** Matches the starter pack recipe and David's day-to-day stack, but carries a React runtime the site does not need. Every page would have to be checked for the no-JavaScript requirement, and the generator's defaults (`cacheComponents`, `partialPrefetching`) already conflicted with static export.

## Consequences

- The starter pack has no Astro recipe, so this project's `AGENTS.md`, ESLint config and scripts are maintained here rather than copied.
- Interactive pieces are written as plain scripts or as an explicitly added framework island; adding a UI framework needs its own decision record.
- TypeScript is pinned to 6.0.x because `@astrojs/check` and `typescript-eslint` did not support 7 at setup. Revisit when they do.
- The repository shows less React/Next.js work to readers of the code; visitors to the site see no difference.
- The build is plain files in `dist/`, so hosting is independent of the framework (originally [0003](0003-vercel-static-hosting.md), now [0007](0007-cloudflare-workers-hosting.md)).
