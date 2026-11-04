# Milestone 1 checklist: Foundation and delivery pipeline

Working plan for [Milestone 1](MILESTONES.md#milestone-1-foundation-and-delivery-pipeline). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** an empty but real Astro site that builds, is checked in CI under the Budget-conscious policy, and deploys to Cloudflare.

## 0. Before starting (David)

- [x] Milestone 0 PR merged, so `main` holds SPEC, MILESTONES and decision records ([PR #2](https://github.com/Phunkhouse/david-krapka/pull/2)).
- [x] Framework decided: Astro ([0006](decisions/0006-astro-static-site.md), supersedes the Next.js choice in [0001](decisions/0001-starter-pack-and-nextjs.md)).
- [x] Hosting decided: Cloudflare Workers static assets ([0007](decisions/0007-cloudflare-workers-hosting.md), supersedes Vercel in [0003](decisions/0003-vercel-static-hosting.md)).
- [ ] Decide on legal planning with `audit-legal-readiness` (recommended) and the optional Claude PR review workflow.
- [ ] Confirm access: Cloudflare account, GitHub repository settings (admin). Websupport access is needed only at launch.
- [x] Starter pack available (cloned to a scratch directory for copying).

## 1. Branch and PR hygiene

- [x] Branch `feat/foundation` from up-to-date `main`; one PR at a time.
- [x] Draft PR open ([PR #3](https://github.com/Phunkhouse/david-krapka/pull/3)); `check` is skipped on drafts (intended).

## 2. Generate the app

- [x] Node 26 from `.nvmrc` (installed via nvm; the machine default is 24.18).
- [x] `create astro` (minimal template, strict TypeScript, pnpm) in a scratch directory, copied in without touching `docs/` or `README.md`. Astro 7.4.5.
- [x] Checked the docs for the installed version (configuration, editor setup, CLI, fonts, i18n) at docs.astro.build.
- [x] Placeholder home page only; no demo content.

## 3. Starter pack files

- [x] `template/core/`: `AGENTS.md` (merged with Astro's generated guidance), `CLAUDE.md`, `.editorconfig`.
- [x] Recipe conventions adapted to Astro: `.nvmrc`, `.prettierrc` (`semi: false`, `singleQuote: true`, `prettier-plugin-astro`), `.prettierignore` (also ignores `docs/`, so planning docs and mockups are not reformatted), ESLint flat config (`@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`).
- [x] `packageManager` pinned (`pnpm@12.9.1`); dev dependencies pinned exactly; TypeScript held at 6.0.x for tool compatibility.

## 4. Scripts and config

- [x] Scripts: `dev`, `build`, `preview`, `format`, `format:check`, `lint`, `typecheck` (`astro check`), `verify` (format check, lint, typecheck, build in sequence).
- [x] `astro.config.mjs`: `output: 'static'`, `trailingSlash: 'always'`.
- [x] `wrangler.jsonc` (static assets from `dist/`, `auto-trailing-slash`, `404-page`, `workers.dev` and preview URLs on, empty `previews` block required by `wrangler preview`) and `public/_headers`: `X-Robots-Tag: noindex` plus basic security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`). CSP waits for milestone 2. `noindex` is removed at launch (milestone 6).
- [x] No Playwright, `test:e2e` or `budget-e2e.yml` yet. `AGENTS.md` lists only commands that exist.
- [x] `pnpm verify` passes locally.

## 5. CI

- [x] `.github/workflows/ci.yml` adapted from the pack's `budget-ci.yml`, job `check` (format, lint, typecheck, build; Node from `.nvmrc`; pnpm cache).
- [x] Draft PRs skip `check` without installing dependencies; ready PRs run the full suite (amends [0002](decisions/0002-budget-conscious-ci.md)).
- [x] `actionlint` installed and clean.
- [x] `AGENTS.md` has the real commands, `CI strategy: Budget-conscious`, and pointers to SPEC, design docs and MILESTONES.
- [x] README has install, dev and verify commands.

## 6. GitHub ruleset on `main` (David or with David's approval)

- [ ] Pull request required before merge.
- [ ] Required status check `check`, source GitHub Actions.
- [ ] Branch must be up to date before merging.
- [ ] Block force pushes and deletion.
- [ ] Note: the `check` context only becomes selectable after it has run once, so enable the ruleset after the first full run.

## 7. Cloudflare

- [x] `pnpm wrangler deploy --dry-run` reads the config; `pnpm preview:cloudflare` serves `/` with the headers above and returns 404 for unknown paths (checked locally).
- [x] Create the Worker by importing the GitHub repository (Workers & Pages → Create → Import a repository). The Worker name must match `wrangler.jsonc` (`david-krapka`). The first production build of `main` failed as expected (no `package.json` until this PR merges).
- [x] Build settings: build command `pnpm build`, deploy command `npx wrangler deploy`, production branch `main`. Previews Base tab: preview builds on, preview command `npx wrangler preview`, Preview URLs enabled, same API token as production. The build image reads Node 26.13 from `.nvmrc` and pnpm 12.9.1 from `packageManager`.
- [x] `pnpm-workspace.yaml` allows the `esbuild` and `workerd` build scripts; pnpm 12 otherwise fails frozen installs in CI (`ERR_PNPM_IGNORED_BUILDS`).
- [ ] Production lives on the `*.workers.dev` URL; **do not add `david-krapka.eu`** or touch DNS until milestone 6.

## 8. Optional

- [ ] Legal planning with `audit-legal-readiness` (Planning mode, top-tier model, high effort) against SPEC; report to `docs/audits/`.
- [ ] Claude PR review workflow from the starter pack.

## 9. Acceptance checks (from MILESTONES.md)

- [ ] `pnpm verify` passes locally on a fresh clone. Evidence: output pasted in the PR.
- [ ] Draft PR skips `check` without installing dependencies. Marking it ready (after David's permission) runs the full suite and passes. Evidence: the milestone PR itself.
- [ ] A new commit to the ready PR triggers a new full run. Evidence: Actions tab.
- [ ] Merging into `main` is blocked while `check` is failing or missing. Evidence: a throwaway PR that fails formatting, closed afterwards.
- [ ] The PR's preview URL and the production `*.workers.dev` URL both serve the built page with `noindex`. Evidence: `curl -I` output.
  - [x] Preview (4 Nov 2026, commit `c7ced9e`): `https://feat-foundation-david-krapka.services-d43.workers.dev/` returns 200 with the placeholder page, `x-robots-tag: noindex`, HSTS, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy` and `permissions-policy`; `/missing` returns 404.
  - [ ] Production `david-krapka.services-d43.workers.dev`, after PR #3 merges.
- [ ] `david-krapka.eu` still has working email (DNS is untouched in this milestone). Evidence: `dig MX david-krapka.eu` unchanged from before.

## 10. Wrap-up

- [ ] Update MILESTONES.md: milestone 1 status `done`, completion evidence (PR link), status date.
- [x] SPEC.md "Commands" and technical approach table updated for Astro.
- [ ] David reviews and merges. Merging is David's call.

## Risks and notes

- No starter pack recipe exists for Astro; this project maintains its own ESLint config, scripts and agent guidance ([0006](decisions/0006-astro-static-site.md)).
- TypeScript is pinned to 6.0.x until `@astrojs/check` and `typescript-eslint` support 7.
- The Astro Fonts API downloads fonts at build time; not used until milestone 2.
- The `check` required status must exist before the ruleset can require it; enable the ruleset after the first full run on this PR.
- Draft PRs skip `check` (job-level `if`). GitHub cannot merge a draft, and marking ready triggers the job, so the skip never gates a merge. Do not replace the skip with a step that passes without validating.
