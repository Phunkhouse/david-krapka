# Development milestones

Delivery plan for david-krapka.eu, aligned with [the specification](SPEC.md) and [the approved design](design/README.md). Milestones are delivered in order. A milestone may span several PRs; PRs go **one at a time** (the next PR starts only after the current one is merged or closed).

Status as of 4 November 2026: milestones 0, 1 and 2 done, the rest planned.

## How every milestone is delivered

- Work on a branch, open the PR as a **draft**. Run `pnpm verify` (and `pnpm test:e2e` once it exists) locally and record results in the PR.
- Draft PRs do not run cloud validation (Budget-conscious CI): the `check` job is skipped. When the work is ready, the agent asks David for permission to mark the PR **ready for review**; that triggers the full suite.
- Every new commit to a ready PR re-runs the full suite. Merge only with green required checks for the current revision. Merging is David's call.
- Cloudflare Workers Builds deploys a preview for every branch, so each PR has a link for visual review.
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

**Status:** done

**Goal:** An empty but real Astro site that builds, is checked in CI under the Budget-conscious policy, and deploys to Cloudflare.

**Scope:**

- Generate the app with `create astro` (minimal template, strict TypeScript, pnpm) without touching `docs/` ([0006](decisions/0006-astro-static-site.md)). Check the installed version's docs at docs.astro.build before configuring.
- Copy from the starter pack: `template/core/` (`AGENTS.md`, `CLAUDE.md`, `.editorconfig`; merge with existing `README.md` and docs rather than overwrite) and the Next.js recipe's tooling conventions adapted to Astro (`.nvmrc`, Prettier settings with `prettier-plugin-astro`, `.prettierignore`, ESLint flat config with `eslint-plugin-astro`).
- Pin `packageManager`; add scripts `format`, `format:check`, `lint`, `typecheck` (`astro check`), `build`, `verify`.
- `astro.config.mjs`: `output: 'static'`, `trailingSlash: 'always'`.
- Adapt `recipes/ci-strategy/examples/budget-ci.yml` to `.github/workflows/ci.yml` (job name `check`). Validate with `actionlint`.
- Write `AGENTS.md` with real commands, `CI strategy: Budget-conscious`, pointers to SPEC, design and milestones.
- GitHub ruleset on `main`: pull request required, required status check `check` from GitHub Actions, branch must be up to date, no force pushes or deletion.
- Cloudflare Worker `david-krapka` connected to the repository with Workers Builds ([0007](decisions/0007-cloudflare-workers-hosting.md)): build command `pnpm build`, deploy command `npx wrangler deploy`, production branch `main`, preview builds for other branches, Node version matching `.nvmrc`. Configuration in `wrangler.jsonc` and `public/_headers`. DNS stays at Websupport and `david-krapka.eu` is **not** attached until launch (milestone 6). Until then production lives on the `*.workers.dev` URL with an `X-Robots-Tag: noindex` header.
- Optional, if David agrees: legal planning with `audit-legal-readiness` (Planning mode, top-tier model, high effort) against SPEC; report in `docs/audits/`. Optional: Claude PR review workflow from the starter pack.

**Acceptance checks:**

- [x] `pnpm verify` passes locally on a fresh clone; verify by running it and recording output in the PR.
- [x] A draft PR skips `check` without installing dependencies; marking it ready runs the full suite and passes; verify on the milestone PR itself.
- [x] A new commit to the ready PR triggers a new full run; verify in the Actions tab.
- [x] Merging into `main` is blocked while `check` is failing or missing; verify with a throwaway PR that fails formatting.
- [x] The preview URL for the PR and the production `*.workers.dev` URL both serve the built page, with `noindex`; verify with `curl -I`.
- [x] `david-krapka.eu` still has working email (MX untouched); verify with `dig MX`.

**Dependencies and risks:** access to Cloudflare and GitHub settings.

**Completion evidence:** [PR #3](https://github.com/Phunkhouse/david-krapka/pull/3), merged 4 November 2026 as `4710592`. Per-check evidence is in the [milestone 1 checklist](milestone-1-checklist.md#9-acceptance-checks-from-milestonesmd). Unplanned changes: framework switched to Astro ([0006](decisions/0006-astro-static-site.md)) and hosting to Cloudflare ([0007](decisions/0007-cloudflare-workers-hosting.md)).

## Milestone 2: Design system and site shell

**Status:** done

**Goal:** The shared look and structure every page uses, in both languages.

**Scope:**

- Design tokens as CSS custom properties ([Visual system](design/visual-system.md)); global reset and base typography; fluid type with `clamp()`.
- Self-hosted fonts through the Astro Fonts API with Latin Extended.
- Print utilities: halftone text (three densities), misregistered copy, yellow paper, pink dot screen, rollers, offset shadows, highlight.
- Components: header with wordmark and navigation, mobile menu, language switcher, footer (with a privacy-notice link and a reserved, initially empty slot for business identification), buttons, section heading, focus styles, pause-motion toggle (static for now).
- Privacy notice routes (`/privacy/`, `/cs/privacy/`) with a placeholder page, so the footer link exists ([LEG-003](SPEC.md#legal-requirements)).
- Ship the `OFL.txt` of Rubik, Sora and Space Mono with the site, or verify that the served font files keep copyright and licence metadata ([LEG-008](SPEC.md#legal-requirements)).
- Routing for `/` (English) and `/cs/` (Czech) with the correct `lang`, typed dictionaries, Astro i18n routing (`prefixDefaultLocale: false`), `site` `https://david-krapka.eu`, `hreflang` alternates, bilingual 404.
- Playwright installed with a first smoke test, plus the adapted `budget-e2e.yml` (required result `playwright`) added to the ruleset.
- Baseline Content-Security-Policy in `public/_headers` (deferred from milestone 1); final review in milestone 6.

**Acceptance checks:**

- [x] `/` and `/cs/` render the shell with `<html lang="en">` and `<html lang="cs">`, and the switcher links between them; verify with Playwright.
- [x] A missing Czech key fails `pnpm typecheck`; verify by deleting one key locally.
- [x] No request leaves the site's own origin on page load; verify in the browser network panel and with a Playwright request listener.
- [x] The site stores nothing on the device: no cookies, `localStorage`, `sessionStorage` or IndexedDB after load and after using the language switcher; verify with Playwright and `curl -I` (no `Set-Cookie`) ([LEG-005](SPEC.md#legal-requirements)).
- [x] The three licence files, or readable font metadata, are in the build output ([LEG-008](SPEC.md#legal-requirements)); verify in `dist/`.
- [x] Keyboard alone reaches every link and the menu, with a visible focus ring on paper and on ink; verify manually and with an axe check in Playwright.
- [x] No horizontal scroll at 320 px; verify in Playwright at 320 × 640.
- [x] Draft PR defers both `check` and `playwright`; ready PR runs both; verify in the Actions tab.
- [x] David signs off on the design system and the shell on the preview URL (specimen on PR B, shell on PR C).

**Dependencies and risks:** Mobile menu, language switcher and pause toggle use a first proposal (canvas page “Site shell”, [Shell components](design/shell-components.md)); expect to iterate.

**Completion evidence:** delivered as three PRs: [#8](https://github.com/Phunkhouse/david-krapka/pull/8) routing, dictionaries and Playwright; [#9](https://github.com/Phunkhouse/david-krapka/pull/9) tokens, fonts, print utilities and CSP; [#10](https://github.com/Phunkhouse/david-krapka/pull/10) site shell. Planning in [#6](https://github.com/Phunkhouse/david-krapka/pull/6) and the optional Claude review workflow in [#7](https://github.com/Phunkhouse/david-krapka/pull/7). Per-check evidence is in the [milestone 2 checklist](milestone-2-checklist.md#acceptance-checks-from-milestonesmd). Unplanned changes: font files are committed locally instead of fetched from a provider ([0009](decisions/0009-self-hosted-font-files.md)); the pause control is built but shown only on the temporary `/specimen/` page until milestone 4; the `playwright` check is required on `main`. Open items carried forward: remove `/specimen/` and the `noindex` header in milestone 6; the Claude review suggestions on #10 were applied in #11 (page behind the open menu made inert, document-level Escape, breakpoint comments, sturdier keyboard-reach test). Still open from that review: re-check the menu layout if the header becomes sticky (milestone 3), and the footer year is the build year.

## Milestone 3: Landing page (static)

**Status:** planning; work plan in the [milestone 3 checklist](milestone-3-checklist.md) (three PRs: hero and work; approach and experience; about, contact and wrap-up).

**Goal:** The full landing page in both languages matching the mockups, with no motion yet.

**Scope:** Hero, Selected work, How I think & build with “AI + me”, Experience (E3), About, Contact and footer, as in [Landing page](design/landing-page.md). Desktop, tablet and mobile layouts. Static states of the drum, columns and portrait (the reduced-motion look). Confirmed copy where available; placeholders allowed but listed. While the trade is suspended, the project invitation stays an invitation to talk, with no prices, rates, terms or availability claims ([LEG-001](SPEC.md#legal-requirements)).

**Acceptance checks:**

- [ ] Side-by-side review against the four mockup boards at 1440 px and 390 px shows matching layout, type and colours; verify with screenshots in the PR and David's sign-off.
- [ ] Tablet widths (768 px and 1024 px) look intentional; verify with screenshots and sign-off.
- [ ] Navigation anchors scroll to their sections and update focus; verify with Playwright.
- [ ] axe reports no violations on both language versions; verify with Playwright + axe.
- [ ] Lighthouse mobile scores meet the SPEC targets on the preview URL; verify with a recorded Lighthouse run.
- [ ] A list of remaining placeholders is in the PR description.
- [ ] Neither language version states prices, rates, terms or availability for paid services; verify by reading the rendered pages ([LEG-001](SPEC.md#legal-requirements)).

**Dependencies and risks:** Answers to the hero and mobile-intro questions in the [design README](design/README.md#open-design-questions); tablet layout approval; whether the header is sticky (carried from the milestone 2 review); how project cards and contact links behave before case studies (milestone 5) and the email address (milestone 6) exist. Lighthouse SEO cannot reach 100 while the preview sends `noindex`; that one audit is recorded as expected until milestone 6.

## Milestone 4: Motion

**Status:** planned

**Goal:** The print-drum hero, approach A5, portrait G4 and card hovers, without hurting accessibility or performance.

**Scope:** Everything in [Motion](design/motion.md): keyframes, IntersectionObserver for develop-once and off-screen pausing, hover rules under `(hover: hover)`, reduced-motion handling, a working pause toggle whose state is kept in page memory only, never in browser storage ([LEG-005](SPEC.md#legal-requirements)).

**Acceptance checks:**

- [ ] With `prefers-reduced-motion: reduce` emulated, no element has a running animation; verify with Playwright reading `getAnimations()`.
- [ ] The pause control (`PauseControl`, built in milestone 2) is placed on every page before any looping motion (WCAG 2.2.2), stops all looping animations and is reachable by keyboard; verify with Playwright.
- [ ] Using the pause toggle writes no cookie, `localStorage`, `sessionStorage` or IndexedDB entry; verify with Playwright.
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
- [ ] Each published case study has a Permissions entry in its project card (client OK for name, logo, screenshots and quotes; OK from every identifiable person shown or the image is cropped or blurred; collaborators asked) with date and form; verify by review ([LEG-006](SPEC.md#legal-requirements)).
- [ ] Images have fixed dimensions (no layout shift) and meaningful alternative text; verify with Lighthouse CLS and axe.
- [ ] Landing cards link to the right pages in both languages; verify with Playwright.
- [ ] David signs off on each page.

**Dependencies and risks:** **Blocked** until the case study template is designed on the canvas and the Kultomat project card is complete. Client permission for screenshots.

## Milestone 6: Launch readiness and launch

**Status:** planned

**Goal:** Publish the site on david-krapka.eu.

**Scope:**

- Contact links with the real address and prefilled subjects; LinkedIn and GitHub links; CV PDF.
- Privacy notice text in English and Czech ([LEG-003](SPEC.md#legal-requirements)), drafted as a separate task once the public email address is decided.
- Private record of the accepted Cloudflare agreement and Data Processing Addendum versions ([LEG-004](SPEC.md#legal-requirements)); Workers logs and observability off or covered by the notice.
- Portrait and CV hygiene ([LEG-007](SPEC.md#legal-requirements)): rights to the portrait documented, CV free of unwanted personal data, EXIF removed from committed images.
- `LICENSE` for the code and a content note for texts and images; one-page private record of processing ([LEG-009](SPEC.md#legal-requirements)).
- If the IČO is active again by launch, or before any paid job: business identification in the footer ([LEG-002](SPEC.md#legal-requirements)) and a review of the project-invitation wording ([LEG-001](SPEC.md#legal-requirements)).
- Favicon / monogram, Open Graph images, `sitemap.xml`, `robots.txt`, canonical URLs, JSON-LD `Person`.
- Final security headers in `public/_headers`, including a Content-Security-Policy; HSTS.
- Placeholder check that fails the production build if any `[…]` placeholder remains.
- Remove the temporary `/specimen/` page and its tests in `tests/e2e/design-system.spec.ts` (move the focus and CSP checks to real pages first).
- Pre-launch reviews: `audit-legal-readiness` (Pre-launch mode, reconciling the [planning report](audits/2026-11-04/legal-planning.md)), `audit-web-quality` (accessibility, SEO, performance), and a light `audit-security` of headers and dependencies.
- Remove `noindex` from `public/_headers` and update the `noindex` assertion in `tests/e2e/smoke.spec.ts`. Move DNS to Cloudflare: add the zone, compare every record with Websupport (especially Active24 MX, SPF, DKIM and DMARC), switch nameservers at Websupport, then attach `david-krapka.eu` as a Custom Domain and redirect `www` to the apex.

**Acceptance checks:**

- [ ] No placeholders remain; verify with the build check.
- [ ] `https://david-krapka.eu/` and `/cs/` serve the site with HTTPS, HSTS and the agreed security headers; verify with `curl -I` and an external header scanner.
- [ ] `https://www.david-krapka.eu/` redirects permanently to the apex; verify with `curl -I`.
- [ ] Email links open a message to the right address with the right subject; verify manually on desktop and phone.
- [ ] Sharing a page on LinkedIn shows the correct preview; verify with LinkedIn's post inspector.
- [ ] Audit reports are saved in `docs/audits/` and every launch-blocking finding is fixed or accepted by David.
- [ ] Email to the domain still arrives after the DNS change; verify by sending a test message.
- [ ] The privacy notice exists in both languages, is linked from every footer, states the real contact address, retention and rights, and has no placeholders; verify by reading both pages.
- [ ] The deployed site still stores nothing on the device (no cookies or browser storage) and sets no `Set-Cookie`; verify with a clean browser profile and `curl -I`.
- [ ] The Pre-launch legal audit reports each LEG requirement as supported, or David has accepted the gap.

**Dependencies and risks:** Content inputs below; legal findings; the public email address (blocks the privacy notice); access to Websupport to change nameservers; DNS change risk for email ([0007](decisions/0007-cloudflare-workers-hosting.md)).

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
| Written permissions for client names, screenshots and identifiable people ([LEG-006](SPEC.md#legal-requirements)) | Milestone 5 |
| Portrait photo with documented rights ([LEG-007](SPEC.md#legal-requirements)) | Milestone 6 |

## After launch

Possible next steps, each to be planned separately: Czech case studies (if not at launch), Playground of small experiments, a cookieless analytics tool, visitor interviews with both audiences, and a Systerna case study when it is ready.
