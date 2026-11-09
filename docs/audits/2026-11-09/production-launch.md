# Post-launch checks: david-krapka.eu

Date: 9 November 2026, after PR #41 deployed and David attached the domain in Cloudflare. Run by Claude Code from David's machine. The local resolver still held the old "no address" answer for a few minutes, so the HTTP checks were sent to a Cloudflare edge address (`104.21.81.241`) with the real host name; public resolvers (Cloudflare, Google) already returned Cloudflare's addresses for the apex and `www`.

## Setup in Cloudflare (David)

- `david-krapka.eu` attached to the Worker `david-krapka` as a Custom Domain; `www` proxied.
- Single Redirect from the "Redirect from WWW to root" template: `https://www.*` to `https://${1}`, status 301, query string preserved.
- SSL/TLS: Always Use HTTPS on.
- The production `workers.dev` address answers 404 since PR #41 (`workers_dev: false`).

## Results

| Check | Result |
| --- | --- |
| Certificate | `CN=david-krapka.eu`, SAN `david-krapka.eu` and `*.david-krapka.eu`, issued by Google Trust Services (WE1), valid until 7 February 2027; renewed by Cloudflare. |
| `https://david-krapka.eu/` and `/cs/` | 200. Headers: `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'` (plus the hashed `<meta>` CSP), `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`. No `X-Robots-Tag`, no `Set-Cookie`. |
| `https://www.david-krapka.eu/cs/work/kultomat/?x=1` | 301 to `https://david-krapka.eu/cs/work/kultomat/?x=1` (path and query kept). |
| `http://david-krapka.eu/` and `/cs/` | 301 to the same path over HTTPS. |
| `http://www.david-krapka.eu/cs/?x=1` | 301 to `https://www…`, then 301 to `https://david-krapka.eu/cs/?x=1` (200). |
| Unknown path | 404 page. |
| `robots.txt`, `sitemap.xml` | Served from the build: `Allow: /` and the sitemap URL; sitemap with `hreflang` alternates. |
| Mozilla HTTP Observatory | Grade **A+**, score 135, 12 of 12 tests passed, scanned 2026-11-09 11:37 UTC ([report](https://developer.mozilla.org/en-US/observatory/analyze?host=david-krapka.eu)). |
| Clean browser profile (Playwright Chromium, new context) | Visited `/`, pressed the pause control, switched to Czech, opened a case study and the privacy notice: no cookies, `localStorage` and `sessionStorage` empty, no response with `Set-Cookie`, no request to any other origin. |
| Cloudflare features that change pages | Served HTML has no Rocket Loader, Email Address Obfuscation, Web Analytics beacon, Zaraz or other `/cdn-cgi/` script, and no Cloudflare cookie such as `__cf_bm` was set. This is evidence from outside; the dashboard toggles were not inspected. |
| Lighthouse 12.6.1, mobile, landing EN and CS | Performance 100, Accessibility 96, Best Practices 100, SEO 100 in both languages; LCP 1.3 s, CLS 0, TBT 0 ms. |

The Accessibility score of 96 is the `color-contrast` audit on the hero lines and sublines of the landing page, sampled while they fade (2.25:1 in the English run, 1.01:1 in the Czech run, where the sampled line was almost fully transparent). The [web quality audit](web-quality.md) recorded the same intermittent result; a line is shown at full contrast once its fade-in ends, and pausing settles the text at a readable point (WEB-001, fixed in PR #39). It is not treated as a new finding.

## Not checked here (David)

- Email links open the right address and subject on desktop and on a phone.
- LinkedIn Post Inspector preview for the landing page (both languages) and one case study.
- A test message to `hello@david-krapka.eu` after the domain change.
- Optional: Google Search Console with the sitemap (needs a DNS TXT record).
