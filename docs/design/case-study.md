# Case study pages

Design for `/work/<slug>/` and `/cs/work/<slug>/`, from the canvas page “Case study pages” (version `1793892356-9fd5`, 5 November 2026). Boards: [mockups/](mockups/README.md) `D-Case-Long`, `M-Case-Long`, `D-Case-Long-CS` (Kultomat long form), `D-Case-Short`, `M-Case-Short`, `M-Case-Short-CS` (Eucal short format) and `OG-Case` (social preview image). All facts on the boards are `[…]` placeholders.

**Principle:** the landing page shows personality; case studies show how I think. The pages are calm and editorial on paper, in the same three inks, with no looping motion (so no pause control).

## Structure (top to bottom)

1. **Site header**, as on every page (the language switcher goes to the same case study).
2. **Page header**, between two 3 px ink rules.
   - Text: “← Selected work” (link to the landing work section), mono project label (the landing card's label), H1 (Rubik 900, uppercase, `letter-spacing: -0.035em`, pink offset shadow `6px 5px 0` at 55 %), summary (Sora 600, 24 px desktop / 18 px mobile) with the yellow placeholder highlight while it is a placeholder.
   - Art: the project's landing card art as the print motif (Kultomat: huge halftone K with the pink misregistered copy on yellow paper; client projects: their card art on tint or paper, without the pink copy). Desktop: art column 600 px (long) or 520 px (short) to the right, 520 / 440 px tall, behind a 3 px rule. Mobile: art band 240 px tall above the text.
3. **Body.** Desktop: two columns, `340px` facts column and a reading column of at most `720px`, 96 px apart. Mobile: one column with 20 px side padding.
   - **Project facts panel:** paper, 3 px ink border, pink offset shadow (8 px desktop, 6 px mobile), heading “Project facts” in mono. Rows: Status, When, My role, Worked with, AI and review, Built with (long form only), Live site (link with ↗). Labels mono 12 px uppercase, values Sora 16 px, rows split by 1 px dashed `--ink-line`.
   - **On this page** (long form, desktop only): numbered list of the section links below the facts panel.
   - **Sections:** numbered with a yellow mono chip (`01`…), H2 Rubik 900 uppercase (44 px desktop / 30 px mobile), paragraphs Sora 19 / 17 px at 1.65 line height. 72 px between sections (48 px mobile). The last section's heading highlights “re” of *rethink* (Czech: “pře” of *přehodnotil*) in yellow, like the hero claim.
4. **Wide figure** (long form): after “The build”, the full content width on yellow paper between 3 px rules, the screenshot in a 3 px ink frame with a pink offset shadow (12 px / 6 px), caption below in mono.
5. **Next project:** ink section, “Next project” H2 in yellow with the pink shadow, “← All work” link, and a large card (card art left 420 px, label, name, text, “Read the case study →”) with a 12 px pink shadow and the landing card lift.
6. **Footer**, as on every page.

## Content blocks

| Block | Look | Use |
| --- | --- | --- |
| Decision | 3 px ink frame; ink header with yellow mono “Decision N” and the decision's name; rows Chose / Instead of / Because / Checked by (Czech: Zvolil jsem / Místo / Protože / Ověřil jsem), label column 150 px on desktop, stacked on mobile | Key decisions (two or three in the long form, one in the short) |
| Figure | Screenshot at reading width in a 3 px ink frame, caption “Fig. N · …” in mono 13 px | Screens that support the text |
| AI + me | Tint panel, 3 px ink border, title “AI + me”, three columns (stacked on mobile): I specified and decided · AI helped with · How I reviewed and tested it | AI and collaboration |
| Outcome | Rows between 3 px ink rules: metric in Rubik 40 / 32 px, one sentence, “Source: …” in mono 12 px; a plain row for a qualitative outcome | Outcomes and validation |

## Long and short format

- **Long (Kultomat):** the eight sections of the [shared structure](../content-and-case-studies.md#proposed-shared-case-study-structure): Summary, What I owned, Problem and constraints, Key decisions, The build, AI and collaboration, Outcomes and validation, What I would rethink.
- **Short (client projects):** five sections: Summary, What I owned, One decision (with one figure), Outcome, What I would rethink. No “On this page” list and no “Built with” row; the AI share stays in the facts panel.

## Breakpoints

- Below 720 px: mobile boards.
- 720 to 1099 px (no board; proposal): page header keeps text and art side by side with the art at 40 %; body is one column with the facts panel above the sections, no “On this page” list.
- From 1100 px: desktop boards.

## Social preview image

`OG-Case`: 1200 × 630, 6 px ink frame, the card art left (520 px), mono “Case study · David Křapka”, the project name in Rubik 112 px with the pink shadow, the summary, and `david-krapka.eu`. One PNG per case study and language, exported from the canvas once the summary is final (milestone 5 decision 9).

## Copy (labels)

| Element | English | Czech |
| --- | --- | --- |
| Back link | ← Selected work | ← Vybraná práce |
| Facts heading | Project facts | Fakta o projektu |
| Facts rows | Status · When · My role · Worked with · AI and review · Built with · Live site | Stav · Kdy · Moje role · Spolupracovníci · AI a kontrola · Použité technologie · Živý web |
| Contents | On this page | Na této stránce |
| Figure caption | Fig. N · … | Obr. N · … |
| Next project | Next project · ← All work · Read the case study → | Další projekt · ← Všechna práce · Přečíst případovou studii → |
| Outcome source | Source: … | Zdroj: … |
