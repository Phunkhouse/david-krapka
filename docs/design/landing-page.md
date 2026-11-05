# Landing page

The only page fully designed so far. Order of sections, layout at desktop (1440 px) and mobile (390 px), and copy in both languages. Visual tokens are in [Visual system](visual-system.md); animations are in [Motion](motion.md).

Copy below is the mockup copy. Square brackets mark **missing content** that must be confirmed or removed before launch (see [content and case studies](../content-and-case-studies.md)). Mobile sometimes uses a shorter variant; it is noted where it differs.

Anchors: `#top`, `#work`, `#approach`, `#experience`, `#about`, `#contact`.

## Implementation decisions (milestone 3)

Agreed 4 and 5 November 2026, while building the static page (milestone 3 is done; the built page follows the canvas except where listed here):

- **Static hero (reduced-motion look):** the H1 shows “Think. Make. Rethink.” as visible text on three lines (“Re” highlighted), all three sublines show as a list, and the drum is frozen on T with the counter at 1/3. Milestone 4 adds the turning drum and cycling words on top.
- **Mobile intro sentence:** not shown, as in the mockup. Desktop and tablet show it.
- **Header:** not sticky. It is the shared site header above the hero, so the drum panel starts below it instead of running behind it as in the mockup, and the desktop hero fills about one screen together with the header.
- **Cards and links (milestone 5):** a card links only to a published case study; the project name is the link, stretched over the whole card, and a “Read the case study →” line follows the text. Cards without a published page, and Systerna, stay plain. Hover and keyboard focus lift a linked card 4 px up and left over 0.2 s, its hard shadow growing 4 px (client cards, which have none, gain a 4 px pink one); no transition under reduced motion. Contact links, LinkedIn, GitHub and the CV stay placeholders until milestone 6.
- **Fluid desktop hero:** the drum column is 720 px at 1440 px and wider, and narrows (50 vw, at least 400 px) down to 1100 px so the headline fits.
- **Approach and Experience:** the three approach columns sit side by side from 1100 px and stack below it (the tablet proposal's optional 960 px grid was not needed). On mobile and tablet the Experience cards stack with the halftone “+” between them and the CV line below; from 1100 px the CV line moves inside the Emplifi card. Static state only: letters are fully developed and columns at rest.
- **About and Contact:** the portrait is David's photo (5 November 2026), treatment **C, duotone**: the photo printed in ink on the yellow paper (ink where it is dark, paper where it is light) with a pink halftone copy on the 9 px grid slipped 8 × 6 px out of register. Chosen over the two-ink halftone of the mockup (A, and a finer 6 px B) because a face that light on a light wall breaks up into a few dots, and over a plain black and white photo (D) because it leaves the print look. Built by `scripts/portrait.mjs`; the portrait is an image named “Portrait of David Křapka” / “Portrét Davida Křapky”. Below 1100 px the portrait sits above the text (320 px from 720 px, 240 px below). Contact cards use `mailto:` links with prefilled subjects (“Role: ” / “Project: ”, Czech “Pozice: ” / “Projekt: ”) and the placeholder address; email, LinkedIn and GitHub stay placeholder text until milestone 6.
- **Kultomat card:** art above text from 720 to 1099 px; side by side from 1100 px with an art column of 380–560 px.

## 1. Header and hero (`#top`)

**Desktop.** Full-height first screen (900 px in the mockup) split into a text column and a 720 px drum panel on the right.

- Header: wordmark “DAVID KŘAPKA” (Rubik 24 px) with “Product-minded engineer” below it (Sora 13 px, 600). Navigation on the right: Work · Approach · About · Contact.
- Text column, aligned to the bottom: mono eyebrow, the cycling H1, the cycling subline, an intro paragraph and two buttons.
- Drum panel: yellow paper, ink rollers left and right, the turning drum (T, M, R in halftone with a pink misregistered copy) and a round counter (1/3 → 2/3 → 3/3) in the top-right corner.

**Mobile.** Header with wordmark and a 48 px round menu button. Then a 410 px drum band, then the headline, subline and buttons. The intro paragraph is not shown on mobile (open question in the [design README](README.md#open-design-questions)). The secondary button becomes a 58 px round icon button labelled “Get in touch”.

| Element | English | Czech |
| --- | --- | --- |
| Role under name | Product-minded engineer | Inženýr s produktovým myšlením |
| Nav | Work · Approach · About · Contact | Práce · Přístup · O mně · Kontakt |
| Eyebrow (desktop) | HOW EVERY PROJECT GOES | TAK PROBÍHÁ KAŽDÝ PROJEKT |
| H1 (accessible text) | Think. Make. Rethink. | Think. Make. Rethink. (kept in English) |
| Subline 1 | Understand the problem and ask the questions. | Pochopit problém a položit otázky. |
| Subline 2 | Turn it into a working product. | Proměnit to ve fungující produkt. |
| Subline 3 | Learn from it and change direction when it helps. (mobile: …and change direction.) | Poučit se a změnit směr, když to pomůže. (mobile: …a změnit směr.) |
| Intro (desktop) | I'm David Křapka, a product-minded engineer. I find the real problem, build the product and keep improving it after it ships. | Jsem David Křapka, inženýr s produktovým myšlením. Najdu skutečný problém, postavím produkt a zlepšuji ho i po spuštění. |
| Primary button | See selected work | Prohlédnout práci |
| Secondary button | Get in touch | Napište mi |

Accessibility: the H1 contains a visually hidden “Think. Make. Rethink.”; the three animated words and the sublines are `aria-hidden`. The drum panel is `aria-hidden`.

## 2. Selected work (`#work`)

**Desktop.** Ink background. Yellow H2 with a pink offset shadow, short intro on the right. A large Kultomat feature card (560 px yellow art panel + text) with a 12 px pink offset shadow. Below it a 4-column grid: Eucal, Vladan Vaněk, UpVideo and the Systerna “In progress” card (dashed, not a link).

**Mobile.** The feature card stacks art above text. The other cards become horizontal rows with a 104 px thumbnail on the left.

| Element | English | Czech |
| --- | --- | --- |
| H2 | Selected work | Vybraná práce |
| Intro | One product I own end to end, a few client projects, and one that is still being built. | Jeden vlastní produkt od začátku do konce, několik projektů pro klienty a jeden, který ještě vzniká. |
| Kultomat label | Main case study · Own product | Hlavní případová studie · Vlastní produkt |
| Kultomat text | From the first question to a product that runs every day: the problem, the decisions, the build and what changed afterwards. [One-line summary to be confirmed] | Od první otázky k produktu, který běží každý den: problém, rozhodnutí, vývoj a co se změnilo potom. [Jednovětý souhrn k potvrzení] |
| Kultomat link | Read the case study → | Přečíst případovou studii → |
| Kultomat art | The huge “K” in halftone only; the “[Screenshot … goes here]” label of the mockups was removed in milestone 5 (screenshots appear on the case study pages, not on the landing cards) | same |
| Eucal | Client · Business needs — Turning business needs into a website visitors can find their way through. | Klient · Potřeby firmy — Potřeby firmy převedené do webu, ve kterém se návštěvníci vyznají. |
| Vladan Vaněk | Client · Personal identity — Content structure and personal presentation for an individual's website. | Klient · Osobní prezentace — Struktura obsahu a osobní prezentace na webu jednotlivce. |
| UpVideo | Client · Visual & multimedia — Visual communication and video content delivered against a client brief. | Klient · Vizuál a multimédia — Vizuální komunikace a video obsah podle zadání klienta. |
| Systerna | In progress — Being built now. The case study comes when it's ready. | Rozpracováno — Právě vzniká. Případová studie přijde, až bude hotový. |

Card art: each client card shows its initial in medium halftone on tint or yellow paper with one shape (Eucal: yellow circle; UpVideo: pink play triangle). Kultomat shows a huge “K” with a pink copy. Systerna shows a yellow “S” over a pink dot circle.

Card links currently point to anchors (`#kultomat`, `#eucal` …). In the build they link to case study pages. Whether short client projects get their own pages is decided in [milestone 5](../MILESTONES.md).

## 3. How I think & build (`#approach`)

**Desktop.** H2 left, intro right. A 3-column grid with a 3 px ink border and 18 px rollers on both sides. Each column has a counter, a title, a paragraph and a huge small-dot halftone letter bleeding off the bottom right. The middle column is yellow paper with a pink copy of “M”. Below: the “AI + me” strip on tint.

**Mobile.** Columns stack vertically (min-height 170 px each), with shorter paragraphs. The “AI + me” tag sits above its text.

| Element | English | Czech |
| --- | --- | --- |
| H2 | How I think & build | Jak přemýšlím a tvořím |
| Intro | The same three turns of the drum on every project, big or small. Good products start with good questions. | Stejné tři otáčky válce u každého projektu, velkého i malého. Dobré produkty začínají dobrými otázkami. |
| 1/3 Think | Understand the problem, ask the questions and choose priorities. Who is this for, and what happens if we don't build it? | Pochopit problém, ptát se a stanovit priority. Pro koho to je a co se stane, když to nepostavíme? |
| 2/3 Make | Turn the intention into a working product: UX, implementation, collaboration and running it in production. | Proměnit záměr ve fungující produkt: UX, implementace, spolupráce a provoz. |
| 3/3 Rethink | Validate, learn and change direction. Feedback, iteration, and the things I chose not to build. | Ověřit, poučit se a změnit směr. Zpětná vazba, iterace a věci, které jsem se rozhodl nestavět. |
| Tag | AI + me | AI a já |
| AI text | I use AI tools in my work, openly. Each case study says what I specified, designed and decided, what AI helped with, and how I reviewed and tested the result. | V práci otevřeně používám nástroje AI. Každá případová studie říká, co jsem zadal, navrhl a rozhodl já, s čím pomohla AI a jak jsem výsledek zkontroloval a otestoval. |

Column titles stay in English in Czech (they match the hero claim). Mobile paragraphs are the first sentence only.

## 4. Experience (`#experience`)

Chosen direction **E3 “Big team. Small team.”**

**Desktop.** Yellow paper with 36 px rollers. Eyebrow and H2, then two cards joined by a large halftone “+”: Emplifi (paper card, ink shadow) and Freelance (ink card, yellow title, pink shadow).

**Mobile.** Cards stack, the “+” sits between them, and the CV link moves below both cards.

| Element | English | Czech |
| --- | --- | --- |
| Eyebrow | Experience · What each one taught me | Zkušenosti · Co mi která dala |
| H2 | Big team. Small team. | Velký tým. Malý tým. |
| Emplifi meta | [Role] · employed · [20XX – 20XX] | [Role] · zaměstnání · [20XX – 20XX] |
| Label | What it taught me | Co mě to naučilo |
| Emplifi lesson | [How to ship inside a big product without breaking it.] | [Jak dodávat ve velkém produktu, aniž by se rozbil.] |
| Emplifi detail | [Responsibilities and one concrete decision, to confirm.] | [Odpovědnosti a jedno konkrétní rozhodnutí, k potvrzení.] |
| CV link | [Download CV] → | [Stáhnout životopis] → |
| Freelance meta | Independent · for clients · [20XX – now] | Nezávisle · pro klienty · [20XX – dnes] |
| Freelance lesson | Owning the whole thing, from the first question to launch. | Vlastnit celou věc, od první otázky po spuštění. |
| Freelance detail | Eucal, Vladan Vaněk, UpVideo. See the projects ↑ | Eucal, Vladan Vaněk, UpVideo. Prohlédnout projekty ↑ |

## 5. About (`#about`)

**Desktop.** 400 px round portrait on the left (yellow paper, ink border, pink dot circle offset behind it, G4 glitch), text on the right.

**Mobile.** Portrait above the text.

| Element | English | Czech |
| --- | --- | --- |
| Eyebrow | About · Always evolving | O mně · Pořád se vyvíjím |
| H2 | Playful by design. **Serious** about the work. | Hravý v designu. Vážný v práci. |
| Text | The way I work has changed a lot. I used to work on parts of a product. Now I take on more of the whole thing, combining product thinking, UX and engineering. [A short personal note goes here.] | Můj způsob práce se hodně změnil. Dřív jsem pracoval na částech produktu. Dnes beru víc celek a spojuji produktové myšlení, UX a vývoj. [Sem přijde krátká osobní poznámka.] |

## 6. Contact (`#contact`)

**Desktop.** Yellow paper with rollers; a huge halftone “?” with a pink copy bleeds off the bottom right. H2, two cards side by side (Hiring? on paper, Have a project? on ink with pink shadow), and a mono line of links.

**Mobile.** Cards stack; shorter Hiring text.

| Element | English | Czech |
| --- | --- | --- |
| H2 | Let's work together. | Pojďme na to. |
| Card 1 title | Hiring? | Hledáte do týmu? |
| Card 1 text | Tell me about the team and the role. My CV and LinkedIn are one click away. (mobile: first sentence) | Napište mi o týmu a roli. Životopis a LinkedIn jsou na jedno kliknutí. (mobile: first sentence) |
| Card 1 link | Talk about a role → | Probrat pozici → |
| Card 2 title | Have a project? | Máte projekt? |
| Card 2 text | Share the problem, not just the spec. I'll come back with questions first. | Popište problém, nejen zadání. Nejdřív se vrátím s otázkami. |
| Card 2 link | Start a project → | Začít projekt → |
| Links | [email address] · [LinkedIn] · [GitHub] | [e-mail] · [LinkedIn] · [GitHub] |

Proposed behaviour: both card links open an email to the published address with a prefilled subject (“Role: …” / “Project: …”). No form and no stored data in the first release (see [SPEC](../SPEC.md#data-and-trust-boundaries)).

**Legal note (LEG-001, decided):** the “Have a project?” card and “Start a project →” link stay as in the mockup, as an invitation to talk. While the trade licence is suspended, do not add prices, rates, terms or availability claims for paid services anywhere on the page. See [SPEC](../SPEC.md#legal-requirements) and [0008](../decisions/0008-keep-project-invitation-while-trade-suspended.md).

## 7. Footer

Ink background, small text.

| English | Czech |
| --- | --- |
| © 2026 David Křapka | © 2026 David Křapka |
| Printed in three inks: blue, yellow and a little pink. | Tištěno třemi barvami: modrou, žlutou a trochou růžové. |

The year should come from the build date. Proposed sizing for the business identification block is in the [milestone 2 checklist](../milestone-2-checklist.md). The language switcher and any legal links will probably live here or in the header (not designed yet). The footer needs a link to the privacy notice (LEG-003) and a reserved slot for business identification (name, place of business, IČO and registration note) that appears once the IČO is active (LEG-002).
