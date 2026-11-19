# Code cleanup audit: david-krapka

- Date: 2026-11-19
- Scope: application source in `src/` (pages, layouts, components, i18n, content helpers, styles), the build and check scripts in `scripts/`, `public/` assets, `astro.config.mjs` and `package.json`. The Playwright tests were read only to find consumers and existing coverage, not audited themselves. Case study MDX text and `docs/` were out of scope, except where a doc repeats a stale code comment.
- Audited project commit: `b08f370` (`main`, clean before this report)
- Toolkit commit: `93655271c449dd4563b48bd69218a0cc12511451` (`ai-audit-toolkit`, resolved through the skill symlink)
- Toolkit working tree: clean
- Previous audit: none for code cleanup. Related: `docs/audits/2026-11-19/test-ci.md` (TCI-002 also touches the build, but does not overlap).
- Evidence sources and access limitations: source reading; scripted searches for consumers of every component, design token, print-motif class, dictionary key and public file; one bounded font-usage check in a disposable clone (see "Checks without findings"). There is no published API or outside consumer: the site is a static build deployed by Cloudflare Workers Builds.

## Executive summary

The codebase is small (about 6,000 lines of Astro, TypeScript and CSS) and in good shape. Every component, design token, print-motif class, dictionary key and public file has a consumer. All dependencies are used, and no TODOs are left. Nothing qualifies for removal.

The findings are all **Low** and are about keeping related code in one place:

- The locale is worked out in four different ways, one of them misleading (CLN-001).
- The landing "Selected work" cards repeat their markup and their card list (CLN-002).
- Header and Footer each keep their own list of landing sections (CLN-003).
- The mobile/desktop text swap is copied across three sections (CLN-004).
- Several comments describe how things worked before (CLN-005).
- A few smaller simplifications (CLN-006 to CLN-008).

None of them blocks a release.

| Severity | Confirmed | Suspected |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 0 | 0 |
| Low | 8 | 0 |

## Release blockers

None.

## Coverage log

| Area | Coverage | Evidence or method | Limitation |
| --- | --- | --- | --- |
| Pages and routing (`src/pages/`, `src/i18n/routes.ts`) | Reviewed | All 9 page files and the sitemap endpoint read | — |
| Layouts | Reviewed | `BaseLayout.astro`, `CaseStudyLayout.astro` read in full | — |
| Shell components (Header, Footer, LanguageSwitcher, Button, SectionHeading, Mark, PauseControl) | Reviewed | Read in full, except PauseControl styles (sampled) | — |
| Landing sections (`src/components/landing/`) | Reviewed (Work, Contact frontmatter, PersonSchema), sampled (Hero, Approach, About, Experience) | Read in part; targeted searches for repeated patterns | Not every style rule in the four large sections was compared |
| Case study components and MDX map | Reviewed | All 8 files' props and logic; styles sampled | — |
| i18n and content helpers | Reviewed | `index.ts`, `routes.ts`, `en.ts`, `load.ts`, `projects.ts`, `profiles.ts`, `content.config.ts`; script listing dictionary keys and how often each is referenced | `cs.ts` checked only for duplicate strings (its keys are type-checked against `en.ts`) |
| Styles | Reviewed | `tokens.css`, `global.css`, `print.css`; script counting `var(--token)` and motif-class uses | — |
| Scripts | Reviewed (check scripts), sampled (asset generators) | Post-build checks read in full; generators' helpers listed | Generators not run |
| Public files and assets | Reviewed | Each file name searched in source, config and tests | Font files are referenced through a template in `astro.config.mjs` |
| Dependencies | Reviewed | `package.json` against imports, scripts and config | — |

## Findings

### CLN-001: The locale is worked out in four different ways

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location:
  - `src/components/PrivacyNotice.astro:7,14`
  - `src/pages/privacy.astro:6,14` and `src/pages/cs/privacy.astro:6,14`
  - `src/pages/index.astro:12` and `src/pages/cs/index.astro:12`
  - `src/layouts/BaseLayout.astro:34-35`
  - `t(Astro.currentLocale)` in `src/components/case-study/{Decision,Outcome,Figure,AiAndMe}.astro`
- Evidence: The same rule, "a known locale, or English otherwise", is written four ways:
  - an `isLocale(...) ? ... : 'en'` ternary, three times;
  - `t()`'s own fallback, in 6 places;
  - `PrivacyNotice`, which takes `locale: string | undefined` and works out its language by comparing dictionary objects: `t(locale) === t('cs') ? 'cs' : 'en'`;
  - the privacy pages, which pass `Astro.currentLocale` unchecked, when every other page component receives a typed `Locale`.
- Counter-evidence: All variants behave the same today. The two locales are static, and the dictionary comparison works because `t()` returns shared objects.
- Impact: Adding or renaming a locale means finding every variant. The identity comparison breaks silently if `t()` ever returns a copy, for example after adding a fallback merge for missing keys. Readers also have to work out four spellings of one rule.
- Remediation: Add `localeOf(value: string | undefined): Locale` to `src/i18n/index.ts` and make `t()` use it. Use it in the pages and `BaseLayout`. Give `PrivacyNotice` a `locale: Locale` prop and index `notices[locale]` directly.
- Verification: `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` (`shell.spec.ts` privacy tests and `seo.spec.ts` `lang`/hreflang tests for both languages). Built HTML of `/privacy/` and `/cs/privacy/` should be unchanged (`diff -r` of `dist/` before and after).

### CLN-002: Landing work cards repeat their markup and their card list

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location:
  - `src/components/landing/Work.astro:111-170`: the project-card loop, and the in-progress card copied from it
  - `src/components/landing/Work.astro:23-27,35-49`: card slugs and links assembled separately for each card group
  - `src/content/projects.ts:45-53`: `cardFor()` builds the same `[featured, ...projects, inProgress]` list again
- Evidence: The in-progress `<li>` repeats the project card's 25 lines. The only differences are the extra `card--progress` class and different variable names (`inProgressHref`, `inProgressPreview`). The list of all cards is built twice: `cardSlugs` in `Work.astro` and `cardFor()` in `projects.ts`. That is a rule ("the landing cards are featured + projects + in progress") that both copies must follow.
- Counter-evidence: The featured card has a different layout (larger picture sizes, its own classes), so it should stay separate. The duplicated project markup was probably written while Systerna was the only in-progress project.
- Impact: A change to the card, such as a new field, link behaviour or accessibility fix, has to be made twice. The in-progress card is easy to miss because it sits after the loop. A new card group would need edits in both `Work.astro` and `projects.ts`.
- Remediation:
  - In `projects.ts`, export `landingCards(locale)` returning `{ featured, cards }`. `cards` should be `[...projects, { ...inProgress, progress: true }]`, with `preview` and `href` filled in.
  - Use it in `cardFor()` and for the slug check in `Work.astro`.
  - Render one loop with `class:list={['card', { 'card--progress': card.progress, 'is-link': card.href }]}`.
- Verification: `pnpm build`, then compare the landing `dist/` HTML before and after, which should be identical except for attribute order. `pnpm test:e2e landing.spec.ts case-study.spec.ts` (card links, published-only links, both locales).

### CLN-003: Header and Footer each keep their own list of landing sections

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location: `src/components/Header.astro:15-24`; `src/components/Footer.astro:23-29`
- Evidence: Both files list the same four landing sections with the same labels, in the same order: `work`, `approach`, `about`, `contact`, using `copy.nav.*` and `` `${home}#…` ``. The ids must also match the `id` attributes in the landing sections.
- Counter-evidence: Each component adds its own extras: the header numbers its links, and the footer appends Privacy. Those stay local.
- Impact: Adding, renaming or reordering a section means editing both lists. If they drift, the header and footer navigation disagree.
- Remediation: Export `sectionLinks(locale)` (an `id`, `href` and `label` for each section) from `src/i18n/routes.ts` next to `pathFor`. Map it in both components: the header adds counters, the footer appends Privacy.
- Verification: `pnpm test:e2e shell.spec.ts` (header, mobile menu and footer navigation in both locales). Header and footer HTML in `dist/` should be unchanged.

### CLN-004: The mobile/desktop text swap is copied into three sections

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location: `.long` / `.short` rules in:
  - `src/components/landing/Work.astro:214-216,451-457`
  - `src/components/landing/Approach.astro:143-145,264-270`
  - `src/components/landing/Contact.astro:174-176,276-282`
- Evidence: All three use the same markup (`<span class="long">` / `<span class="short">`) and the same rules: hide `.long` below 720 px, and show `.long` / hide `.short` from 720 px. They follow one dictionary convention, documented at `src/i18n/en.ts:98-99`: "each `*Short` text is the mobile version". That is one shared design rule kept in three scoped copies.
- Counter-evidence: Scoped styles keep each section self-contained, and the duplicated CSS is small (about 10 lines each).
- Impact: Moving the breakpoint, or changing how the swap works, means three edits. A fourth section would copy it again.
- Remediation: Move the rule into `src/styles/global.css` as a utility, `.text-long` / `.text-short`, with the 720 px query and a comment pointing to the dictionary convention. Then remove the local copies. See the UI candidates table below.
- Verification: `pnpm build`, then `pnpm test:e2e landing.spec.ts` (it checks the short texts on mobile). Spot-check at 390, 768 and 1440 px that each viewport shows exactly one version. `pnpm check:fonts`.

### CLN-005: Several comments describe how things worked before

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location and evidence:
  - `src/layouts/BaseLayout.astro:41-42` says case studies share the site-wide image "until their OG-Case image exists". But `CaseStudyLayout.astro:29,41-46` always passes `data.ogImage ?? previewFor(slug)`, so case studies never use the site-wide image. `docs/design/visual-system.md:113` repeats the outdated claim.
  - `src/components/landing/Work.astro:22`: "Systerna keeps its in-progress card; it links once its case study is built." The Systerna case study was published in #46 (`draft: false` in both languages), so the card already links.
  - `scripts/placeholders.mjs:5-6` ("part of pnpm verify since launch") and `scripts/check-fonts.mjs:3` ("part of `pnpm verify`") leave out CI job `check`, which runs both since #47.
- Counter-evidence: `check-drafts.mjs:7` already says "as in `pnpm verify` and CI"; only the other two lag behind.
- Impact: A maintainer looking for the case study social image fallback is sent to the wrong one. The Work comment suggests a pending state that no longer exists.
- Remediation:
  - Reword the BaseLayout comment to "landing and privacy pages".
  - Fix the design-doc sentence: case studies use the project preview or their own `ogImage`.
  - State the current Systerna situation: published, kept under "In progress" by choice.
  - Add "and CI job `check`" to the two script headers.
- Verification: Read the changes against `CaseStudyLayout.astro` and `ci.yml`. No build output changes.

### CLN-006: Three check scripts each hand-roll a recursive file walk

- Severity: Low
- Confidence: Medium
- Status: Confirmed
- Previous finding: none
- Location: `scripts/check-drafts.mjs:25-30` (`files`); `scripts/placeholders.mjs:17-26` (`htmlFiles`); `scripts/check-fonts.mjs:33-43` (`htmlFiles`, identical to the one in `placeholders.mjs`)
- Evidence: Three recursive walkers built on `readdirSync` and `statSync`. The project requires Node ≥ 26 (`package.json` `engines`, `.nvmrc`), and `readdirSync(dir, { recursive: true })` has been available since Node 20.1.
- Counter-evidence: The recursive option returns paths relative to the starting directory and does not follow symlinked directories, unlike `statSync`. `dist/` contains no symlinks today. Each walker is about 8 lines.
- Impact: Small. There are two identical copies to keep in step, and three ways to list files where the runtime provides one.
- Remediation: Replace each walker with `readdirSync(root, { recursive: true }).filter(...)` joined to `root`. A shared helper module is not worth adding for this.
- Verification: `pnpm build`, then `pnpm check:fonts`, `pnpm check:drafts`, `pnpm placeholders --fail`. The output should match the current counts (15 pages, 0 drafts, 0 placeholders). Also try a throwaway local `dist/` containing a placeholder and confirm `--fail` still exits 1.

### CLN-007: The two landing page files are identical

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location: `src/pages/index.astro` and `src/pages/cs/index.astro` (29 lines each, identical except for import paths)
- Evidence: Both import the same 7 components and render the same section list in the same order. Adding, removing or reordering a landing section has to be done in both files.
- Counter-evidence: Astro's file-based i18n routing (decision 0005, `prefixDefaultLocale: false`) needs a route file for `/` and one for `/cs/`. `landing.spec.ts` runs for both locales, so a forgotten section would probably be caught. The privacy and case study route pairs are 15–21 lines each and very unlikely to change, so those are best left alone.
- Impact: Section order is a design decision that should change in one place.
- Remediation: Move the body into `src/components/landing/HomePage.astro` (props: `locale`). Each route file then becomes a 5-line wrapper.
- Verification: `pnpm build`; `dist/index.html` and `dist/cs/index.html` should be identical to before. Then `pnpm test:e2e landing.spec.ts seo.spec.ts`.

### CLN-008: CSS rules for the same selector are split in two places

- Severity: Low
- Confidence: High
- Status: Confirmed
- Previous finding: none
- Location: `src/layouts/BaseLayout.astro:126-130` and `:151-154` (two `main { … }` blocks); `src/components/landing/Hero.astro:305-312` (two consecutive `.intro { … }` blocks inside one media query)
- Evidence: The declarations don't conflict, so each pair merges without changing what is applied.
- Counter-evidence: None. This is purely tidiness.
- Impact: Readers see only half of `main`'s layout rules when they find the first block.
- Remediation: Merge each pair.
- Verification: `pnpm build`. The compiled CSS in `dist/` should be the same apart from rule order. Spot-check the landing and privacy pages at 390 and 1440 px.

## Code cleanup assessment

| Priority and finding | Proposed change | Expected benefit | Effort and regression risk | Verification |
| --- | --- | --- | --- | --- |
| 1 · CLN-001 | `localeOf()` helper; `PrivacyNotice` takes `Locale` | One rule for a new locale; removes a misleading comparison | Low effort; low risk (types catch callers) | typecheck, `dist/` diff, privacy/seo E2E |
| 2 · CLN-005 | Fix four stale comments and one design-doc sentence | Comments match behaviour | Very low | Review only |
| 3 · CLN-002 | One card list in `projects.ts`, one card loop in `Work.astro` | Card changes made once; the in-progress card can't drift | Low effort; low risk | Landing `dist/` diff, landing and case study E2E |
| 4 · CLN-003 | `sectionLinks(locale)` shared by Header and Footer | Section nav changes once | Low effort; low risk | shell E2E, `dist/` diff |
| 5 · CLN-004 | Global `.text-long/.text-short` utility | One breakpoint for the dictionary convention | Low effort; medium visual risk (cascade order of scoped vs global rules) | landing E2E plus visual check at 390/768/1440 |
| 6 · CLN-007 | `HomePage.astro` shared by both landing routes | Section order in one place | Low effort; low risk | `dist/` identical, landing E2E |
| 7 · CLN-008 | Merge split rules | Readability | Trivial | `dist/` CSS diff |
| 8 · CLN-006 | `readdirSync(..., { recursive: true })` in check scripts | Fewer hand-rolled helpers | Low effort; low risk | Same counts from all three checks |

CLN-001, 003, 005, 007 and 008 fit in one small refactor PR, because each one leaves the build output identical. CLN-002 and CLN-004 deserve their own commits, with a `dist/` diff and visual check.

### Shared UI candidates

| Pattern and locations | Shared intent and intentional variants | Adoption decision and rationale | Effort, risk and verification |
| --- | --- | --- | --- |
| Long/short copy swap: Work, Approach, Contact (CLN-004) | Same 720 px breakpoint, same dictionary convention; no variants | **Share as a global utility** in `global.css` | Low; verify each viewport shows one version, at 390/768/1440 |
| Pill CTA: `Button.astro`; mobile menu `.menu-cta` (`Header.astro:374-385`); hero contact button on desktop (`Hero.astro:327-334`) | The hero already uses `Button` and only overrides its mobile shape. `.menu-cta` looks like `Button` primary on ink, but is full width, inherits the menu's font size and has no hover lift | **Keep local.** Adopting `Button` would need width and size overrides about as long as the 10-line rule it replaces. Revisit if a third pill CTA appears outside `Button` | — |
| Hard offset shadows: 30+ literal `box-shadow` / `text-shadow` values across Work, Experience, Contact, Figure, NextProject, CaseStudyLayout | `visual-system.md:76` sets the sizes per element ("8–12 px on cards", "6 px 5 px on headings") and steps them up at breakpoints. The tokens `--shadow-card`, `--shadow-card-ink` and `--shadow-heading` cover only a few of the sizes | **Keep local.** The values are different on purpose, per element and breakpoint, so a token per size would just rename them. Only `--shadow-heading` has a clear repeated meaning, and it is already a token | — |
| Pink at 60% (`rgb(255 72 176 / 0.6)`) in `Header.astro:351`, `PauseControl.astro:136`, against the `--pink-overprint` token (0.55) | `visual-system.md:21,76` allows 45–60% | **Keep.** Within the design range; not drift | — |
| Responsive visually-hidden label in `Hero.astro:295-301` (same declarations as global `.visually-hidden`) | It is un-hidden from 720 px, which the global class can't do without its own override | **Keep local** | — |

## Not verified

| Area | Why | Evidence needed | How to get it |
| --- | --- | --- | --- |
| Visual parity of CLN-004 | No refactor was made | Screenshots before and after at 390, 768 and 1440 px | Playwright screenshot comparison in the implementing PR |
| Full style comparison inside the four large landing sections (Hero, Approach, About, Experience) | Only sampled | Rule-by-rule comparison | Look again if those sections are being redesigned |

## Checks without findings

- **Reachability.** All 23 components, both layouts and the MDX component map have consumers: MDX files use `Decision`, `Figure`, `AiAndMe`, `Outcome(s)` and `Re`. Every dictionary key is referenced, and every design token is used outside `tokens.css` (`--pink-overprint` through `--shadow-heading`). Every print-motif class in `print.css` is used. Every `public/` file is referenced by markup, the manifest, `_headers` or scripts. Font files are loaded through the `variants()` template in `astro.config.mjs`.
- **Space Mono 400 is not dead.** It is configured but unused on the landing page (`design-system.spec.ts:20-21`). In a disposable clone of `b08f370` I loaded all 15 sitemap pages plus a 404, at 390 and 1440 px, through `wrangler dev`. It loaded on 20 of those 32 page views, all of them case study pages. Keep it.
- **Draft machinery.** Every case study is currently `draft: false`. `draftsVisible`, the Figure placeholder box, the summary highlight and `check:drafts` are not dead, though. They serve a supported workflow (decision 0011, Workers Builds preview branches) and are enforced in CI.
- **`check-drafts.mjs:14-18`** re-implements `draftsVisible()` from `load.ts:16-21`. If the two drift, the script fails loudly rather than letting a draft through. The script is plain Node and `load.ts` depends on `import.meta.env`, so keeping them separate with the existing cross-reference is reasonable.
- **Asset scripts.** `brand-assets.mjs` and `work-previews.mjs` each define a small `font()`, and `flash-check.mjs` and `portrait.mjs` each define an `option()` parser. These are manual, independent tools; sharing them would only couple them.
- **Duplicate copy.** In both languages, `site.description` equals `home.hero.intro`, and `menu.cta` equals `contact.project.link`. Each pair serves a different place (meta description and visible intro; menu and contact card). Separate keys let them diverge, so keep them.
- **Dependencies.** Every `dependencies` and `devDependencies` entry is imported, configured or invoked by a script.
- **No TODO or FIXME comments.** The time-bound comments that exist ("for now" in `Experience.astro:14`, "until" in `Decision.astro:11`) still describe current behaviour.
- **Source tree.** `git status` was clean before writing this report. The font check ran only in the disposable clone in the session scratchpad.
