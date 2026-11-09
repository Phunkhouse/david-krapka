# Project instructions

Project overview: `README.md`. Detailed scope, workflows, limitations and open questions: `docs/SPEC.md`. Approved design: `docs/design/`. Agreed development stages, when present: `docs/MILESTONES.md`. Decision records: `docs/decisions/`.

Before changing code, inspect the relevant files and the documentation for the installed Astro version (`astro` in `package.json`; docs at https://docs.astro.build, upgrade guides for breaking changes). Do not assume that remembered APIs match this project.

## Commands

- Use the package manager and scripts selected for this project. Check the manifest before running a command.
- Before finishing a code change, run the relevant checks. Record their results and any checks you could not run.
- When adding or changing a script, update this section with its exact command and purpose.

- Package manager: pnpm (pinned in `packageManager`). Node version: `.nvmrc`.
- `pnpm dev`: start the dev server (http://localhost:4321). Agents run it in the background with `pnpm astro dev --background`, managed with `pnpm astro dev stop|status|logs`.
- `pnpm build`: static build to `dist/` (`output: 'static'`). `pnpm preview` serves it locally; `pnpm preview:cloudflare` serves it through `wrangler dev` with `public/_headers` and the 404/trailing-slash behaviour of production.
- `pnpm format` / `pnpm format:check`: write / check Prettier formatting (`docs/` is excluded).
- Hosting: Cloudflare Workers static assets (decision 0007), configured in `wrangler.jsonc` and `public/_headers`. Deploys run in Cloudflare Workers Builds, not from this repository's scripts.
- `pnpm lint`: ESLint (`@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`).
- `pnpm typecheck`: `astro check` (runs `astro sync`, then type-checks `.astro` and `.ts` files). TypeScript is pinned to 6.0.x because `@astrojs/check` and `typescript-eslint` do not support 7 yet.
- `pnpm verify`: format check, lint, typecheck, build, font coverage check and draft check in sequence. Run it before asking for review.
- `pnpm check:drafts`: after `pnpm build`, fails if a build made without drafts contains the page of a draft case study or any mention of its `/work/<slug>` path in its HTML, XML or text files. Published case studies are expected in the build. Draft case studies (`draft: true`) are shown by `pnpm dev` and built only with `SHOW_DRAFTS=1` (set by the Playwright build) or on a Workers Builds branch other than `main`. Part of `pnpm verify` and CI job `check` ([0011](docs/decisions/0011-case-studies-as-mdx-collection.md)).
- `pnpm check:fonts`: after `pnpm build`, fails if any built page shows a character the site fonts do not cover (it would render in a fallback font). Fix by regenerating the fonts with `scripts/subset-fonts.py` (see `src/assets/fonts/README.md`). Also run in CI job `check`.
- `pnpm placeholders`: after `pnpm build`, lists every `[…]` placeholder left in `dist/` per page (report only; `--fail` exits 1 when any remain, for the milestone 6 production check).
- `scripts/flash-check.mjs` (manual, not a pnpm script): approximate WCAG 2.3.1 flash check of a looping element on a served build (`node scripts/flash-check.mjs <url> <selector>`). Usage and limits are in its header and in `docs/audits/2026-11-05/flash-analysis.md`.
- `scripts/portrait.mjs` (manual, not a pnpm script): rebuilds the About portrait masks in `src/assets/portrait/` from a source photo (`node scripts/portrait.mjs <photo.jpg>`). The source photo is not committed; the generated files carry no camera metadata (LEG-007).
- `scripts/work-previews.mjs` (manual, not a pnpm script): rebuilds the project preview images in `src/assets/work/` (landing cards, case study `og:image`) from one home-page screenshot per project (`node scripts/work-previews.mjs <screenshot-dir>`). The raw screenshots are not committed.
- `scripts/brand-assets.mjs` (manual, not a pnpm script): rebuilds the favicons, app icons and the site-wide social preview images in `public/` from the canvas design, with text from the dictionaries and the committed fonts (`node scripts/brand-assets.mjs`). Run it when the mark, name, role or claim changes.
- `scripts/subset-fonts.py` (manual, not a pnpm script): rebuilds the site-subset font files in `src/assets/fonts/` when new copy needs a character they lack. Steps and requirements are in `src/assets/fonts/README.md`.
- `pnpm test:e2e`: Playwright end-to-end tests in `tests/e2e/` (Chromium, with axe). It builds the site with `SHOW_DRAFTS=1` (so draft case studies are tested) and serves it with `wrangler dev` on port 8788, so `public/_headers` and production 404 handling apply. First run: `pnpm exec playwright install chromium`. Not part of `pnpm verify`; CI runs it in its own job.

## Validation strategy

- CI strategy: Budget-conscious (decision 0002). `.github/workflows/ci.yml` job `check` is skipped for draft PRs and runs the full suite for ready PRs. `.github/workflows/e2e.yml` does the same for Playwright: `browser_tests` runs in the Playwright container (its image tag must match `@playwright/test` exactly), and `playwright` is the required status that fails unless `browser_tests` succeeded.
- Optional Claude feedback: commenting `@claude review` on a PR runs `.github/workflows/claude.yml` (starter pack recipe `claude-pr-review`). It replies in a comment, is not a required check or an approval, and uses the `CLAUDE_CODE_OAUTH_TOKEN` secret and David's Claude plan. Ask before triggering it.
- During development and before handing off work, run the relevant local formatting, lint, type, test and build checks using existing project commands. Use a unified verification command when useful; report results and local/cloud environment differences, including checks that could not run.
- Standard runs cloud validation on relevant PR updates. Budget-conscious uses draft PRs while developing and defers expensive cloud jobs until ready for review; every subsequent commit to a ready PR still needs full cloud validation.
- In Budget-conscious mode, create draft PRs and obtain explicit user permission before marking them ready. Permission to request review is not permission to merge. Do not bypass checks or change the strategy to avoid a failure.
- Before any authorized merge, confirm successful independent CI for the current revision, including every required suite. Local results and earlier commits' CI do not replace it. Respect existing security, migration, deployment and branch rules.

## Architecture

- Astro, fully static (decision 0006). Pages in `src/pages/`, components in `src/components/`, shared layouts in `src/layouts/`. Do not create directories just to match a template.
- Ship no client JavaScript by default. Add a `<script>` or a hydrated island only where the spec needs behaviour (motion pause control, mobile menu), and keep content and navigation working without JavaScript.
- Do not add a UI framework integration (React, etc.) without recording the reason in `docs/decisions/`.
- Keep files close to the pages they serve; avoid broad barrel exports.

## UI

- Prefer semantic HTML, keyboard access, visible focus and useful alternative text.
- Follow the approved design in `docs/design/`; keep repeated visual values consistent.
- Put user-facing copy in the project's chosen content or localization system when one exists.

## Testing and changes

- Test important behavior and failure cases at the lowest useful level. Use real database integration tests for concurrency and transaction behavior.
- Prefer role-based queries in UI tests. Do not use fixed sleeps to make tests pass.
- Keep diffs focused. Explain meaningful dependency, schema and architecture decisions in the change description; record lasting trade-offs in `docs/decisions/`.
- Name commits `type: short imperative summary`, using lowercase `feat`, `fix`, `docs`, `refactor`, `test` or `chore` as appropriate.
- Before finishing, run the relevant checks, update affected documentation and commands, and mention unrelated changes without folding them into the task.
- If `docs/MILESTONES.md` exists, use its acceptance checks to guide the current milestone. Before calling a milestone complete, verify each check, record evidence and unresolved gaps there, and request user validation for product or visual judgments. A passing CI run alone does not establish that the intended outcome works.
- Do not commit secrets, `.env` files or personal data. If the project needs environment variables, create `.env.example` with names and safe examples only.

## Legal planning (when enabled)

- Use `audit-legal-readiness` in Planning mode after the initial specification and before dependent implementation, then Pre-launch mode against the built product. Revisit the plan after material changes to markets, business model, features, suppliers or data uses.
- Run either mode with a top-tier reasoning model and high reasoning effort or the closest supported equivalent. Announce the model/settings when known; warn if weaker or unverified. Prioritize source verification and completeness over token savings, and do not claim a model switch or review that did not occur.
- Keep review output in `docs/audits/`. Promote approved requirements into `docs/SPEC.md` and milestone acceptance checks separately. Planned controls do not prove launch readiness; do not publish legal documents as part of the review.

## Pull requests

- Work through multiple PRs sequentially. Keep at most one agent-authored PR awaiting user review at a time.
- Finish checks and address feedback in the current PR. Wait for the user to merge or close it before starting the next PR's implementation, unless the user explicitly requests parallel PR work.
- Leave the final merge to the user unless they explicitly ask you to perform it.
