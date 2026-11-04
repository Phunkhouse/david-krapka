# 0004. Personal Portfolio mockups canvas is the design source of truth

Date: 2026-11-04  
Status: accepted

## Context

The brief left the hero concept, palette, typefaces and motion level open, and proposed an orange “Electric Editorial” palette among others. Since then, David developed the [Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5) canvas and named it the design source of truth.

## Decision

- The canvas decides the design. Its chosen boards are recorded in [docs/design/](../design/README.md) with source snapshots in `docs/design/mockups/`.
- This settles: the **print-drum hero** with *Think. Make. Rethink.*; the **three-ink palette** (blue `#1B2F7A`, yellow `#FFE800`, pink `#FF48B0` on `#FAFAF7`); **Rubik, Sora and Space Mono**; Experience variant **E3**; approach motion **A5**; portrait glitch **G4**; and English plus Czech landing pages.
- Earlier palette and typeface candidates in the brief (Electric Editorial, Acid Modernism, Space Grotesk, Syne, Inter, IBM Plex Mono) are superseded.

## Alternatives considered

- The variants explored on the canvas (E1, E2, E4; A1–A4; G1–G3) and the separate hero explorations. They remain on the canvas for reference.

## Consequences

- Design changes happen on the canvas first, then in `docs/design/` and code in the same PR.
- Screens the canvas lacks (case study page, mobile menu, language switcher, pause control, tablet range) must be designed there before they are built.
