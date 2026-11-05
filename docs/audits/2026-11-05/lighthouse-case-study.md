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

## Reproduce

```bash
pnpm test:e2e   # builds with SHOW_DRAFTS=1
pnpm exec wrangler dev --port 8790
npx -y lighthouse@12.6.1 http://localhost:8790/work/kultomat/ --output=json --output-path=/tmp/lh.json --chrome-flags="--headless=new"
```
