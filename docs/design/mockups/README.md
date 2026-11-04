# Mockup sources

Copies of the approved landing-page artboards from the [Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5) canvas, taken on 4 November 2026 (canvas version `1793790030-28cb`). They are reference material for exact CSS values and keyframes, not code to ship.

| File | Board | Size |
| --- | --- | --- |
| [D-Home.dc.html](D-Home.dc.html) | Landing page · desktop · English | 1440 × 5444 |
| [M-Home.dc.html](M-Home.dc.html) | Landing page · mobile · English | 390 × 6047 |
| [D-Home-CS.dc.html](D-Home-CS.dc.html) | Úvodní stránka · desktop · Czech | 1440 × 5301 |
| [M-Home-CS.dc.html](M-Home-CS.dc.html) | Úvodní stránka · mobil · Czech | 390 × 6050 |
| [shell-components.html](shell-components.html) | Not from the canvas: first proposal for the mobile menu, language switcher and pause control. Renders directly in a browser. | — |
| [canvas.json](canvas.json) | Canvas index: all boards, pages and titles, including the explorations | — |

The landing boards already contain the chosen section variants (E3 experience, A5 approach motion, G4 portrait glitch). The explored alternatives stay on the canvas only; they are listed in the [design README](../README.md#explored-and-not-chosen).

## Format notes

- Files use the canvas's Design Component format: a `<x-dc>` root, a `<helmet>` block with fonts and styles, inline styles on elements, and a small script block. They need the canvas runtime (`support.js`) to render, so they will not display correctly when opened directly.
- Everything visual is inline `style` attributes plus the CSS in `<helmet>`. Translate it to CSS Modules and design tokens; do not copy inline styles into components.
- Fonts are loaded from Google Fonts in the mockups. The site self-hosts them instead (see [Visual system](../visual-system.md#typefaces)).

## Updating

When the canvas changes, re-export the changed boards here in the same PR that updates the design documents and the implementation, and record the new canvas version above.
