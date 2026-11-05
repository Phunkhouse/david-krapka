# 0009. Commit the font files and load them with the local font provider

Date: 2026-11-04  
Status: accepted (the subsetting is refined by [0010](0010-subset-fonts-to-site-characters.md))

## Context

The design needs Rubik 900, Sora 400/600/700 and Space Mono 400/700 with Latin Extended for Czech ([visual system](../design/visual-system.md#typefaces)). Visitor data must not go to Google, and the font payload must stay at or below 150 KB. Astro's Fonts API can download fonts at build time from a provider such as Fontsource, or read files committed to the repository with its local provider. The three fonts are under SIL OFL 1.1, which requires shipping the licence with the fonts ([LEG-008](../SPEC.md#legal-requirements)).

## Decision

Commit `woff2` files, subset to Latin and Latin Extended, in `src/assets/fonts/` and load them with `fontProviders.local()`. Ship each family's OFL licence in `public/fonts/licenses/`, so it is served with the site; `src/assets/fonts/README.md` records the source and version of every file.

## Alternatives considered

- **Fontsource provider.** Less to commit and easy to update, but every build in CI and Cloudflare Workers Builds then depends on the network and on a third party being available.

## Consequences

- Builds are reproducible and work offline.
- Updating a font means replacing files by hand. Record where each file came from (family, version, subset) in a short note next to the files.
- The repository grows by roughly 100 KB of binary files.
