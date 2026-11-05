# Flash analysis: looping motion (milestone 4, PR C)

Date: 5 November 2026. Requirement: [WCAG 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) and [Motion](../../design/motion.md#global-rules) rule 7.

## Method and its limit

The check is `scripts/flash-check.mjs`, written for this project. It is **not** a certified analyser (PEAT, IRIS): it approximates the general flash test.

1. Open the built site (served by `wrangler dev`), scroll the element into view, hold every animation and step all of them through successive 1/60 s frames (14 s for the 7 s portrait loop, 18 s for the 9 s drum loop, so the loop seam is included).
2. Capture the element's region for each frame and compare consecutive frames pixel by pixel in WCAG relative luminance.
3. A pixel has changed when its luminance moves by 0.1 or more. A frame step counts as a change in one direction when the changed area reaches 341 × 256 px (the general flash area on the 1024 × 768 reference screen, technique G176). Opposing changes in a row are flashes; the worst 1 s window is reported, once at the full area threshold and once at a quarter of it as a safety margin.
4. Saturated red flashes (R / (R+G+B) ≥ 0.8) are not measured: the palette has none (pink `#FF48B0` is about 0.5).

Reproduce (serve the site first, for example `pnpm build && pnpm preview:cloudflare`):

```bash
node scripts/flash-check.mjs http://127.0.0.1:8788/ "#about .portrait" --width 1440
node scripts/flash-check.mjs http://127.0.0.1:8788/ "#about .portrait" --width 390
node scripts/flash-check.mjs http://127.0.0.1:8788/ "#top .drum" --width 1440 --seconds 18
```

## Results

| Element | Viewport | Largest changed area (brighter / darker) | Worst flashes per second at the area threshold (87,296 px) | at a quarter of it | Limit |
| --- | --- | --- | --- | --- | --- |
| Portrait glitch (G4) | 1440 px (400 px portrait) | 13,524 / 13,103 px | 0 | 0 | 3 |
| Portrait glitch (G4) | 390 px (240 px portrait) | 6,972 / 7,549 px | 0 | 0 | 3 |
| Hero drum | 1440 px | 86,882 / 81,001 px | 0 | 2 | 3 |

## Reading

- **Portrait:** the strips and inks jump sideways in short bursts, but the changed area never gets above about 15 % of the flash area threshold, so no change counts. The portrait passes with a wide margin and needs no softening.
- **Hero drum:** each 120° turn changes about the whole threshold area once (a yellow, dotted glyph turning into the next), over 0.6 s, with 2 to 3 s of calm between turns. It never alternates fast: 0 flashes at the area threshold and 2 per second at a quarter of it, under the limit of 3. Margin is smaller than for the portrait, so keep the drum's turn time (0.6 s) and the calm holds when tuning.
- **Why it matters:** the pause control (WCAG 2.2.2) is the main mechanism for the looping motion. This check covers 2.3.1.

## Limits of the method

- Animations are stepped with `currentTime`, so the check measures the CSS timeline, not real compositing or dropped frames on a device.
- Counting a flash as a pair of opposing changes (rounded up) is conservative.

## Open

- Re-run with a certified tool (PEAT or IRIS) as part of the pre-launch review, if David wants a result that does not rest on this approximation. Not run here: neither tool is installed.
- Re-run this script if the portrait or drum timings change, or when a real portrait photo replaces the silhouette.
