# 0013. MIT for the code, all rights reserved for the content

Date: 2026-11-05  
Status: accepted

## Context

The repository is public and had no licence, so everything in it was all rights reserved by default. The legal planning audit recommended a `LICENSE` file and a note for the content ([LEG-009](../SPEC.md#legal-requirements)). The repository mixes code with things David does not want reused: the site's texts, case studies, his portrait, screenshots of client work, the CV and the design boards. The code itself is ordinary and could help others building a similar site.

## Decision

- `LICENSE`: the standard MIT licence, so GitHub and tools recognise it. It covers the source code and configuration.
- `CONTENT-LICENSE.md`: texts (copy strings in `src/i18n/`, case studies, privacy notice), images (portrait, screenshots, icons, Open Graph images, design boards), the CV and `docs/` are © David Křapka, all rights reserved. Short quotes with attribution and links are welcome. Client material keeps its owners' rights.
- The fonts keep the SIL Open Font License 1.1 (`public/fonts/licenses/`).
- The README links both files.

Decided by David on 5 November 2026 (milestone 6 decision 13).

## Alternatives considered

- **No open licence (all rights reserved for everything).** The simplest, but it turns away people who would learn from the code, and gains nothing, because the parts worth protecting are protected by the content note anyway.

## Consequences

- The UI copy lives in TypeScript files (`src/i18n/*.ts`), so one file can hold both MIT code and reserved text. `CONTENT-LICENSE.md` names those strings explicitly; keep it accurate when content moves.
- Anything committed is published under these terms; LEG-006 and LEG-007 still decide what may be committed at all.
- Revisit if the site gains content under another licence (for example a quoted image under Creative Commons) or if David wants to open the case studies.
