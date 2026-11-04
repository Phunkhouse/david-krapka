# Project specification

The current description of the portfolio site at **david-krapka.eu**. This file is the single source of truth for scope, requirements and technical approach. Background and reasoning from the brainstorming are in the [product and design brief](portfolio-brief.md); project facts are tracked in [content and case studies](content-and-case-studies.md); the approved design is in [docs/design/](design/README.md); delivery stages are in [milestones](MILESTONES.md).

Status: planning, 4 November 2026. A placeholder Astro site exists (milestone 1). Statements marked **proposal** need confirmation; everything else is confirmed by the user or by the approved mockups.

## Purpose and users

A personal portfolio for David Křapka, positioned as a **product-minded engineer**. It should show product thinking, engineering and a personal brand to two audiences:

| Audience | Needs to learn | Main path |
| --- | --- | --- |
| Hiring managers, recruiters, technical and product leads | Focus, experience, contribution inside a team, how decisions are made | Hero → Kultomat case study → Experience / CV → “Hiring?” |
| Potential clients (an invitation to talk only while the trade is suspended; David accepts no paid work until the IČO is active, [LEG-001](#legal-requirements)) | Can he understand a brief, deliver and communicate? | Relevant client project → Approach → Contact |

Success (qualitative, from the brief): a visitor can say in their own words what David does, find a relevant project, tell his contribution apart from team or AI work, and reach contact details without help.

## Scope

### First release

- **Landing page** in English and Czech, built to the [approved mockups](design/landing-page.md): hero, Selected work, How I think & build, Experience, About, Contact, footer.
- **Kultomat case study** (long form) and **short pages** for Eucal, Vladan Vaněk and UpVideo, once their facts are verified. **Proposal:** short client projects get their own pages only if there is enough verified material; otherwise their cards link to the live site.
- **Systerna** as the labelled “In progress” card only, without a page.
- **Emplifi** inside the Experience section, with confirmed role and dates.
- **Contact** via email links (separate subjects for roles and projects; the project link is an invitation to talk, see [LEG-001](#legal-requirements)), LinkedIn and GitHub.
- **Privacy notice** in both languages, linked from every footer ([LEG-003](#legal-requirements)).
- **CV** as a downloadable PDF (**proposal:** English only at first).
- Motion as designed, with reduced-motion support and a pause control.
- Search and sharing basics: titles, descriptions, Open Graph images, sitemap, `hreflang`, canonical URLs.

### Out of scope for the first release

Blog, Playground, services catalogue, prices, rates, terms or availability claims for paid services (until the trade is active again, [LEG-001](#legal-requirements)), contact form, newsletter, CMS, comments, analytics with cookies, and dark mode. Each can be reconsidered after launch.

## Important workflows and requirements

### Navigation and structure

- One landing page with anchor navigation: Work · Approach · About · Contact (desktop) and a menu button (mobile). The mobile menu panel still needs design.
- Every project card is a real link (except Systerna). Every section offers a path to work, CV or contact.
- A language switcher on every page links to the same page in the other language. Its position still needs design.

### URLs (proposal)

| Page | English | Czech |
| --- | --- | --- |
| Landing | `/` | `/cs/` |
| Case study | `/work/<slug>/` | `/cs/work/<slug>/` |
| CV | `/cv/david-krapka-cv.pdf` | same file |
| Not found | `404` | `404` (bilingual text) |

Slugs: `kultomat`, `eucal`, `vladan-vanek`, `upvideo`. Canonical host is `https://david-krapka.eu`; `www` redirects to it permanently.

### Accessibility (required)

- WCAG 2.2 AA. Semantic landmarks, one H1 per page, logical heading order, `lang` set correctly per language.
- All decorative glyphs and animations are `aria-hidden`; their meaning is present as text.
- Visible focus on every interactive element (see [focus rule](design/visual-system.md#focus)); full keyboard use including the mobile menu.
- Motion: reduced-motion support, a pause control for looping animation (WCAG 2.2.2) and a flash check (2.3.1). Details in [Motion](design/motion.md).
- Text contrast at least 4.5:1; pink and yellow-on-paper are never used for text.
- Works at 320 px width and 200 % zoom without horizontal scrolling.

### Performance (targets, measured on a mid-range phone profile)

- Largest Contentful Paint ≤ 2.0 s in lab tests, ≤ 2.5 s at the 75th percentile for real visitors.
- Cumulative Layout Shift ≤ 0.05; Interaction to Next Paint ≤ 200 ms.
- Lighthouse mobile: Performance ≥ 95; Accessibility, Best Practices and SEO 100.
- Fonts self-hosted, subset to Latin and Latin Extended, total font payload ≤ 150 KB.
- No third-party requests on page load.

### Content honesty (required)

- No square-bracket placeholders (`[Role]`, `[20XX]`) on the published site. An automated check fails the build for production when any remain.
- Every case study states David's role, collaborators and the share of AI assistance, following the structure in [content and case studies](content-and-case-studies.md#proposed-shared-case-study-structure).
- Screenshots are authentic and approved for publication, with written permission from the client and from any identifiable person shown ([LEG-006](#legal-requirements)).

### Failure cases

- JavaScript disabled or failed: all content, links and navigation still work (static HTML); only motion and the mobile menu's enhanced behaviour are lost. **Proposal:** the mobile menu falls back to an anchor link to a footer navigation.
- Unknown URL: bilingual 404 page with links to both landing pages.
- Missing translation: the build fails rather than shipping a page with missing strings.

## Data and trust boundaries

- The site is fully static. It has no server code, database, forms, accounts or user input.
- It sets no cookies, stores nothing on visitors' devices and loads no third-party scripts, fonts or embeds in the first release ([LEG-005](#legal-requirements)). **Proposal:** no analytics at launch; if wanted later, choose a cookieless, EU-hosted option and run legal planning again.
- The only personal data processed on the site itself is what Cloudflare handles for each request (IP address, user agent), plus emails people send and collaborators named in case studies. The privacy notice covers it ([LEG-003](#legal-requirements)); Cloudflare is the processor ([LEG-004](#legal-requirements)).
- Email links expose a public address; spam is an accepted risk. The address must be one David is happy to publish.
- Security headers are set by the host through `public/_headers`: HSTS, Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and frame protection.

## Legal requirements

From the [legal planning audit of 4 November 2026](audits/2026-11-04/legal-planning.md) (Planning mode; not legal advice, and not a statement that the site complies). Requirements keep their audit IDs. Each is checked again in the Pre-launch audit in milestone 6.

**Operator facts (David, 4 November 2026):** a natural person in the Czech Republic with an IČO whose trade licence is suspended while on social-security support; the site offers no paid work for now and is a showcase and job search; the public email address is undecided; no client contract or NDA restricts showing past work.

| ID | Requirement | When |
| --- | --- | --- |
| LEG-001 | **Decided (accepted risk, [0008](decisions/0008-keep-project-invitation-while-trade-suspended.md)):** the “Have a project?” card and “Start a project →” link stay as an invitation to talk, as in the mockups. While the trade licence is suspended, David accepts no paid work, and the site gives no prices, rates, terms or availability claims. Revisit when the IČO is reactivated or before the first paid job. | Copy in milestone 3; revisit on IČO reactivation |
| LEG-002 | When David accepts paid work or the site offers services as an entrepreneur: name, place of business (*sídlo*), IČO and registration note in the footer of every page (Civil Code § 435). Decide early whether the place of business is a home or a separate business address. Reserve a footer slot in the shell. | Slot in milestone 2; content on IČO reactivation |
| LEG-003 | Bilingual privacy notice (for example `/privacy/` and `/cs/soukromi/`), linked from every footer: controller and contact, purposes and lawful basis, Cloudflare as processor, transfers outside the EEA, retention, rights, right to complain to ÚOOU. Needs the public email address. | Page route and footer link in milestone 2; text in milestone 6 |
| LEG-004 | Private dated record of the accepted Cloudflare Self-Serve agreement and Data Processing Addendum versions. Keep Workers logs and observability off unless the privacy notice covers them. | Before launch |
| LEG-005 | The site stores nothing on visitors' devices: no cookies, `localStorage`, `sessionStorage` or IndexedDB, including for the pause control. This is why no cookie banner is planned. Cloudflare features that set cookies stay off. | Milestones 2 and 4 acceptance checks |
| LEG-006 | Written permission per project for names, logos, screenshots and quotes; permission from any identifiable person shown (Civil Code § 84–85) or blur or crop them; ask named collaborators first. Record the date and form of each permission in the project card. | Before each case study is published (milestone 5) |
| LEG-007 | Portrait photo with documented rights; CV PDF and images free of personal data you do not want public; EXIF and location metadata removed from committed images. | Milestone 6 |
| LEG-008 | The three fonts are under SIL OFL 1.1. Ship each font's `OFL.txt`, or verify that the served font files keep copyright and licence in readable metadata. | Milestone 2 |
| LEG-009 | Add a `LICENSE` file (code) and a content note (texts, case studies, images and CV: all rights reserved). Keep a one-page private record of processing. | Milestone 6 |

Out of scope by the audit's reasoning, to be re-checked if the facts change: consumer-contract and marketing-communication rules (nothing is sold or sent), the Czech accessibility act (a personal portfolio and micro-enterprise exemption; WCAG 2.2 AA remains a product requirement), and information-society-service duties. Not covered by the audit: social-security, tax and employment questions.

## Technical approach

Built with the [AI starter pack](https://github.com/Phunkhouse/ai-starter-pack): core templates, the tooling conventions of its Next.js recipe adapted to Astro, and the Budget-conscious CI strategy. Reasons are in [decision records](decisions/README.md).

| Area | Choice | Status |
| --- | --- | --- |
| Framework | Astro 7, strict TypeScript, generated with `create astro`. No client JavaScript by default; scripts or islands only where behaviour needs them. | Confirmed ([0006](decisions/0006-astro-static-site.md)) |
| Rendering | Fully static (`output: 'static'`, build to `dist/`), no server runtime | Confirmed ([0006](decisions/0006-astro-static-site.md)) |
| Package manager and runtime | pnpm (pinned with `packageManager`), Node from `.nvmrc` (recipe default 26 LTS) | From recipe |
| Styling | Astro component-scoped styles plus global design tokens as CSS custom properties; no Tailwind; Sass only if a real need appears | Confirmed ([0006](decisions/0006-astro-static-site.md)) |
| Fonts | Rubik 900, Sora 400/600/700, Space Mono 400/700, self-hosted through the Astro Fonts API (to verify in milestone 2), Latin + Latin Extended | Confirmed design |
| Languages | English (default, `/`) and Czech (`/cs/`); typed dictionaries so a missing key fails type checking | Proposal ([0005](decisions/0005-bilingual-routing.md)) |
| Case study content | MDX files in an Astro content collection, one per project and language; a schema enforces role, collaborators and AI share | Proposal |
| Images | Optimised at build time (Astro `<Image>`/`<Picture>`, AVIF/WebP with fixed dimensions) | Proposal |
| Formatting and linting | Prettier (`semi: false`, `singleQuote: true`), ESLint flat config with `@eslint/js`, `typescript-eslint` and `eslint-plugin-astro` | From recipe |
| Tests | Playwright for smoke, navigation, reduced-motion and accessibility checks (with axe). Vitest only when there is logic worth unit testing. | Proposal |
| CI | GitHub Actions, **Budget-conscious**: draft PRs defer cloud jobs; ready PRs run the full suite | Confirmed ([0002](decisions/0002-budget-conscious-ci.md)) |
| Hosting | Cloudflare Workers static assets (no Worker script), deployed by Workers Builds: production from `main`, preview URLs for branches; `wrangler.jsonc` and `public/_headers` | Confirmed ([0007](decisions/0007-cloudflare-workers-hosting.md)) |
| Domain and DNS | `david-krapka.eu`, registered at Websupport, which also hosts its DNS today. Apex and `www` still point to Vercel from a deleted project. At launch DNS moves to Cloudflare (needed for the apex), with the Active24 mail records (MX, SPF, DKIM, DMARC) copied exactly. Mail must keep working. | Confirmed ([0007](decisions/0007-cloudflare-workers-hosting.md)) |
| Repository | `git@github.com:Phunkhouse/david-krapka.git`, public, default branch `main` | Confirmed |

### Commands

`pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`, and `pnpm verify` running format check, lint, typecheck and build in sequence. `AGENTS.md` will list only commands that exist.

### Local and cloud differences to document

macOS locally versus Ubuntu in CI; Playwright browser version tied to the installed package; fonts downloaded at build time by the Astro Fonts API (network needed during build).

## Known limitations and risks

- **Content is the critical path.** Most project facts, Emplifi details, the portrait photo, the CV and the public email address are still missing. Design and code can progress, but launch cannot.
- **Case study pages are not designed.** Milestone 5 cannot start building until the canvas has a case study template.
- **DNS move at launch.** Moving the zone to Cloudflare can break email if a mail record is missed; compare records one by one before switching nameservers and send a test email afterwards.
- **Looping motion** carries accessibility risk; the pause control and flash check are launch requirements.
- **Trade suspension (accepted risk, [LEG-001](#legal-requirements)).** The “Have a project?” invitation sits in a grey area while the trade licence is suspended; the legal classification and the conditions of David's social-security support are unresolved and outside the audit's scope. David accepted the risk on 4 November 2026 on the basis that it is only an invitation to talk ([0008](decisions/0008-keep-project-invitation-while-trade-suspended.md)).
- **Static output** rules out middleware-based language detection; visitors choose the language themselves.
- **Branch protection** is technically enforceable because the repository is public. If it becomes private, rulesets need a paid GitHub plan.

## Planning and open questions

Delivery order and acceptance checks are in [MILESTONES.md](MILESTONES.md). Open questions, in the order they block work:

| Blocks | Question |
| --- | --- |
| Milestone 2 | Business identification in the footer ([LEG-002](#legal-requirements)): which place of business will be published when the IČO is active? Needed to size the footer slot. |
| Milestone 2 | Design the mobile menu panel, language switcher and pause control. |
| Milestone 3 | Should the mobile hero show the intro sentence? What does the reduced-motion hero show? Should Experience be in the navigation? |
| Milestone 3 | Tablet layout (720–1100 px): accept the proposal in [Visual system](design/visual-system.md#breakpoints-proposal) or design it. |
| Milestone 5 | Case study page design; whether short client projects get their own pages; Czech translations of case studies at launch or later. |
| Milestone 5 | How Systerna is presented (card only, teaser, or left out). |
| Milestone 6 | Public email address (**also blocks the privacy notice, [LEG-003](#legal-requirements)**), LinkedIn and GitHub URLs, CV content and languages. |
| Milestone 6 | Final role title, availability statement and which audience comes first. |
| Milestone 6 | Analytics at launch: none (proposal) or a cookieless tool. |

## Design

Approved visual and interaction decisions are in [docs/design/](design/README.md), taken from the [Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5) canvas. Summary of constraints that affect this specification: a three-ink print identity (blue, yellow, pink on off-white), Rubik / Sora / Space Mono, a print-drum hero cycling *Think. Make. Rethink.*, looping decorative motion that must stay optional, and an English and a Czech landing page.
