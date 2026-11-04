# 0007. Host on Cloudflare Workers static assets

Date: 2026-11-04  
Status: accepted  
Supersedes: [0003](0003-vercel-static-hosting.md)

## Context

[0003](0003-vercel-static-hosting.md) proposed Vercel because the domain's DNS already pointed there. David's Vercel Hobby account is getting crowded with other projects. The Hobby terms also allow only non-commercial use, which was an open risk for a portfolio that invites client work. The site is plain static files in `dist/` ([0006](0006-astro-static-site.md)), so it can run on any static host. The domain is registered at Websupport, which also hosts its DNS. Mail is at Active24 and must keep working.

## Decision

- Host on **Cloudflare Workers with static assets** (no Worker script), deployed by Workers Builds from the GitHub repository. Production deploys from `main`, and every other branch gets a preview URL.
- Configure the project in `wrangler.jsonc`: `assets.directory` `./dist/`, `html_handling: auto-trailing-slash`, `not_found_handling: 404-page`, with `workers.dev` and preview URLs enabled. Headers live in `public/_headers`.
- Until launch, production lives on `david-krapka.<account>.workers.dev` with `X-Robots-Tag: noindex`.
- At launch (milestone 6), move the domain's DNS to Cloudflare, because the apex domain needs a Cloudflare zone. The registrar stays Websupport. Copy the Active24 mail records exactly first: MX, plus any SPF, DKIM and DMARC TXT records. Then attach `david-krapka.eu` as a Custom Domain, with `www` redirecting to the apex.

## Alternatives considered

- **Vercel ([0003](0003-vercel-static-hosting.md)).** DNS already pointed there, but the Hobby account is crowded and its terms forbid commercial use; Pro costs money.
- **Cloudflare Pages.** Similar, with automatic previews and the option of a `www`-only domain without moving DNS. Cloudflare's own guides cover moving from Pages to Workers, where the feature set is broader; this site needs nothing Pages-only, so new work starts on Workers.

## Consequences

- The free plan allows commercial use, and static asset requests are free and unlimited, so the Vercel Hobby risk in SPEC goes away.
- Free-plan build limits (3,000 build minutes a month, one build at a time, 20-minute timeout) are ample for this site.
- The DNS move at launch is the riskiest step for mail. It needs a record-by-record comparison before switching nameservers, and a test email afterwards.
- `pnpm preview:cloudflare` runs `wrangler dev` against `dist/`, so headers, trailing slashes and 404 handling can be checked locally.
- Workers previews are public; protect them with Cloudflare Access if that becomes a concern.
- Revisit if the site needs server features that Workers cannot cover, or if Cloudflare's free terms change.
