# Shell components: mobile menu, language switcher, pause control

**Status: first proposal, 4 November 2026, to iterate.** Drawn in the existing three-ink system at David's request so milestone 2 can proceed. The boards are on the canvas page **Site shell · menu, switcher, pause** (canvas version `1793818431-5e1b`); as everywhere, the canvas wins if it and this document disagree (see [design README](README.md)). Source copies: [M-Menu-Closed](mockups/M-Menu-Closed.dc.html), [M-Menu-Open](mockups/M-Menu-Open.dc.html), [M-Menu-Open-CS](mockups/M-Menu-Open-CS.dc.html), [D-Shell](mockups/D-Shell.dc.html). The business identification line in D-Shell uses square-bracket placeholders: the real block renders only when filled.

All values use the tokens in [Visual system](visual-system.md). Focus follows the [agreed rule](visual-system.md#focus): ink outline on light backgrounds, yellow outline on ink.

## Mobile menu (below 720 px)

**Button.** The existing 48 px round button in the header (paper fill, 3 px ink border, two 18 × 3 px bars). While open it turns yellow and the bars cross into an ×. `aria-label` “Open menu” / “Close menu” (Czech: “Otevřít menu” / “Zavřít menu”), `aria-expanded`, `aria-controls` pointing at the panel.

**Panel.** Opens directly under the header, filling the rest of the viewport (the header stays visible so the button can close it).
- Ink background with 14 px yellow rollers on both edges.
- Four links, one per row, in nav order: Work · Approach · About · Contact (Czech: Práce · Přístup · O mně · Kontakt). Each row has a mono counter (`01`–`04`, `--ink-soft`) and the label in Rubik 900 uppercase, `clamp(36px, 11vw, 44px)`, yellow with the pink hard offset shadow (`5px 4px 0`, 60 %). Rows are divided by dashed `--ink-line` borders. “Přístup” is the longest label and fits at 390 px.
- Bottom group: a secondary “Start a project →” button (yellow, pill; Czech “Začít projekt →”, invitation to talk only, see [LEG-001](../SPEC.md#legal-requirements)), a small “Language” label with the switcher, and the footer tagline in mono.
- Focused link: 3 px yellow outline drawn inside the row.

**Behaviour.** Opens and closes without animation at first (a short slide can be added with the motion work, and must respect reduced motion). Escape closes and returns focus to the button. Choosing an anchor link closes the panel. The page behind does not scroll while the panel is open. Without JavaScript the button is a link to the footer navigation.

## Language switcher

A two-item segmented pill, `EN | CS`, in Space Mono 700, 12 px, uppercase, `0.08em` tracking.
- Current language: ink fill, yellow text, `aria-current="page"`. The other: paper fill, ink text, a real link to the same page in the other language.
- 3 px ink border, pill shape, 34 px high (header and footer); 48 px high with 64 px wide items in the mobile menu, so touch targets are large enough.
- On ink (footer, mobile menu): yellow border and text, current item yellow fill with ink text.
- A `role="group"` labelled “Language” / “Jazyk” (not a `<nav>`: it appears up to three times per page, and repeated landmarks with one name fail axe). Each link has `lang` and `hreflang`; its accessible name keeps the visible code and adds the language in its own language: “EN English”, “CS Česky”. No redirects and nothing stored ([0005](../decisions/0005-bilingual-routing.md), [LEG-005](../SPEC.md#legal-requirements)).
- Placement: desktop header, to the right of the navigation; mobile menu panel; both footers. On mobile the header shows only the wordmark and menu button, so the switcher is one tap deeper.

## Pause control

Required by [Motion](motion.md#pause-requirement) (WCAG 2.2.2). It pauses all looping decorative animation (hero drum, portrait glitch).
- A pill button: yellow fill, 3 px ink border, pink hard offset shadow (`4px 4px 0`, 60 %), Space Mono 700 uppercase. A 20 px ink circle holds the icon: two yellow bars (pause) or a yellow triangle (play).
- Labels: “Stop the press” / “Start the press”; Czech “Zastavit tisk” / “Spustit tisk”. The label states the action; use `aria-pressed` or swap the label, not both.
- Placement: on the hero drum band, bottom-left (16–20 px from the edges), 40 px high on desktop and 36 px on mobile. It sits early in the tab order, before the animation it controls. Yellow on the yellow band is separated by the ink border and the shadow; focus ring is ink.
- Default state: playing, except under `prefers-reduced-motion`, where it starts paused. State lives in page memory only: no cookie, `localStorage` or `sessionStorage`.
- Milestone 2 builds it as a static component (`src/components/PauseControl.astro`) shown only on the specimen page. It is not placed on real pages until the looping motion exists (milestone 4), so it never offers a control that does nothing.

## Header and footer additions

- Desktop header: wordmark left; Work · Approach · About · Contact, then the switcher, right.
- Footer links (mono 12 px uppercase, yellow on ink): the navigation, Privacy (links to `/privacy/` or `/cs/privacy/`) and the switcher. The optional business identification block sits above the © line (sizing in the [milestone 2 checklist](../milestone-2-checklist.md)).

## To iterate

- Whether the switcher should also appear in the mobile header, next to the menu button.
- Whether the menu panel should slide, and how (needs a motion decision).
- Whether the pause control should also exist on the portrait glitch, or one control for the whole page is enough.
- Tablet range (720–1100 px): this proposal switches to the desktop header at 720 px; check that all four links plus the switcher fit, otherwise raise the breakpoint for the header only.
