# Design source of truth

The approved design lives in the **[Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5)** canvas. This directory records what that canvas decides, so implementation does not depend on reading the canvas. If this directory and the canvas disagree, the canvas wins; update these documents in the same PR that implements the change.

Snapshot taken on 4 November 2026 from canvas version `1793790030-28cb`. Source copies of the four landing-page artboards are in [mockups/](mockups/README.md).

## Documents

| Document | Contents |
| --- | --- |
| [Visual system](visual-system.md) | Colours, typefaces, type scale, print motifs (halftone, misregistration, rollers), borders, shadows, spacing and breakpoints. |
| [Landing page](landing-page.md) | Section-by-section layout for desktop and mobile, with English and Czech copy and every placeholder that still needs content. |
| [Motion](motion.md) | Hero print drum, approach section, portrait glitch and hover behaviour, with timings, reduced-motion rules and the pause requirement. |
| [Shell components](shell-components.md) | First proposal for the mobile menu, language switcher and pause control (not yet on the canvas), with a [visual mockup](mockups/shell-components.html). |
| [Mockup sources](mockups/README.md) | Snapshot of the canvas index and the four landing-page artboards. |

## Product and interaction principles

- **The homepage shows personality; case studies show how I think.** The landing page is the experimental surface. Case study pages, which are not designed yet, should be calm and editorial (see [the brief](../portfolio-brief.md)).
- **Printed in three inks.** The whole identity is a risograph-like print run: dark blue ink, yellow paper and a little pink. Motion is mechanical (drums turning, inks slipping, halftone developing), never floaty.
- **Think. Make. Rethink.** is the confirmed hero claim and the structure of the approach section. It stays in English in the Czech version.
- **Content works without motion.** Every animation is decorative and `aria-hidden`; the same information is available as static text. Reduced-motion preferences turn animations off.
- **One page, clear exits.** The landing page is a single scroll with anchor navigation. Every section leads to work, the CV or contact.
- **Honest placeholders.** Square-bracketed text in the mockups (`[Role]`, `[20XX – 20XX]`) is missing content, not copy. It must be replaced with verified facts or removed before launch.

## What the canvas decides

| Area | Decision | Canvas board |
| --- | --- | --- |
| Hero | Print drum: a yellow drum turns T → M → R on a 9 s loop, with the headline cycling *Think. / Make. / Rethink.* | Landing page (desktop, mobile) |
| Palette and type | Three inks (blue `#1B2F7A`, yellow `#FFE800`, pink `#FF48B0`) on paper `#FAFAF7`; Rubik Black, Sora, Space Mono | All boards |
| Navigation | Desktop: Work · Approach · About · Contact. Mobile: round menu button | Landing page |
| Selected work | Kultomat as a large feature card; Eucal, Vladan Vaněk, UpVideo as three cards; Systerna as a dashed “In progress” card | Landing page |
| Approach | Three columns Think / Make / Rethink; **A5** motion: halftone develops on scroll, columns react on hover | Approach section · motion (A5 approved) |
| AI disclosure | “AI + me” strip below the approach columns | Landing page |
| Experience | **E3** “Big team. Small team.”: Emplifi card + Freelance card joined by a halftone plus sign | Experience section (E3 chosen) |
| About | Round portrait with **G4** print glitch (ink slip + roller jam, 7 s loop); “Playful by design. Serious about the work.” | About · portrait glitch (G4 chosen) |
| Contact | Two doors: “Hiring?” and “Have a project?”, plus email · LinkedIn · GitHub | Landing page |
| Languages | English and Czech versions of the full landing page | Landing page · CZ |

### Explored and not chosen

Kept on the canvas for reference; do not implement.

- **Experience:** E1 two columns “In a team. On my own.”; E2 two-track timeline; E4 short CV list.
- **Approach motion:** A1 print pass (columns wipe in); A2 yellow ink follows the hero drum; A3 halftone develops (merged into A5); A4 hover only (merged into A5).
- **Portrait glitch:** G1 ink slip only; G2 roller jam only; G3 dot scramble.

## Not designed yet

These are needed before the related milestone can finish (see [milestones](../MILESTONES.md)):

1. **Case study page** template (desktop and mobile), including the Kultomat long form and the shorter client format.
2. **Mobile menu**, **language switcher** and **motion pause control**: first proposal in [Shell components](shell-components.md), not yet on the canvas; to iterate.
5. **Tablet range** (roughly 720–1100 px). The mockups cover 390 px and 1440 px only.
6. **404 page**, CV download treatment, and any legal or privacy page the legal planning requires.
7. **Social preview image** (Open Graph) and favicon / monogram.
8. **Real portrait photo** treatment. The glitch currently masks a silhouette placeholder.

## Open design questions

| Question | Why it matters |
| --- | --- |
| What should the reduced-motion hero show? Today only “Think.” and its subline remain visible, because the other two words are hidden. | The static version should still say all three words. Proposal: show “Think. Make. Rethink.” on three lines, or one line at a smaller size, and freeze the drum on T. |
| Should the mobile hero include the intro sentence (“I'm David Křapka, a product-minded engineer…”)? Desktop has it; mobile drops it. | Without it, mobile visitors and search engines see no plain description of the role above the fold. |
| Should Experience get a nav item? | The section exists but is reachable only by scrolling. |
| How are project thumbnails replaced by real screenshots? | Cards currently show halftone letters with a “[Screenshot … goes here]” label. Decide whether screenshots replace the letter art or sit inside it. |
