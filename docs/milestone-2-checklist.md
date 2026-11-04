# Milestone 2 checklist: Design system and site shell

Working plan for [Milestone 2](MILESTONES.md#milestone-2-design-system-and-site-shell). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** the shared look and structure every page uses, in both languages.

## Delivery plan: three PRs, one at a time

The milestone is split so work can start before the missing canvas designs exist. Each PR starts only after the previous one is merged or closed.

| PR | Branch (proposed) | Contents | Blocked by |
| --- | --- | --- | --- |
| A | `feat/i18n-routing-e2e` | Bilingual routing, typed dictionaries, base layout, unstyled placeholder pages, bilingual 404, Playwright and the `playwright` CI job | Nothing |
| B | `feat/design-system` | Design tokens, fonts and their licences, base typography, print utilities, buttons, section heading, focus styles, baseline CSP | Nothing |
| C | `feat/site-shell` | Header, mobile menu, language switcher, footer, pause toggle (static), privacy notice placeholder pages | Nothing (builds from the [shell proposal](design/shell-components.md)) |

## 0. Before starting (David)

- [x] Milestone 1 merged and complete ([PR #3](https://github.com/Phunkhouse/david-krapka/pull/3), evidence in [PR #5](https://github.com/Phunkhouse/david-krapka/pull/5)).
- [ ] Approve this plan, or name changes.
- [x] **Shell designs** (were blocking PR C): first proposal for the mobile menu, language switcher and pause toggle in [Shell components](design/shell-components.md), on the canvas page “Site shell · menu, switcher, pause”, made in the existing style (4 November 2026). David will iterate on it later, so PR C builds from this and updates the docs if the design changes. The 404 page and tablet header are still undesigned; PR C uses the proposal's rules for both.
- [x] **Focus ring**: agreed 4 November 2026: 3 px ink outline with 3 px offset on light backgrounds, 3 px yellow outline on ink ([Visual system](design/visual-system.md#focus)).
- [x] **Privacy notice Czech slug**: `/cs/privacy/` (decided 4 November 2026; same slug as English, recorded in [0005](decisions/0005-bilingual-routing.md)).
- [x] **Font delivery**: local provider with committed `woff2` files subset to Latin + Latin Extended and the `OFL.txt` files next to them (decided 4 November 2026, [0009](decisions/0009-self-hosted-font-files.md)).
- [ ] **Footer slot for business identification** ([LEG-002](SPEC.md#legal-requirements)): accept a slot for four short lines (name, place of business, IČO, registration note) without knowing the address yet. The slot renders nothing until filled. **Proposed sizing, to confirm:**
  - Sora 400, 14 px / 1.5 on desktop and 13 px / 1.5 on mobile (the footer is small text, below body size), `--ink-soft` on `--ink` (8.9:1).
  - Block above the © line, separated by a 1 px `--ink-line` rule; one line per item on desktop, wrapping on mobile, at most about 60 characters per line.
  - Footer navigation and the privacy link stay Space Mono 12 px uppercase labels (the mono label size), so the legal block reads as plain text and the links as navigation.
- [x] Adding the required status `playwright` to the `protect-main` ruleset is approved (4 November 2026). It can only be done at the end of PR A, after the job has run once.
- [x] Decide on the optional Claude PR review workflow from the starter pack (carried over from milestone 1): yes, 4 November 2026, as its own small PR right after the planning PR and before PR A. Not required for milestone 2.
  - [ ] David installs the [Claude GitHub App](https://github.com/apps/claude) on the repository and saves a `claude setup-token` token as the Actions secret `CLAUDE_CODE_OAUTH_TOKEN` (never in chat or files).
  - [ ] Copy `recipes/claude-pr-review/files/.github/workflows/claude.yml` from the starter pack; `actionlint` clean; mention the workflow in `AGENTS.md`.
  - [ ] After merge (the workflow must be on `main`), comment `@claude review` on the next PR and record the run and response.

## PR A: Routing, layout and end-to-end tests

### A1. Branch and docs

- [ ] Branch from up-to-date `main`; draft PR; `check` skipped on the draft (intended).
- [ ] Check the Astro 7.4 docs for i18n routing (`i18n`, `prefixDefaultLocale`, `getRelativeLocaleUrl`, `Astro.currentLocale`), the `site` option and 404 pages before configuring.

### A2. Bilingual routing

- [ ] `astro.config.mjs`: `site: 'https://david-krapka.eu'`, `i18n` with `locales: ['en', 'cs']`, `defaultLocale: 'en'`, `routing.prefixDefaultLocale: false`. Keep `trailingSlash: 'always'`.
- [ ] Pages: `src/pages/index.astro` (EN) and `src/pages/cs/index.astro` (CS) using one shared layout.
- [ ] `src/layouts/BaseLayout.astro`: `<html lang>` from the locale, title and description from the dictionary, `<link rel="alternate" hreflang="en|cs|x-default">` and a canonical URL built from `site`. A skip link to `#main`.
- [ ] Route map in one place (for example `src/i18n/routes.ts`) that gives each page's path in both languages, so the switcher, `hreflang` and later the sitemap use the same source.

### A3. Typed dictionaries

- [ ] `src/i18n/en.ts` is the source of keys; `src/i18n/cs.ts` is typed against it (for example `satisfies Dictionary` where `Dictionary` is derived from `en`), so a missing or misspelt Czech key fails `pnpm typecheck`.
- [ ] A small helper returns the dictionary for `Astro.currentLocale`; no barrel exports.
- [ ] Shell strings only for now: site title, description, navigation labels (Work · Approach · About · Contact / Práce · Přístup · O mně · Kontakt), skip link, language names, 404 text, footer lines.
- [ ] Evidence: delete one Czech key locally, record the `pnpm typecheck` error, restore it.

### A4. Bilingual 404

- [ ] `src/pages/404.astro` with English and Czech text on one page and links to `/` and `/cs/`. Check it is still served by `wrangler.jsonc` (`not_found_handling: "404-page"`) through `pnpm preview:cloudflare`.

### A5. Playwright

- [ ] Add `@playwright/test` (pinned exactly) and `@axe-core/playwright`. Check the current Playwright docs for config and the web-server option.
- [ ] `playwright.config.ts`: runs against the built site (`pnpm build` then `pnpm preview`), Chromium only to start; add WebKit if it stays cheap.
- [ ] Script `test:e2e` (`playwright test`); update `AGENTS.md` Commands and the SPEC commands paragraph. Decide whether `verify` should include it (recommendation: no, keep `verify` fast; CI runs it in its own job).
- [ ] First smoke tests in `tests/e2e/`:
  - [ ] `/` has `<html lang="en">`, `/cs/` has `<html lang="cs">`, each with one `h1`.
  - [ ] `hreflang` alternates and canonical point to the right absolute URLs.
  - [ ] Unknown path shows the bilingual 404 (status 404 on `pnpm preview:cloudflare`; note if `astro preview` differs).
  - [ ] Request listener: no request leaves the page's origin on load.
  - [ ] Storage check: no cookies, `localStorage`, `sessionStorage` or IndexedDB databases after load ([LEG-005](SPEC.md#legal-requirements)).
  - [ ] No horizontal scroll at 320 × 640.
  - [ ] axe has no violations on both pages.
- [ ] Ignore `test-results/`, `playwright-report/` and `blob-report/` in Git, Prettier and ESLint.

### A6. CI

- [ ] Re-clone the starter pack to a scratch directory and adapt `recipes/ci-strategy/examples/budget-e2e.yml` to `.github/workflows/e2e.yml`, job name `playwright`: same draft skip as `check` (job-level `if`, no install on drafts), Node from `.nvmrc`, pnpm cache, Playwright browsers installed with dependencies (cache them if the recipe does), report uploaded as an artifact on failure.
- [ ] `actionlint` clean.
- [ ] After the first full `playwright` run on the ready PR, add `playwright` (source GitHub Actions) as a required status in `protect-main` (David or with David's approval).
- [ ] Update `AGENTS.md` (Validation strategy, Commands) and [0002](decisions/0002-budget-conscious-ci.md) if the e2e job changes the policy.

## PR B: Design system

### B1. Tokens and base styles

- [ ] `src/styles/tokens.css`: colours from [Visual system](design/visual-system.md#colours) (`--ink`, `--paper`, `--yellow`, `--pink`, `--tint`, `--ink-soft`, `--ink-line`), border width, offset shadows, spacing steps (14, 18, 24, 28, 48, 56 px and section padding), breakpoints as comments (custom media is not native CSS), content max width 1440 px.
- [ ] Fluid type scale with `clamp()` between the 390 px and 1440 px values in the [type scale](design/visual-system.md#type-scale) (H1, H2, contact, about, card titles, body large, body, mono label).
- [ ] `src/styles/global.css`: modern reset, paper background, ink text, Sora body, Rubik 900 uppercase headings with tight tracking, Space Mono label class, `prefers-reduced-motion` base rule. Imported once from `BaseLayout`.
- [ ] From this PR on, `docs/design/visual-system.md` points to `tokens.css` as the reference for exact values.

### B2. Fonts and licences

- [ ] Configure Rubik 900, Sora 400/600/700 and Space Mono 400/700 through the Astro Fonts API (`fonts` in `astro.config.mjs`, `<Font cssVariable preload />` in the layout) with the provider chosen in section 0. Latin + Latin Extended only.
- [ ] Check Czech glyphs render in all three faces (ř, ě, ů, č, Ř, Ů) on a test string in the placeholder page.
- [ ] Measure total font payload in `dist/` (target ≤ 150 KB, SPEC performance). Record the number in the PR.
- [ ] Ship `OFL.txt` for Rubik, Sora and Space Mono (for example `public/fonts/licenses/<family>-OFL.txt`), or show that the served files keep copyright and licence metadata ([LEG-008](SPEC.md#legal-requirements)). Evidence: list the files in `dist/`.
- [ ] No request to Google Fonts or any other host at runtime (the PR A request test keeps passing).

### B3. Print utilities

Each utility is a class or small component, decorative output `aria-hidden="true"`, documented in a comment with its source in the visual system.

- [ ] Halftone text in three densities (large, medium, small).
- [ ] Misregistered pink copy (offset, 45–55 % opacity, `multiply`).
- [ ] Yellow paper surface (faint ink dot screen).
- [ ] Pink dot screen.
- [ ] Rollers (36 / 18 / 22 px variants).
- [ ] Offset shadows (heading and card).
- [ ] Highlight (yellow behind a word fragment).
- [ ] A temporary, unlinked specimen page (for example `/_specimen/`, excluded from the sitemap later and `noindex` already) showing every token, type step and utility, for David's visual review on the preview URL. Remove it before launch (track in milestone 6) or keep it out of the production build.

### B4. Shared components

- [ ] `Button` (primary: ink with yellow text; secondary: yellow with ink border; pill shape; renders `<a>` or `<button>`).
- [ ] `SectionHeading` (eyebrow label, heading level as a prop, offset shadow).
- [ ] Focus styles from the agreed rule: visible on paper, yellow and ink backgrounds; never yellow on paper.

### B5. Security headers

- [ ] Check the Astro 7.4 docs for its CSP support and for inline scripts or styles in the build output.
- [ ] Add a baseline `Content-Security-Policy` to `public/_headers` that allows only `'self'` (plus hashes if Astro inlines anything). Final review stays in milestone 6. Note: the milestone 1 checklist deferred CSP to this milestone.
- [ ] `pnpm preview:cloudflare` shows the header and the browser console has no CSP violations on both pages and the specimen.

## PR C: Site shell

### C1. Design handoff

- [ ] Build from [Shell components](design/shell-components.md). If David's iteration changes the design before or during this PR, update that document (and the canvas version, once the canvas has boards for these) in the same PR.

### C2. Header and navigation

- [ ] `Header.astro`: wordmark “DAVID KŘAPKA” with “Product-minded engineer”, anchor links Work · Approach · About · Contact pointing to the landing sections (`/#work` from other pages), in a `<nav>` with an accessible name.
- [ ] Mobile menu: round 48 px button that opens the designed panel. Without JavaScript the button is a link to the footer navigation (SPEC failure case). With JavaScript: `aria-expanded`, `aria-controls`, Escape closes and returns focus to the button, focus stays reachable in the panel. Script inline in the component, no framework.

### C3. Language switcher

- [ ] Links to the same page in the other language using the route map from A2, with `hreflang` and `lang` on the link and an accessible label (“Česky” / “English”). No automatic redirect, nothing stored ([0005](decisions/0005-bilingual-routing.md), [LEG-005](SPEC.md#legal-requirements)).

### C4. Footer

- [ ] Ink background; © year from the build date; “Printed in three inks…” line in both languages.
- [ ] Footer navigation (also the no-JavaScript target for the menu).
- [ ] Link to the privacy notice in the current language ([LEG-003](SPEC.md#legal-requirements)).
- [ ] Business identification slot ([LEG-002](SPEC.md#legal-requirements)): an optional dictionary or config entry that renders the block only when present. Empty now, so nothing renders.

### C5. Pause-motion toggle (static)

- [ ] Rendered as designed, keyboard reachable, with a text label in both languages. No behaviour yet (milestone 4); hide it or mark it inert so it does not mislead before motion exists. Decide which with David.

### C6. Privacy notice placeholder

- [ ] Routes `/privacy/` and the Czech route chosen in section 0, added to the route map, `hreflang` paired, linked from every footer.
- [ ] Placeholder body that says the notice is being prepared. Use the `[…]` placeholder convention so the milestone 6 build check catches it.

### C7. Tests

- [ ] Playwright: the switcher links `/` ↔ `/cs/` and `/privacy/` ↔ its Czech page; storage stays empty after using the switcher and the menu.
- [ ] Playwright: keyboard tabbing reaches every header, menu and footer link; the menu opens, traps nothing, and closes with Escape.
- [ ] axe on both pages, the 404 and both privacy pages, at desktop and 320 px widths.
- [ ] No horizontal scroll at 320 × 640 on every page.

## Acceptance checks (from MILESTONES.md)

Record evidence here and in the PR that completes each check.

- [ ] `/` and `/cs/` render the shell with `<html lang="en">` and `<html lang="cs">`, and the switcher links between them; verify with Playwright. (PR A for `lang`, PR C for the switcher.)
- [ ] A missing Czech key fails `pnpm typecheck`; verify by deleting one key locally. (PR A)
- [ ] No request leaves the site's own origin on page load; verify in the browser network panel and with a Playwright request listener. (PR A, re-checked after fonts in PR B)
- [ ] The site stores nothing on the device: no cookies, `localStorage`, `sessionStorage` or IndexedDB after load and after using the language switcher; verify with Playwright and `curl -I` (no `Set-Cookie`) ([LEG-005](SPEC.md#legal-requirements)). (PR A, completed in PR C)
- [ ] The three licence files, or readable font metadata, are in the build output ([LEG-008](SPEC.md#legal-requirements)); verify in `dist/`. (PR B)
- [ ] Keyboard alone reaches every link and the menu, with a visible focus ring on paper and on ink; verify manually and with an axe check in Playwright. (PR C)
- [ ] No horizontal scroll at 320 px; verify in Playwright at 320 × 640. (PR A, re-checked in PR C)
- [ ] Draft PR defers both `check` and `playwright`; ready PR runs both; verify in the Actions tab. (PR A)
- [ ] David signs off on the specimen page (PR B) and the shell on the preview URL (PR C).

## Wrap-up

- [ ] Update MILESTONES.md: milestone 2 status `done`, completion evidence (PR links), status date, and any unplanned changes.
- [ ] Update SPEC.md: languages row from proposal to confirmed, fonts row with the chosen provider, commands with `test:e2e`, and resolved open questions.
- [ ] `AGENTS.md` lists every new command and the e2e job.

## Risks and notes

- PR C builds from a first proposal. Expect design changes after review; keep the components simple to restyle.
- Astro's i18n helpers and the Fonts API change between versions; check the docs for the installed version before using them, and pin what you use.
- A Fontsource provider makes every build depend on the network (Cloudflare Workers Builds and CI included). The local provider avoids that at the cost of committing font files.
- `astro preview` and `wrangler dev` can differ on 404 status and trailing slashes. Playwright runs against one of them; note which, and check the other by hand.
- Required checks: `playwright` must have run once before the ruleset can require it. A skipped job on a draft never gates a merge, because drafts cannot be merged.
- The specimen page must not reach the launched site.
