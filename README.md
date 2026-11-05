# David Křapka — personal portfolio

Source and planning for **[david-krapka.eu](https://david-krapka.eu)**, the personal portfolio of David Křapka, a product-minded engineer. The site presents product thinking, engineering and a personal brand to potential employers and clients, in English and Czech.

The repository has a planned scope, design and delivery plan, and a placeholder Astro site. The real design is built from milestone 2 onward.

## How it will work

A static Astro site hosted on Cloudflare Workers. One bilingual landing page (hero, selected work, approach, experience, about, contact) printed in a three-ink style, plus case study pages. No server, forms or cookies in the first release. Development follows the [AI starter pack](https://github.com/Phunkhouse/ai-starter-pack) with Budget-conscious CI: draft PRs are checked locally, and cloud CI runs when a PR is marked ready for review.

## Documentation

- [Specification](docs/SPEC.md) — scope, requirements, technical approach, risks and open questions. The single source of truth.
- [Milestones](docs/MILESTONES.md) — delivery stages with acceptance checks, and the content each stage needs.
- [Design](docs/design/README.md) — the approved design from the Personal Portfolio mockups canvas: visual system, landing page, motion and mockup sources.
- [Decision records](docs/decisions/README.md) — why the stack, CI, hosting, design source and language routing were chosen.
- [Content and case studies](docs/content-and-case-studies.md) — projects, Emplifi, case study structure and the evidence still missing.
- [Product and design brief](docs/portfolio-brief.md) — background synthesis of the original brainstorming.
- [Earlier decisions and next steps](docs/decisions-and-next-steps.md) — the pre-mockup decision log, kept for history.

The documentation distinguishes confirmed decisions from proposals. Project roles, technologies and outcomes need evidence before publication.

## Getting started

Requires the Node version in `.nvmrc` and pnpm (version pinned in `package.json`).

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm verify   # format check, lint, typecheck, build
```

Other scripts: `pnpm build` (to `dist/`), `pnpm preview`, `pnpm preview:cloudflare` (serves `dist/` with the production headers), `pnpm format`, `pnpm lint`, `pnpm typecheck`. Commands and conventions for agents are in [AGENTS.md](AGENTS.md).

## Licence

The code is under the [MIT licence](LICENSE). The site's texts, case studies, images, portrait, CV and documentation are all rights reserved; see [CONTENT-LICENSE.md](CONTENT-LICENSE.md). The fonts keep their own SIL Open Font License.
