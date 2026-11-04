# Milestone 1 checklist: Foundation and delivery pipeline

Working plan for [Milestone 1](MILESTONES.md#milestone-1-foundation-and-delivery-pipeline). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** an empty but real Next.js site that builds, is checked in CI under the Budget-conscious policy, and deploys to Vercel.

## 0. Before starting (David)

- [ ] Milestone 0 PR merged, so `main` holds SPEC, MILESTONES and decision records.
- [ ] Confirm decisions [0001](decisions/0001-starter-pack-and-nextjs.md) (Next.js + starter pack) and [0003](decisions/0003-vercel-static-hosting.md) (static export on Vercel), or name alternatives. Flip their status to `accepted`.
- [ ] Decide on legal planning with `audit-legal-readiness` (recommended) and the optional Claude PR review workflow.
- [ ] Confirm access: Vercel account, GitHub repository settings (admin), Websupport DNS.
- [ ] Make the [AI starter pack](https://github.com/Phunkhouse/ai-starter-pack) available locally (it is not cloned on this machine); `template/core/` and `recipes/` are copied from it.

## 1. Branch and PR hygiene

- [ ] Branch from up-to-date `main` (for example `feat/foundation`); one PR at a time.
- [ ] Open the PR as a **draft** early; expect `check` to be skipped (intended).

## 2. Generate the app

- [ ] Check installed Node matches the recipe (`.nvmrc`, recipe default 26 LTS; local machine has Node 24.18, so install the pinned version via nvm).
- [ ] Run the official Next.js generator in the repo root: TypeScript, App Router, `src/`, pnpm, ESLint, no Tailwind. `docs/`, `README.md` and `.git` stay untouched (generate in a scratch directory and copy if the generator refuses a non-empty directory).
- [ ] Read `node_modules/next/dist/docs/` for the installed version before configuring anything; note the version in the PR.
- [ ] Remove generator boilerplate (demo page, logos, default styles) and leave a minimal placeholder home page.

## 3. Starter pack files

- [ ] Copy `template/core/`: `AGENTS.md`, `CLAUDE.md`, `.editorconfig`. Merge with the existing `README.md` and docs rather than overwrite.
- [ ] Copy recipe files: `.nvmrc`, `.prettierrc` (`semi: false`, `singleQuote: true`), `.prettierignore`, `eslint.config.mjs`.
- [ ] Pin `packageManager` in `package.json`.

## 4. Scripts and config

- [ ] Scripts: `format`, `format:check`, `lint`, `typecheck` (`next typegen && tsc --noEmit`), `build`, `verify` (format check, lint, typecheck, build in sequence).
- [ ] `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`.
- [ ] Vercel config (`vercel.json`): `X-Robots-Tag: noindex` header for now, and the security headers listed in SPEC if cheap to add (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection; CSP can wait for milestone 2 once fonts and styles exist). Note that the `noindex` header is removed at launch (milestone 6).
- [ ] No Playwright, `test:e2e` or `budget-e2e.yml` yet: they arrive when there is something to test. `AGENTS.md` lists only commands that exist.
- [ ] `pnpm verify` passes locally; save the output for the PR.

## 5. CI

- [ ] Adapt `recipes/ci-strategy/examples/budget-ci.yml` to `.github/workflows/ci.yml` with job name `check` (format, lint, typecheck, build; Node from `.nvmrc`; pnpm cache).
- [ ] Draft PRs fail `check` immediately without installing dependencies; ready PRs run the full suite.
- [ ] Install `actionlint` (`brew install actionlint`) and validate the workflow.
- [ ] Write `AGENTS.md` with the real commands, `CI strategy: Budget-conscious`, and pointers to SPEC, design docs and MILESTONES. Same commit as the workflow, per [0002](decisions/0002-budget-conscious-ci.md).
- [ ] Update README with install, dev and verify commands and links to docs.

## 6. GitHub ruleset on `main` (David or with David's approval)

- [ ] Pull request required before merge.
- [ ] Required status check `check`, source GitHub Actions.
- [ ] Branch must be up to date before merging.
- [ ] Block force pushes and deletion.
- [ ] Note: the `check` context only becomes selectable after it has run once, so enable the ruleset after the first full run.

## 7. Vercel

- [ ] Create the project and link the repository; framework preset Next.js, production branch `main`, preview deployments for other branches.
- [ ] Node version matches `.nvmrc`.
- [ ] Production lives on the `*.vercel.app` URL; **do not attach `david-krapka.eu`** until milestone 6.
- [ ] Reuse existing DNS records only at milestone 6. If Vercel later reports the domain as in use, verify ownership with the TXT record it asks for.
- [ ] Hobby vs Pro: stay on Hobby for now; decision is a milestone 6 blocker.

## 8. Optional

- [ ] Legal planning with `audit-legal-readiness` (Planning mode, top-tier model, high effort) against SPEC; report to `docs/audits/`.
- [ ] Claude PR review workflow from the starter pack.

## 9. Acceptance checks (from MILESTONES.md)

- [ ] `pnpm verify` passes locally on a fresh clone. Evidence: output pasted in the PR.
- [ ] Draft PR skips `check` without installing dependencies. Marking it ready (after David's permission) runs the full suite and passes. Evidence: the milestone PR itself.
- [ ] A new commit to the ready PR triggers a new full run. Evidence: Actions tab.
- [ ] Merging into `main` is blocked while `check` is failing or missing. Evidence: a throwaway PR that fails formatting, closed afterwards.
- [ ] Vercel preview for the PR and the production `*.vercel.app` URL both serve the built page with `noindex`. Evidence: `curl -I` output.
- [ ] `david-krapka.eu` still has working email. Evidence: `dig MX david-krapka.eu` unchanged from before.

## 10. Wrap-up

- [ ] Update MILESTONES.md: status of milestone 1, completion evidence (PR link), status date.
- [ ] Update SPEC.md "Commands" section from "to be created" to actual, and the technical approach table statuses for 0001 and 0003.
- [ ] David reviews and merges. Merging is David's call.

## Suggested PR split

Everything may go in one PR; if it grows, split in this order (each PR starts only after the previous one is merged):

1. App scaffold, starter pack files, scripts, `AGENTS.md`, CI workflow (this PR proves the draft/ready behaviour).
2. Vercel config and headers, README updates, completion evidence. Ruleset and Vercel project setup are settings changes made outside the repo.

## Risks and notes

- Starter pack recipe was drafted against Next.js 16; the generator may install a newer version. Follow the installed docs.
- `next/font` fetches at build time in CI; not used until milestone 2, so no network risk yet.
- The `check` required status must exist on `main` before the ruleset can require it; otherwise merges block forever. Order: merge the workflow PR, then enforce, or enable the ruleset after the first run on the PR.
- Draft PRs skip `check` (job-level `if`). GitHub cannot merge a draft, and marking ready triggers the job, so the skip never gates a merge. Do not replace the skip with a step that passes without validating.
