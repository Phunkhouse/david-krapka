# Milestone 5 checklist: Case studies

Working plan for [Milestone 5](MILESTONES.md#milestone-5-case-studies). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** Kultomat as the main case study and short client project pages, built on verified facts.

**Content is the critical path.** Code can be ready long before the facts are. This plan therefore splits the work into a pipeline that needs no design and no content (PR A), a template that needs the canvas design (PR B), and content PRs that need finished project cards (PRs C and D). A case study is published only when its facts are verified (permissions are skipped for the four planned projects, [0012](decisions/0012-skip-permission-requests-for-case-studies.md)); until then its landing card stays as it is today, not a link.

## Delivery plan: four PRs, one at a time

Each PR is reviewable on the preview URL and starts only after the previous one is merged or closed.

| PR | Branch (proposed) | Contents | Blocked by |
| --- | --- | --- | --- |
| A | `feat/case-study-pipeline` | MDX and the case study content collection with its schema, `/work/<slug>/` routes in both languages, draft handling, metadata, switcher and `hreflang`, landing cards as links with the hover and focus lift | Decisions 1 to 6 in section 0 |
| B | `feat/case-study-template` | The designed case study layout (long and short), figures and optimised screenshots, facts panel, “Next project”, Open Graph images | Case study design on the canvas (decision 7) |
| C | `feat/case-study-kultomat` | Kultomat long form in the agreed languages, screenshots; its card becomes a link | Kultomat project card complete |
| D | `feat/case-study-clients` | Eucal, Vladan Vaněk and UpVideo as short pages or links out; Lighthouse on case study pages; milestone wrap-up | Each project's card; may split into one PR per project |

PR A comes first because it is the only part that is not waiting for anyone, and it lets PRs B to D show real pages on the preview. PR B goes before content so the copy is written into the final layout and its length can be judged there. If the design is ready before Kultomat's facts, the order stays; if Kultomat is ready first, PR C can use the PR A layout and PR B restyles it.

## 0. Before starting (David)

Each item has a recommendation; answering “as recommended” is enough. Decisions go into SPEC, the design docs or a decision record in the PR that implements them.

- [x] Milestone 4 merged and complete ([PR #21](https://github.com/Phunkhouse/david-krapka/pull/21)), with the device checks and the feel sign-off carried to milestone 6.
- [ ] Approve this plan, or name changes. Approved by merging [PR #22](https://github.com/Phunkhouse/david-krapka/pull/22).
- [x] **1. Content format** (blocks PR A; SPEC proposal). Recommendation: MDX files in an Astro content collection (official `@astrojs/mdx` integration), one file per project and language, with a Zod schema that requires role, dates, collaborators, AI share and status. MDX rather than plain Markdown because the pages need a few components (figure with caption, facts panel, perhaps a diagram). Record it in decision `0011`. Alternative: plain Markdown plus frontmatter, with figures built only from frontmatter (no new dependency, less flexible). **Decided 5 November 2026: as recommended.**
- [x] **2. Unpublished case studies** (blocks PR A). Recommendation: a `draft` field in the schema. Drafts are built on preview branches so David can review them, and are left out of builds of `main`: no page, no sitemap entry, and the landing card stays a plain card. The branch comes from Workers Builds' build variables (`WORKERS_CI_BRANCH`; confirm the name in the Cloudflare docs in PR A); a local `pnpm build` treats drafts as not published unless `SHOW_DRAFTS=1` is set. Alternative: drafts never leave a local branch (simpler, but no preview link for review). **Note:** the repository is public, so a draft committed to any branch is public in Git even when it is not built. Commit only what David is happy to show; keep raw notes and private emails outside the repository ([LEG-009](SPEC.md#legal-requirements)). **Decided 5 November 2026: as recommended.**
- [x] **3. Short client projects** (affects PRs A and D; SPEC open question). Recommendation: decide per project once its card is filled. A project gets its own short page when the card has at least the role, the problem, one real decision and a verifiable outcome; otherwise its card links to the live site, marked as external (“eucal.cz ↗”), and states David's role on the card. Alternative: short pages for all three regardless. **Decided 5 November 2026: as recommended.**
- [x] **4. Czech case studies** (affects PRs A, C and D; SPEC open question). Recommendation: each published case study ships in both languages together, so the language switcher, `hreflang` and the “missing translation fails the build” rule work the same as on the rest of the site. Three of the four projects are Czech clients, so the Czech version matters. Alternative: English only at launch; the Czech cards then link to the English page with `hreflang="en"` and a “(v angličtině)” note, the switcher on the case study goes to the Czech landing page, and Czech versions follow after launch. **Decided 5 November 2026: as recommended.**
- [x] **5. Systerna** (SPEC open question). Recommendation: keep the dashed “In progress” card as it is, no page and no link. Alternative: a short teaser page with confirmed facts only, or remove the card. **Decided 5 November 2026: as recommended.**
- [x] **6. Card links** (blocks PR A). Recommendation: the project name in each card is the link, stretched over the whole card with a pseudo-element, so the accessible name is just the project name and the card text stays readable by screen readers as normal text. Add the “Read the case study →” line from the mockups (Czech copy to be written; for links out, “Visit eucal.cz ↗”). Hover and `:focus-visible` lift the card by `translate(-4px, -4px)` over 0.2 s with the offset shadow growing to match; under reduced motion the lift happens without the transition. Alternative: wrap the whole card in `<a>` (simpler markup, but screen readers read the whole card as the link name). **Decided 5 November 2026: as recommended.**
- [ ] **7. Case study page design** (blocks PR B). Needs boards on the [canvas](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5): desktop 1440 and mobile 390, the Kultomat long form and the short client format, English and Czech. Recommendation for the brief, following the principle “case studies show how I think”: calm and editorial on paper, ink text in a reading column of about 65 characters, Sora body at a larger reading size, Rubik only for the H1 and section numbers; one print motif in the page header (the project's halftone letter from its card, so the page feels like opening the card); a facts panel near the top (role, dates, collaborators, AI share, stack, live link); the eight sections of the [shared structure](content-and-case-studies.md#proposed-shared-case-study-structure) as H2s; figures with captions at reading width or full bleed; “Next project” as a large card at the end; no looping motion, so no pause control on these pages. The same session can decide the open design question on screenshots and the Open Graph image layout (decisions 8 and 9). David designs it, or asks for a design session that adds the boards; the boards are then exported to `docs/design/mockups/` and described in a new `docs/design/case-study.md`. **Decided 5 November 2026: brief as recommended; the boards are still to be made, so this stays open until they exist.**
- [x] **8. Screenshots on the landing cards** (open in the [design README](design/README.md#open-design-questions)). Recommendation: the landing cards keep their halftone letter art, and real screenshots appear only on the case study pages. The landing page stays light (no images in the first screens), keeps its print look, and needs no screenshot permissions. The “[Screenshot … goes here]” label is removed from the Kultomat card. Alternative: a halftone-treated screenshot inside the letter art. **Decided 5 November 2026: as recommended.**
- [x] **9. Open Graph images for case studies** (affects PR B). Recommendation: one static 1200 × 630 PNG per case study and language, made from a canvas template and committed (no build-time image generation, no new dependency). The site-wide image for the other pages stays in milestone 6. Alternative: generated at build time with Satori and resvg (two new dependencies and a decision record), or carry all Open Graph images to milestone 6. **Decided 5 November 2026: as recommended.**
- [x] **10. “Next project” order.** Recommendation: the landing order, Kultomat → Eucal → Vladan Vaněk → UpVideo → back to Kultomat, skipping projects without a published page. Alternative: always back to the landing work section. **Decided 5 November 2026: as recommended.**

## Content inputs for this milestone (David)

These gate PRs C and D, not PR A. The [working project card](content-and-case-studies.md#working-project-card) is the format; one card per project.

- [ ] Kultomat project card: status, audience and problem, dates, what David owned, what others and AI contributed, two or three decisions (alternative, reason, validation), outcome with its source, what he would rethink.
- [ ] Kultomat screenshots: authentic, dated, captioned; no personal data of other people visible.
- [ ] Eucal, Vladan Vaněk, UpVideo project cards, each with the distinct angle from [content and case studies](content-and-case-studies.md#client-projects-each-should-demonstrate-a-distinct-value), or confirmed facts for a link-out card.
- [x] ~~Permissions ([LEG-006](SPEC.md#legal-requirements)) per project~~ **Decided 5 November 2026: skipped for all four projects, accepted risk ([0012](decisions/0012-skip-permission-requests-for-case-studies.md)).** The clients and people involved are David's relatives or friends. Nothing to collect; crop screenshots that show third-party content where easy.
- [ ] One-line summary for the Kultomat card, replacing `[One-line summary to be confirmed]` on both landing pages.
- [ ] Czech text for every published case study (if decision 4 is “both languages”).

## Shared rules for every PR

- Every claim comes from the project card. If a fact is missing, leave it out or keep a `[…]` placeholder that `pnpm placeholders` lists; never fill a gap with a plausible guess.
- The schema enforces role, dates, collaborators and AI share, so a case study without them fails `pnpm typecheck` / `pnpm build`.
- Both languages share one slug and path (`/work/<slug>/`, `/cs/work/<slug>/`, decision 0005); add the case study routes to `src/i18n/routes.ts` (or its successor) so the language switcher, `hreflang`, canonical URLs and the later sitemap all use one source.
- UI copy (labels, “Next project”, facts panel headings, “Read the case study →”) goes into `src/i18n/en.ts` and `cs.ts`; long-form text lives in the MDX files.
- Images through Astro's image pipeline (`<Picture>` with AVIF and WebP, explicit `width` and `height`, `sizes` for the reading column), lazy below the first screen, meaningful `alt`, decorative art `aria-hidden`. Strip EXIF and location metadata from every committed image ([LEG-007](SPEC.md#legal-requirements)); check with `exiftool`.
- No client JavaScript on case study pages unless the design needs behaviour; no looping motion, so no pause control there. Card hover and focus lift is CSS only.
- New copy may need characters the font subset lacks: `pnpm check:fonts` catches it; regenerate with `scripts/subset-fonts.py`.
- The CSP stays as it is: no inline styles or scripts outside Astro's hashing, `img-src 'self' data:`; the existing CSP test covers the new pages.
- Before configuring, check the Astro 7 docs for content collections, the MDX integration and images (AGENTS.md); do not assume remembered APIs.
- Each PR: `pnpm verify` and `pnpm test:e2e` locally, results in the PR; draft PR first; David's sign-off on the preview.

## PR A: Case study pipeline and card links

### A1. Branch and docs

- [x] Branch from up-to-date `main`; draft PR; `check` and `playwright` skipped on the draft (intended).
- [x] Record decisions 1 to 6 (and 10) in SPEC (case study content row, URLs, open questions), the [landing page](design/landing-page.md) design doc (card links and hover) and decision `0011` (MDX content collection and draft handling).

### A2. Content collection

- [x] Add `@astrojs/mdx` (pinned, as the other dependencies) and a `caseStudies` collection in `src/content.config.ts` with the glob loader, one folder per project with `en.mdx` and `cs.mdx` (or the layout the Astro 7 docs recommend).
- [x] Schema: `title`, `summary` (meta description), `project` (slug), `locale`, `kind` (`long` | `short`), `status` text, `dates`, `role`, `collaborators` (list of name and role, may be empty but must be present), `ai` (what AI helped with and how it was reviewed), `stack` (optional), `liveUrl`, `draft`, `order`. A missing required field fails the build.
- [x] A check that every published project has both language entries (if decision 4 is “both languages”); a missing one fails the build, as missing dictionary keys do.
- [x] Draft handling per decision 2, in one helper used by the routes, the landing cards and later the sitemap.
- [x] A Kultomat draft entry with only placeholders (`[…]`), so the routes have something to render on previews. It must contain no unverified facts.

### A3. Routes and metadata

- [x] `src/pages/work/[slug].astro` and `src/pages/cs/work/[slug].astro` with `getStaticPaths` from the collection (published entries, plus drafts where decision 2 allows).
- [x] A minimal `CaseStudyLayout` on the existing `BaseLayout`: one H1, the facts as a definition list, the MDX body, a link back to the landing work section. Semantic and on the design tokens, not styled to a design yet (PR B).
- [x] Per-page `<title>` and description from the entry; canonical URL, `hreflang` alternates and `x-default`; the language switcher goes to the same case study in the other language.
- [x] Unknown or unpublished slugs return the bilingual 404 (check through `wrangler dev`).

### A4. Landing cards

- [x] Cards with a published page (or a link out, decision 3) become links per decision 6, with the “Read the case study →” line; others stay as today. Systerna stays a plain card (decision 5).
- [x] Hover (`@media (hover: hover)`) and `:focus-visible` lift: `translate(-4px, -4px)` over 0.2 s, shadow growing to match; no transition under reduced motion. Focus ring per the [focus rule](design/visual-system.md#focus) on ink.
- [x] Remove the “Cards are not links yet” comment in `Work.astro` and the screenshot label if decision 8 is as recommended.

### A5. Tests

- [x] Playwright: with a published fixture (or the draft on a draft-enabled build), each linked card is a link named after the project and goes to `/work/<slug>/` from `/` and `/cs/work/<slug>/` from `/cs/`.
- [x] Playwright: the case study page has one H1, the right `lang`, canonical and `hreflang` links, and the switcher goes to the other language's page.
- [x] A draft slug is absent, and its card is not a link, in a build without drafts. Done by `pnpm check:drafts` (part of `pnpm verify` and CI) rather than Playwright, because the Playwright build includes drafts; Playwright checks that unknown slugs are 404 and that only published cards are links.
- [x] Playwright: the card lift appears on hover and on keyboard focus; no lift transition under reduced motion.
- [x] axe at 1280, 768 and 320 px, 320 px scroll, request, storage, CSP and no-JavaScript checks extended to the case study pages.

## PR B: Case study template

### B1. Design handoff

- [ ] Export the case study boards to `docs/design/mockups/`, record the canvas version, and write `docs/design/case-study.md` (layout, type sizes, colours, spacing, breakpoints, copy for labels in both languages). Resolve decision 8 in the design README.

### B2. Layout

- [ ] `CaseStudyLayout` to the design: page header with the project's print motif, facts panel, reading column, section headings for the shared structure, desktop, tablet and mobile.
- [ ] Long and short variants from the same layout (`kind`), not two templates.
- [ ] “Next project” per decision 10, with the card lift from PR A.

### B3. Figures and images

- [ ] `Figure` MDX component: `<Picture>` (AVIF, WebP), fixed dimensions, `sizes`, caption, reading-width and full-bleed variants; `alt` required by its props.
- [ ] Screenshots kept in the project's content folder, pre-optimised sources (sensible maximum width, metadata stripped); record the size budget per page in the PR.
- [ ] The first screen of a case study stays text-first so LCP is text or a properly prioritised image (`loading="eager"`, `fetchpriority="high"` only for a first-screen image).

### B4. Open Graph

- [ ] Per decision 9: `og:title`, `og:description`, `og:url`, `og:locale`, `og:image` (with width, height and alt) on case study pages; image files from the canvas template, metadata stripped.

### B5. Tests

- [ ] Playwright: every image on a case study page has `width`, `height` and non-empty `alt` (or is `aria-hidden` decorative art); no layout shift while images load (read `layout-shift` entries with a PerformanceObserver).
- [ ] Playwright: “Next project” goes to the next published case study in the agreed order and wraps around.
- [ ] Screenshots against the boards at 1440 and 390 px in the PR, plus 768 and 1024 px.

## PR C: Kultomat

- [ ] Kultomat `en.mdx` (and `cs.mdx`) from the finished project card, following the shared structure: summary, what I owned, problem and constraints, two or three decisions, the build, AI and collaboration, outcomes and validation, rethink.
- [ ] Every claim and metric traceable to the project card; metrics with source, timeframe and method, or left out.
- [ ] Screenshots with captions and alternative text; no identifiable person without a recorded OK.
- [x] ~~Permissions entry in the Kultomat card~~ Not needed, decision 0012.
- [ ] `draft: false`; the card on both landing pages links to it; the card summary placeholder is replaced.
- [ ] `pnpm placeholders` shows no placeholder on the Kultomat pages.
- [ ] David's review of the facts and sign-off on the pages (both languages).

## PR D: Client projects and wrap-up

- [ ] Per project (Eucal, Vladan Vaněk, UpVideo), according to decision 3: a short page following the shared structure, or a link-out card with David's role stated on it.
- [x] ~~Permissions entry in each project card~~ Not needed, decision 0012. Still prefer screenshots without strangers or third-party content.
- [ ] Each card links to the right destination in both languages.
- [ ] Lighthouse mobile on the preview for the Kultomat page and one short page, both languages, three runs each: Performance ≥ 95, Accessibility 100, Best Practices 100, LCP ≤ 2.0 s, CLS ≤ 0.05 (SEO `noindex` exception as before). Save a summary in `docs/audits/`.
- [ ] David's review of the facts and sign-off on each page.

## Acceptance checks (from MILESTONES.md)

Record evidence here and in the PR that completes each check.

- [ ] Each case study follows the [shared structure](content-and-case-studies.md#proposed-shared-case-study-structure) and states role, collaborators and AI share; verify by review against the project card. (PRs C and D; the schema from PR A enforces the fields)
- [ ] Every claim and metric has a source in the project card; verify by David's review. (PRs C and D)
- [ ] Each published case study has a Permissions entry in its project card, or falls under [decision 0012](decisions/0012-skip-permission-requests-for-case-studies.md) (accepted risk for the four planned projects); verify that the project is one of them and that nobody has objected ([LEG-006](SPEC.md#legal-requirements)). (PRs C and D)
- [ ] Images have fixed dimensions (no layout shift) and meaningful alternative text; verify with Lighthouse CLS and axe. (PR B, measured in D)
- [ ] Landing cards link to the right pages in both languages; verify with Playwright. (PR A, extended in C and D)
- [ ] David signs off on each page. (PRs B, C and D)

## Wrap-up

- [ ] Update MILESTONES.md: milestone 5 status `done`, completion evidence (PR links), status date, unplanned changes and items carried forward (for example short pages or Czech versions left for after launch).
- [ ] Update SPEC.md: case study scope, content row (no longer a proposal), images row, resolved open questions.
- [ ] Update [content and case studies](content-and-case-studies.md) with the filled project cards, and the [design README](design/README.md) (case study page designed, screenshot question resolved).
- [ ] `AGENTS.md` lists every new command or environment variable (`SHOW_DRAFTS`, if added).
- [ ] Milestone 6 scope still lists the site-wide Open Graph image, sitemap (now including case study pages) and the placeholder `--fail` check.

## Risks and notes

- **Content is late.** PRs C and D can wait a long time for project cards. PR A and B are useful on their own; if the milestone stalls on content, launch can go ahead with Kultomat only and the client cards as link-outs, decided by David.
- **Public repository.** Anything committed, including drafts and screenshots on unmerged branches, is public. Permissions must cover the repository, and unverified facts never go into a commit.
- **Permissions skipped (accepted risk, [0012](decisions/0012-skip-permission-requests-for-case-studies.md)).** Nothing to wait for, but nothing on record either; remove a name, likeness or image promptly if anyone objects, and revisit before adding any project or person outside the four.
- **Image weight and CLS.** Screenshots are the first large images on the site. Fixed dimensions, AVIF and `sizes` keep CLS 0 and LCP within target; check the first screen especially on mobile.
- **Placeholders on drafts.** Draft pages on previews will show `[…]` placeholders; `pnpm placeholders` lists them, and the milestone 6 `--fail` check runs on the production build only, where drafts are excluded.
- **Workers Builds variables.** The draft rule relies on knowing the branch at build time; if Workers Builds does not expose it, fall back to an explicit build variable set only for preview builds, or to local-only drafts.
- **Translation load.** Both languages per case study (decision 4) doubles the writing and the review; the alternative is recorded in section 0.
