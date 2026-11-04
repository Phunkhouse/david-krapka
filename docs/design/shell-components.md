# Shell components: mobile menu, language switcher, pause control

**Status: first proposal, 4 November 2026.** Drawn without access to the canvas so milestone 2 can proceed, in the existing three-ink system. David asked for a first version to iterate on. The canvas still has no board for these; when one exists, it wins (see [design README](README.md)). Visual reference: [mockups/shell-components.html](mockups/shell-components.html) (opens directly in a browser).

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
- Each link has `lang` and `hreflang`, and an accessible name in its own language: “English”, “Česky”. No redirects and nothing stored ([0005](../decisions/0005-bilingual-routing.md), [LEG-005](../SPEC.md#legal-requirements)).
- Placement: desktop header, to the right of the navigation; mobile menu panel; both footers. On mobile the header shows only the wordmark and menu button, so the switcher is one tap deeper.

## Pause control

Required by [Motion](motion.md#pause-requirement) (WCAG 2.2.2). It pauses all looping decorative animation (hero drum, portrait glitch).
- A pill button: yellow fill, 3 px ink border, pink hard offset shadow (`4px 4px 0`, 60 %), Space Mono 700 uppercase. A 20 px ink circle holds the icon: two yellow bars (pause) or a yellow triangle (play).
- Labels: “Stop the press” / “Start the press”; Czech “Zastavit tisk” / “Spustit tisk”. The label states the action; use `aria-pressed` or swap the label, not both.
- Placement: on the hero drum band, bottom-left (16–20 px from the edges), 40 px high on desktop and 36 px on mobile. It sits early in the tab order, before the animation it controls. Yellow on the yellow band is separated by the ink border and the shadow; focus ring is ink.
- Default state: playing, except under `prefers-reduced-motion`, where it starts paused. State lives in page memory only: no cookie, `localStorage` or `sessionStorage`.
- Milestone 2 ships it static: rendered and labelled, no behaviour, because no motion exists yet. Decide in PR C whether to hide it until milestone 4.

## Header and footer additions

- Desktop header: wordmark left; Work · Approach · About · Contact, then the switcher, right.
- Footer links (mono 12 px uppercase, yellow on ink): the navigation, Privacy (links to `/privacy/` or `/cs/privacy/`) and the switcher. The optional business identification block sits above the © line (sizing in the [milestone 2 checklist](../milestone-2-checklist.md)).

## To iterate

- Whether the switcher should also appear in the mobile header, next to the menu button.
- Whether the menu panel should slide, and how (needs a motion decision).
- Whether the pause control should also exist on the portrait glitch, or one control for the whole page is enough.
- Tablet range (720–1100 px): this proposal switches to the desktop header at 720 px; check that all four links plus the switcher fit, otherwise raise the breakpoint for the header only.
