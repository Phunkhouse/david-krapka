# Lighthouse run: static landing page (milestone 3, PR C)

Date: 5 November 2026. Two rounds: **first run** (fonts as Fontsource Latin and Latin Extended files, commit `05ff1f9`) and **after trimming the fonts** ([0010](../../decisions/0010-subset-fonts-to-site-characters.md), commit `e0972c0`). Target: PR preview `https://feat-landing-about-contact-david-krapka.services-d43.workers.dev/` and `/cs/` at commit `05ff1f9`. Lighthouse 12.6.1, mobile profile (default simulated throttling), headless Chromium, three runs per page. The full HTML and JSON reports (about 1 MB each) are not committed; the commands below regenerate them.

## Results, first run (commit `05ff1f9`)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` run 1 / 2 / 3 | 98 / 98 / 98 | 100 | 100 | 66 | 2.1 / 2.0 / 2.1 s | 0 / 0 / 0.001 | 0 ms |
| `/cs/` run 1 / 2 / 3 | 98 / 98 / 98 | 100 | 100 | 66 | 2.0 / 2.1 / 2.1 s | 0 / 0.001 / 0.001 | 0 ms |

## Results after trimming the fonts (commit `e0972c0`)

Same method, same preview URL, three runs per page.

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | Fonts loaded |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` run 1 / 2 / 3 | 99 / 99 / 99 | 100 | 100 | 66 | 1.5 / 1.4 / 1.6 s | 1.8 / 1.7 / 1.7 s | 0 | 6 files, 61 KB transferred (56.6 KB decoded) |
| `/cs/` run 1 / 2 / 3 | 99 / 99 / 99 | 100 | 100 | 66 | 1.5 / 1.6 / 1.5 s | 1.7 / 1.7 / 1.7 s | 0 | same 6 files |

Font payload per page: `/` 110.9 KB to 56.6 KB, `/cs/` 156.4 KB to 56.6 KB. LCP dropped about 0.3 s, as predicted from the local comparison (1.7 s to 1.4 s).

## Against the [SPEC targets] (status after trimming the fonts)(../../SPEC.md#performance-targets-measured-on-a-mid-range-phone-profile)

| Target | Result |
| --- | --- |
| Performance ≥ 95 | Met (98). |
| Accessibility 100, Best Practices 100 | Met. |
| SEO 100 | 66 on the preview, **expected**: the only failing SEO audit is `is-crawlable`, because the preview and production send `X-Robots-Tag: noindex` until milestone 6. Re-run after `noindex` is removed. |
| CLS ≤ 0.05 | Met (≤ 0.001). |
| LCP ≤ 2.0 s (lab) | **Met after trimming the fonts**: 1.7 to 1.8 s on the preview (was 2.0 to 2.1 s). |
| Font payload ≤ 150 KB | **Met after trimming**: 56.6 KB on every page (6 files). Before: `/` 110.9 KB, `/cs/` 156.4 KB (Czech letters pulled in the Latin Extended file of every face). |
| No third-party requests | Met (Playwright request test, and the CSP `default-src 'self'`). |

## What was done

- Stylesheets are inlined into each page (`build.inlineStylesheets: 'always'`): Lighthouse had flagged two small render-blocking CSS files (about 8 KB). The e2e CSP checks still pass.
- Fonts trimmed to the characters the site uses, one file per weight ([0010](../../decisions/0010-subset-fonts-to-site-characters.md)): removed the two near-misses above. Removing the font preloads was also tested and did not help.
- No-JavaScript check: all six sections present and the hero button jumps to `#work` on both pages at 1280 and 390 px, with no horizontal scroll.
- 200 % zoom (640 CSS px wide): no horizontal scroll on either page.

## Further levers, if needed later

Documented in [0010](../../decisions/0010-subset-fonts-to-site-characters.md#alternatives-considered), not done: drop Space Mono 400 (about 6 KB) and merge Sora 600 and 700 (about 11 KB), each with a visible typography change.

## Reproduce

```bash
pnpm dlx lighthouse@12.6.1 https://<preview-url>/ --form-factor=mobile --output=html --output-path=./lh-en
pnpm dlx lighthouse@12.6.1 https://<preview-url>/cs/ --form-factor=mobile --output=html --output-path=./lh-cs
```
