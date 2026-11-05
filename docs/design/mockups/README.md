# Mockup sources

Copies of artboards from the [Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5) canvas, taken on 4 November 2026: the approved landing pages (canvas version `1793790030-28cb`, unchanged since) and the site shell proposal (canvas version `1793818431-5e1b`); the case study pages were added on 5 November 2026 (canvas version `1793892356-9fd5`). On 5 November 2026 (canvas version `1793902296-fc46`) the “Logo & favicon” page was added (mark, favicon set and site-wide social preview images), and the landing and case study boards gained the háček mark in the header and footer; those boards were re-exported. The site shell boards (`D-Shell`, `M-Menu-*`) are no longer on the canvas; their copies here stay as the record of the built shell. They are reference material for exact CSS values and keyframes, not code to ship.

| File | Board | Size |
| --- | --- | --- |
| [D-Home.dc.html](D-Home.dc.html) | Landing page · desktop · English | 1440 × 5444 |
| [M-Home.dc.html](M-Home.dc.html) | Landing page · mobile · English | 390 × 6047 |
| [D-Home-CS.dc.html](D-Home-CS.dc.html) | Úvodní stránka · desktop · Czech | 1440 × 5301 |
| [M-Home-CS.dc.html](M-Home-CS.dc.html) | Úvodní stránka · mobil · Czech | 390 × 6050 |
| [M-Menu-Closed.dc.html](M-Menu-Closed.dc.html) | Site shell · mobile · menu closed, pause control on the drum band (proposal) | 390 × 844 |
| [M-Menu-Open.dc.html](M-Menu-Open.dc.html) | Site shell · mobile · menu open · English (proposal) | 390 × 844 |
| [M-Menu-Open-CS.dc.html](M-Menu-Open-CS.dc.html) | Site shell · mobile · menu open · Czech (proposal) | 390 × 844 |
| [D-Shell.dc.html](D-Shell.dc.html) | Site shell · desktop · header with switcher, pause control, footer, component states (proposal) | 1440 × 1040 |
| [D-Case-Long.dc.html](D-Case-Long.dc.html) | Case study · long form (Kultomat) · desktop · English | 1440 × 6495 |
| [M-Case-Long.dc.html](M-Case-Long.dc.html) | Case study · long form · mobile · English | 390 × 6596 |
| [D-Case-Long-CS.dc.html](D-Case-Long-CS.dc.html) | Případová studie · dlouhá forma · desktop · Czech | 1440 × 6449 |
| [D-Case-Short.dc.html](D-Case-Short.dc.html) | Case study · short client format (Eucal) · desktop · English | 1440 × 3494 |
| [M-Case-Short.dc.html](M-Case-Short.dc.html) | Case study · short client format · mobile · English | 390 × 3867 |
| [M-Case-Short-CS.dc.html](M-Case-Short-CS.dc.html) | Případová studie · krátká forma · mobil · Czech | 390 × 3772 |
| [OG-Case.dc.html](OG-Case.dc.html) | Social preview image template · case study · 1200 × 630 | 1200 × 630 |
| [Logo-H2.dc.html](Logo-H2.dc.html) | Logo · H2 háček: mark, lockups, favicon at real size | 1280 × 760 |
| [Favicon-Set.dc.html](Favicon-Set.dc.html) | Favicon set: sizes, on dark, browser tabs, one-colour version, export list | 1280 × 880 |
| [OG-Site.dc.html](OG-Site.dc.html) | Social preview image · site-wide · English | 1200 × 630 |
| [OG-Site-CS.dc.html](OG-Site-CS.dc.html) | Náhledový obrázek · celý web · Czech | 1200 × 630 |
| [canvas.json](canvas.json) | Canvas index: all boards, pages and titles, including the explorations | — |

The landing boards already contain the chosen section variants (E3 experience, A5 approach motion, G4 portrait glitch). The explored alternatives stay on the canvas only; they are listed in the [design README](../README.md#explored-and-not-chosen).

## Format notes

- Files use the canvas's Design Component format: a `<x-dc>` root, a `<helmet>` block with fonts and styles, inline styles on elements, and a small script block. They need the canvas runtime (`support.js`) to render, so they will not display correctly when opened directly.
- Everything visual is inline `style` attributes plus the CSS in `<helmet>`. Translate it to CSS Modules and design tokens; do not copy inline styles into components.
- Fonts are loaded from Google Fonts in the mockups. The site self-hosts them instead (see [Visual system](../visual-system.md#typefaces)).

## Updating

When the canvas changes, re-export the changed boards here in the same PR that updates the design documents and the implementation, and record the new canvas version above.
