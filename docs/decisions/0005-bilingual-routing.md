# 0005. English at the root, Czech under /cs/

Date: 2026-11-04  
Status: proposed

## Context

The mockups include complete English and Czech landing pages; the hero claim stays in English in both. The brief proposed English as the primary language. The site is a static export, so there is no middleware to detect the visitor's language.

## Decision

- English at `/`, Czech at `/cs/`, with the same slugs for case studies (`/work/kultomat/`, `/cs/work/kultomat/`).
- Interface copy lives in typed dictionaries per language, so a missing translation fails type checking. Case studies are MDX files per language.
- Each page sets its own `lang` and lists the other language as an `hreflang` alternate.
- A visible switcher links to the equivalent page; no automatic redirects.

## Alternatives considered

- **Locale prefixes for both (`/en/`, `/cs/`).** Symmetrical, but the root would need a redirect, which a static export can only do client-side or through host configuration.
- **Translated slugs (`/cs/prace/…`).** Friendlier for Czech readers, but doubles routing complexity for a handful of pages.
- **English only at launch.** Less work, but the Czech design already exists and local clients are a target audience.

## Consequences

- English is the default for unknown visitors and search engines.
- Every new string must be added in both languages.
- Revisit if Czech becomes the primary market.
