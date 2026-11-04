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
- `pnpm verify`: format check, lint, typecheck and build in sequence. Run it before asking for review.
- No test suite exists yet; `pnpm test:e2e` arrives with Playwright.

## Validation strategy

- CI strategy: Budget-conscious (decision 0002). `.github/workflows/ci.yml` job `check` is skipped for draft PRs and runs the full suite for ready PRs.
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
