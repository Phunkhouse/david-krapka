# 0001. Use the AI starter pack with its Next.js recipe

Date: 2026-11-04  
Status: superseded by [0006](0006-astro-static-site.md) (framework choice; the starter pack is still used)

## Context

David asked to build the portfolio using as much as possible of the [AI starter pack](https://github.com/Phunkhouse/ai-starter-pack). The pack provides documentation templates, agent instructions, a CI policy and one stack recipe: Next.js with TypeScript, the App Router, pnpm and no Tailwind. The site is a mostly static, bilingual marketing page with a few long-form case studies and expressive CSS animation. Implementation will be largely AI-assisted, so clear agent instructions and checks matter.

## Decision

Adopt the starter pack's core templates (`AGENTS.md`, `CLAUDE.md`, `.editorconfig`, `docs/SPEC.md`, `docs/design/`, `docs/decisions/`, `docs/MILESTONES.md`) and its **Next.js recipe** (generator settings, `.nvmrc`, Prettier, ESLint flat config, scripts). Style with CSS Modules and CSS custom properties.

## Alternatives considered

- **A lighter static site generator (for example Astro).** Would ship less JavaScript by default, which suits a mostly static page. Rejected for now because the starter pack's recipe, CI examples and agent guidance are written for Next.js, and a second stack would need its own recipe.
- **Tailwind CSS.** The recipe explicitly omits it; the design relies on many one-off print effects that read better as named CSS utilities and modules.

## Consequences

- Tooling, CI and agent instructions can be copied rather than invented.
- The React runtime adds client JavaScript even to static pages; the performance budget in SPEC must be checked from milestone 1.
- The recipe was drafted against Next.js 16. Check the installed version's documentation before configuring.
- Revisit if Lighthouse targets cannot be met with Next.js static export.
