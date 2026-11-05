# Visual system

Taken from the [mockups](README.md). The values are implemented as CSS custom properties in [`src/styles/tokens.css`](../../src/styles/tokens.css) and the print motifs as classes in [`src/styles/print.css`](../../src/styles/print.css). The code is the reference for exact values; this document explains what they are for.

## Concept: a three-ink print run

The site looks like a risograph print: dark blue ink on off-white paper, with yellow paper stock and a little pink as the second ink. Decoration comes from printing artefacts: halftone dots, inks slightly out of register, and the dark blue rollers that frame yellow panels. The footer says it directly: *“Printed in three inks: blue, yellow and a little pink.”*

## Colours

| Token (proposed) | Value | Role |
| --- | --- | --- |
| `--ink` | `#1B2F7A` | Dark blue ink. All body text, borders, rollers, dark sections (Work, footer, Freelance card). |
| `--paper` | `#FAFAF7` | Page background and light cards. |
| `--yellow` | `#FFE800` | Yellow paper: hero drum, Make column, Experience and Contact backgrounds, primary accent, headline highlights (“Re”), text on blue. |
| `--pink` | `#FF48B0` | Second ink: misregistered letter copies, offset shadows, bullet squares, glitch. Decorative only. |
| `--tint` | `#E9ECF7` | Pale blue panels: “AI + me” strip, alternate card thumbnails, row hover. |
| `--ink-soft` | `#D6DCF2` | Secondary text on blue. |
| `--ink-line` | `#8C9BD6` | Dashed border of the “In progress” card on blue. |

Pink at 45–60 % opacity is used with `mix-blend-mode: multiply`, so it reads as overprinted ink.

### Contrast (WCAG 2.2)

| Pair | Ratio | Use |
| --- | --- | --- |
| Ink on paper | 11.6:1 | Body text |
| Ink on yellow | 9.7:1 | Text on yellow panels and buttons |
| Yellow on ink | 9.7:1 | Headings and buttons on blue |
| Paper on ink | 11.6:1 | Text on blue |
| Ink-soft on ink | 8.9:1 | Secondary text on blue |
| Ink on tint | 10.3:1 | Text on pale panels |
| Ink-line on ink | 4.5:1 | Dashed border (non-text, needs 3:1) |
| Pink on paper | 3.0:1 | **Never for text.** Decoration only. |
| Pink on ink | 3.9:1 | **Never for body text.** Large decorative glyphs only. |
| Yellow on paper | 1.2:1 | **Never** for text, icons or focus indicators. |

## Typefaces

| Role | Family | Weights | Use |
| --- | --- | --- | --- |
| Display | Rubik | 900 | All headings, project names, drum letters, halftone glyphs. Always uppercase with tight tracking (`-0.02em` to `-0.035em`). |
| Body | Sora | 400, 600, 700 | Paragraphs, buttons, navigation, card text. |
| Mono | Space Mono | 400, 700 | Eyebrow labels, counters (1/3), tags, placeholders, footer line. Uppercase with `0.08em` tracking when used as a label. |

All three must cover Czech (ř, ě, ů, č); the site files are subset to the characters the site uses ([0010](../decisions/0010-subset-fonts-to-site-characters.md)). Self-host them through the framework's font loader rather than linking Google Fonts at runtime, so no visitor data goes to Google and there is no layout shift from late font swaps.

## Type scale

| Element | Desktop (1440) | Mobile (390) |
| --- | --- | --- |
| Hero headline (H1) | 104 px / 116 px line | 56 px / 62 px line |
| Hero subline | 24 px, 600 | 17 px, 600 |
| Section heading (H2) | 88–96 px, line-height 0.95–1 | 48–52 px |
| Contact heading | 112 px | 52 px |
| About heading | 56 px | 36 px |
| Feature card title (Kultomat) | 64 px | 40 px |
| Experience card title | 56 px | 38 px |
| Approach column title | 48 px | 32 px |
| Small card title | 30 px | 24 px |
| Body large | 18–19 px, line-height 1.55–1.65 | 16–17 px |
| Body | 16–17 px, line-height 1.5–1.6 | 15–16 px |
| Mono label | 12–14 px, 700 | 11–13 px |

Implement headings with `clamp()` between the mobile and desktop values so the tablet range scales smoothly.

## Print motifs

These are reusable utilities. All decorative glyphs are `aria-hidden="true"`.

- **Halftone text.** Large letters filled with a dot screen: transparent text, `background-clip: text`, `radial-gradient(var(--ink) r, transparent r+0.3–0.8px)`. Three densities: large (6 px dots on an 18 px grid, hero drum and contact “?”), medium (3.4 px on 11 px, cards and the “+”), small (2.2 px on 8 px, approach columns).
- **Misregistered copy.** A solid pink copy of the same glyph, offset by roughly 10–18 px right and down, at 45–55 % opacity with `multiply`.
- **Yellow paper.** `--yellow` with a faint ink dot screen (2 px dots on a 12 px grid at 10 % ink).
- **Pink dot screen.** 2.2 px pink dots on a 9 px grid, used behind the portrait and in the Systerna card.
- **Rollers.** Solid ink bars on the left and right edges of yellow panels: 36 px on desktop sections, 18 px on the approach grid, 22 px on mobile.
- **Offset shadow.** Hard shadow with no blur: `6px 5px 0` pink at 55–60 % on section headings; `8–12px` pink or ink on cards.
- **Highlight.** Yellow background behind a word fragment (“Re”think, “Serious”), with 6–8 px horizontal padding.

## Borders, shapes and shadows

- Borders are always `3px solid var(--ink)`. The only dashed border is the “In progress” card.
- Cards and panels have square corners. Only buttons (pill, `border-radius: 999px`), the menu button, the drum counter and the portrait are round.
- Primary button: ink background, yellow text. Secondary button: yellow background, 3 px ink border.
- Hard offset shadows are the only depth effect. No blur shadows, gradients (except the drum's shading) or rounded cards.

## Spacing and layout

- Desktop page width in the mockups: 1440 px with 56 px side padding (96 px in Contact). Sections use 96–112 px vertical padding.
- Mobile: 390 px with 20 px side padding (34 px inside sections that have rollers). Sections use 56–72 px vertical padding.
- Content blocks are laid out with grid and `gap`; common gaps are 14, 18, 24, 28, 48 and 56 px.
- Proposed maximum content width: 1440 px, centred, with paper background beyond it. Rollers and full-bleed sections continue to the viewport edges.

### Breakpoints (proposal)

The mockups define the two ends; the middle needs design review (see [open questions](README.md#not-designed-yet)).

| Range | Layout |
| --- | --- |
| < 720 px | Mobile mockup: stacked hero with drum band, list-style project cards, stacked columns. |
| 720–1099 px | Hero stays stacked; work cards in a 2-column grid; approach columns stay stacked or become a 3-column grid at ≥ 960 px. |
| ≥ 1100 px | Desktop mockup. |

Nothing may scroll horizontally at 320 px.

## Mark and icons

From the canvas page “Logo & favicon” (boards `Logo-H2`, `Favicon-Set`, `OG-Site`, `OG-Site-CS`), 5 November 2026.

- **Mark (H2 háček):** the caron of the Ř in “Křapka”. A 100 × 100 drawing: yellow paper `#FFE800` with 22 corner radius, the háček as a polyline `M22 38 L50 66 L78 38` stroked 20 wide in ink, and the same line in pink 5 units right and down behind it (the misregistered pass). The large version on the `Logo-H2` board uses a halftone ink stroke and an 80 % pink pass; small sizes use solid ink. The same icon works on paper and on ink, so there is no dark-mode variant. One-colour version: the ink háček alone, stroke 22.
- **Header:** the mark (40 px, 48 px from 720 px) left of the name and role, 12 px gap. The mark is decorative (`aria-hidden`); the link keeps its text name. Built as `src/components/Mark.astro`.
- **Footer:** a 24 px mark before the colophon, 10 px gap.
- **Favicons** (`public/`, built by `scripts/brand-assets.mjs`): `favicon.svg`, `favicon.ico` (16, 32 and 48 px inside), `apple-touch-icon.png` (180 px, square because iOS rounds it), `icon-192.png` and `icon-512.png` for `site.webmanifest`, `theme-color` `#1B2F7A`. The board's `safari-pinned-tab.svg` is not built: current Safari uses the regular favicon and ignores `mask-icon`.
- **Site-wide social preview image** (`public/og/site-en.png`, `site-cs.png`, 1200 × 630): 6 px ink frame; left 520 px yellow paper with the large halftone háček and pink pass; right the role in Space Mono 16 px caps, “David Křapka” in Rubik 112 px on two lines with the pink shadow, “Think. Make. Rethink.” in Sora 30 px bold with “Re” on yellow (the claim stays English in Czech), and `david-krapka.eu`. Used by the landing and privacy pages, and by case studies until their own `OG-Case` image exists. The case study template (`OG-Case`) now has the 44 px mark before its label.

## Focus

The mockups define a yellow outline only for project cards on blue. Agreed rule (David, 4 November 2026): a 3 px ink outline with 3 px offset on light backgrounds, and a 3 px yellow outline on ink backgrounds. Never use yellow on paper. Focus must be visible on every link, button and card.

## Imagery

- Project thumbnails are placeholders (halftone initial + geometric shape). Real screenshots replace or join them once approved for publication.
- The portrait is David's photo as a duotone: ink on the yellow paper, with a pink halftone copy out of register (decided 5 November 2026, [Landing page](landing-page.md)). The glitch slices both inks.
- No stock photos, emoji or icon fonts. Arrows (→, ↑) are text characters.
