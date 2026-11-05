# Motion

All motion is decorative, mechanical and print-themed. Exact keyframes are in the [mockup sources](mockups/README.md); this page records intent, timing and the rules the implementation must add.

## Global rules

1. **Decorative only.** Animated elements are `aria-hidden`. Their meaning is always available as static text.
2. **Reduced motion.** Under `prefers-reduced-motion: reduce`, every animation and transition below is switched off and the static state is shown.
3. <a id="pause-requirement"></a>**Pause control (required, not in the mockups).** The hero drum (9 s) and the portrait glitch (7 s) loop forever next to readable content. WCAG 2.2.2 requires a way to pause motion that starts automatically, lasts more than five seconds and runs alongside other content. Add a visible, keyboard-reachable “Stop the press / Spustit tisk” style toggle (wording to design), keep the choice in page memory only (no `localStorage`, `sessionStorage` or cookie, so the site needs no consent banner; see [SPEC legal requirements](../SPEC.md#legal-requirements), LEG-005), and default to paused under reduced motion.
4. **Off-screen pause.** Pause looping animations when their section is not visible (IntersectionObserver), to save battery and CPU.
5. **Hover is optional.** Hover effects run only under `@media (hover: hover)`. Touch users get the same content without them.
6. **Cheap properties.** Animate `transform`, `opacity`, `clip-path`, `background-color` and one registered custom property (`--r`). No layout-affecting properties.
7. **Flashing.** The portrait glitch jumps in short bursts. Check it against WCAG 2.3.1 (no more than three flashes per second) with a flash-analysis tool before launch, and soften it if it fails.

## Implementation decisions (milestone 4)

Decided 5 November 2026 (as recommended in the [milestone 4 checklist](../milestone-4-checklist.md#0-before-starting-david)).

- **Motion needs JavaScript.** A small inline script in `<head>` adds `motion` to `<html>` before first paint when `prefers-reduced-motion: no-preference` matches. Every animation and the motion layout of the hero hang off `html.motion`. Without JavaScript, or under reduced motion, the page is the static milestone 3 page. Reason: without JavaScript the pause control cannot work, and a loop without a pause fails WCAG 2.2.2.
- **One pause control** on the hero drum band stops every looping animation on the page (the portrait in milestone 4 PR C included). It is hidden until JavaScript runs.
- **“Stop the press” freezes in place** (`animation-play-state: paused` on everything inside `[data-loop]`) and resumes from the same frame.
- **Off-screen pause is separate from the visitor's choice.** A `[data-loop]` section gets `offscreen` while outside the viewport; a press the visitor stopped stays stopped when they scroll back.
- **Reduced motion:** the control is shown as “Start the press”. Pressing it adds `motion` for this page view only (state in page memory, LEG-005), so the hero changes from the static list to the cycling layout on the visitor's own action.
- **Text stays real.** The cycling words and sublines are the same elements as the static list, stacked and cross-faded, so the H1 and sublines are always whole text for assistive technology. Only the drum art is `aria-hidden`; the control sits beside it, outside the hidden part, first in the DOM so it comes before the hero text in tab order.
- **Card hover moves to milestone 5**, when the cards become links. **Smooth anchor scrolling** is on, off under reduced motion. **The mobile menu does not slide.**

## Hero print drum (9 s loop)

The drum is a 3D prism with three faces, T, M and R, rotated around the X axis (`perspective` 1300 px desktop, 620 px mobile; faces at `translateZ(180px)` desktop, `88px` mobile).

| Time (of 9 s) | Drum | Headline | Counter |
| --- | --- | --- | --- |
| 0–26 % | Holds on **T** | “Think.” + subline 1 | 1/3 |
| 26–33 % | Turns 120° | Words cross-fade, 36 px vertical slide | Slides up one step |
| 33–59 % | Holds on **M** | “Make.” + subline 2 | 2/3 |
| 59–66 % | Turns 120° | Cross-fade | Slides |
| 66–92 % | Holds on **R** | “**Re**think.” + subline 3 | 3/3 |
| 92–100 % | Turns back to T | Cross-fade | Slides to the repeated 1/3 |

- Easing for the drum and counter: `cubic-bezier(.7, 0, .3, 1)` (mechanical stop-start). Words: `ease-in-out`.
- **Kick:** on each turn the letter jolts 10 px right and back, like paper catching on a roller.
- Shading: a vertical gradient darkens the top and bottom of the drum to suggest curvature.
- **Reduced motion:** the drum stays on T and the counter on 1/3; the H1 and all three sublines are visible as static text (decided 4 November 2026, [Landing page](landing-page.md#implementation-decisions-milestone-3)).

## Approach section: A5 “develops on scroll + reacts on hover”

**On first scroll into view (plays once):**

- The small-dot halftone letters develop: dot radius `--r` grows from 0 to 2.2 px over 1.6 s, `ease-out`. Requires `@property --r` (supported in all current evergreen browsers; without support the letters simply appear).
- The pink “M” slides into register from `translate(18px, -14px)` and fades to 20 % opacity over 1.4 s.
- Column text fades in from 6 px blur over 0.9 s.
- Stagger per column: 0.2 s, 0.45 s, 0.7 s.

The mockup's landing page plays these on load; on the live site they start when the section enters the viewport (IntersectionObserver, once).

**On hover (hover-capable devices only):**

- The hovered column turns yellow; the others return to paper.
- Its big letter rises 36 px and rotates −4°; the pink copy moves `14px, -26px`.
- Its title shifts 8 px right; the “Re” highlight inverts to ink with yellow text.
- Durations 0.35–0.45 s, `cubic-bezier(.2, .8, .2, 1)` for the letter.

**Letters faded (5 November 2026, David's review of PR B):** the big halftone letters and the pink M rest at 20 % opacity instead of full ink and 45 % pink, so the column text stays readable over them, also when a letter lifts into the copy on hover. One variable (`--letter-fade` in `Approach.astro`); the canvas still shows the stronger letters, so the canvas needs the same change.

**Implementation (milestone 4, PR B).** Under `html.motion` a small script arms `#approach` (`data-develop="armed"`: letters at `--r: 0`, pink M offset and transparent, column text blurred) and sets `data-develop="play"` once, when the columns first reach 10 % visibility. If the script or `IntersectionObserver` is missing, nothing is armed and the static, developed state shows. `--r` is a registered property (`@property`, `global.css`); without support the letters appear. These one-time animations are not looped, so the pause control leaves them alone. Hover applies on `(hover: hover)`; the lift and tilt only without a reduced-motion preference, while the colour change stays. Anchor links scroll smoothly only under `prefers-reduced-motion: no-preference`.

Keyboard users should get the same highlight with `:focus-within` if a column ever contains a link. Today the columns contain no interactive elements, so no focus state is needed.

## About portrait: G4 “ink slip + roller jam” (7 s loop)

The portrait is two halftone layers (ink and pink, 9 px dot grid) masked to a head-and-shoulders shape, sliced into six horizontal strips.

- **Calm:** roughly 0–57 % of the loop; the pink layer sits 8 px right, 6 px down (normal misregistration).
- **First burst (~58–65 %):** a 14 px pink scan bar sweeps down; the six strips jump sideways by 6–30 px in quick `steps(1)` frames, slightly staggered; both ink layers jump out of register and snap back.
- **Second, smaller burst (~84–90 %):** strips and inks twitch once more.
- A pink dot circle behind the portrait drifts slowly on its own 4 s loop (`6px, -4px`).
- **Reduced motion:** everything holds in the calm state, and the scan bar is hidden.
- **Implementation (milestone 4, PR C).** `About.astro` keeps the SVG as the static state and swaps it for the glitch layers under `html.motion`: six strips (`clip-path`), each with a pink and a blue halftone layer masked to the silhouette, plus the scan bar (moved with `transform`, not `top`). Keyframes are the mockup's, with every pixel value multiplied by `--u` (portrait size / 400 px), so jumps and dots keep their proportions at 240, 320 and 400 px. `#about` is `data-loop`, so the one pause control and the off-screen pause cover it. Flash analysis: [report](../audits/2026-11-05/flash-analysis.md). **A real photo** replaces the silhouette mask with its own two-colour halftone layers (ink and pink, same 9 px grid) used as the `.ink` backgrounds; the strips, offsets and keyframes stay.
- The silhouette is a placeholder. With a real photo, prepare two-colour halftone layers (or apply the dot screen with CSS masks) so the effect still works.

## Small interactions

- **Project cards:** on hover, move `translate(-4px, -4px)` over 0.2 s so the offset shadow appears to grow. Same on `:focus-visible`, plus the focus ring.
- **Links:** underline thickens to 3 px on hover.
- **Experience rows (E1/E2 only):** not used in the chosen E3.

## Performance targets for motion

- No animation library is needed; CSS keyframes plus a small IntersectionObserver helper cover everything.
- No long tasks during scroll; the landing page should stay at 60 fps on a mid-range phone. Verify with the browser's performance panel on a real device.
- Large 3D text (680 px glyphs) should be checked on Safari iOS for blurry rasterisation; fall back to a 2D flip if it looks poor.
