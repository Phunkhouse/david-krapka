# Lighthouse run: case study pages (milestone 5, PR D)

Date: 5 November 2026. Target: a local `wrangler dev` serve of the Playwright build (`SHOW_DRAFTS=1`, with `public/_headers`) at commit of PR D, not a Cloudflare preview. Lighthouse 12.6.1, mobile profile (default simulated throttling), headless Chromium, three runs per page.

**Scope and limit:** the pages carry placeholder text and no screenshots yet. This run measures the template (text, fonts, header art), not the finished pages. Repeat it on the preview of the PR that makes Kultomat real, with screenshots, and again before launch.

## Results

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/work/kultomat/` (long) run 1 / 2 / 3 | 100 / 100 / 100 | 100 | 100 | 63 | 1.4 / 1.4 / 1.2 s | 0 | 0 ms |
| `/cs/work/kultomat/` | 100 / 100 / 100 | 100 | 100 | 63 | 1.4 / 1.4 / 1.4 s | 0 | 0 ms |
| `/work/eucal/` (short) | 100 / 100 / 100 | 100 | 100 | 63 | 1.4 / 1.4 / 1.4 s | 0 | 0 ms |
| `/cs/work/eucal/` | 100 / 100 / 100 | 100 | 100 | 63 | 1.4 / 1.4 / 1.4 s | 0 | 0 ms |

SEO 63 is the `noindex` exception (`X-Robots-Tag` until milestone 6), as on the landing page.

## Against the targets

Performance ≥ 95, Accessibility 100, Best Practices 100, LCP ≤ 2.0 s and CLS ≤ 0.05: met on the template. Not yet measured: pages with real screenshots.

## Repeat on the finished pages (9 November 2026)

Target: a local `wrangler dev` serve (port 8790) of a normal `pnpm build` of `main` plus PR #37 (all four case studies published, real text and screenshots, production headers). Lighthouse 12.6.1, mobile profile (default simulated throttling), headless Chromium, three runs per page.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/work/kultomat/` (long, two screenshots) | 100 / 100 / 100 | 100 | 100 | 69 | 1.5 s | 0 | 0 ms | 77 KB |
| `/cs/work/kultomat/` | 100 / 100 / 100 | 100 | 100 | 69 | 1.5 / 1.6 / 1.5 s | 0 | 0 ms | 78 KB |
| `/work/eucal/` (short, the largest screenshot, 306 KB source) | 100 / 100 / 100 | 100 | 100 | 69 | 1.4 s | 0 | 0 ms | 91 KB |
| `/cs/work/eucal/` | 100 / 100 / 100 | 100 | 100 | 69 | 1.4 s | 0 | 0 ms | 75 KB |

SEO 69 comes from one audit, `is-crawlable` (“Page is blocked from indexing”), which is the `X-Robots-Tag: noindex` header that stays until launch (PR G). Every other SEO audit passes. Recheck after launch.

Against the targets (Performance ≥ 95, Accessibility 100, Best Practices 100, LCP ≤ 2.0 s, CLS ≤ 0.05): met on every measured page. The transfer sizes are small because the screenshots are lazy-loaded below the fold and served as AVIF or WebP, and Lighthouse's default run does not scroll. The size of the images themselves is covered by the build (`pnpm build` output, fixed width and height so layout does not shift: CLS is 0).

Not covered: the landing page (see [the landing run](lighthouse-landing.md)), Vladan Vaněk and UpVideo (same template as Eucal), and real devices. The page-by-page Lighthouse run in the pre-launch review (PR F) repeats all page types on the preview URL.

## Reproduce

```bash
pnpm test:e2e   # builds with SHOW_DRAFTS=1
pnpm exec wrangler dev --port 8790
npx -y lighthouse@12.6.1 http://localhost:8790/work/kultomat/ --output=json --output-path=/tmp/lh.json --chrome-flags="--headless=new"
```
