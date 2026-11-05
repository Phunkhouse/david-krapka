# Milestone 4 checklist: Motion

Working plan for [Milestone 4](MILESTONES.md#milestone-4-motion). Scope and acceptance checks come from MILESTONES.md; this file only sequences the work. Tick items as they are done and record evidence in the PR.

**Goal:** the print-drum hero, approach A5, portrait G4 and the small hover interactions, without hurting accessibility or performance.

**Motion is a layer on top of the static page.** Milestone 3 built the reduced-motion look. Everything here is added on top of that markup and switched on only when it is safe: JavaScript is running and the visitor has not asked for reduced motion. With JavaScript off, failed, or `prefers-reduced-motion: reduce`, the page stays exactly as it is today. Timings and keyframes come from [Motion](design/motion.md) and the mockup sources in [docs/design/mockups/](design/mockups/README.md) (`D-Home`, `M-Home`).

## Delivery plan: three PRs, one at a time

Each PR is reviewable on the preview URL and starts only after the previous one is merged or closed.

| PR | Branch (proposed) | Contents | Blocked by |
| --- | --- | --- | --- |
| A | `feat/motion-hero-pause` | Motion switch and helper, hero print drum with cycling headline, pause control placed and working, off-screen pausing | Decisions in section 0 |
| B | `feat/motion-approach-hover` | Approach A5 (develop once on scroll, hover), link hover, smooth anchor scrolling, card hover if decided | Nothing |
| C | `feat/motion-portrait` | Portrait G4 and the dot-circle drift, flash analysis, real-device check, Lighthouse, wrap-up | Nothing |

The drum is first because it is the biggest risk (3D text on Safari, LCP) and because the pause control needs a looping animation to control. The portrait is last because it carries the flash check.

## 0. Before starting (David)

Each item has a recommendation; answering “as recommended” is enough. Decisions go into the design docs in the PR that implements them.

- [x] Milestone 3 merged and complete ([PR #16](https://github.com/Phunkhouse/david-krapka/pull/16)).
- [x] Approve this plan, or name changes. Approved by merging [PR #17](https://github.com/Phunkhouse/david-krapka/pull/17).
- [x] **Motion without JavaScript** (blocks PR A). Recommendation: motion runs only when JavaScript is available. A tiny inline script in `<head>` adds a `motion` class to `<html>` before first paint when reduced motion is not requested; every animation and the motion layout of the hero hang off that class. Reason: without JavaScript the pause control cannot work, and a loop without a pause fails WCAG 2.2.2. Adding the class before paint means no layout shift. Alternative: pure CSS motion for everyone, with the pause control only where JavaScript runs (fails 2.2.2 without JavaScript). **Decided 5 November 2026: as recommended.**
- [x] **One pause control or two** (blocks PR A; open in [Shell components](design/shell-components.md#to-iterate)). Recommendation: one control on the hero drum band, as designed, that stops every looping animation on the page, including the portrait far below. WCAG 2.2.2 needs a mechanism, not one per animation. Alternative: a second, smaller control next to the portrait. **Decided 5 November 2026: as recommended.**
- [x] **What “Stop the press” does to a loop mid-turn** (blocks PR A). Recommendation: freeze in place (`animation-play-state: paused`) and resume from the same point, like stopping a press. If a freeze mid cross-fade looks broken (two half-visible words), PR A instead lets the current turn finish and holds on the next face. Alternative: jump back to the static, reduced-motion layout (the headline changes from one line to three, a visible jump). **Decided 5 November 2026: as recommended.**
- [x] **Reduced motion and the pause control** (blocks PR A). Recommendation: as designed, the control is shown under reduced motion and starts as “Start the press”; pressing it starts the motion for that page view only. Alternative: hide the control under reduced motion and never animate. **Decided 5 November 2026: as recommended.**
- [x] **Project card hover** (affects PR B). Recommendation: leave it out of this milestone. The cards are not links until milestone 5, and a lift on hover suggests something clickable. Milestone 5 adds the hover and `:focus-visible` lift together with the links. Alternative: add the lift now on hover only. **Decided 5 November 2026: as recommended.**
- [x] **Smooth scrolling for anchor links** (affects PR B). Recommendation: yes, `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`; focus still moves to the section as today. Alternative: keep the instant jump. **Decided 5 November 2026: as recommended.**
- [x] **Mobile menu slide** (open in [Shell components](design/shell-components.md#to-iterate)). Recommendation: not in this milestone; the menu keeps opening instantly. Alternative: a short slide from the header, designed first. **Decided 5 November 2026: as recommended.**

## Shared rules for every PR

- Animated elements stay `aria-hidden`. Readable text never depends on an animation: the H1 keeps its full text “Think. Make. Rethink.” for assistive technology, and the cycling words are a decorative copy.
- Every animation is scoped to `html.motion` (or its equivalent from section 0) **and** `@media (prefers-reduced-motion: no-preference)`. The global reduced-motion rule in `src/styles/global.css` stays as a safety net.
- Start states that hide something (undeveloped halftone, blurred column text) only apply while the script that reveals them can run. If the reveal never happens (observer not supported, script error), the page must still show the developed, readable state; a timeout or `@supports` fallback is fine.
- Animate only `transform`, `opacity`, `clip-path`, `background-color` and the registered `--r` ([Motion rule 6](design/motion.md#global-rules)). No layout-affecting properties, so CLS stays 0.
- One small client module for motion (switch, pause state, IntersectionObserver), no animation library. Keep it under 2 KB compressed; record the size in each PR.
- The pause state lives in a module variable only: no cookie, `localStorage`, `sessionStorage`, IndexedDB or URL parameter ([LEG-005](SPEC.md#legal-requirements)).
- Copy for new labels in `src/i18n/en.ts` and `cs.ts` (the pause labels already exist).
- Inline scripts must pass the hashed `<meta>` CSP from `astro.config.mjs`; the existing CSP test catches violations.
- Measured against the mockups at 1440 and 390 px; motion compared with the canvas by David, as screen recordings in the PR.
- Each PR: `pnpm verify` and `pnpm test:e2e` locally, results in the PR; David's sign-off on the feel of each animation on the preview URL.

## PR A: Motion switch, hero drum and pause control

### A1. Branch and docs

- [x] Branch from up-to-date `main`; draft PR; `check` and `playwright` skipped on the draft (intended).
- [x] Record the section 0 decisions in [Motion](design/motion.md), [Shell components](design/shell-components.md) and the [design README](design/README.md#open-design-questions); mark the SPEC open question for milestone 2 (pause control) resolved.

### A2. Motion switch and helper

- [x] Inline `<head>` script in `BaseLayout.astro` sets the motion class before first paint when `matchMedia('(prefers-reduced-motion: no-preference)')` matches; listens for preference changes during the visit.
- [x] Motion module: page-wide paused state, a `data-paused` (or class) switch on `<html>` that sets `animation-play-state: paused` on every looping animation, and an IntersectionObserver that pauses each looping section while it is off-screen. User pause and off-screen pause are separate; the user's choice always wins.
- [x] Without JavaScript and under reduced motion the page is identical to milestone 3 (compare screenshots).

### A3. Hero print drum (`#top`)

- [x] Drum: three faces T, M, R on a prism (`perspective` 1300 px desktop, 620 px mobile; `translateZ` 180 / 88 px), each with the pink misregistered copy; the 9 s turn with `cubic-bezier(.7, 0, .3, 1)`, the 10 px kick and the curvature shade, as in [Motion](design/motion.md#hero-print-drum-9-s-loop).
- [x] Counter sheet slides 1/3 → 2/3 → 3/3 → 1/3 in step with the drum.
- [x] Headline in motion: one line cycling “Think.” → “Make.” → “**Re**think.” with the 36 px slide and cross-fade, and the matching subline under it. The H1 keeps the full claim as text for assistive technology; the cycling words and sublines are `aria-hidden`. On the Czech page the claim stays marked `lang="en"`.
- [x] Reserve the headline and subline height so the motion layout does not shift the intro and buttons (CLS 0).
- [x] The LCP element is still text and still paints without waiting for fonts or script; check in Lighthouse (the visually hidden H1 text does not count as LCP, so check which element Lighthouse picks).
- [x] Safari (macOS, and iOS on a real phone): drum letters are sharp during and after a turn. If not, fall back to a 2D flip (`scaleY` with the shade) and record it in [Motion](design/motion.md). Evidence: David tested the drum on Safari macOS and iOS (5 November 2026): looks good, animation is fine. No 2D fallback needed.

### A4. Pause control

- [x] `PauseControl` placed on the hero drum band, bottom-left, 40 px desktop / 36 px mobile, early in the tab order, before the drum ([Shell components](design/shell-components.md#pause-control)). Both landing pages.
- [x] Toggles between “Stop the press” / “Start the press” (Czech “Zastavit tisk” / “Spustit tisk”) and the pause / play icon. Use either `aria-pressed` or the swapped label, not both (as specified); recommended: swap the label and drop `aria-pressed`.
- [x] Behaviour per section 0 (freeze or finish the turn; reduced-motion start state).
- [x] Without JavaScript the control is not shown (it would do nothing). Remove the “not placed on any page” comment from the component.
- [x] The `/specimen/` page keeps its static copies or uses the working component; either way its tests still pass.

### A5. Tests

- [x] Playwright, reduced motion emulated: no animation has `playState === 'running'` (read with `document.getAnimations()`), the hero shows the milestone 3 static layout, the pause control starts as “Start the press”.
- [x] Playwright, no preference: the drum animations run; pressing the control (mouse and keyboard) pauses every looping animation and pressing again resumes them; the label and accessible name change.
- [x] Playwright: after using the control there are no cookies and nothing in `localStorage`, `sessionStorage` or IndexedDB (extend the existing storage check).
- [x] Playwright: scrolling the hero out of view pauses its animations; scrolling back resumes them unless the user paused.
- [x] Playwright with JavaScript disabled: no running animations and no pause control.
- [x] The H1 accessible name is still “Think. Make. Rethink.” on both pages; axe, 320 px scroll, request, storage and CSP checks pass.
- [x] Lighthouse mobile on the preview for `/` (one run is enough here; the full record is in PR C): LCP and CLS still within target. Evidence (preview, Lighthouse 12.6.1, two runs): Performance 100, Best Practices 100, LCP 1.3 s, CLS 0, TBT 0. Accessibility 100 in one run and 96 in the other: axe sampled a heading line and subline mid cross-fade (contrast 1.36 at partial opacity). It is a timing artefact of the fade, not text that stays unreadable; **Decided 5 November 2026: accept it**; the cross-fade stays as designed and an occasional 96 is a known measurement effect, not a defect.

## PR B: Approach A5 and small interactions

### B1. Approach (`#approach`)

- [x] Develop once on scroll: when the section enters the viewport, `--r` grows from 0 to 2.2 px over 1.6 s (`@property --r`), the pink “M” slides into register from `translate(18px, -14px)` to 45 % opacity over 1.4 s, column text fades in from 6 px blur over 0.9 s, staggered 0.2 / 0.45 / 0.7 s ([Motion](design/motion.md#approach-section-a5-develops-on-scroll--reacts-on-hover)).
- [x] Plays once per page view; the observer disconnects afterwards. A visitor who lands below the section (or jumps to `#approach`) still sees it develop or sees the developed state, never an empty column.
- [x] Without `@property` support the letters simply appear developed.
- [x] Hover (only under `@media (hover: hover)`): hovered column turns yellow, others return to paper; its letter rises 36 px and rotates −4°; the pink copy moves `14px, -26px`; the title shifts 8 px; the “Re” highlight inverts. 0.35–0.45 s, `cubic-bezier(.2, .8, .2, 1)` for the letter.
- [x] Not a looping animation, so not tied to the pause control; check that it is off under reduced motion.

### B2. Small interactions

- [x] Links: underline thickens to 3 px on hover (hover-capable devices).
- [x] Smooth anchor scrolling per section 0, off under reduced motion; anchor focus behaviour unchanged.
- [x] Project card hover per section 0: none until milestone 5 (decided); added to the milestone 5 scope in MILESTONES.md.

### B3. Tests

- [x] Playwright: the approach letters are undeveloped before the section is scrolled into view and developed after (read the computed `--r` or the animation state); the animation runs once.
- [x] Playwright, reduced motion: approach shows the developed state with no running animations.
- [x] Playwright: the existing anchor and focus tests still pass with smooth scrolling (wait for focus, not for time; no fixed sleeps).
- [x] axe, 320 px scroll, request, storage and CSP checks pass.

## PR C: Portrait G4, checks and milestone wrap-up

### C1. Portrait (`#about`)

- [x] Two halftone layers (ink and pink, 9 px dot grid) masked to the silhouette and sliced into six strips; the 7 s loop with the calm phase, the first burst with the 14 px scan bar, and the smaller second burst, `steps(1)` frames, as in the mockup keyframes `pg-*` ([Motion](design/motion.md#about-portrait-g4-ink-slip--roller-jam-7-s-loop)).
- [x] Pink dot circle drifts on its own 4 s loop (`6px, -4px`).
- [x] Both loops stop with the pause control and pause off-screen.
- [x] Reduced motion and no JavaScript: calm state, no scan bar (as today).
- [x] Build it so the real photo can replace the silhouette later (two-colour halftone layers or CSS masks over one image); note how in [Motion](design/motion.md).

### C2. Flash analysis

- [x] Record the portrait loop at 60 fps at 1440 and 390 px and run a flash-analysis tool on it (for example EA's open-source IRIS, or PEAT on Windows); record the tool, version and result in `docs/audits/` ([WCAG 2.3.1](design/motion.md#global-rules): no more than three flashes per second).
- [x] If it fails, soften the burst (fewer frames, smaller jumps, lower contrast of the scan bar) and re-run.

### C3. Real devices and performance

- [ ] Mid-range Android phone and Safari on iOS (David's devices): hero, approach and portrait run smoothly, drum text is sharp; a short screen recording of each in the PR. **Carried to the milestone 6 pre-launch review** (David checked the hero drum on Safari macOS and iOS in PR A).
- [ ] Performance panel on a throttled profile: no long tasks while scrolling the landing page; record the trace summary. **Carried to the milestone 6 pre-launch review.**
- [x] Lighthouse mobile on the preview for `/` and `/cs/`, three runs each, compared with the [milestone 3 baseline](audits/2026-11-05/lighthouse-landing.md): Performance ≥ 95, Accessibility 100, Best Practices 100, LCP ≤ 2.0 s, CLS ≤ 0.05 (SEO `noindex` exception as before). Save a summary in `docs/audits/`. Evidence (PR #20 preview, Lighthouse 12.6.1, three runs per page): Performance 100, Best Practices 100, LCP 1.2 to 1.4 s, CLS 0, TBT 0 ms on `/` and `/cs/` (milestone 3 baseline: 99, LCP 1.7 to 1.8 s). Accessibility **96 in all six runs**, not 100: axe samples the hero heading line and subline mid cross-fade (contrast 1.4 to 2.0 at partial opacity), the effect accepted on 5 November 2026; here it happens every run rather than occasionally. **Decided 5 November 2026: keep accepting it** (the SPEC Accessibility 100 target is met by the e2e axe checks, not by Lighthouse's mid-fade sample). SEO 66 from the expected `noindex`.
- [x] Motion script size recorded (target under 2 KB compressed).

### C4. Tests

- [x] Playwright: portrait loops stop with the pause control and when scrolled off-screen; reduced motion shows the calm state with no scan bar.
- [x] Full suite on both languages: axe at 1280, 768 and 320 px, 320 px scroll, request, storage and CSP checks. Evidence: 138 e2e tests pass, including axe at 1280, 768 and 320 px on both pages.

## Acceptance checks (from MILESTONES.md)

Record evidence here and in the PR that completes each check.

- [x] With `prefers-reduced-motion: reduce` emulated, no element has a running animation; verify with Playwright reading `getAnimations()`. (PR A, extended in B and C) Evidence: `motion.spec.ts`, `approach-motion.spec.ts`, `portrait-motion.spec.ts` (nothing runs, static hero, developed approach, calm portrait).
- [x] The pause control (`PauseControl`, built in milestone 2) is placed on every page before any looping motion (WCAG 2.2.2), stops all looping animations and is reachable by keyboard; verify with Playwright. (PR A; portrait added in C. Only the landing pages have looping motion.) Evidence: `motion.spec.ts` (keyboard stop and restart, tab order before the hero text) and `portrait-motion.spec.ts` (the one control also stops the portrait).
- [x] Using the pause toggle writes no cookie, `localStorage`, `sessionStorage` or IndexedDB entry; verify with Playwright. (PR A) Evidence: `motion.spec.ts` (and the reduced-motion opt-in test).
- [x] Looping animations pause when scrolled off-screen; verify with Playwright. (PR A for the drum, C for the portrait) Evidence: `motion.spec.ts` (hero) and `portrait-motion.spec.ts` (portrait).
- [x] The portrait glitch passes a flash analysis (≤ 3 flashes per second); verify with a flash-analysis tool and record the result. (PR C) Evidence: [flash analysis](audits/2026-11-05/flash-analysis.md): 0 flashes per second at 1440 and 390 px (largest changed area 15 % of the threshold). Approximate tool of our own, not PEAT or IRIS; the hero drum also passes (0, and 2 at a quarter of the area).
- [ ] Smooth on a real mid-range phone and on Safari iOS (drum text not blurry); verify manually with a screen recording. (PR A for the drum on Safari, C for the whole page; David's devices) **Partly; rest carried to milestone 6.**
- [x] Lighthouse performance and CLS targets still met; verify with Lighthouse. (PR C, spot check in A) Evidence (PR #20 preview, Lighthouse 12.6.1, three runs per page): Performance 100, Best Practices 100, LCP 1.2 to 1.4 s, CLS 0, TBT 0 ms on `/` and `/cs/` (milestone 3 baseline: 99, LCP 1.7 to 1.8 s). Accessibility **96 in all six runs**, not 100: axe samples the hero heading line and subline mid cross-fade (contrast 1.4 to 2.0 at partial opacity), the effect accepted on 5 November 2026; here it happens every run rather than occasionally. **Decided 5 November 2026: keep accepting it** (the SPEC Accessibility 100 target is met by the e2e axe checks, not by Lighthouse's mid-fade sample). SEO 66 from the expected `noindex`.
- [ ] David signs off on the feel of each animation compared with the canvas. (Each PR) **Decided 5 November 2026: animations stay as built in PRs A and B; the sign-off moves to one comprehensive review before launch (milestone 6).** David checked the hero drum on Safari macOS and iOS and found it good.

## Wrap-up

- [x] Update MILESTONES.md: milestone 4 status `done`, completion evidence (PR links), status date, unplanned changes and items carried forward.
- [x] Update SPEC.md: motion status, resolved open questions.
- [x] Update [Motion](design/motion.md), [Shell components](design/shell-components.md) and the [design README](design/README.md) with decisions and any changes made during review (the canvas wins if they disagree).
- [x] If card hover moved to milestone 5, add it to the milestone 5 scope. (Done in PR B.)
- [x] `AGENTS.md` lists every new command.

## Risks and notes

- **Safari 3D text.** Large glyphs in `preserve-3d` can rasterise blurry on iOS. Check in PR A on a real phone; the fallback is a 2D flip.
- **LCP.** Cycling headline words must not become a late LCP element or delay the first paint of the H1. The motion class is set before paint and the first word is visible from the start of the loop.
- **Layout shift.** The static hero shows three lines and all sublines; the motion hero shows one line and one subline. Both layouts are decided before first paint, so there is no shift; a late class change would cause one.
- **Hidden-until-revealed content.** The approach develop animation must never leave text blurred or letters missing if the observer or script fails.
- **Pausing mid-turn** may look broken; section 0 has the fallback.
- **Tests and time.** Animation tests read animation state and wait for conditions, never fixed sleeps. Off-screen checks scroll and wait for `playState`.
- **Flash check tooling** may need a Windows machine (PEAT) or a local build (IRIS); budget time for it in PR C.
- The `/specimen/` page and its tests stay until milestone 6.
