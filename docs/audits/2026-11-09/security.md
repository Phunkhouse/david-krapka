# Security audit: personal portfolio

- Date: 2026-11-09 (Europe/Prague).
- Scope: the static Astro portfolio, published build artifacts, browser protections, dependency advisories, locally reachable Git history, GitHub workflows and available deployment configuration. No production exploitation, credential use, workflow triggering or infrastructure changes.
- Audited project commit: `569064aa200c425ad48d5aac73530f00e4266bce`, branch `docs/web-quality-audit`; initial working tree clean. The only difference from application revision `0d06465aea8d3dc889593e32b33ca211a7e4b022` is the committed web-quality report.
- Toolkit commit: `d04b8b83b083f1242f0fdfd8474a617623c93f6e`; toolkit working tree clean. The physical skill folder resolved to the toolkit checkout's `skills/audit-security`; provenance was obtained with `git -C ../.. rev-parse HEAD` from that folder.
- Previous security audit: none found; no prior `SEC-` IDs or `docs/audits/context.md`. Related evidence: `docs/audits/2026-11-09/web-quality.md` and the existing legal planning/privacy research reports, which do not substitute for this review.
- Private working evidence: `/private/tmp/portfolio-security-nvonmcj9/`. Raw audit JSON, upstream source copies, test fixtures and browser results remain outside the repository. No secrets or sensitive screenshots are included here.

## Executive summary

No exploitable application vulnerability or security release blocker was confirmed in the inspected scope. One **Low** supply-chain hardening finding concerns a mutable third-party action reference in the credential-bearing optional review workflow. This is conditional exposure, not evidence of a compromised action or leaked credential.

The published site is static, with no accounts, forms, database or request-time application backend. Browser checks on the isolated build confirmed blocking of unapproved inline scripts and framing. A targeted scan of locally reachable Git history found no matching credential patterns. The dependency registry returned one development-tool advisory; inspected callers do not enable the required vulnerable optimization mode. Production dependency lookup returned no advisories. Neither result establishes that every dependency is vulnerability-free.

Cloudflare account settings, production TLS/headers, actual CI credential scopes and historical workflow runs remain unverified. This is an evidence-based review of the available boundaries, not a guarantee of security.

| Severity | Confirmed | Suspected |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 0 | 0 |
| Low | 1 | 0 |

## Release blockers

None confirmed within the reviewed security scope. SEC-001 is a hardening task, not a demonstrated application compromise. Deployment/account checks below remain prerequisites for a complete production assessment. The separate WEB-001/WEB-002 accessibility findings are not duplicated as security vulnerabilities.

## Trust boundaries and coverage

Visitors can request public static files and choose URL paths, query strings and fragments. Page text, translations, MDX, images, metadata and link destinations come from repository-controlled files. Build tools execute repository code in development/CI; Cloudflare serves `dist/`. The optional model-assisted GitHub review is a separate CI integration with credentials and repository capabilities; the deployed website itself does not call a model or offer agent tools.

| Area | Coverage | Evidence and practical limits |
| --- | --- | --- |
| Rendering, routes and injection | Reviewed | `src/pages/`, layouts, content loader/schema, dictionaries, components and client scripts; current source contains no request-input-to-HTML or request-input-to-code path. MDX is trusted build input, not user-submitted content. |
| Authentication, authorization, tenant isolation, CSRF and business abuse | Not applicable to the deployed app | No accounts, cookies, tenants, forms, paid transactions or server-side mutations. CI authorization reviewed separately. |
| Browser security policy | Sampled | Five representative HTML routes in local Chromium; header, CSP and framing checks. HTTP-only localhost cannot verify real HTTPS/HSTS enforcement. |
| Published artifact exposure | Reviewed | Inventory of 132 files, including 13 HTML files, in the isolated production build. No source maps, source TypeScript/MDX, environment/key files or repository metadata found in that inventory. |
| Dependencies | Reviewed | Copied lockfile; full and production-only pnpm advisory lookups; advisory prerequisites traced through installed matching ESLint/typescript-eslint/minimatch code. No package updates or exploit workload executed. |
| Credentials and Git history | Sampled | All 142 commits reachable from local refs: 653 unique blobs, 610 text blobs scanned, 43 binary blobs skipped; no oversized blobs. Seven targeted credential pattern families, not an exhaustive secret scanner. No remote-only/dangling history or live secret validation. |
| CI workflows and optional review action | Reviewed | All three workflows; source and security documentation of the currently resolved review action; isolated authorization guard fixtures. No GitHub job or model call triggered. |
| Repository protection | Reviewed, read-only live snapshot | Public GitHub repository and active `protect-main` ruleset inspected through the connector. Does not establish that any particular revision's CI passed. |
| Cloudflare delivery/account controls | Configuration reviewed; live state not verified | Static assets configuration and `_headers` inspected. No Cloudflare account, DNS, certificate or feature-setting inspection in this audit. |

## Findings

### SEC-001: The credential-bearing review workflow uses a mutable action tag

- Severity: **Low**.
- Confidence: **High** for the configuration; no upstream compromise observed.
- Status: **Confirmed** conditional supply-chain exposure.
- Previous finding: None.
- Location: `.github/workflows/claude.yml:33`; credential input at line 35. Other action references in `ci.yml` and `e2e.yml` also use version tags, but the direct third-party credential handoff makes this the priority instance of the same root cause.
- Evidence: The workflow invokes `anthropics/claude-code-action@v1`, rather than a reviewed full commit SHA, and passes a repository OAuth secret when configured. At inspection, `v1` resolved through tag object `074f3963a45f3e002e58c97dd0ddf472e0146bf5` to commit `61a9c274fa7110a66dfafc1bbbced03833eb25fe` (tag message identifies v1.0.269). A later tag update can change the executed implementation without a change to this repository. GitHub recommends full commit SHA references to reduce this risk: [secure use of third-party actions](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions).
- Realistic exploitation conditions: An upstream action/ref compromise or malicious replacement must occur, followed by an eligible run of this optional workflow with its credentials configured. No ordinary site visitor or arbitrary text string can move the upstream tag. The configuration risk is proven; a compromise, token leak or unauthorized model run is not.
- Impact: Replacement action code would execute in the credential-bearing CI job and could misuse the credential or the job's available repository capabilities. Exposure is confined to the conditional workflow scenario, rather than the public site's request handling.
- Contrary evidence considered: The action is an established vendor integration, runs only on matching review events, and has authorization controls; the workflow has a 20-minute timeout and limited declared `GITHUB_TOKEN` permissions. These reduce other risks but do not verify the identity of future code behind a movable tag. The action's separately obtained App token also needs its own scope assessment; workflow `permissions` alone do not prove all tokens are read-only.
- Remediation: Pin the reviewed action revision to its full verified upstream commit SHA, retain a version comment, and review future updates explicitly. Apply the same policy to the remaining workflow actions when convenient. Pinning the outer action does not by itself freeze all downloaded tools or eliminate upstream dependency risk.
- Verification: Confirm the pinned SHA belongs to the upstream repository and its reviewed release; inspect a subsequent authorized workflow's action resolution and credential scopes. This audit did not change workflows or trigger a run.

## Dependency advisory assessment

Commands ran in `/private/tmp/portfolio-security-nvonmcj9/dependency-audit/`, containing copies of the project's manifest, workspace configuration and lockfile, using Node 26.13.0 and pnpm 12.9.1:

```sh
pnpm audit --json --registry=https://registry.npmjs.org
pnpm audit --prod --json --registry=https://registry.npmjs.org
```

The first sandboxed lookup was stopped without a result. The permitted network-enabled rerun completed: full audit exited 1 for one moderate advisory; production-only audit exited 0 with no advisories. No `--fix`, installation or dependency update was used. Registry metadata counted 514 total dependencies in the full lookup and 303 in the production-only lookup, including optional/platform packages; these are tool-reported inventory counts, not counts of shipped browser modules.

| Advisory | Project evidence | Applicability and action |
| --- | --- | --- |
| [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249), maintainer advisory retrieved 2026-11-09 | `pnpm-lock.yaml:1828` locks minimatch 10.2.6. The registry reports one advisory across 69 dependency paths through development lint/type tooling; this is not 69 independent vulnerabilities. | The advisory concerns versions ≥7.0.0 and <11.0.1 and requires attacker-supplied glob patterns with `optimizationLevel >= 2`. Installed minimatch defaults to 1. The inspected ESLint/config-array/typescript-estree callers pass ordinary options such as `dot: true`, without enabling level 2; current project config also does not enable it. No production request or browser bundle reaches this matcher. Therefore an exploitable project vulnerability was **not confirmed**, and the registry rating was not copied into an active finding. Track a compatible upstream update; reassess if callers start accepting untrusted glob patterns or enabling aggressive optimization. No denial-of-service payload was run. |

Relevant inspected call sites: `@eslint/config-array`'s `doMatch`, ESLint's `eslint-helpers.js` matcher creation and typescript-estree's default-project matcher; dependency paths anchored in `pnpm-lock.yaml:2926`, `:3322` and `:3791`. An untrusted PR author could already alter executable lint configuration; that is a separate CI code-execution boundary, not proof that the current project exposes this advisory to visitors. CI uses ordinary `pull_request` jobs with read-only declared permissions, bounded timeouts and no project secrets passed to those validation jobs.

## Browser, artifact and data-flow checks

The normal static production build from the preceding web-quality audit was reused. A Git comparison confirmed that application source, dependencies, public assets, scripts, Astro/Wrangler configuration and workflows had not changed since that build's application revision. Builds and server state stayed outside the repository; the source checkout's `dist/` was not rebuilt or used as fresh evidence.

Local server: Wrangler 4.157.0, `--local --ip 127.0.0.1 --port 8879`, with telemetry disabled and log output in the private audit workspace. Browser: Playwright 1.64.1, Chrome for Testing 156.0.8078.4, locale en-US, anonymous clean context. Browser checks ran on 9 November around 09:30 Prague. The server was stopped after checks.

- GET checks covered `/`, `/cs/`, `/work/kultomat/`, `/cs/work/eucal/`, `/privacy/`, an unknown route, CV, favicon, sitemap and robots. Intended content/assets returned 200 and the unknown route returned 404. Requests for environment, Git, package-manifest and source-file paths returned 404 in the isolated server; artifact inventory independently showed that these files were not deployed in `dist/`.
- Sampled responses carried `nosniff`, frame protection, restrictive referrer and permissions policies, same-origin opener policy, and the configured HSTS header. The CSP response header supplies `frame-ancestors 'none'`, `object-src 'none'` and `base-uri 'self'`; generated HTML adds the broader meta policy with self-origin defaults, script/style hashes and `form-action 'none'`. [Cloudflare documents `_headers` for static assets](https://developers.cloudflare.com/workers/static-assets/headers/); the live deployed behavior must still be checked separately.
- On all five representative HTML pages, a harmless dynamically appended script was blocked and a `script-src-elem` violation was recorded; normal page loading produced no preceding JavaScript/console errors or foreign page requests. An attempted local iframe embedding was blocked by `frame-ancestors 'none'`. These are narrow enforcement checks, not exhaustive CSP bypass testing.
- Artifact inspection found no `unsafe-inline`/`unsafe-eval` policy, inline event-handler attributes or dangerous URL schemes. Executable inline scripts after the meta policy matched its hashes. The fixed motion bootstrap in `BaseLayout.astro` appears **before** the generated meta policy on all 13 pages and is not covered by that later meta policy; it contains no visitor-controlled data. No exploitable injection path into that position was found, so this ordering was not presented as an XSS finding. [Astro's CSP configuration reference](https://docs.astro.build/en/reference/configuration-reference/#securitycsp) informed interpretation; emitted artifacts and browser behavior supplied the actual evidence.
- The sole `set:html` use is repository-derived Person JSON-LD in `src/components/landing/PersonSchema.astro:25`; it serializes with `JSON.stringify` and escapes `<`, preventing its data from closing the script element. Other displayed text/attributes use normal Astro expressions. MDX is intentionally executable trusted build input, not a sandbox for arbitrary uploads.
- Current href/src values are repository-owned; contact subjects use `encodeURIComponent`. Client scripts operate fixed DOM selectors and motion/navigation state, without evaluating query strings, fragments or remote content. A harmless query marker did not appear in the returned landing HTML. No visitor-controlled URL was traced to an application fetch, shell command or HTML injection sink.
- No `Set-Cookie`, cookies, local/session storage or IndexedDB entries were observed in the five-page checks. The existing web-quality report supplies additional interaction sampling. Intentional public biography/contact/CV content was not classified as a credential leak; a separate privacy/content review remains distinct from this audit.

## CI permissions and counter-evidence

- All three workflow files were inspected. Validation uses `pull_request`, not `pull_request_target`, with `contents: read`, frozen-lockfile installs and bounded jobs. No PR title/body/comment is interpolated into a shell `run` block. The review workflow references its credential through GitHub secrets rather than committing a value.
- Review action code and documentation were fetched read-only from its upstream repository; no workflow was triggered. An apparent permission discrepancy was traced through the **complete applicable guard sequence**. Isolated fixtures running the original TypeScript with network/API imports stubbed showed that an ordinary read-only user is denied by the permission check and a non-allowlisted bot is denied by the later actor guard before agent preparation. The partial first-guard result was not reported as an authorization bypass. Evidence: upstream `src/entrypoints/run.ts`, `src/modes/tag/index.ts` and `src/github/validation/{permissions,actor}.ts` at commit `61a9c274fa7110a66dfafc1bbbced03833eb25fe`; [upstream security documentation](https://github.com/anthropics/claude-code-action/blob/61a9c274fa7110a66dfafc1bbbced03833eb25fe/docs/security.md).
- The action uses an OIDC-to-App-token exchange when no GitHub token override is supplied. Its inspected `src/github/token.ts` requests repository write capabilities alongside the workflow's additional `actions: read` permission. The workflow's declared read permissions therefore do not establish read-only authority for that separate token. Actual App installation grants and credential status were not inspected; no credential was read or tested. Review-only token restriction is a practical follow-up, not a demonstrated unauthorized-write finding.
- Live GitHub reads confirmed that the repository is public, `main` is protected, and ruleset `protect-main` is active for the default branch. It requires PRs and strict `check`/`playwright` statuses from the GitHub Actions integration, prevents deletion and non-fast-forward updates, and has no configured bypass actors in the returned snapshot. It does not require an approving review; no independent-review requirement was established for this personal project, so that was not promoted to a finding. This snapshot does not verify Cloudflare's deployment permissions or previous CI success.

## Credential scan and limitations

The read-only scanner enumerated locally reachable Git objects with `git rev-list --objects --all` and read blobs through `git cat-file --batch`. It checked recognizable private keys, GitHub tokens, Anthropic/OpenAI token forms, AWS access-key identifiers, Cloudflare global-key assignments and credential-bearing connection URLs. It printed only match locations/types, never token values. No matches or tracked environment/private-key/credential filenames were found. No gitleaks or trufflehog executable was available, and no tool was installed for the audit.

This does not rule out custom-format secrets, secrets embedded in binary content, remote-only history, credentials in external logs/artifacts or secrets that do not match the selected patterns. No live validity check, secret retrieval or rotation was performed.

## Previous findings

There is no previous security report or `SEC-` finding to reconcile. WEB-001 and WEB-002 remain separate accessibility findings in the committed web-quality report. Existing LEG findings concern legal/privacy requirements; this audit does not reclassify or close them.

## Not verified

| Area | Missing evidence | Practical next step |
| --- | --- | --- |
| Production domain, TLS and headers | Local HTTP checks do not prove certificate, HTTPS redirect, HSTS/subdomain compatibility, CDN header delivery or public origin behavior | After domain attachment, check final HTTPS responses, redirects and representative assets/errors; confirm every affected subdomain supports HTTPS before relying on `includeSubDomains`. |
| Cloudflare account and deployment controls | No account role, MFA, build integration, branch-deployment rule, feature-injection or token-scope snapshot | Review account roles/MFA, Worker build/deploy grants and production branch selection; confirm features that inject scripts or cookies match the approved configuration. |
| Actual CI/App secret scopes and logs | Source shows configured inputs and requested scopes, not accepted App grants, OAuth credential status or log contents | Inspect integration permissions and authorized job metadata privately; confirm review-only authority and debug/full-output settings without exposing secrets. Do not trigger a model review merely to obtain evidence. |
| Dependency coverage beyond the advisory service | Audit databases do not cover every defect; action/tool downloads are outside the project lockfile's advisory lookup | Maintain reviewed updates and repeat advisories after changes. Use the exact caller prerequisites when evaluating future alerts. |
| Wider credential exposure | Binary blobs, remote-only history, CI artifacts and external account records were not scanned | Use existing private secret-scanning facilities against the needed history/artifacts; redact outputs and rotate any confirmed exposure. |
| End-to-end hostile PR/prompt handling | No malicious PR, model execution or token exchange was performed | If deeper review is needed, use a separate test repository with synthetic credentials, minimal privileges and explicit authorization. The current isolated guard tests establish only the tested code paths. |
| Other browsers and exhaustive penetration testing | Chromium sample only; no fuzzing, load testing or broad exploit suite | Add narrowly justified tests when a concrete new input boundary or suspected issue appears; no exhaustive security pass is claimed. |

## Repository preservation

Git status was empty before the audit and immediately before writing this report. The final status comparison confirmed that the only repository addition is `docs/audits/2026-11-09/security.md`, with empty staged/unstaged tracked-file diffs and unchanged HEAD; application code, configuration, data, the committed web-quality report and milestone checklists were preserved. All generated checks and browser/server artifacts stayed in disposable directories. No commit, push or PR was created for this audit.

## Follow-up, 9 November 2026

Added after the audit; the findings above are unchanged.

- **SEC-001: fixed** in PR 39. `.github/workflows/claude.yml` now pins `anthropics/claude-code-action` to commit `61a9c274fa7110a66dfafc1bbbced03833eb25fe` with a comment naming v1.0.269. The commit was checked against the upstream tag with `gh api` (tag `v1` and `v1.0.269` point to it). The other workflow actions are unchanged; pinning them is a possible later hardening step.
