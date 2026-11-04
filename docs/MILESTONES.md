# Development milestones

Delivery plan for david-krapka.eu, aligned with [the specification](SPEC.md) and [the approved design](design/README.md). Milestones are delivered in order. A milestone may span several PRs; PRs go **one at a time** (the next PR starts only after the current one is merged or closed).

Status as of 4 November 2026: milestone 0 done (PR #2), milestone 1 in progress, the rest planned.

## How every milestone is delivered

- Work on a branch, open the PR as a **draft**. Run `pnpm verify` (and `pnpm test:e2e` once it exists) locally and record results in the PR.
- Draft PRs do not run cloud validation (Budget-conscious CI): the `check` job is skipped. When the work is ready, the agent asks David for permission to mark the PR **ready for review**; that triggers the full suite.
- Every new commit to a ready PR re-runs the full suite. Merge only with green required checks for the current revision. Merging is David's call.
- Vercel builds a preview for every branch, so each PR has a link for visual review.
- Visual and product judgements (does it match the mockups, does the motion feel right) need David's sign-off; green CI is not enough.

## Milestone 0: Plan and design handoff

**Status:** done

**Goal:** One source of truth for scope, design and delivery before any code.

**Scope:** `docs/SPEC.md`, `docs/MILESTONES.md`, decision records, design documents moved from the mockup canvas, README links. Git remote switched to SSH.

**Acceptance checks:**

- [ ] Every chosen design variant on the canvas (landing EN/CS desktop/mobile, E3, A5, G4) is described in `docs/design/`; verify by reviewing the [design README](design/README.md) against the canvas.
- [ ] Open questions are listed with the milestone they block; verify in [SPEC](SPEC.md#planning-and-open-questions).
- [ ] David approves the plan, or names changes; verify in PR review.

**Completion evidence:** [PR #2](https://github.com/Phunkhouse/david-krapka/pull/2), merged 4 November 2026.

## Milestone 1: Foundation and delivery pipeline

**Status:** in progress

**Goal:** An empty but real Astro site that builds, is checked in CI under the Budget-conscious policy, and deploys to Vercel.

**Scope:**

- Generate the app with `create astro` (minimal template, strict TypeScript, pnpm) without touching `docs/` ([0006](decisions/0006-astro-static-site.md)). Check the installed version's docs at docs.astro.build before configuring.
- Copy from the starter pack: `template/core/` (`AGENTS.md`, `CLAUDE.md`, `.editorconfig`; merge with existing `README.md` and docs rather than overwrite) and the Next.js recipe's tooling conventions adapted to Astro (`.nvmrc`, Prettier settings with `prettier-plugin-astro`, `.prettierignore`, ESLint flat config with `eslint-plugin-astro`).
- Pin `packageManager`; add scripts `format`, `format:check`, `lint`, `typecheck` (`astro check`), `build`, `verify`.
- `astro.config.mjs`: `output: 'static'`, `trailingSlash: 'always'`.
- Adapt `recipes/ci-strategy/examples/budget-ci.yml` to `.github/workflows/ci.yml` (job name `check`). Validate with `actionlint`.
- Write `AGENTS.md` with real commands, `CI strategy: Budget-conscious`, pointers to SPEC, design and milestones.
- GitHub ruleset on `main`: pull request required, required status check `check` from GitHub Actions, branch must be up to date, no force pushes or deletion.
- Vercel project linked to the repository: production branch `main`, preview deployments for other branches, Node version matching `.nvmrc`. The existing DNS records come from a deleted project and can be reused; if Vercel still reports the domain as in use, verify ownership with the TXT record it asks for. `david-krapka.eu` is **not** attached to production until launch (milestone 6). Until then production lives on the `*.vercel.app` URL with an `X-Robots-Tag: noindex` header.
- Optional, if David agrees: legal planning with `audit-legal-readiness` (Planning mode, top-tier model, high effort) against SPEC; report in `docs/audits/`. Optional: Claude PR review workflow from the starter pack.

**Acceptance checks:**

- [ ] `pnpm verify` passes locally on a fresh clone; verify by running it and recording output in the PR.
- [ ] A draft PR skips `check` without installing dependencies; marking it ready runs the full suite and passes; verify on the milestone PR itself.
- [ ] A new commit to the ready PR triggers a new full run; verify in the Actions tab.
- [ ] Merging into `main` is blocked while `check` is failing or missing; verify with a throwaway PR that fails formatting.
- [ ] The Vercel preview for the PR and the production `*.vercel.app` URL both serve the built page, with `noindex`; verify with `curl -I`.
- [ ] `david-krapka.eu` still has working email (MX untouched); verify with `dig MX`.

**Dependencies and risks:** David's confirmation of decision 0003; access to Vercel, GitHub settings and Websupport DNS. Vercel Hobby terms (see SPEC risks).

## Milestone 2: Design system and site shell

**Status:** planned

**Goal:** The shared look and structure every page uses, in both languages.

**Scope:**

- Design tokens as CSS custom properties ([Visual system](design/visual-system.md)); global reset and base typography; fluid type with `clamp()`.
- Self-hosted fonts through the Astro Fonts API with Latin Extended.
- Print utilities: halftone text (three densities), misregistered copy, yellow paper, pink dot screen, rollers, offset shadows, highlight.
- Components: header with wordmark and navigation, mobile menu, language switcher, footer, buttons, section heading, focus styles, pause-motion toggle (static for now).
- Routing for `/` (English) and `/cs/` (Czech) with the correct `lang`, typed dictionaries, Astro i18n routing (`prefixDefaultLocale: false`), `site` `https://david-krapka.eu`, `hreflang` alternates, bilingual 404.
- Playwright installed with a first smoke test, plus the adapted `budget-e2e.yml` (required result `playwright`) added to the ruleset.

**Acceptance checks:**

- [ ] `/` and `/cs/` render the shell with `<html lang="en">` and `<html lang="cs">`, and the switcher links between them; verify with Playwright.
- [ ] A missing Czech key fails `pnpm typecheck`; verify by deleting one key locally.
- [ ] No request leaves the site's own origin on page load; verify in the browser network panel and with a Playwright request listener.
- [ ] Keyboard alone reaches every link and the menu, with a visible focus ring on paper and on ink; verify manually and with an axe check in Playwright.
- [ ] No horizontal scroll at 320 px; verify in Playwright at 320 × 640.
- [ ] Draft PR defers both `check` and `playwright`; ready PR runs both; verify in the Actions tab.

**Dependencies and risks:** Mobile menu, language switcher and pause toggle need a design on the canvas first (small additions).

## Milestone 3: Landing page (static)

**Status:** planned

**Goal:** The full landing page in both languages matching the mockups, with no motion yet.

**Scope:** Hero, Selected work, How I think & build with “AI + me”, Experience (E3), About, Contact and footer, as in [Landing page](design/landing-page.md). Desktop, tablet and mobile layouts. Static states of the drum, columns and portrait (the reduced-motion look). Confirmed copy where available; placeholders allowed but listed.

**Acceptance checks:**

- [ ] Side-by-side review against the four mockup boards at 1440 px and 390 px shows matching layout, type and colours; verify with screenshots in the PR and David's sign-off.
- [ ] Tablet widths (768 px and 1024 px) look intentional; verify with screenshots and sign-off.
- [ ] Navigation anchors scroll to their sections and update focus; verify with Playwright.
- [ ] axe reports no violations on both language versions; verify with Playwright + axe.
- [ ] Lighthouse mobile scores meet the SPEC targets on the preview URL; verify with a recorded Lighthouse run.
- [ ] A list of remaining placeholders is in the PR description.

**Dependencies and risks:** Answers to the hero and mobile-intro questions in the [design README](design/README.md#open-design-questions); tablet layout approval.

## Milestone 4: Motion

**Status:** planned

**Goal:** The print-drum hero, approach A5, portrait G4 and card hovers, without hurting accessibility or performance.

**Scope:** Everything in [Motion](design/motion.md): keyframes, IntersectionObserver for develop-once and off-screen pausing, hover rules under `(hover: hover)`, reduced-motion handling, a working pause toggle remembered for the session.

**Acceptance checks:**

- [ ] With `prefers-reduced-motion: reduce` emulated, no element has a running animation; verify with Playwright reading `getAnimations()`.
- [ ] The pause toggle stops all looping animations and is reachable by keyboard; verify with Playwright.
- [ ] Looping animations pause when scrolled off-screen; verify with Playwright.
- [ ] The portrait glitch passes a flash analysis (≤ 3 flashes per second); verify with a flash-analysis tool and record the result.
- [ ] Smooth on a real mid-range phone and on Safari iOS (drum text not blurry); verify manually with a screen recording.
- [ ] Lighthouse performance and CLS targets still met; verify with Lighthouse.
- [ ] David signs off on the feel of each animation compared with the canvas.

**Dependencies and risks:** 3D text rendering on Safari; fallback to a 2D flip if needed.

## Milestone 5: Case studies

**Status:** planned

**Goal:** Kultomat as the main case study and short client project pages, built on verified facts.

**Scope:** Case study page template (calm, editorial), MDX pipeline, Kultomat long form, Eucal / Vladan Vaněk / UpVideo short format (or links out, per decision), pre-optimised screenshots, per-page metadata and Open Graph images, “Next project” navigation. Czech versions if decided.

**Acceptance checks:**

- [ ] Each case study follows the [shared structure](content-and-case-studies.md#proposed-shared-case-study-structure) and states role, collaborators and AI share; verify by review against the project card.
- [ ] Every claim and metric has a source in the project card; verify by David's review.
- [ ] Images have fixed dimensions (no layout shift) and meaningful alternative text; verify with Lighthouse CLS and axe.
- [ ] Landing cards link to the right pages in both languages; verify with Playwright.
- [ ] David signs off on each page.

**Dependencies and risks:** **Blocked** until the case study template is designed on the canvas and the Kultomat project card is complete. Client permission for screenshots.

## Milestone 6: Launch readiness and launch

**Status:** planned

**Goal:** Publish the site on david-krapka.eu.

**Scope:**

- Contact links with the real address and prefilled subjects; LinkedIn and GitHub links; CV PDF.
- Favicon / monogram, Open Graph images, `sitemap.xml`, `robots.txt`, canonical URLs, JSON-LD `Person`.
- Security headers in Vercel configuration; HSTS.
- Placeholder check that fails the production build if any `[…]` placeholder remains.
- Pre-launch reviews: `audit-legal-readiness` (Pre-launch mode, if legal planning was enabled), `audit-web-quality` (accessibility, SEO, performance), and a light `audit-security` of headers and dependencies.
- Remove `noindex`; attach `david-krapka.eu` to production and redirect `www` to the apex.

**Acceptance checks:**

- [ ] No placeholders remain; verify with the build check.
- [ ] `https://david-krapka.eu/` and `/cs/` serve the site with HTTPS, HSTS and the agreed security headers; verify with `curl -I` and an external header scanner.
- [ ] `https://www.david-krapka.eu/` redirects permanently to the apex; verify with `curl -I`.
- [ ] Email links open a message to the right address with the right subject; verify manually on desktop and phone.
- [ ] Sharing a page on LinkedIn shows the correct preview; verify with LinkedIn's post inspector.
- [ ] Audit reports are saved in `docs/audits/` and every launch-blocking finding is fixed or accepted by David.
- [ ] Email to the domain still arrives after the DNS change; verify by sending a test message.

**Dependencies and risks:** Content inputs below; Vercel plan decision; legal findings.

## Content inputs (owner: David)

These run in parallel with development and gate the milestones shown.

| Input | Needed by |
| --- | --- |
| Answers to the design questions (mobile menu, language switcher, pause toggle, reduced-motion hero, mobile intro, tablet layout) | Milestones 2–3 |
| Emplifi role, dates, responsibilities and one concrete decision | Milestone 3 (placeholders allowed), 6 (final) |
| Freelance start year | Milestone 3 / 6 |
| Short personal note for About; portrait photo | Milestone 3 / 6 |
| Case study page design on the canvas | Milestone 5 |
| Completed project cards for Kultomat, Eucal, Vladan Vaněk, UpVideo; screenshots and permissions | Milestone 5 |
| Decision on Systerna's presentation | Milestone 5 |
| Public email, LinkedIn, GitHub; CV PDF | Milestone 6 |

## After launch

Possible next steps, each to be planned separately: Czech case studies (if not at launch), Playground of small experiments, a cookieless analytics tool, visitor interviews with both audiences, and a Systerna case study when it is ready.
