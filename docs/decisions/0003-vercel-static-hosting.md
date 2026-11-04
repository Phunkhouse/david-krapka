# 0003. Static export hosted on Vercel

Date: 2026-11-04  
Status: superseded by [0007](0007-cloudflare-workers-hosting.md)

## Context

The site has no forms, accounts or server logic in the first release. The domain `david-krapka.eu` (DNS at Websupport) already has apex and `www` records pointing to Vercel, left over from an earlier project that has been deleted; on 4 November 2026 it returned Vercel's “deployment not found”. The domain is free to move to a new Vercel project. Email for the domain is hosted at Active24 and must keep working.

## Decision

- Build the site as fully static files (Astro `output: 'static'` since [0006](0006-astro-static-site.md); originally Next.js `output: 'export'`).
- Host on Vercel: production from `main`, preview deployments for branches, security headers in Vercel configuration.
- Keep production on the `*.vercel.app` address with `noindex` until launch; attach `david-krapka.eu` (apex canonical, `www` redirecting) in milestone 6.

## Alternatives considered

- **Server rendering on Vercel.** Enables middleware (for example automatic language detection) but adds a server runtime the site does not need.
- **Another static host (for example Cloudflare or GitHub Pages).** Viable because the output is plain files, but DNS already points to Vercel and Vercel builds preview deployments for every branch.

## Consequences

- The site can move to any static host later without code changes.
- No on-demand image optimisation: images are optimised before or during the build.
- No middleware: language is chosen by URL and the switcher.
- Vercel's Hobby plan is for non-commercial personal use. A portfolio that also seeks client work may need the Pro plan; confirm before launch.
