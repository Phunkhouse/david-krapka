# Project specification

The current description of the portfolio site at **david-krapka.eu**. This file is the single source of truth for scope, requirements and technical approach. Background and reasoning from the brainstorming are in the [product and design brief](portfolio-brief.md); project facts are tracked in [content and case studies](content-and-case-studies.md); the approved design is in [docs/design/](design/README.md); delivery stages are in [milestones](MILESTONES.md).

Status: planning, 4 November 2026. A placeholder Next.js site exists (milestone 1). Statements marked **proposal** need confirmation; everything else is confirmed by the user or by the approved mockups.

## Purpose and users

A personal portfolio for David Křapka, positioned as a **product-minded engineer**. It should show product thinking, engineering and a personal brand to two audiences:

| Audience | Needs to learn | Main path |
| --- | --- | --- |
| Hiring managers, recruiters, technical and product leads | Focus, experience, contribution inside a team, how decisions are made | Hero → Kultomat case study → Experience / CV → “Hiring?” |
| Potential clients | Can he understand a brief, deliver and communicate? | Relevant client project → Approach → “Have a project?” |

Success (qualitative, from the brief): a visitor can say in their own words what David does, find a relevant project, tell his contribution apart from team or AI work, and reach contact details without help.

## Scope

### First release

- **Landing page** in English and Czech, built to the [approved mockups](design/landing-page.md): hero, Selected work, How I think & build, Experience, About, Contact, footer.
- **Kultomat case study** (long form) and **short pages** for Eucal, Vladan Vaněk and UpVideo, once their facts are verified. **Proposal:** short client projects get their own pages only if there is enough verified material; otherwise their cards link to the live site.
- **Systerna** as the labelled “In progress” card only, without a page.
- **Emplifi** inside the Experience section, with confirmed role and dates.
- **Contact** via email links (separate subjects for roles and projects), LinkedIn and GitHub.
- **CV** as a downloadable PDF (**proposal:** English only at first).
- Motion as designed, with reduced-motion support and a pause control.
- Search and sharing basics: titles, descriptions, Open Graph images, sitemap, `hreflang`, canonical URLs.

### Out of scope for the first release

Blog, Playground, services catalogue, contact form, newsletter, CMS, comments, analytics with cookies, and dark mode. Each can be reconsidered after launch.

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
- Screenshots are authentic and approved for publication.

### Failure cases

- JavaScript disabled or failed: all content, links and navigation still work (static HTML); only motion and the mobile menu's enhanced behaviour are lost. **Proposal:** the mobile menu falls back to an anchor link to a footer navigation.
- Unknown URL: bilingual 404 page with links to both landing pages.
- Missing translation: the build fails rather than shipping a page with missing strings.

## Data and trust boundaries

- The site is fully static. It has no server code, database, forms, accounts or user input.
- It sets no cookies and loads no third-party scripts, fonts or embeds in the first release. **Proposal:** no analytics at launch; if wanted later, choose a cookieless, EU-hosted option and run legal planning again.
- The only personal data processed is what the hosting provider logs for each request (IP address, user agent). This must be covered by the legal review.
- Email links expose a public address; spam is an accepted risk. The address must be one David is happy to publish.
- Security headers are set by the host: HSTS, Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and frame protection.

## Technical approach

Built with the [AI starter pack](https://github.com/Phunkhouse/ai-starter-pack): core templates plus the Next.js recipe and the Budget-conscious CI strategy. Reasons are in [decision records](decisions/README.md).

| Area | Choice | Status |
| --- | --- | --- |
| Framework | Next.js, App Router, TypeScript, `src/` directory, generated with the official generator. Version checked at setup; the recipe was drafted against Next.js 16. | Proposal ([0001](decisions/0001-starter-pack-and-nextjs.md)) |
| Rendering | Fully static (`output: 'export'`), no server runtime | Proposal ([0003](decisions/0003-vercel-static-hosting.md)) |
| Package manager and runtime | pnpm (pinned with `packageManager`), Node from `.nvmrc` (recipe default 26 LTS) | From recipe |
| Styling | CSS Modules plus global design tokens as CSS custom properties; no Tailwind; Sass only if a real need appears | From recipe |
| Fonts | Rubik 900, Sora 400/600/700, Space Mono 400/700, self-hosted through `next/font`, Latin + Latin Extended | Confirmed design |
| Languages | English (default, `/`) and Czech (`/cs/`); typed dictionaries so a missing key fails type checking | Proposal ([0005](decisions/0005-bilingual-routing.md)) |
| Case study content | MDX files in the repository, one per project and language | Proposal |
| Images | Pre-optimised AVIF/WebP with fixed dimensions (static export cannot use the on-demand image optimiser) | Proposal |
| Formatting and linting | Prettier (`semi: false`, `singleQuote: true`), ESLint flat config with `eslint-config-next` | From recipe |
| Tests | Playwright for smoke, navigation, reduced-motion and accessibility checks (with axe). Vitest only when there is logic worth unit testing. | Proposal |
| CI | GitHub Actions, **Budget-conscious**: draft PRs defer cloud jobs; ready PRs run the full suite | Confirmed ([0002](decisions/0002-budget-conscious-ci.md)) |
| Hosting | Vercel, production from `main`, preview deployments for branches; domain `david-krapka.eu` | Proposal ([0003](decisions/0003-vercel-static-hosting.md)) |
| Domain and DNS | `david-krapka.eu`, DNS at Websupport. Apex and `www` still point to Vercel from a previous project that has since been deleted, so the domain is free to attach to the new Vercel project. Mail (MX) is at Active24 and must not be changed. | Confirmed |
| Repository | `git@github.com:Phunkhouse/david-krapka.git`, public, default branch `main` | Confirmed |

### Commands

`pnpm dev`, `pnpm build`, `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`, and `pnpm verify` running format check, lint, typecheck and build in sequence. `AGENTS.md` will list only commands that exist.

### Local and cloud differences to document

macOS locally versus Ubuntu in CI; Playwright browser version tied to the installed package; fonts downloaded at build time by `next/font` (network needed during build).

## Known limitations and risks

- **Content is the critical path.** Most project facts, Emplifi details, the portrait photo, the CV and the public email address are still missing. Design and code can progress, but launch cannot.
- **Case study pages are not designed.** Milestone 5 cannot start building until the canvas has a case study template.
- **Vercel Hobby plan terms** allow non-commercial personal use only. A portfolio that also invites client work may count as commercial; confirm before launch or use the Pro plan.
- **Looping motion** carries accessibility risk; the pause control and flash check are launch requirements.
- **Static export** rules out middleware-based language detection; visitors choose the language themselves.
- **Branch protection** is technically enforceable because the repository is public. If it becomes private, rulesets need a paid GitHub plan.

## Planning and open questions

Delivery order and acceptance checks are in [MILESTONES.md](MILESTONES.md). Open questions, in the order they block work:

| Blocks | Question |
| --- | --- |
| Milestone 1 | Confirm Next.js and Vercel (records 0001, 0003), or name alternatives. |
| Milestone 1 | Enable legal planning with the `audit-legal-readiness` skill? (Recommended: EU audience, freelance offer, possible identification duties for a sole trader.) |
| Milestone 2 | Design the mobile menu panel, language switcher and pause control. |
| Milestone 3 | Should the mobile hero show the intro sentence? What does the reduced-motion hero show? Should Experience be in the navigation? |
| Milestone 3 | Tablet layout (720–1100 px): accept the proposal in [Visual system](design/visual-system.md#breakpoints-proposal) or design it. |
| Milestone 5 | Case study page design; whether short client projects get their own pages; Czech translations of case studies at launch or later. |
| Milestone 5 | How Systerna is presented (card only, teaser, or left out). |
| Milestone 6 | Public email address, LinkedIn and GitHub URLs, CV content and languages. |
| Milestone 6 | Final role title, availability statement and which audience comes first. |
| Milestone 6 | Analytics at launch: none (proposal) or a cookieless tool. |
| Milestone 6 | Vercel Hobby or Pro. |

## Design

Approved visual and interaction decisions are in [docs/design/](design/README.md), taken from the [Personal Portfolio mockups](https://claude.ai/artifact/4ZHRJaJupE3YgvXMZrBdk5) canvas. Summary of constraints that affect this specification: a three-ink print identity (blue, yellow, pink on off-white), Rubik / Sora / Space Mono, a print-drum hero cycling *Think. Make. Rethink.*, looping decorative motion that must stay optional, and an English and a Czech landing page.
