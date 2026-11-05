# Lighthouse run: static landing page (milestone 3, PR C)

Date: 5 November 2026. Target: PR preview `https://feat-landing-about-contact-david-krapka.services-d43.workers.dev/` and `/cs/` at commit `05ff1f9`. Lighthouse 12.6.1, mobile profile (default simulated throttling), headless Chromium, three runs per page. The full HTML and JSON reports (about 1 MB each) are not committed; the commands below regenerate them.

## Results

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` run 1 / 2 / 3 | 98 / 98 / 98 | 100 | 100 | 66 | 2.1 / 2.0 / 2.1 s | 0 / 0 / 0.001 | 0 ms |
| `/cs/` run 1 / 2 / 3 | 98 / 98 / 98 | 100 | 100 | 66 | 2.0 / 2.1 / 2.1 s | 0 / 0.001 / 0.001 | 0 ms |

## Against the [SPEC targets](../../SPEC.md#performance-targets-measured-on-a-mid-range-phone-profile)

| Target | Result |
| --- | --- |
| Performance ≥ 95 | Met (98). |
| Accessibility 100, Best Practices 100 | Met. |
| SEO 100 | 66 on the preview, **expected**: the only failing SEO audit is `is-crawlable`, because the preview and production send `X-Robots-Tag: noindex` until milestone 6. Re-run after `noindex` is removed. |
| CLS ≤ 0.05 | Met (≤ 0.001). |
| LCP ≤ 2.0 s (lab) | **Borderline**: 2.0 to 2.1 s on the preview over the internet with Lighthouse's simulated slow connection; 1.7 to 1.8 s when served locally. Not clearly met; see below. |
| Font payload ≤ 150 KB | `/`: 110.9 KB (8 files). `/cs/`: **156.4 KB** (12 files), about 4 % over, because Czech letters pull in the Latin Extended file of every face in use. |
| No third-party requests | Met (Playwright request test, and the CSP `default-src 'self'`). |

## What was done

- Stylesheets are inlined into each page (`build.inlineStylesheets: 'always'`): Lighthouse had flagged two small render-blocking CSS files (about 8 KB). The e2e CSP checks still pass.
- No-JavaScript check: all six sections present and the hero button jumps to `#work` on both pages at 1280 and 390 px, with no horizontal scroll.
- 200 % zoom (640 CSS px wide): no horizontal scroll on either page.

## Open points for David

1. **Czech font payload (156 KB vs 150 KB).** Options: drop one weight (for example Space Mono 400, used only for the contact link line, or Sora 600) or accept 4 % over. Dropping a weight changes the look slightly.
2. **LCP around 2.0 s.** The largest element is hero text; the cost is mostly the first request plus fonts. Candidates if it matters: preload only the fonts above the fold (already `preload` on display and body 400), drop a font weight, or accept it. Real-user numbers will come after launch (the 75th-percentile target is 2.5 s).

## Reproduce

```bash
pnpm dlx lighthouse@12.6.1 https://<preview-url>/ --form-factor=mobile --output=html --output-path=./lh-en
pnpm dlx lighthouse@12.6.1 https://<preview-url>/cs/ --form-factor=mobile --output=html --output-path=./lh-cs
```
