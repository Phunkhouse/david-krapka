# 0011. Case studies as an MDX content collection with draft handling

Date: 2026-11-05  
Status: accepted

## Context

Milestone 5 adds a long case study (Kultomat) and short client pages. The site is fully static ([0006](0006-astro-static-site.md)) and bilingual ([0005](0005-bilingual-routing.md)). Two things need settling before any page is written: where the text lives, and how an unfinished case study is kept off the live site. The repository is public, so anything committed is public in Git whatever the build does.

## Decision

- Case studies are MDX files in an Astro content collection, `src/content/case-studies/<slug>/<language>.mdx`, loaded with the `glob()` loader and rendered by `src/pages/work/[slug].astro` and `src/pages/cs/work/[slug].astro`. MDX comes from the official `@astrojs/mdx` integration, pinned.
- A Zod schema (`src/content.config.ts`) requires title, summary, kind, status, dates, role, collaborators (may be empty), AI share, order and `draft`. A case study without its role, collaborators or AI share fails `pnpm typecheck` and `pnpm build` (SPEC, “Content honesty”).
- `src/content/load.ts` fails the build when a project has only one language, or is a draft in one language and published in the other, so there are never half-translated pages.
- `draft: true` entries are built only when `SHOW_DRAFTS=1` or on a Cloudflare Workers Builds branch other than `main` (`WORKERS_CI_BRANCH`). Production builds never contain them: no page, and the landing card stays a plain card. `pnpm check:drafts` (part of `pnpm verify` and CI) fails when a build without drafts contains a case study page or a link to one. The Playwright build sets `SHOW_DRAFTS=1`, so the pages themselves are tested.
- The language and project slug come from the file path, not from frontmatter, so they cannot disagree with the URL.

## Alternatives considered

- **Plain Markdown with frontmatter.** No new dependency, but figures, captions and the facts panel would have to be faked in frontmatter or raw HTML. MDX components keep them in the text.
- **Drafts never leave a local branch.** Simpler, but David could not review a draft on a preview URL.
- **A separate `drafts` folder or branch for unfinished text.** Keeps drafts out of `main` by hand, with no check that it was done. The flag plus `check:drafts` is automatic.
- **Draft state per language.** More flexible, but allows an English page to go live without its Czech twin, which decision 4 of the milestone 5 plan rules out.

## Consequences

- Preview builds show drafts, including the placeholder Kultomat entry; `pnpm placeholders` lists their `[…]` text. The milestone 6 `--fail` check runs on the production build, where drafts are absent.
- A draft committed to any branch is public in the repository. Commit only what David is content to show, and keep raw notes and private emails outside the repository.
- Publishing is one edit, `draft: false` in both files of a project.
- Revisit if there are many case studies (a per-project folder with shared assets may need a different layout) or if Workers Builds stops exposing `WORKERS_CI_BRANCH`; then `SHOW_DRAFTS=1` becomes a build variable set for preview builds only.
