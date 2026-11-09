# Milestone 6 checklist: Launch readiness and launch

Working plan for [Milestone 6](MILESTONES.md#milestone-6-launch-readiness-and-launch). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** Publish the site on david-krapka.eu.

**Content and David's accounts are the critical path.** Almost all code is in place. What is left is mostly David's input (email address, CV, project cards, copy facts, portrait rights), records only David can make (Cloudflare agreement, record of processing), reviews only David can sign off (facts, feel, devices), and one risky operation (moving DNS without breaking email). The plan therefore starts with the work that needs nobody (PR A), keeps each content PR small enough to land as soon as its input arrives, and puts the irreversible steps (DNS and launch) last and in their own steps.

**Status, 9 November 2026: launched** at https://david-krapka.eu. Everything below is done except the optional Search Console step. Earlier status notes are kept in the sections below.

Starting point (5 November 2026, `main` at `7a39d6d`): 30 placeholders in 6 pages (`pnpm placeholders`: landing copy, contact links, CV, privacy text); four draft case studies with placeholders only; `X-Robots-Tag: noindex` on every response; `/specimen/` still built; no sitemap, `robots.txt`, `LICENSE`, landing Open Graph tags or JSON-LD; the favicon is Astro's default; DNS still at Websupport with the apex and `www` pointing at a deleted Vercel project.

## Delivery plan: PRs one at a time, plus two operations

Each PR is reviewable on the preview URL and starts only after the previous one is merged or closed. PRs B to E wait for their inputs and may land in any order; take whichever is unblocked first.

| Step | Branch (proposed) | Contents | Blocked by |
| --- | --- | --- | --- |
| A | `chore/launch-foundation` | `LICENSE` and content note, sitemap, `robots.txt`, landing Open Graph tags, JSON-LD `Person`, final header set (except `noindex`), `/specimen/` removed with its tests moved, `wrangler.jsonc` observability check | Decisions 5, 8, 9 and 13 in section 0 |
| B | `feat/site-icons-and-og` | Favicon and monogram, apple-touch icon, site-wide Open Graph images (EN and CS) | Decision 6: boards on the canvas |
| C | `feat/contact-and-cv` | Real email, LinkedIn and GitHub links, CV PDF, landing copy facts (Emplifi, freelance year, personal note, Kultomat card summary, role title) | Decisions 1 to 3; content inputs |
| D | `feat/privacy-notice` | Privacy notice text in English and Czech (LEG-003) | Decision 1 (email); Cloudflare retention facts; LEG-004 record |
| E | `feat/case-study-kultomat`, `feat/case-study-clients` | Case study content from the [milestone 5 checklist](milestone-5-checklist.md) PRs C and D: text in both languages, screenshots, `OG-Case` images, `draft: false` | Each project card complete; may split into one PR per project |
| Ops 1 | none (dashboard work) | Move the DNS zone to Cloudflare with mail records copied exactly; mail test | Decision 7; Websupport and Cloudflare access |
| F | `docs/pre-launch-review` | David's comprehensive visual, motion and device review; pre-launch audits (legal, web quality, security) saved in `docs/audits/`; fixes in their own PRs if large | A to E merged |
| G | `chore/launch` | Remove `noindex`, placeholder `--fail` in `pnpm verify`, `workers_dev` per decision 8, then attach the domain, redirect `www`, post-launch checks, milestone wrap-up | F's launch-blocking findings fixed or accepted |

PR A comes first because nothing blocks it and it shrinks the launch PR to a few lines. The DNS move (Ops 1) is recommended as a separate, earlier step (decision 7) so an email problem never coincides with the launch. F goes last before launch because the review must see the finished content. G is short on purpose: the risky parts are a header line, a test assertion and two dashboard actions.

## 0. Before starting (David)

Each item has a recommendation; answering “as recommended” is enough. Decisions go into SPEC, the design docs or a decision record in the PR that implements them.

- [x] Milestone 5 merged and wrapped up ([PR #27](https://github.com/Phunkhouse/david-krapka/pull/27)), with the case study content carried here.
- [x] Approve this plan, or name changes. Approved by merging [PR #28](https://github.com/Phunkhouse/david-krapka/pull/28).
- [x] **1. Public email address** (blocks C and D; SPEC open question, legal planning Q3). Recommendation: one address on the domain, for example `hello@david-krapka.eu`, set up as an alias at Active24 that forwards to the inbox David reads. It is easy to change or retire if spam grows, keeps the private inbox private, and stays valid if the mail provider changes. Alternative: an existing personal address. **Decided 5 November 2026: as recommended, `hello@david-krapka.eu`.** The alias must exist at Active24 and forward to David's inbox before launch (private to-do; a test mail goes with the DNS move, Ops 1).
- [x] **2. CV** (blocks C; SPEC proposal). Recommendation: English only at launch, served at `/cv/david-krapka-cv.pdf` (both languages link to the same file; the Czech link reads “Stáhnout životopis (v angličtině)”). David supplies the PDF; before committing, check it for data he does not want public (home address, date of birth, personal phone) and strip document metadata (author, software, edit history) with `exiftool` (LEG-007). Alternative: a Czech CV as well, at `/cv/david-krapka-zivotopis.pdf`. **As shipped (PR #36):** English only at `/cv/david-krapka-cv.pdf`, public version without the phone number, document metadata limited to David's name, title and a creation date. The file type and size hint was declined by David on 9 November 2026. **Confirmed by David, 9 November 2026,** with the Czech link now reading “Stáhnout životopis (v angličtině) →”.
- [x] **3. Role title, availability and audience order** (blocks C; SPEC open question). Recommendation: keep “product-minded engineer” and the current order (hiring first, projects second). If an availability line is wanted, make it about employment only (“Open to product engineering roles”), with no availability for paid client work while the trade is suspended ([LEG-001](SPEC.md#legal-requirements), [0008](decisions/0008-keep-project-invitation-while-trade-suspended.md)). Alternative: no availability statement. **As shipped (PR #36):** the English role stays “Product-minded engineer”; the Czech role changed to “Vývojář s produktovým myšlením” (was “Inženýr…”); hiring first, projects second; no availability line. **Confirmed by David, 9 November 2026.** The Emplifi card's “employed” became “employee” / “zaměstnanec”, because “employed” read as current while the dates end in June 2026.
- [x] **4. Analytics at launch** (SPEC open question). Recommendation: none. The site stays storage-free and third-party-free, which is why there is no cookie banner ([LEG-005](SPEC.md#legal-requirements)). Revisit after launch with a cookieless EU tool and a new legal planning pass. **Decided 9 November 2026: as recommended.**
- [x] **5. Sitemap** (blocks A). Recommendation: a small static endpoint `src/pages/sitemap.xml.ts` that lists every page in both languages with `xhtml:link` `hreflang` alternates, built from `src/i18n/routes.ts` and the same published-case-study helper the routes use, so drafts can never leak into it. No new dependency. `robots.txt` allows everything and points to the sitemap. Alternative: the official `@astrojs/sitemap` integration with its i18n option and a filter for drafts (one dependency, less control over the draft rule). **Decided 5 November 2026: as recommended.**
- [x] **6. Favicon, monogram and site Open Graph image** (blocks B; [design README](design/README.md#not-designed-yet) item 7). Needs boards on the [canvas](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5). Recommendation for the brief: a “DK” monogram in Rubik 900, ink on yellow paper with the pink misregistered copy, legible at 16 px (simplify to a single letter or the halftone dot if “DK” blurs); delivered as `favicon.svg`, a 32 px `favicon.ico` and a 180 px `apple-touch-icon.png`. The site image follows `OG-Case` (1200 × 630, ink frame) with “Think. Make. Rethink.” and the role line, one per language. David designs it, or asks for a design session; the boards are exported to `docs/design/mockups/`. **Decided 5 November 2026:** David designed the mark on the canvas (H2 háček, the caron of the Ř in Křapka, instead of a “DK” monogram) and the favicon set; the site preview image was designed on the same page (boards `OG-Site`, `OG-Site-CS`).
- [x] **7. DNS move timing** (blocks Ops 1). Recommendation: move the zone to Cloudflare **before** launch, as its own step after PR A, in a quiet moment: import the zone, compare every record with Websupport one by one (Active24 MX, SPF, DKIM, DMARC, autodiscover and any webmail host), **drop** the dead Vercel apex and `www` records instead of copying them, switch the nameservers, then send and receive test mail. The domain is attached to the Worker only at launch (PR G). This separates an email failure from the site launch and gives propagation time. Alternative: everything on launch day. **Done as recommended, 9 November 2026** (Ops 1 below).
- [x] **8. `workers.dev` and preview URLs after launch** (affects A and G). Recommendation: set `workers_dev: false` at launch so production answers only on the domain; keep `preview_urls` for PR review. Once `noindex` leaves `_headers`, previews lose it too, because static `_headers` cannot vary by host. PR A checks whether Cloudflare marks preview URLs as `noindex` by itself; if not, the canonical links (already pointing at the apex) tell search engines which copy counts. Alternative: keep `workers_dev` on (a second indexable copy of the site, mitigated only by canonical links). **Decided 5 November 2026: as recommended.** Cloudflare's docs say `workers.dev` preview URLs carry `X-Robots-Tag: noindex` by themselves ([Previews](https://developers.cloudflare.com/workers/previews/)); `preview_urls: true` is set explicitly in `wrangler.jsonc`, so previews keep working when `workers_dev` is off.
- [x] **9. Final headers** (affects A). Recommendation: keep the current set and add `Cross-Origin-Opener-Policy: same-origin`; keep HSTS at two years with `includeSubDomains` but **without** `preload` at launch (preload is hard to undo). Before launch, confirm in the DNS records that no subdomain (webmail, autodiscover) is served over plain HTTP, because `includeSubDomains` forces HTTPS on all of them once a browser has seen the header on the apex. Alternative: add `preload` and submit to the preload list after a few weeks without problems. **Decided 5 November 2026: as recommended.**
- [x] **10. Client case studies: page or link out** (affects E; milestone 5 decision 3, carried). Decided per project when its card is filled: a short page when the card has the role, the problem and one real decision; otherwise its draft is removed and the card links out to the live site. **Decided 9 November 2026 (David):** the criterion is amended; an outcome or validation line is shown when there is a real one and left out when there is not, because a weak invented outcome is worse than none (the `checkedBy` field of a decision is optional for this reason). **As shipped (PR #36):** Eucal, Vladan Vaněk and UpVideo are short pages, published. Eucal has an Outcome section; Vladan Vaněk's decision carries a validation line (he runs the blog himself and shares it on LinkedIn); UpVideo's validation line (added 9 November 2026) says only what is checkable on the live site: the new team and client list are shown on the Next.js build. Replace it with a real outcome when David has one.
- [x] **11. Minimum content for launch** (affects G). Recommendation: launch needs Kultomat in both languages plus every other project either as a finished short page or as a link-out card; no draft case study blocks launch. If Kultomat is not ready, the launch waits. Alternative: launch the landing page with Kultomat as a link-out too. **Met as shipped (PR #36):** Kultomat in both languages and three short pages, none a draft. **Confirmed by David, 9 November 2026.**
- [x] **12. Certified flash check** (affects F; optional, carried from milestone 4). Recommendation: skip. Our own analysis measured 0 flashes per second for every looping element ([flash analysis](audits/2026-11-05/flash-analysis.md)), well under the WCAG 2.3.1 limit of 3. Alternative: run PEAT or IRIS on a screen recording and save the result in `docs/audits/`. **Decided 9 November 2026: as recommended.**
- [x] **13. Licences** (blocks A; [LEG-009](SPEC.md#legal-requirements)). Recommendation: code under MIT in `LICENSE`; a short `CONTENT-LICENSE.md` (or a section in the README) saying that texts, case studies, images, the portrait and the CV are all rights reserved, and that the OFL fonts keep their own licence. Alternative: no open licence (everything all rights reserved). **Decided 5 November 2026: as recommended.** Recorded in [0013](decisions/0013-mit-code-and-reserved-content.md).
- [x] **14. Footer year** (open item since milestone 2). Recommendation: keep the build year. Workers Builds rebuilds on every merge, and a portfolio is updated at least yearly; close the open item. Alternative: a fixed “© 2026” or a range. **Decided 9 November 2026: as recommended.**

## Content inputs for this milestone (David)

These gate PRs C, D and E, not PR A.

- [x] Public email address (decision 1), LinkedIn URL, GitHub URL.
- [x] CV PDF, checked for unwanted personal data (decision 2, LEG-007). Public version committed in PR #36: no phone, photo kept, `hello@david-krapka.eu` as the email; metadata is the author name, the title and a creation date (no software); checked by reading the file, `exiftool` is not installed.
- [x] Emplifi role, dates, responsibilities and one concrete decision; the Experience card headline. In PR #36.
- [x] Freelance start year (2016).
- [x] Short personal note for About. In PR #36.
- [x] One-line summary for the Kultomat card: dropped instead (the card uses its two text variants).
- [x] Portrait: who took the photo and the right to publish and edit it (LEG-007). If David took it himself, a sentence saying so is enough. David took the portrait photo himself and holds the rights to publish and edit it (stated 9 November 2026); the site shows only the generated duotone masks without metadata.
- [x] Kultomat project card and screenshots; Eucal, Vladan Vaněk and UpVideo project cards (or confirmed facts for link-out cards). Written and published in PR #36; the facts still need David's sign-off (PR E). UpVideo's “checked by” line states what the live site shows (added 9 November 2026). Format: [working project card](content-and-case-studies.md#working-project-card).
- [x] Czech text for every published case study (in PR #36).

## Private records (David, kept outside the repository)

Not committed, because the repository is public and they are for David's own compliance file. The checklist only records that they exist.

- [x] Cloudflare: the version and acceptance date of the Self-Serve Subscription Agreement and the Data Processing Addendum for this account, from the dashboard ([LEG-004](SPEC.md#legal-requirements)). Done 9 November 2026 as part of LEG-004: the public versions in force (Self-Serve Subscription Agreement last updated 12 September 2025, DPA v6.4 effective 3 April 2026) saved privately with PDFs; Free plan, David the only member ([legal readiness](audits/2026-11-09/legal-readiness.md#follow-up-and-decisions-by-david-9-november-2026)).
- [x] One-page record of processing (reviewed and dated by David 9 November 2026, with the Active24 to Proton route and the saved terms versions; kept privately; closes the LEG-009 gap from the legal audit): purposes, data, recipients, retention ([LEG-009](SPEC.md#legal-requirements)). The agent can draft it from the privacy notice in PR D for David to keep.
- [x] Portrait rights note (above), if it should not be public. David took the portrait photo himself and holds the rights to publish and edit it (stated 9 November 2026); the site shows only the generated duotone masks without metadata.

## Shared rules for every PR

- Every fact comes from David. A missing fact stays a `[…]` placeholder that `pnpm placeholders` lists; never fill a gap with a plausible guess.
- UI copy goes into `src/i18n/en.ts` and `cs.ts`; case study text into the MDX files. Both languages land together.
- New copy may need characters the font subset lacks: `pnpm check:fonts` catches it; regenerate with `scripts/subset-fonts.py`.
- Committed images and PDFs carry no EXIF, GPS or document metadata ([LEG-007](SPEC.md#legal-requirements)); check with `exiftool` and record it in the PR.
- The site stays storage-free and third-party-free; the CSP stays strict. JSON-LD is data, not script, but check that Astro's CSP hashing does not drop or block it.
- Before configuring anything new (endpoints, headers, Cloudflare custom domains and redirects), check the current Astro 7 and Cloudflare docs (AGENTS.md); do not assume remembered APIs.
- Each PR: `pnpm verify` and `pnpm test:e2e` locally, results in the PR; draft PR first; David's sign-off on the preview.

## PR A: Launch foundation

### A1. Branch and docs

- [x] Branch from up-to-date `main`; draft PR; `check` and `playwright` skipped on the draft (intended).
- [x] Record decisions 4, 5, 8, 9, 13 and 14 in SPEC (open questions, data and trust boundaries, technical approach) and, where lasting, a decision record. Done for 5, 8, 9 and 13 (SPEC: data and trust boundaries, technical approach; decision 0013). Decisions 4 and 14 are still open.

### A2. Licences

- [x] `LICENSE` (MIT, David Křapka, 2026) and the content note per decision 13; README links both.

### A3. Search and sharing

- [x] `sitemap.xml` per decision 5: every published page in both languages with `hreflang` alternates and `x-default`; no draft, no 404, no `/specimen/`, no privacy page if David prefers it left out. The privacy pages are listed.
- [x] `robots.txt`: allow all, `Sitemap: https://david-krapka.eu/sitemap.xml`.
- [x] Landing and privacy pages get `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url` and `og:locale` (+ `og:locale:alternate`), shared with the case study layout rather than duplicated. `og:image` follows in PR B. Moved into `BaseLayout` (prop `og`), which the case study layout now uses.
- [x] JSON-LD `Person` on both landing pages: name, job title, URL, `sameAs` (LinkedIn and GitHub as placeholders until PR C; omit rather than ship a placeholder URL). `sameAs` left out until PR C.

### A4. Headers and hosting

- [x] `public/_headers` per decision 9; `noindex` stays until PR G. Update the header comment.
- [x] `wrangler.jsonc` has no `observability` block and Workers Logs are off in the dashboard (LEG-004); record it in the PR. Checked by David on 5 November 2026: the Worker's Observability settings show no Workers Logs or Traces option, and say that Logpush and Tail Workers “cannot be added to a Worker that only has static assets”. Re-check if a Worker script is ever added.
- [x] Find out whether Cloudflare preview URLs send `X-Robots-Tag: noindex` on their own (decision 8); record the answer. Yes, per Cloudflare's docs (decision 8).

### A5. Remove `/specimen/`

- [x] Move the self-hosted font, font licence and CSP checks in `tests/e2e/design-system.spec.ts` to real pages (landing, privacy, a case study, 404), then delete `src/pages/specimen.astro`, its test and any code used only by it. Fonts on `/`, CSP on `/privacy/` instead of `/specimen/`.
- [x] `PauseControl` and `BaseLayout` lose their specimen-only branches, if any. `PauseControl` lost its static `live`-less mode; it is always the working control.

### A6. Tests

- [x] Playwright: `sitemap.xml` is valid XML, lists exactly the expected URLs for a drafts-off build (or the check runs in `pnpm check:drafts`, since the Playwright build includes drafts), and every listed URL returns 200. `tests/e2e/seo.spec.ts`; the drafts-off build is covered by `pnpm check:drafts`, which already scans `.xml` files for `/work/`.
- [x] Playwright: `robots.txt` content; Open Graph and JSON-LD present and in the right language on both landing pages; JSON-LD parses.
- [x] Playwright: the new header is present; `/specimen/` returns the 404.

## PR B: Icons and site Open Graph image

- [x] Export the boards to `docs/design/mockups/`, describe them in the design docs, strike item 7 in the design README. Canvas version `1793902296-fc46`; described in [Mark and icons](design/visual-system.md#mark-and-icons).
- [x] `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` replace Astro's defaults; `<link>` tags in `BaseLayout`. Plus `icon-192.png`, `icon-512.png`, `site.webmanifest` and `theme-color`; all built by `scripts/brand-assets.mjs`. The header and footer show the mark (`Mark.astro`), as on the updated boards.
- [x] `og:image` (with width, height and alt) on the landing and privacy pages, per language; files metadata-stripped. Case studies use their project preview image as `og:image` (`scripts/work-previews.mjs`). Generated in Chromium, no metadata (exiftool is not installed locally, so the check is by construction; PNG headers hold only image data).
- [x] Playwright: icons and Open Graph images return 200 with the right content type; dimensions match the tags. `tests/e2e/seo.spec.ts`.

## PR C: Contact, CV and landing facts

- [x] Email address in the three contact links with the prefilled subjects (“Role: ” / “Project: ”, “Pozice: ” / “Projekt: ”); LinkedIn and GitHub links (external, marked ↗, `rel="noopener"`); JSON-LD `sameAs`. Details in `src/content/profiles.ts`. The alias `hello@david-krapka.eu` is not set up yet (see decision 1).
- [x] CV PDF at `/cv/david-krapka-cv.pdf` per decision 2: done in PR #36 (public version David exported, metadata limited as above) and both “Download CV” links point to it. The file type and size hint on the links was declined by David (9 November 2026), so the links stay “Download CV →” and “Stáhnout životopis →”.
- [x] Emplifi card, freelance start year, personal note, Kultomat card summary and role copy, in both languages (PR #34 and PR #36). The availability copy waits on decision 3 (none shipped).
- [x] Re-read both landing pages for LEG-001: no prices, rates, terms or availability for paid work. Checked by machine on 9 November 2026: the Playwright test for money terms passes and the built English page has no “available”, “hourly” or “for hire”. “Freelance · 2016 – now” kept by David on 9 November 2026: he accepts no new paid work until the licence is renewed (decision 0008). David accepted the reworded “Have a project?” card on 9 November 2026.
- [x] `pnpm placeholders` shows no placeholder on the landing pages: 0 in 13 pages (9 November 2026).
- [x] Playwright: the `mailto:` links carry the address and the encoded subjects (done, `tests/e2e/landing.spec.ts`); the CV link returns a PDF (`tests/e2e/landing.spec.ts`).

## PR D: Privacy notice

- [x] Research before drafting: Cloudflare's retention of request data for Workers static assets on this plan, and the controller/processor split ([legal planning, Not verified](audits/2026-11-04/legal-planning.md#not-verified)). Record sources in the PR. Done 5 November 2026; results in [privacy notice research](audits/2026-11-05/privacy-notice-research.md). Retention for this setup is **not published** by Cloudflare, so the notice says so instead of naming a period.
- [x] Notice text in English and Czech per [LEG-003](SPEC.md#legal-requirements): controller and contact address, purposes and lawful basis (legitimate interests), Cloudflare as processor, transfers outside the EEA under the EU SCCs, retention, rights, right to complain to ÚOOU, and a line that the site stores nothing on the device. Plain language; a date of the last update.
- [x] David reviews and approves the text (it is his statement, not legal advice). Approved by David on 9 November 2026, including the open points: twelve-month email retention, email providers left unnamed, legitimate interest as the legal basis for messages and for names in case studies.
- [x] Draft of the private record of processing handed to David (not committed): kept outside the repository.
- [x] `pnpm placeholders` shows nothing on the privacy pages. Playwright checks both pages (sections, dated notice, working `mailto:`, regulator and Cloudflare named, no placeholder).

## PR E: Case studies

Follow [the milestone 5 checklist](milestone-5-checklist.md) PRs C and D, which keep their items and evidence. In short, per project:

- [x] Text in both languages from the finished project card, following the shared structure; every claim traceable to the card. Text is in both languages (PR #36); David signed off the facts below.
- [x] Screenshots through `Figure`, with captions and alternative text (every case study has at least one; Kultomat has two). Metadata stripped: no EXIF or XMP in the five files (checked by reading headers, 9 November 2026). Size budget: the five JPEGs are 98 to 377 KB, served as AVIF and WebP; not recorded elsewhere.
- [x] Case study social image: the project preview (`src/assets/work/`), same in both languages; `OG-Case` per-study images dropped for now.
- [x] `draft: false` for all four; the landing cards link to them (PR #36). Per decision 10 as shipped.
- [x] David's review of the facts and sign-off on the pages. Signed off by David on 9 November 2026 for all four case studies, in both languages.
- [x] Lighthouse mobile on the real pages (Kultomat and one short page, both languages); updated the [case study summary](audits/2026-11-05/lighthouse-case-study.md) on 9 November 2026: Performance, Accessibility and Best Practices 100 on all four, LCP 1.4 to 1.6 s, CLS 0, SEO 69 only because of `noindex`.

## Ops 1: DNS move (David, with the agent)

- [x] Export the current Websupport zone (screenshot or text) and keep it as the rollback reference (private; it lists mail hosts but no secrets). Done 9 November 2026: screenshots of the zone (managed in the Active24 panel) and a `dig` capture of every record, including DKIM and DNSSEC, kept privately by David. The old zone also stays in the Active24 panel, so a rollback is switching the nameservers back.
- [x] Add the zone in Cloudflare; compare each imported record with the export; fix differences. Mail records exactly as before; the Vercel apex and `www` records removed (decision 7). Proxy off (DNS only) for every mail-related record. Done 9 November 2026 (Free plan). The import set every A, AAAA and CNAME record to proxied (switched to DNS only) and missed five records, added by hand: the AAAA records of `smtp`, `pop3`, `imap` and `admin`, and the `_github-pages-challenge-phunkhouse` TXT. Removed on purpose: the Vercel apex A and `www` CNAME, and three unused Resend records (`resend._domainkey`, `send`, `rsend`). After the switch, all 20 kept records answered identically from Websupport and Cloudflare (MX, SPF, DMARC, the full `mail._domainkey` DKIM key, SRV, A and AAAA of six mail hosts, `autodiscover`, `autoconfig`, GitHub TXT).
- [x] Note any subdomain served over plain HTTP (decision 9). Checked 9 November 2026: `admin`, `mail`, `webmail`, `smtp`, `imap` and `pop3` serve HTTPS and redirect HTTP to it. `autodiscover` and `autoconfig` answer only over HTTP (their HTTPS certificate does not match). Only mail clients use them, through the SRV record or plain HTTP, not browsers, so HSTS with `includeSubDomains` on the apex is not expected to affect them; recheck mail client setup after launch if a problem appears.
- [x] Switch nameservers at Websupport; wait for Cloudflare to mark the zone active. Done 9 November 2026: `leonard.ns.cloudflare.com` and `rosalie.ns.cloudflare.com`, listed by the `.eu` registry at 11:57; zone active. DNSSEC was on with Websupport's key: its DS record was removed first (gone from the registry at 11:47), and DNSSEC was turned on again in Cloudflare after the switch, with the new key entered at Active24. The registry published DS key tag 2371 at 12:08, matching Cloudflare's key; Cloudflare, Google and Quad9 resolvers validate the zone (`ad` flag).
- [x] `dig MX`, `dig TXT` (SPF, DMARC) and DKIM lookups match the export; send a test message to the domain from an outside account and reply from it. Lookups match (above). A test message from an outside account to `hello@david-krapka.eu` arrived in David's inbox on 9 November 2026. Replies go out from David's Proton address, not through this domain, so they do not depend on these records.
- [x] Cloudflare features that set cookies or inject scripts stay off (Bot Fight Mode, Web Analytics, Rocket Loader, email obfuscation, Zaraz) (LEG-005, CSP). Moved to the post-launch checks by David, 9 November 2026 (G3). Checked from outside after launch: no injected script or Cloudflare cookie ([post-launch checks](audits/2026-11-09/production-launch.md)).

## PR F: Pre-launch review

- [x] **David's comprehensive review on the preview** (carried from milestone 4): the feel of every animation against the canvas; the whole landing page on a mid-range Android phone and on Safari iOS (smooth, drum sharp), with a short screen recording of each; tablet widths (768 and 1024 px); the finished copy and case studies in both languages. **Signed off by David, 9 November 2026:** animations fine, device check fine. Copy and case studies were signed off earlier the same day. No screen recordings were kept.
- [x] Scrolling performance trace on a throttled profile: no long tasks while scrolling the landing page; summary recorded (carried from milestone 4). Partial evidence only: the [web quality audit](audits/2026-11-09/web-quality.md) recorded no long task over 50 ms in two 8 s scroll samples of the landing page at 4× CPU slowdown; David checked scrolling on his devices on 9 November 2026 and found it fine; no full trace file was recorded, so the evidence is the audit sample plus David's check.
- [x] Certified flash check per decision 12, if chosen. Not chosen (decision 12: skipped).
- [x] `audit-legal-readiness` in Pre-launch mode, reconciling the [planning report](audits/2026-11-04/legal-planning.md) LEG by LEG; top-tier model and high reasoning effort announced in the report. Done 9 November 2026 by David in Codex (“6.1 Sol / High”, as reported by David; the report says it could not verify the setting): [legal readiness](audits/2026-11-09/legal-readiness.md). No High or Critical finding; LEG-003 (Swiss mail transfer missing from the notice) fixed in this PR; LEG-009 (private record) open; LEG-001, LEG-002 and LEG-006 stay accepted risks or interpretation questions.
- [x] `audit-web-quality` on the preview: accessibility, technical SEO, browser quality, Lighthouse for every page type. Done 9 November 2026 (Codex): [web quality](audits/2026-11-09/web-quality.md). No High or Critical finding; every measured page scores Performance 100; SEO is below 100 only because of `noindex`. WEB-001 (pausing mid-fade froze the hero text half transparent) and WEB-002 (skip link inert while the menu is open) fixed in this PR, with tests.
- [x] `audit-security`, light: headers, CSP, dependencies (`pnpm audit`), repository secrets, Cloudflare settings that matter for a static site. Done 9 November 2026 (Codex): [security](audits/2026-11-09/security.md). No release blocker; the one Low finding, SEC-001 (the optional review workflow used the movable tag `claude-code-action@v1`), is fixed in this PR by pinning the commit behind v1.0.269, verified against the upstream tag. The `pnpm audit` advisory (minimatch, development tooling only) was assessed as not exploitable here. Not verified: Cloudflare account and production TLS and headers (post-launch checks), CI secret scopes.
- [x] Reports saved under `docs/audits/<date>/`; every launch-blocking finding fixed (own PR if not trivial) or accepted by David in writing in the report. Reports are saved in `docs/audits/2026-11-09/`; no finding was rated launch-blocking. Follow-up recorded at the end of the legal report: LEG-003 fixed; the private record (LEG-009) made and dated and the public terms versions saved (LEG-004); David accepted the open question of where Active24 stores mail, and deletes mail promptly (12 months at most) without a separate reminder. The accepted risks LEG-001, LEG-002 and LEG-006 are as before.
- [x] Lighthouse SEO is expected below 100 until `noindex` goes; recheck after launch. SEO 100 on production in both languages, 9 November 2026 ([post-launch checks](audits/2026-11-09/production-launch.md)).

## PR G: Launch

### G1. Code (merged first, while the domain is not yet attached)

- [x] Remove `X-Robots-Tag: noindex` from `public/_headers`; change the assertion in `tests/e2e/smoke.spec.ts` to “no `X-Robots-Tag`”. Done in the launch PR.
- [x] Add `pnpm placeholders --fail` to `pnpm verify` (and so to CI job `check`); update AGENTS.md. Done in the launch PR: 0 placeholders in 13 pages.
- [x] `workers_dev` per decision 8. Done in the launch PR: `workers_dev: false`, `preview_urls: true`. After the merge deploys, the production `workers.dev` address stops answering until the domain is attached (G2).
- [x] `pnpm verify` and `pnpm test:e2e` pass; full CI green on the ready PR. PR #41: `check`, `browser_tests`, `playwright` and Workers Builds passed.

### G2. Domain (David, with the agent, right after the merge deploys)

- [x] Attach `david-krapka.eu` to the Worker as a Custom Domain. Done by David, 9 November 2026.
- [x] Redirect `www.david-krapka.eu` to the apex permanently (301 or 308), keeping path and query; method per current Cloudflare docs (for example a Custom Domain for `www` plus a Redirect Rule). Done 9 November 2026: Single Redirect `https://www.*` to `https://${1}`, 301, query kept; `www` proxied; Always Use HTTPS on for plain HTTP.
- [x] Wait for the certificate; then run the post-launch checks below. Certificate issued by Google Trust Services, valid until 7 February 2027.

### G3. Post-launch checks

- [x] `curl -I https://david-krapka.eu/` and `/cs/`: 200, HSTS, the agreed headers, no `X-Robots-Tag`, no `Set-Cookie`. 200 for both, every agreed header, no `X-Robots-Tag`, no `Set-Cookie` ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] `curl -I https://www.david-krapka.eu/some/path/`: permanent redirect to the same path on the apex; `http://` redirects to `https://`. 301 to the same path and query on the apex; `http://` redirects with 301 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] External header scanner (for example securityheaders.com or Mozilla HTTP Observatory) result saved. Mozilla HTTP Observatory: A+, 135, 12 of 12 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] Clean browser profile: no cookies or storage after browsing, switching language and using the pause control. No cookies, no storage, no `Set-Cookie`, no third-party request ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] Cloudflare features that set cookies or inject scripts are off: Bot Fight Mode, Web Analytics, Rocket Loader, Email Address Obfuscation, Zaraz (from Ops 1; LEG-005, CSP). From outside: no injected script and no Cloudflare cookie in the served pages ([post-launch checks](audits/2026-11-09/production-launch.md)); the dashboard toggles were not inspected.
- [x] Email links open the right address and subject on desktop and on a phone. Checked by David on desktop and phone, 9 November 2026.
- [x] LinkedIn Post Inspector shows the right preview for the landing page (both languages) and one case study. Checked by David, 9 November 2026.
- [x] Test email to the domain still arrives after the domain change. Checked by David after the domain was attached, 9 November 2026.
- [x] Lighthouse mobile on production, landing in both languages: SEO 100 now that `noindex` is gone; other targets still met. Performance 100, Accessibility 96 (the known mid-fade `color-contrast` sample), Best Practices 100, SEO 100 in both languages; LCP 1.3 s, CLS 0 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [ ] Optional: submit the sitemap in Google Search Console (needs a DNS TXT verification record; ask David first). Not done at launch; moved to the after-launch list.

## Acceptance checks (from MILESTONES.md)

Record evidence here and in the PR that completes each check.

- [x] No placeholders remain; verify with the build check. (G1) `pnpm placeholders --fail` in `pnpm verify`: 0 placeholders in 13 pages.
- [x] `https://david-krapka.eu/` and `/cs/` serve the site with HTTPS, HSTS and the agreed security headers; verify with `curl -I` and an external header scanner. (A, G3) Verified 9 November 2026 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] `https://www.david-krapka.eu/` redirects permanently to the apex; verify with `curl -I`. (G2, G3) Verified 9 November 2026: 301 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] Email links open a message to the right address with the right subject; verify manually on desktop and phone. (C, G3) Verified by David, 9 November 2026.
- [x] Sharing a page on LinkedIn shows the correct preview; verify with LinkedIn's post inspector. (A, B, E, G3) Verified by David, 9 November 2026.
- [x] Audit reports are saved in `docs/audits/` and every launch-blocking finding is fixed or accepted by David. (F) Reports in `docs/audits/2026-11-09/`; no launch-blocking finding; fixes in PR #39; David's acceptances recorded in the legal report.
- [x] Email to the domain still arrives after the DNS change; verify by sending a test message. (Ops 1, G3) Ops 1 part done 9 November 2026 (test message arrived after the nameserver switch); repeat after the domain is attached at launch (post-launch checks). Repeated by David after the domain was attached: arrived.
- [x] The privacy notice exists in both languages, is linked from every footer, states the real contact address, retention and rights, and has no placeholders; verify by reading both pages. (D) Verified (PR #35, updated in PR #39 for LEG-003).
- [x] The deployed site still stores nothing on the device (no cookies or browser storage) and sets no `Set-Cookie`; verify with a clean browser profile and `curl -I`. (G3) Verified 9 November 2026 ([post-launch checks](audits/2026-11-09/production-launch.md)).
- [x] The Pre-launch legal audit reports each LEG requirement as supported, or David has accepted the gap. (F) No High or Critical finding; LEG-003 fixed, LEG-009 closed, LEG-004 public terms recorded; the Active24 mail location and LEG-001, LEG-002, LEG-006 accepted by David ([legal readiness](audits/2026-11-09/legal-readiness.md#follow-up-and-decisions-by-david-9-november-2026)).
- [x] Carried from milestone 5: each case study follows the shared structure, every claim has a source in its project card, and David signs off each page. (E) Signed off by David on 9 November 2026 (PR #36).
- [x] Carried from milestone 4: smooth on a mid-range Android phone and Safari iOS, and David signs off the feel of each animation. (F) Signed off by David, 9 November 2026.

## Wrap-up

- [x] Update MILESTONES.md: milestone 6 status, completion evidence (PR links, audit reports, launch date), unplanned changes, and the post-launch list.
- [x] Update SPEC.md: status line (launched), resolved open questions, URLs (no longer a proposal), limitations.
- [x] Update README (live URL), AGENTS.md (commands, `noindex` notes removed) and the design README. AGENTS.md was updated in PR #41 (placeholder check); it had no `noindex` notes.
- [x] Remove or update every “until milestone 6” comment in the code (`grep -rn "milestone 6" src tests public`). The `noindex` comments changed in PR #41; the remaining mentions name where a decision was made, not future work.

## Risks and notes

- **Email during the DNS move.** The highest-impact risk. Mitigated by moving the zone separately (decision 7), a record-by-record comparison, DNS-only mail records and a test message. Rollback: switch the nameservers back to Websupport; the old zone stays there until mail is confirmed.
- **Content is late.** PRs C to E wait for David. PR A and the DNS move do not; if content stalls, decision 11 says what can still launch.
- **`includeSubDomains` and HTTP-only subdomains.** Once browsers see HSTS on the apex, any plain-HTTP subdomain stops working for them for two years; check before launch (decision 9).
- **Duplicate copies.** `*.workers.dev` and preview URLs serve the same site; canonical links and decision 8 handle it.
- **Public repository.** CV, screenshots and case study drafts are public once committed, on any branch. Commit only what David has approved.
- **Cloudflare features.** Turning on Web Analytics, Rocket Loader, email obfuscation or Bot Fight Mode would add scripts or cookies, breaking the CSP or LEG-005. Keep them off; the post-launch storage check catches cookies.
- **Search engines.** Removing `noindex` is reversible but indexing is slow to undo; merge G1 only when F is closed.
