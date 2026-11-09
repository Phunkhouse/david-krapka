# Web quality audit: personal portfolio

- Date: 2026-11-09 (Europe/Prague).
- Scope: the bilingual static portfolio, rendered from an isolated production build; accessibility, technical SEO, responsive behavior, browser errors and page-load performance.
- Audited project commit: `0d06465aea8d3dc889593e32b33ca211a7e4b022`.
- Project working tree before the audit: clean, including untracked files. All tracked source files were copied to a disposable directory; no source changes were introduced into that copy.
- Toolkit commit: `d04b8b83b083f1242f0fdfd8474a617623c93f6e`; working tree clean. Skill physical path resolved to the toolkit checkout's `skills/audit-web-quality`; SHA obtained with `git -C ../.. rev-parse HEAD` from that folder.
- Prior evidence: `docs/audits/2026-11-05/lighthouse-landing.md`, `lighthouse-case-study.md` (including its 9 November update) and `flash-analysis.md`. No earlier `web-quality.md`, assigned `WEB-` IDs, or `docs/audits/context.md` were present.
- Requirements: `docs/SPEC.md`, current implementation, `docs/design/motion.md` and `docs/milestone-6-checklist.md`. Older opening paragraphs in README/SPEC still describe a placeholder site; the current build and milestone checklist establish that the case studies, CV and privacy pages are present.

## Executive summary

The local production build provides the expected content in both languages. All sampled Lighthouse performance results meet the project's ≥95 target, with LCP below 2 seconds, CLS ≤0.01373 and TBT 0 ms. Accessibility needs an interaction fix: stopping the hero during a fade can leave the main heading and explanatory text faint indefinitely. A separate mobile-menu edge case leaves the skip link pointing into inert content. SEO scores below 100 are caused by the intentional pre-launch `noindex` header, not missing metadata.

| Severity | Confirmed | Suspected |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 1 | 0 |
| Low | 1 | 0 |

## Release blockers and acceptance gaps

No Critical or High finding was confirmed. Resolve WEB-001 before signing off the stated WCAG 2.2 AA requirement. WEB-002 is a lower-priority keyboard defect with an Escape-key workaround. The deliberately configured `noindex` remains a launch-step prerequisite; it was not removed during this audit. This review does not certify overall accessibility, security, indexing or production readiness.

## Scope and coverage

The audience is recruiters, hiring managers, technical/product leads and potential clients. Critical paths are landing → relevant case study → contact or CV, with equivalent language switching. All pages are public; there are no authenticated roles, forms, purchase flows or dialogs. The mobile navigation overlay and motion controls supply the relevant interactive states.

| Area | Coverage | Evidence and limitation |
| --- | --- | --- |
| EN/CS landing pages | Reviewed | Three mobile Lighthouse runs each; keyboard, skip link, pause, reduced motion, no-JavaScript and responsive checks. |
| EN/CS Kultomat long case study | Reviewed | Three mobile Lighthouse runs each; headings, images, metadata, local links and responsive checks. |
| EN/CS Eucal short case study | Reviewed | Three mobile Lighthouse runs each; same checks for the short template. |
| EN/CS Vladan Vaněk and UpVideo | Sampled | Rendered, axe at desktop/320 px, all six widths, images and metadata inspected; no Lighthouse repeats for these instances of the short template. |
| EN/CS privacy pages | Reviewed | Three mobile Lighthouse runs each; headings, content render, links, responsive and axe checks. No legal assessment. |
| Unknown URL | Sampled | Bilingual 404, correct status, no canonical, no horizontal overflow, no axe violations. No Lighthouse score assigned to this intentionally non-indexable error state. |
| Responsive layout | Reviewed | All 13 routes at 1440×900, 1024×900, 768×900, 640×844, 390×844 and 320×844 CSS px. No horizontal overflow in these measurements. |
| Keyboard and open menu | Sampled | EN/CS landing, EN long case and EN privacy at 390×844; tab sequence, outlines, Escape, inertness and anchor closure. Open state investigated separately. |
| JavaScript disabled | Sampled | EN/CS landing, EN long case, CS short case and EN privacy at 320×844: real content, footer-navigation fallback and no horizontal overflow. |
| Assistive technology, real devices, Safari | Not verified | No screen-reader session or physical devices. Installed Playwright requires WebKit build 2370; only 2359 is present. No browser installed for this audit. |
| Live deployment and integrations | Not verified | No production testing, DNS changes, email sending, external-link browsing, search-engine submissions or purchases. |

## Web quality results

### Environment and reproducibility

- Disposable workspace and private raw artifacts: `/private/tmp/portfolio-web-quality-25y912i4/`. JSON/HTML reports, browser screenshots, logs and temporary scripts remain outside the repository. These are local temporary artifacts, not published evidence; essential observations are reproduced below.
- Build: normal production static build, `SHOW_DRAFTS` unset; 13 pages generated. Source copied before execution; existing installed dependencies copied into the disposable workspace. No database, application backend, telemetry integration or third-party content service is part of the application.
- Server: Wrangler 4.157.0, `--local --ip 127.0.0.1 --port 8879`, serving the copied build with `public/_headers` and configured trailing-slash/404 behavior. Final URLs were exactly `http://127.0.0.1:8879` plus the routes below, with expected titles, language, H1 and content; no login or error page substituted for a successful scan. Authentication: anonymous throughout.
- Tools: Node 26.13.0, Astro 7.4.5, Playwright 1.64.1, axe-core 4.14.0, Lighthouse 12.8.2, Chrome for Testing 156.0.8078.4; macOS 27.2 arm64. Existing tooling used; no successful dependency or browser install.
- Budget fixed before testing: 25 minutes overall, at most 24 Lighthouse runs, three per selected route, 90-second timeout per run and 20-minute Lighthouse sub-budget. Runs executed serially, without simultaneous manual browser testing.
- Lighthouse: performance/accessibility/best-practices/SEO, default mobile simulated throttling, 412×823 CSS px, DPR 1.75; network RTT 150 ms, throughput 1638.4 Kbps, CPU slowdown multiplier 4. Resolved auxiliary throttling values: request latency 562.5 ms, download 1474.56 Kbps, upload 675 Kbps. Browser/report locale en-US; page languages EN or CS. Emulated network UA identifies Android 11 Moto G Power/Chrome 136; actual host browser is Chrome 156. Fresh Chrome instance and storage/cache reset for each run (`disableStorageReset=false`), no user credentials or prewarmed page visit.
- Initial command errors were environmental: pnpm auto-bootstrap attempted registry fetches after the copied dependency store path changed; DNS access failed and the operation was stopped. Direct execution of the already installed Astro CLI then hit sandbox `listen EPERM` on its temporary font server; the permitted retry succeeded. Wrangler initially lacked a built assets directory and could not write its default log path; the final server started only after the successful build, with logs redirected outside the repository. These failed setup attempts are not passing application checks.

Commands, from the disposable source directory (Node 26.13.0 first on PATH):

```sh
ASTRO_TELEMETRY_DISABLED=1 node node_modules/astro/bin/astro.mjs build
WRANGLER_SEND_METRICS=false WRANGLER_LOG_PATH=/private/tmp/portfolio-web-quality-25y912i4/wrangler-logs node node_modules/wrangler/bin/wrangler.js dev --local --ip 127.0.0.1 --port 8879
```

Each Lighthouse run used the existing cached CLI and installed Chrome, from the disposable workspace:

```sh
CHROME_PATH='<installed Chrome for Testing binary>' node '<existing lighthouse>/cli/index.js' 'http://127.0.0.1:8879/<route>' --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path='<temporary route-profile-repeat>' --chrome-flags='--headless=new' --locale=en-US --no-enable-error-reporting --quiet
```

The exact executable paths, commands, resolved settings and per-run timestamps are retained in `lh-summary.json`; individual raw reports use `<route>-mobile-<1|2|3>.report.json` and `.report.html`.

### Category scores and performance measurements

Scores and metrics below are ordered run 1 / 2 / 3. All 24 runs completed with no Lighthouse runtime errors or run warnings. Capture window: 08:18:25–08:22:39 UTC (09:18:25–09:22:39 Prague); the final score was produced shortly after the last capture timestamp. Host benchmark index varied from 2319 to 3105, another reason to keep all observations rather than infer small differences.

| Route | Performance | Accessibility | Best practices | SEO | LCP (s) | FCP (s) | CLS | Initial transfer (KiB) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 100 / 100 / 100 | 100 / 96 / 100 | 100 / 100 / 100 | 66 / 66 / 66 | 1.526 / 1.488 / 1.446 | 1.226 / 1.263 / 1.221 | 0.00000 / 0.00000 / 0.00000 | 177.7 / 177.7 / 177.7 |
| `/cs/` | 100 / 100 / 100 | 100 / 100 / 96 | 100 / 100 / 100 | 66 / 66 / 66 | 1.495 / 1.527 / 1.455 | 1.270 / 1.227 / 1.230 | 0.00000 / 0.00000 / 0.00000 | 178.1 / 178.1 / 178.1 |
| `/work/kultomat/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 69 / 69 / 69 | 1.516 / 1.516 / 1.249 | 1.216 / 1.216 / 1.099 | 0.00000 / 0.00000 / 0.00000 | 77.2 / 77.2 / 77.2 |
| `/cs/work/kultomat/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 69 / 69 / 69 | 1.516 / 1.529 / 1.514 | 1.216 / 1.229 / 1.214 | 0.00000 / 0.00000 / 0.00000 | 78.0 / 78.0 / 78.0 |
| `/work/eucal/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 69 / 69 / 69 | 1.378 / 1.085 / 1.376 | 1.078 / 0.935 / 1.076 | 0.00000 / 0.00000 / 0.00000 | 91.4 / 91.4 / 91.4 |
| `/cs/work/eucal/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 69 / 69 / 69 | 1.386 / 1.375 / 1.382 | 1.086 / 1.075 / 1.082 | 0.00000 / 0.00000 / 0.00000 | 75.3 / 75.3 / 75.3 |
| `/privacy/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 66 / 66 / 66 | 1.235 / 1.367 / 1.386 | 1.085 / 1.067 / 1.086 | 0.00000 / 0.00000 / 0.00000 | 65.1 / 65.1 / 65.1 |
| `/cs/privacy/` | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 66 / 66 / 66 | 1.219 / 1.231 / 1.224 | 1.069 / 1.081 / 1.074 | 0.01372 / 0.01372 / 0.01372 | 65.6 / 65.6 / 65.6 |

TBT: 0 / 0 / 0 ms on every measured route. Across all runs, LCP ranged from 1.085 to 1.529 seconds, below the 2.0-second lab target. Maximum CLS was 0.01372 on Czech privacy, below the 0.05 target; all other routes measured 0. The two accessibility scores of 96 were `color-contrast` failures on the animated landing text (EN run 2, CS run 3); they are retained in this table and investigated as WEB-001. Image-delivery and dependency-tree optimization suggestions were not promoted to findings: the actual loading budgets were met and no user-facing performance failure was demonstrated.

All results above are local synthetic lab measurements. They do not establish real-user LCP, INP, CDN latency or production performance. No INP conclusion is derived from TBT. Screenshot images below the fold are lazy-loaded: initial transfer numbers do not represent a fully scrolled page. The manual pass scrolled each main-content image into view and confirmed successful decoding. The homepage loaded five font requests totaling 54,835 transferred bytes, below the 150 KB font budget.

The only failing SEO audit was `is-crawlable`, explained by `X-Robots-Tag: noindex` in `public/_headers:9`. It is explicitly retained until launch in the milestone checklist. Canonical production URLs and language alternates are intentional on the local preview; local origin mismatch is not an indexing defect. Production robots directives and search visibility remain unverified.

## Findings

### WEB-001: Pausing the hero can freeze its text at unreadably low contrast

- Severity: **Medium**.
- Confidence: **High**.
- Status: **Confirmed**; measured browser behavior and code-proven mechanism.
- Previous finding: None.
- Location: `src/components/PauseControl.astro:63`, `src/styles/global.css:148`, `src/components/landing/Hero.astro:537` (and subsequent word keyframes).
- Affected state: `/` and `/cs/`, JavaScript enabled, motion allowed, tested at 390×844; shared CSS also applies on desktop. Final URLs remained the intended landing routes.
- Reproduction: Focus “Stop the press” / “Zastavit tisk”. Activate it while the heading fades out, roughly 2.5 seconds into a 9-second cycle, or during another word transition. The reproduction waited on the naturally running opacity phase and pressed Enter on the real control; it did not edit animation time or application code.
- Evidence: After activation, `html.paused=true`, running animations=0. Heading opacities were EN `[0.240616, 0, 0]`, CS `[0.240702, 0, 0]`; corresponding sublines had the same values. A screenshot confirmed faint text persisted in the stopped state. Compositing the ink color `#1B2F7A` at the observed opacity over paper `#FAFAF7` gives approximately **1.58:1** contrast. That is below both the 3:1 large-text and 4.5:1 ordinary-text thresholds explained by [W3C's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Independent Lighthouse transition captures reported `color-contrast`, including a 2.25:1 example; the focused low-opacity stopped-state axe run itself reported no violations. This illustrates why the issue is grounded in rendered behavior and measured colors, not just a score.
- Contrary evidence considered: The design explicitly calls for freezing the current frame (`docs/design/motion.md:21`), and reduced-motion/no-JavaScript versions present complete, opaque text. Assistive-technology text remains in the DOM. Those facts explain the implementation but do not make the visual heading or subline readable after an ordinary pause action. A transient fade alone would not justify the lasting-impact finding.
- Impact: A visitor who stops motion to read may instead leave the main positioning statement and its explanation faint until they restart it. This particularly affects visitors with low contrast sensitivity and fails the intended readable paused state.
- Remediation: Give paused text a stable readable state: reveal the static complete heading/sublines or snap text to an opaque frame while retaining the desired paused decorative artwork. Preserve reduced-motion behavior and avoid introducing overlap or layout shifts.
- Verification: Pause before, during and after every word transition, in both locales and mobile/desktop profiles. The visible stopped text should remain readable at the applicable contrast threshold, with no overlapping lines. Repeat contrast checks, keyboard pause/resume and Lighthouse; keep timing variability in the recorded results.

### WEB-002: The mobile skip link targets content that the open menu keeps inert

- Severity: **Low**.
- Confidence: **High**.
- Status: **Confirmed**; measured browser behavior and code-proven mechanism.
- Previous finding: None.
- Location: `src/components/Header.astro:116` and `src/components/Header.astro:140`; skip link at `src/layouts/BaseLayout.astro:114`.
- Affected state: Mobile navigation open, tested at 390×844 on both landing locales; the shared header was also sampled on EN long case and privacy pages.
- Reproduction: Keyboard-focus the menu toggle, press Enter, then Shift+Tab twice to reach “Skip to content” / “Přejít na obsah”. Press Enter.
- Evidence: Before activation the skip link is focusable while `main.inert=true`. After activation, the URL changes to `#main`, focus is on `BODY`, the menu remains open and `main.inert` remains true. Header logic clears inertness only via the menu toggle, Escape, selected panel links or breakpoint change; the skip link is outside those handlers. Forward tabbing after the final language link can also leave the header and reach the skip link.
- Contrary evidence considered: Escape closes the menu, restores toggle focus and clears inertness; ordinary panel navigation links also close it. The menu is a navigation disclosure, so the absence of a dialog role or a modal focus trap is not itself reported as a defect. [W3C's disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) likewise uses navigation links rather than requiring an ARIA menu widget.
- Impact: The offered bypass action fails while the overlay is open, and focus loses its meaningful destination. Users can recover with Escape, so this is a narrow keyboard edge case rather than an unrecoverable trap. [W3C's focus-order guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) supports preserving operability and a meaningful focus sequence.
- Remediation: Close the mobile panel and remove inertness before following the skip link, then allow focus to reach `main`. Alternatively use a consistent disclosure focus-exit policy that closes the panel before focus reaches content outside it. A new dialog abstraction is not necessary for this fix.
- Verification: Repeat the Shift+Tab sequence in both languages and on a case-study page. Enter should close the panel, clear inertness and focus `main`. Recheck Escape, ordinary section links and resizing above the mobile breakpoint.


## Previous findings and baseline reconciliation

| Prior observation | Current state | Evidence and limits |
| --- | --- | --- |
| Landing LCP/font budget after font subsetting, 5 November | Supported on the current local build | LCP below 2 s and measured font transfer below 150 KB. Earlier runs used a remote preview and Lighthouse 12.6.1; these are not controlled regression measurements. |
| Case-study template performance, including 9 November finished-content measurements | Supported on the sampled current build | Long and short pages in both languages meet lab targets with screenshots present. No improvement/regression inferred across Lighthouse/browser versions. |
| Intentional pre-launch `noindex` | Still open as a planned launch action | Correctly applied by the isolated Wrangler server; not assigned a defect ID. Recheck after the launch change. |
| Prior automated accessibility scores of 100 | Not sufficient for current interaction sign-off | Default axe checks can pass while WEB-001/WEB-002 remain. Intermittent Lighthouse contrast failures now recorded, with paused-state reproduction in WEB-001. |
| Approximate portrait flash analysis | Not reverified | Existing `flash-analysis.md` remains the evidence; this audit did not run certified flash analysis or a real-device motion review. |

No prior `WEB-` or `PERF-` finding IDs were assigned. Other prior audit reports contain legal planning, not an independently assigned performance finding for either root cause.

## Checks without additional findings

- All 12 intended content routes returned 200 and the unknown route returned 404. Each content page had one H1, a nonempty localized title/description, the expected production canonical and EN/CS/x-default alternates. Sampled headings did not skip heading levels.
- Sitemap XML parsed successfully, contained 12 unique URLs matching the rendered canonical route set, and contained the expected language alternates. `robots.txt` allowed crawling and pointed to the production sitemap. No missing local fragment target was detected in the sampled DOM.
- All unique local destinations gathered from landing/long/short/privacy pages returned 200, including the CV PDF, all case-study routes and both privacy pages. Two sampled slashless URLs resolved to their trailing-slash routes; only the local result is established, not the eventual production redirect chain.
- Main-content images decoded after scrolling them into view. Alternative text and dimensions were present in the inspected image records. Rendered/built landing JSON-LD parsed as a `Person`; this does not certify the truth of its claims or rich-result eligibility.
- Closed-state axe found no violations on all 13 routes at 1440 and 320 px (26 page/profile checks); Lighthouse adds the independent transient contrast failures recorded above. Incomplete axe checks remain review limitations, not passes.
- Keyboard checks confirmed the skip link normally focuses `main`, the pause control stops animation, Escape restores menu-button focus, and ordinary menu section links close the panel. Verified focus rings: header ink 3 px, footer yellow 3 px, and project-card yellow 3 px on the link's `::after`; the card's suppressed element outline is intentional and has a visible replacement.
- No page-origin third-party requests, unexpected JavaScript/console errors, broken main-content images, cookies, localStorage/sessionStorage entries or IndexedDB databases were detected during the main page sampling. The expected 404 resource message on the intentional missing-page request is not an unexpected browser failure. No CSP blocking error appeared in these flows. This is not a security audit.
- Reduced-motion starts with zero running animations on both landing locales. JavaScript-disabled content and footer-navigation fallback worked in the five sampled states. Mobile same-page language switching landed on the expected counterpart route.
- A supplementary scroll sample traversed each landing page over about 8 seconds at a 390×844 viewport with CDP CPU slowdown 4×. The Long Tasks API recorded no tasks exceeding 50 ms during either sample. This is two short synthetic samples, not a retained full performance trace, GPU/frame-rate study or real-device smoothness sign-off. Duration: EN 8.011 s, CS 8.016 s.

No application tests or CI definitions were changed. The existing Playwright suite was inspected as context; the browser measurements and focused checks above were executed independently, rather than claiming the full existing suite passed.

## Not verified and practical next steps

| Area | Missing evidence | Practical next step |
| --- | --- | --- |
| Preview and production delivery | This audit used an isolated local production build, not the deployed branch preview or custom domain | Repeat the selected routes on the actual preview; after launch verify HTTPS, redirect preservation, headers and absence of production `noindex`. |
| Safari/iOS, Firefox, Android and physical input | Matching WebKit unavailable; only Chromium executed; no physical device or screen reader | Use existing CI/browser infrastructure and physical Safari iOS/mid-range Android; test VoiceOver/NVDA reading order and navigation. No cross-browser pass claimed. |
| Actual desktop 200% zoom/text resize | 640 CSS-px reflow and 2× CDP pinch were sampled; pinch changes the visual viewport and does not replace browser zoom/text-resize validation | Use native browser 200% zoom and text enlargement; confirm menus, headings and contact controls remain usable. |
| Full WCAG 2.2 AA conformance | Automated sampling and targeted keyboard checks cover only part of WCAG | Resolve findings, then complete a criterion-based review with assistive technology. Category scores alone are insufficient. |
| Real-user Web Vitals and interaction latency | No production field dataset; TBT is not INP | Collect an appropriate field sample after launch if desired, preserving the site's privacy/storage requirements; assess against the SPEC's field targets. |
| Search indexing, rich results and social previews | Local DOM/HTTP checks do not prove crawlers index the domain or social platforms render the image | Recheck deployed robots/headers/canonicals and sitemap; use authorized search/social inspection after launch. Person JSON-LD presence is not rich-result certification. |
| Email delivery, external sites and CV accessibility | Local link destinations/asset responses only; no email sent, external application opened or PDF accessibility audit | Test the real mail alias and subjects on desktop/phone, validate intended external destinations, and separately review the CV with PDF/assistive tooling. |
| Complete performance/page matrix | Three mobile runs on eight routes; no desktop Lighthouse, 404 Lighthouse or repeats for the two other short-template projects | Add page/profile runs if content or template diverges; compare using the same tool versions and conditions. |

## Repository preservation

Before execution, `git status --porcelain=v1 --untracked-files=all` was empty. It was still empty immediately before writing this report. After writing, status comparison confirmed that the only difference is the new `docs/audits/2026-11-09/web-quality.md`; both unstaged and staged tracked-file diffs are empty, and HEAD is unchanged. No application code, configuration, infrastructure, project data, existing report or milestone checklist was edited. Builds, server state, raw reports and browser artifacts remain in the disposable workspace. The temporary local server was stopped after verification.

## Follow-up, 9 November 2026

Added after the audit; the findings above are unchanged.

- **WEB-001: fixed** in PR 39. Pressing stop now moves the looping hero animations to the nearest point where the text is fully readable (the end of the current fade-in, or the end of the cycle) before pausing, instead of freezing mid-fade. Three end-to-end tests pause at 27 %, 60 % and 95 % of the 9 s cycle and check that one heading line and one subline are fully opaque and the rest fully transparent; the 60 % and 95 % tests fail without the fix. The "Stop the press" note in `docs/design/motion.md` was updated.
- **WEB-002: fixed** in PR 39. Activating the skip link closes the open mobile menu, so `main` is no longer inert and receives focus. An end-to-end test covers it.
- `noindex` stays until the launch step. The reconciliation of the Lighthouse scores is unchanged: re-run Lighthouse after launch.
