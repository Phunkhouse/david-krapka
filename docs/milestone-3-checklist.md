# Milestone 3 checklist: Landing page (static)

Working plan for [Milestone 3](MILESTONES.md#milestone-3-landing-page-static). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** the full landing page in both languages matching the mockups, with no motion yet.

**Static means the reduced-motion look.** Everything built here is the state a visitor sees with `prefers-reduced-motion: reduce`. Milestone 4 adds motion on top without changing the markup that carries meaning. Decorative parts (drum, halftone letters, rollers, portrait art) are `aria-hidden` from the start.

## Delivery plan: three PRs, one at a time

Sections are grouped so each PR is a reviewable part of the page on the preview URL. Each PR starts only after the previous one is merged or closed. Sections not built yet are simply absent; the header links to them stay (they jump nowhere until the section lands).

| PR | Branch (proposed) | Contents | Blocked by |
| --- | --- | --- | --- |
| A | `feat/landing-hero-work` | Landing dictionary structure, section scaffold and anchors, hero (static drum), Selected work | Hero decisions in section 0 |
| B | `feat/landing-approach-experience` | How I think & build with “AI + me”, Experience (E3) | Nothing |
| C | `feat/landing-about-contact` | About (static portrait), Contact, placeholder report, tablet pass, Lighthouse, final screenshots | Contact link decision in section 0 |

## 0. Before starting (David)

Each item has a recommendation; answering “as recommended” is enough. Decisions go into the design docs in the PR that implements them.

- [x] Milestone 2 merged and complete ([PR #10](https://github.com/Phunkhouse/david-krapka/pull/10), follow-ups in [PR #11](https://github.com/Phunkhouse/david-krapka/pull/11)).
- [x] Approve this plan, or name changes. Approved by merging [PR #12](https://github.com/Phunkhouse/david-krapka/pull/12).
- [x] **Reduced-motion / static hero** (blocks PR A). Recommendation: the H1 shows “Think. Make. Rethink.” as visible text on three lines (no hidden duplicate needed in the static state); the drum is frozen on T with the counter at 1/3; the subline shows all three sentences as a short list, or only the first one. Pick: three sublines or one. **Decided:** three lines, all three sublines, drum frozen on T.
- [x] **Mobile intro sentence** (blocks PR A). Recommendation: show it on mobile too, below the subline, so the role is described above the fold for visitors and search engines. **Decided:** no, keep the mockup (desktop and tablet only).
- [x] **Experience in the navigation.** Recommendation: no; keep the four designed items. The section keeps its `#experience` anchor. **Decided:** no.
- [x] **Sticky header** (carried from the milestone 2 review). Recommendation: not sticky; the mockups do not show one. If sticky, PR A re-checks the menu layout and adds `scroll-margin-top` to every section. **Decided:** not sticky.
- [x] **Tablet range (720–1099 px).** Recommendation: accept the [breakpoint proposal](design/visual-system.md#breakpoints-proposal) and judge it from screenshots at 768 and 1024 px in PR C, rather than designing it on the canvas first. **Decided:** accept the proposal; judged from screenshots in PR C.
- [x] **Project card links before case studies exist** (milestone 5). Recommendation: cards render as designed but are not links yet, and the “Read the case study →” line is left out until the pages exist. Milestone 5 adds the links and its acceptance check already covers them. Alternative: keep the line as a `[…]` placeholder. **Decided:** cards are not links yet.
- [x] **Contact links before the email address is decided** (milestone 6). Recommendation: build both card links as `mailto:` with the prefilled subjects (“Role: …” / “Project: …”) from one constant, whose address is a `[email address]` placeholder for now; LinkedIn and GitHub stay `[…]` text, not links. The CV link in Experience stays `[Download CV]` text, not a link. **Decided:** mailto with a `[email address]` placeholder and prefilled subjects; LinkedIn, GitHub, CV as placeholder text.
- [ ] Any confirmed copy that can replace placeholders now: Emplifi role and dates, freelance start year, About personal note, Kultomat one-line summary (see [Content inputs](MILESTONES.md#content-inputs-owner-david)). Placeholders are allowed in this milestone.

## Shared rules for every PR

- Copy lives in `src/i18n/en.ts` and `cs.ts` under `home.*`, one group per section; Czech is typed against English, so missing keys fail `pnpm typecheck`. Shorter mobile variants are separate keys, shown or hidden with CSS (`display: none`, so screen readers get one version).
- Missing content keeps the `[…]` convention so the milestone 6 build check catches it.
- One `h1` per page; section titles are `h2` through `SectionHeading`, card titles `h3`.
- Reuse the milestone 2 tokens, print utilities, `Button` and `SectionHeading`. New repeated values go into `tokens.css`, not into a component.
- Section components in `src/components/landing/` (one per section), used by both `src/pages/index.astro` and `src/pages/cs/index.astro`.
- No client JavaScript in this milestone. No images except inline SVG or CSS art; the Kultomat screenshot and the portrait stay placeholders.
- Measured against the mockups in [docs/design/mockups/](design/mockups/README.md) (`D-Home`, `D-Home-CS`, `M-Home`, `M-Home-CS`) at 1440 and 390 px.
- Each PR: `pnpm verify` and `pnpm test:e2e` locally, results in the PR; screenshots of the new sections at 1440 and 390 px in both languages; David's sign-off on the preview URL.

## PR A: Hero and Selected work

### A1. Branch and docs

- [x] Branch from up-to-date `main`; draft PR; `check` and `playwright` skipped on the draft (intended).
- [x] Record the section 0 decisions in [Landing page](design/landing-page.md), [Motion](design/motion.md) (reduced-motion hero) and the [design README](design/README.md#open-design-questions); mark the SPEC open questions resolved.

### A2. Page scaffold

- [x] Replace the placeholder `home` keys with the landing structure; remove `home.placeholder`.
- [x] Both landing pages render the sections in order. Only `#top` and `#work` exist after PR A; the other anchors arrive with their sections in PR B and C.
- [x] Anchor targets work with the header (desktop links and mobile menu): the section is scrolled into view and the next Tab continues inside it. No smooth scrolling yet (motion is milestone 4).

### A3. Hero (`#top`)

- [x] Desktop: full-height first screen, text column aligned to the bottom (eyebrow, H1, subline, intro, two buttons), 720 px yellow-paper drum panel with rollers, halftone T with the pink misregistered copy, round counter at 1/3.
- [x] Mobile: 410 px drum band, then headline, sublines and buttons (no intro, as decided); the secondary button becomes the 58 px round “Get in touch” icon button with an accessible name.
- [x] H1 and sublines follow the static-hero decision; drum panel `aria-hidden`.
- [x] Buttons: “See selected work” → `#work`, “Get in touch” → `#contact`.
- [x] The Largest Contentful Paint element is text, not decorative art: Lighthouse on the preview shows only the time-to-first-byte (151 ms) and render-delay (190 ms) phases and no resource load.

### A4. Selected work (`#work`)

- [x] Ink section, yellow H2 with pink offset shadow, intro on the right (stacked on mobile).
- [x] Kultomat feature card: 560 px yellow art panel with the huge “K” and pink copy, text side with label, summary and the `[Screenshot…]` placeholder, 12 px pink offset shadow. Stacks on mobile.
- [x] Four-card grid: Eucal, Vladan Vaněk, UpVideo (initial in medium halftone with its shape) and the dashed Systerna “In progress” card. Mobile: horizontal rows with a 104 px thumbnail.
- [x] Card links per the section 0 decision; Systerna is never a link.
- [x] Cards are a list (`ul`/`li`) with `h3` titles.

### A5. Tests

- [x] Playwright: both pages have one `h1`, `h2` and the five `h3` headings in the right order (`tests/e2e/landing.spec.ts`).
- [x] Playwright: header links (desktop and mobile menu) and the hero button move to `#work` and focus it (sections are `tabindex="-1"` focus targets).
- [x] Existing checks still pass on the new content: axe at 1280 and 320 px, no horizontal scroll at 320 × 640, no off-origin requests, no storage, no CSP violations.

## PR B: Approach and Experience

### B1. How I think & build (`#approach`)

- [x] H2 left, intro right; three columns with a 3 px ink border and 18 px rollers on both sides; counter, title, paragraph and a huge small-dot halftone letter bleeding off the bottom right. The middle column is yellow paper with the pink “M” copy.
- [x] Static state of A5: the halftone letters fully developed, columns in their resting state (this is also the reduced-motion state).
- [x] Column titles stay in English in Czech. Mobile: stacked columns (min-height 170 px) with the first-sentence paragraph.
- [x] “AI + me” strip on tint below the columns; tag above the text on mobile.

### B2. Experience (`#experience`)

- [x] Yellow paper with 36 px rollers; eyebrow and H2 “Big team. Small team.”.
- [x] Emplifi card (paper, ink shadow) and Freelance card (ink, yellow title, pink shadow) joined by a large halftone “+” (`aria-hidden`). Stacked on mobile with the “+” between them.
- [x] CV line as plain placeholder text (section 0 decision); on mobile below both cards.
- [x] “See the projects ↑” links to `#work`.
- [x] Placeholders kept: `[Role]`, dates, lesson and detail, unless David supplies them.

### B3. Tests

- [x] Playwright: heading order (`h2` ×3, `h3` ×10), `#approach` anchor and focus, three ordered steps with the AI disclosure, and the Experience link back to `#work` (`tests/e2e/landing.spec.ts`).
- [x] axe, 320 px scroll, request, storage and CSP checks pass.

## PR C: About, Contact and milestone wrap-up

### C1. About (`#about`)

- [x] 400 px round portrait: yellow paper, ink border, pink dot circle offset behind it, silhouette placeholder in the static G4 state (calm, no scan bar), `aria-hidden` or with alternative text once a real photo exists. Portrait above the text on mobile.
- [x] Eyebrow, H2 “Playful by design. **Serious** about the work.” with the designed emphasis, text with the `[personal note]` placeholder.

### C2. Contact (`#contact`)

- [x] Yellow paper with rollers and the huge halftone “?” with pink copy bleeding off the bottom right (`aria-hidden`).
- [x] H2, “Hiring?” card (paper) and “Have a project?” card (ink, pink shadow), stacked on mobile with the shorter Hiring text.
- [x] Card links per the section 0 decision, with prefilled subjects in both languages.
- [x] Mono link line: email · LinkedIn · GitHub (placeholders until milestone 6).
- [x] LEG-001: wording as designed, an invitation to talk; no prices, rates, terms or availability anywhere ([0008](decisions/0008-keep-project-invitation-while-trade-suspended.md)).

### C3. Tablet pass

- [x] Apply the breakpoint proposal across all sections: < 720 px mobile, 720–1099 px stacked hero with 2-column work cards and approach columns becoming a grid at ≥ 960 px, ≥ 1100 px desktop.
- [x] Check the header at 720 px fits four links and the switcher in both languages ([Shell components](design/shell-components.md)); raise the header breakpoint if not.
- [x] Screenshots at 768 and 1024 px in both languages for David.

### C4. Placeholder report

- [x] `pnpm placeholders` (`scripts/placeholders.mjs`) lists every `[…]` placeholder in the built HTML per page. It reports only; `--fail` is there for the milestone 6 production check. Added to `AGENTS.md` Commands.
- [x] Paste its output in the PR description as the list of remaining placeholders.

### C5. Performance and quality

- [x] Font payload: first measured `/` 110.9 KB and `/cs/` 156.4 KB (over the 150 KB target); fixed by subsetting the fonts ([0010](decisions/0010-subset-fonts-to-site-characters.md)): **56.6 KB on every page**.
- [x] Lighthouse mobile on the PR preview URL for `/` and `/cs/`, three runs each: Performance 98 then 99, Accessibility 100, Best Practices 100, CLS ≈ 0, SEO 66 (only `is-crawlable`, expected). **LCP 2.0 to 2.1 s at first, 1.7 to 1.8 s after the font trim (target ≤ 2.0 s).** Summary in [docs/audits/2026-11-05/lighthouse-landing.md](audits/2026-11-05/lighthouse-landing.md) (full reports are about 1 MB each and not committed). Targets from [SPEC](SPEC.md#performance-targets-measured-on-a-mid-range-phone-profile): Performance ≥ 95, Accessibility 100, Best Practices 100, LCP ≤ 2.0 s, CLS ≤ 0.05. SEO: the preview sends `X-Robots-Tag: noindex` on purpose, so Lighthouse flags “Page is blocked from indexing”; record the SEO score with that one audit noted as expected, and every other SEO audit passing.
- [x] Without JavaScript every section, link and anchor works (only the menu falls back to the footer link); check with JavaScript disabled.
- [x] 200 % zoom at 1280 px: no horizontal scroll, nothing clipped.

### C6. Tests

- [x] Playwright: full landing on both languages: anchors, heading order, contact links (`mailto:` with the right subject, if decided), no price or rate wording (a simple text check for currency symbols and “per hour / za hodinu”) as a LEG-001 guard.
- [x] axe, 320 px scroll, request, storage and CSP checks pass on the finished page.

## Acceptance checks (from MILESTONES.md)

Record evidence here and in the PR that completes each check.

- [ ] Side-by-side review against the four mockup boards at 1440 px and 390 px shows matching layout, type and colours; verify with screenshots in the PR and David's sign-off. (Each PR for its sections; final in PR C.)
- [ ] Tablet widths (768 px and 1024 px) look intentional; verify with screenshots and sign-off. (PR C)
- [x] Navigation anchors scroll to their sections and update focus; verify with Playwright. (PR A, extended in B and C) Evidence: `landing.spec.ts` covers header links (desktop and mobile menu), hero buttons, direct `#id` addresses and the Experience link, on both languages.
- [x] axe reports no violations on both language versions; verify with Playwright + axe. (Every PR) Evidence: 82 e2e tests pass, including axe on the whole landing page at 1280, 768 and 320 px, both languages.
- [x] Lighthouse mobile scores meet the SPEC targets on the preview URL; verify with a recorded Lighthouse run. (PR C; SEO `noindex` exception noted) Evidence: [report summary](audits/2026-11-05/lighthouse-landing.md): Performance 99, Accessibility 100, Best Practices 100, CLS 0, LCP 1.7 to 1.8 s, fonts 56.6 KB per page; SEO 66 only from the expected `noindex`.
- [x] A list of remaining placeholders is in the PR description. (PR C, from the placeholder report) Evidence: `pnpm placeholders` lists 34 in 6 pages; summarised in [PR #15](https://github.com/Phunkhouse/david-krapka/pull/15).
- [ ] Neither language version states prices, rates, terms or availability for paid services; verify by reading the rendered pages ([LEG-001](SPEC.md#legal-requirements)). (PR C, read by David; Playwright guard as support)

## Wrap-up

- [ ] Update MILESTONES.md: milestone 3 status `done`, completion evidence (PR links), status date, and unplanned changes.
- [ ] Update SPEC.md: resolved open questions, and the landing page status.
- [ ] Update [Landing page](design/landing-page.md) and the [design README](design/README.md) with any design changes made during review (the canvas wins if they disagree).
- [ ] `AGENTS.md` lists every new command.

## Risks and notes

- The mockups cover 390 and 1440 px only; the tablet range is a proposal judged from screenshots. Expect a round of adjustments in PR C.
- Big halftone letters and rollers are easy to make overflow at 320 px; keep them clipped inside their section (`overflow: clip`) so they never cause horizontal scroll.
- The LCP element must be text, not decorative art, or the Performance target will be hard to reach in milestone 4 when motion is added.
- Inline styles from components must stay within the hashed CSP; the existing CSP test catches violations.
- Lighthouse SEO cannot reach 100 on a `noindex` preview; the full SEO check moves to milestone 6 after `noindex` is removed.
- The `/specimen/` page and its tests stay until milestone 6.
