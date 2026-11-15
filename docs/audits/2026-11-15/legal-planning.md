# Legal planning: server-side visit statistics for david-krapka.eu

- Mode: **Planning**, reviewed on **15 November 2026**. Scope: one material change in data use, nothing else. The site's traffic would be counted server-side from Cloudflare's own request data. David's monitoring tool, Systerna, would read daily totals through Cloudflare's GraphQL Analytics API. No script, beacon, cookie or browser storage is added to the site.
- Audited project commit: `3d5fe12cf04b635bb0a209d52087ac8934db2283`; working tree clean before this report.
- Toolkit commit: `e6e2d044395514bae596c4d1c152a02ef66d03c2`; working tree clean. Skill physical path: `/Users/davidkrapka/dev/tools/ai-audit-toolkit/skills/audit-legal-readiness`; grandparent verified as the toolkit checkout.
- Model and reasoning: **Opus 5.5, High**, as reported by David in this session. He raised the effort from Low to Medium and then to High before the review started. The agent did not independently verify the setting.
- Previous reviews: [legal planning, 4 November](../2026-11-04/legal-planning.md) and [legal readiness, 9 November](../2026-11-09/legal-readiness.md). Continuing IDs LEG-003, LEG-004, LEG-005 and LEG-009 are reused. New IDs start at **LEG-010**.
- Evidence:
  - this repository: `docs/SPEC.md`, `src/content/privacy-notice.ts`, `wrangler.jsonc`, `public/_headers`;
  - Systerna's [ADR 0032 amendment B1](https://github.com/Phunkhouse/systerna/blob/main/docs/decisions/0032-site-analytics-cloudflare-web-analytics.md) (proposed) and its zone traffic feasibility note, read at Systerna commit `a40886c`;
  - Kultomat's decision 0017 (beacon and consent) as context only;
  - primary sources below;
  - a live `curl` of `https://david-krapka.eu/` on 15 November: no `Set-Cookie`, no `cloudflareinsights` script.

  No Cloudflare account, token, dashboard or Systerna database was accessed.

## Outcome

Planning only: nothing here is a current violation, and fulfillment is **Not yet assessed** until the change is built.

- **GDPR:** server-side visit statistics can rest on **legitimate interests** (Art 6(1)(f)), as a further purpose compatible with operating the site (Art 6(4)).
  - Cloudflare stays the processor; its DPA covers the logs it makes available to customers.
  - The daily totals Systerna stores are aggregate data, not personal data, as long as they stay totals (Recitals 26 and 162).
- **The privacy notice must change first.** Art 13(3) requires visitors to be told about a new purpose **before** the further processing starts. Today the notice says the opposite: "no … analytics" and "I do not receive, store or analyse these records" (LEG-003).
- **The unique-visitor figure needs a decision (LEG-010).** "Unique visitors (IP)" is a count of distinct IP addresses, computed from information the visitor's device sends. EDPB Guidelines 2/2023 say IP-based tracking can fall within ePrivacy Art 5(3), even when another party instructed the device to send it. If that rule applies, there is no consent exemption for statistics today. A plain count of page requests is much further from that rule. The recommendation is to start with **page requests only**, and to add unique visitors later only with a recorded risk decision, or once the pending EU change to these rules is law.
- **LEG-005 is not affected.** Nothing is stored on or read from devices by the site itself.

| Supported planning risks | Confirmed | Suspected |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 0 | 0 |
| Low | 1 (LEG-010) | 0 |

This is not a statement that the planned processing is legally compliant. It maps the requirements that apply to the planned facts.

## Established facts and assumptions

| Fact | Evidence and strength |
| --- | --- |
| Natural-person operator in Czechia; portfolio for job search; Czech/EU audience | Prior reviews (operator statements, SPEC). Unchanged. |
| Site is static Astro on Cloudflare Workers static assets, proxied zone `david-krapka.eu` | `wrangler.jsonc`; SPEC; Systerna B1. Observed. |
| The site sets no cookie and loads no analytics script | Live `curl`, 15 Nov: no `Set-Cookie`, no beacon. LEG-005 tests in `tests/e2e/`. Observed. |
| Cloudflare already records each request it serves: IP address, time, path, status, content type and user agent. It computes zone analytics (requests, `pageViews`, `uniq.uniques`) for every zone, whether or not the customer reads them | Notice section "When you visit"; Cloudflare DPA Annex 1 "Customer Logs" (S06); Systerna's zone traffic note. The analytics computation is Cloudflare's product behaviour, documented by Cloudflare, not observed by the agent. |
| **Planned:** Systerna reads, a few times a day, two daily figures for the zone: "Page requests" (successful HTML GET responses, or Cloudflare's `pageViews`) and "Unique visitors (IP)" (`uniq.uniques`). It stores **only the date and the counts**: no IP, user agent, path, country or referrer | Systerna ADR 0032 B1, points 2, 5 and 6 (proposed, not accepted). |
| Systerna uses a read-only Cloudflare token (Account Analytics: Read, possibly Zone Analytics: Read for this zone) | B1 condition B-O1. Token scope is decided after the probes. |
| The probes confirmed that the figures can be read | **Operator statement**, 15 November. Systerna's note still shows Z1–Z7 as "pending". The results are not yet recorded there. |
| Systerna is David's own tool. Only David sees the figures | **Assumption**, not confirmed by David in this review. Systerna has sharing features (`docs/research/project-shares.md`); whether this site's figures would be shared is unknown. |
| Systerna runs on Vercel Hobby and Neon Free (Systerna ADR 0011); Neon region not recorded | Systerna docs. Relevant only if the stored data were personal data (see LEG-011). |

## Primary-source register

All retrievals on **15 November 2026**. EUR-Lex was "temporarily not fully available" that day, so the EU texts were read from the Publications Office's official CELEX resources. Source IDs are local to this review.

| ID | Issuer and type; provisions read | Version and dates | Source and limits |
| --- | --- | --- | --- |
| S01 | EU legislature; GDPR, binding. Recitals 26, 162; Arts 5(1)(b)–(c), 6(1)(f), 6(4), 11, 13(1)(c)–(d), 13(3), 21(1), 89(1) | Regulation (EU) 2016/679, OJ L 119, 4.5.2016. In force 24 May 2016; applies from 25 May 2018. | [Publications Office, CELEX 32016R0679](https://publications.europa.eu/resource/celex/32016R0679), the OJ text. Arts 28 and 30 rely on the 9 November reading (P01 there). |
| S02 | EU legislature; ePrivacy Directive Art 5(3), binding on Member States, as amended by 2009/136/EC; Recital 66 of 2009/136/EC | Consolidated 19.12.2009 (documentation tool, not legally binding); amending directive OJ L 337, 18.12.2009 | [CELEX 02002L0058-20091219](https://publications.europa.eu/resource/celex/02002L0058-20091219); [CELEX 32009L0136](https://publications.europa.eu/resource/celex/32009L0136). Wording matches across both. |
| S03 | Czech legislature; Act 127/2005 Sb., **§ 89(3)**, binding | e-Sbírka informative consolidation "aktuální znění od 1. 11. 2026"; published 31 March 2005; effective 1 May 2005 | [e-Sbírka](https://e-sbirka.gov.cz/sb/2005/127?zalozka=text), § 89 read in full. No unprocessed-amendment warning was shown this time, so the **Not verified** status from 9 November (P08 there) is resolved for § 89(3). |
| S04 | EDPB; Guidelines 2/2023 on Technical Scope of Art. 5(3) ePD, **guidance, not law**. Paras 27–35, 42–43, 54–56 and footnote 28 | Version 2.0, adopted 7 October 2024 | [EDPB PDF](https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf), text extracted and read. |
| S05 | ÚOOÚ; cookie FAQ, **authority guidance** | Revision date not shown | [uoou.gov.cz](https://uoou.gov.cz/verejnost/qa-otazky-a-odpovedi/cookies). Says analytics and marketing cookies need prior consent; covers "technologie podobné cookies" and fingerprinting. **Says nothing about server logs, server-side measurement or IP addresses.** |
| S06 | Cloudflare; Data Processing Addendum, **contract**: §§2.1, 3.1(a); Annex 1 (categories, nature, purpose, retention; definition of "Customer Logs") | Version 6.4, effective 3 April 2026. Account acceptance date: recorded privately under LEG-004 (not inspected) | [cloudflare.com](https://www.cloudflare.com/cloudflare-customer-dpa/). "Customer Logs" means logs of End Users' interactions "made available to Customer via the Service dashboard or other online interface". Purpose: "Processing necessary to provide the Services to Customer in accordance with the documented instructions". |
| S07 | EU co-legislators; "Digital Omnibus" proposal amending the device-access rules, **not enacted** | Commission proposal of November 2025. A Council negotiating mandate of 21 October 2026 (ST 14756/26) is **reported** by secondary sources, which disagree on where the rule sits (new GDPR Art 88a or a rewritten ePD Art 5(3)) | **Not verified**: only secondary sources were found. Reported to include a consent exemption for first-party aggregated audience measurement. Cannot be applied as law today. A revisit trigger only. |

## Applicability and decisions

| Question | Applicability | Verification | Reasoning |
| --- | --- | --- | --- |
| GDPR applies to Cloudflare's processing of request data for statistics | **Applies** | Not yet assessed | IP addresses with request data are personal data in Cloudflare's hands. Statistics is a new purpose David decides, so David is the controller of that purpose (S01 Art 4(7), as in the prior reviews). |
| Legal basis for the statistics purpose | **Applies**: Art 6(1)(f) | Not yet assessed | Legitimate interest: knowing whether the portfolio is visited. Necessity: daily totals are the least that answers it. Balancing: visitors expect a host to keep request records. David never receives an identifier. There are no consequences for any person and no profiling (Recital 162: results "not used in support of measures or decisions regarding any particular natural person"). Art 6(4) compatibility with operating the site: (a) close link; (b) same hosting context; (c) no special categories; (d) no consequences; (e) aggregation before David sees anything. Art 5(1)(b)'s statistical-purposes presumption is **not** relied on: whether a website traffic count is "statistical purposes" under Art 89 is open, and the conclusion stands without it. |
| Daily totals in Systerna are personal data | **Does not apply** while they stay totals | — | Recital 26: anonymous information is outside the GDPR; Recital 162: statistical results are "aggregate data". Two numbers per day, with no breakdown, do not allow singling out. A breakdown by path, country, browser or hour on a low-traffic site could make small counts relatable to a person who knows they visited. **That needs a new check (LEG-011).** |
| Cloudflare's role | **Applies**: processor for this purpose | Supported by contract text (S06) | Zone analytics are logs and statistics Cloudflare makes available through its dashboard and API: "Customer Logs" in Annex 1, processed to provide the Services. Cloudflare's own controller purposes (network security) are unchanged and already disclosed. |
| Transparency before the new purpose starts | **Applies**: Art 13(1)(c)–(d), 13(3) | **Planning conflict** | The notice states no analytics and no reading of the records. It must change before Systerna's first read (LEG-003). |
| Rights | **Applies**: Arts 11, 21 | Not yet assessed | David cannot identify a visitor in daily totals and holds no identifier. Art 11(2): inform visitors where possible, which the notice already does in "How to use your rights". The objection right (Art 21) is stated; in practice it is met by not holding any identifier. |
| Record of processing | **Applies**: Art 30 (non-occasional processing; prior reviews) | Not yet assessed | Add the statistics purpose to the private record (LEG-009). |
| ePrivacy Art 5(3) / Czech § 89(3) for **page requests** | **Undetermined**, low risk | Needs interpretation | Counting successful page responses uses only the fact that a requested page was delivered. No identifier from the device is used to tell visitors apart. The site sends no instruction beyond the page itself. EDPB paras 42–43 tie the risk to "relying on those mechanisms to collect information (for example in the context of fingerprinting or the tracking of resource identifiers)", which this does not do. |
| ePrivacy Art 5(3) / Czech § 89(3) for **unique visitors (IP)** | **Undetermined** | Needs interpretation | See LEG-010. |
| LEG-005 (nothing stored on devices, no banner) | **Applies**, unchanged | Supported today (live `curl`, e2e tests) | No storage or script is added. The ePrivacy question in LEG-010 is about reading data the device sends, not about storage. |
| International transfer | **Applies** to Cloudflare as before | Supported by contract (S06), as in prior reviews | No new transfer of personal data. Systerna's hosts receive only aggregates; transfer rules do not apply to anonymous data. |
| SPEC: "choose a cookieless, EU-hosted option" | Project rule, not law | — | No new supplier is added: Cloudflare is already the host and processor. The EU-hosting wish cannot be met by Cloudflare, but this adds no recipient. Promote this as an explicit SPEC change; don't leave the two in conflict. |

## Requirements

| ID | Planned facts | Sources | Requirement or decision | Acceptance check | Unresolved | Re-review trigger |
| --- | --- | --- | --- | --- | --- | --- |
| LEG-003 (continuing; statutory) | Notice says no analytics and that David does not receive or analyse the request records | S01 Arts 13(1)(c)–(d), 13(3), 21 | Update the notice in **both languages before Systerna first reads the zone figures**. It must say: <br>• Cloudflare counts visits from its request records; <br>• David receives only daily totals (and which ones); <br>• the purpose (knowing whether and how much the site is visited) and the legal basis (legitimate interests); <br>• that nothing is stored on the device and no tracking script runs; <br>• that he cannot identify a visitor from the totals. <br>Remove "no analytics" from the intro and the page description. Update the date. Draft wording below. | The published notice (EN and CS) states the above; its "updated" date precedes the first stored zone figure in Systerna | Which figures are read (LEG-010) changes one sentence | A new figure, any breakdown, or sharing of the figures |
| LEG-004 (continuing; contractual) | Cloudflare processes the logs and computes zone analytics | S06 §3.1(a), Annex 1 | No new agreement is needed. Give the API token only the read permission the probes showed is enough, and never a write permission. Keep Workers observability and logs off and Web Analytics' automatic beacon setup off, as before. | Systerna records the token's permissions. `curl` of production shows no `cloudflareinsights` script. `wrangler.jsonc` has no `observability` block | Exact permission (B-O1) | Cloudflare DPA or Self-Serve terms change; any Cloudflare analytics feature turned on |
| LEG-005 (continuing; statutory basis for no banner) | Unchanged | S02, S03, S05 | Keep it as is. This change must add no script, beacon, cookie or storage. | Existing e2e checks (no storage, no foreign request) keep passing | — | Any client-side measurement |
| LEG-009 (continuing; statutory) | Private record of processing exists (completed after 9 November) | S01 Art 30 | Add an entry: "Visit statistics". It covers: <br>• data used by Cloudflare: IP address, time, path, status, content type, user agent; <br>• output: daily totals only, kept in Systerna; <br>• legal basis: 6(1)(f); <br>• processor: Cloudflare; <br>• retention: Cloudflare's own for the raw data, as long as useful for the totals; <br>• no transfer of personal data beyond Cloudflare's. | A dated private record entry exists | — | As LEG-003 |
| **LEG-010** (new; planning risk, see finding) | Systerna would show "Unique visitors (IP)" from `uniq.uniques` | S02, S03, S04 paras 42–43, 54–56; S05; S07 | **Owner decision before B1 is accepted:** <br>(a) **recommended:** page requests only for now; <br>(b) page requests and unique visitors, with a decision record accepting the interpretation risk below. <br>Revisit when S07 becomes law. | The decision is recorded in this repository's decision record and reflected in Systerna's B1 (fields read and shown) | The ePrivacy classification itself | S07 enacted; ÚOOÚ or EDPB guidance on server-side measurement; a ruling on IP-based measurement |
| **LEG-011** (new; statutory, data minimisation) | Systerna stores date and counts only | S01 Art 5(1)(c), Recitals 26, 162 | Keep the zone figures as **daily site-wide totals**. Do not store or show IPs, user agents, or per-path, per-country, per-referrer or per-hour counts unless this is reviewed again. | Systerna's zone-traffic table holds only site, date, counts and sampling metadata | Whether per-page counts will be wanted later | Any breakdown, a shorter interval, or sharing |

### LEG-010: The unique-visitor count may be within ePrivacy Art 5(3)

- Severity: Low (planning risk)
- Confidence: Medium
- Status: Confirmed (the facts and the guidance are established; the legal classification is not)
- Location: planned Systerna B1 point 2, "Unique visitors (IP)"; this repository's privacy notice once it describes the figure.
- Evidence:
  - **The rule.** Art 5(3) (S02) and § 89(3) (S03) require prior consent to "gaining of access to information already stored" in the terminal equipment. They exempt only access "for the sole purpose of carrying out the transmission" or "strictly necessary" for a service the user requested. Neither text has an exemption for audience measurement.
  - **The EDPB reading** (S04):
    - The IP address can be such information, and the receiving entity need not be the one that instructed the device (paras 42, 54).
    - Collecting IP addresses "to track the navigation of the user" can fall within Art 5(3). This is independent of the IP's use for transmission (footnote 28).
    - Unless the IP address does not come from the user's device (for example behind carrier-grade NAT), "it has to take all the steps pursuant to the Article 5(3) ePD" (para 55).
  - **The ÚOOÚ position** (S05): analytics need prior consent. It names cookies, similar technologies and fingerprinting, but does not address server logs.
- Competing readings:
  1. **Outside Art 5(3), or within the transmission exemption.** The IP address arrives because the visitor's browser requested the page, which is the communication itself. The site instructs nothing further. Cloudflare counts distinct addresses per day from records it keeps anyway. Nothing tracks a visitor's navigation, and David receives one number. The Czech text speaks of data "uložené v koncových zařízeních" (stored in the terminal equipment), which an IP address arguably is not.
  2. **Within Art 5(3).** Under the EDPB reading, using the IP address to tell devices apart is a secondary use of information from the device that is not needed for transmission. If so, no exemption applies and consent would be needed, which the site cannot ask for without breaking LEG-005.

  No ruling or Czech guidance on server-side visitor counting was found.
- Impact: if reading 2 prevails, counting unique IPs without consent would breach § 89(3). The practical exposure is low: no identifier reaches David, the count is computed for every Cloudflare zone anyway, and nothing is done to any person. But the site's own promise of no consent banner rests on not doing this kind of thing.
- Remediation: option (a), page requests only. They answer the purpose (is the site visited, is it growing) almost as well on a small site where bots weigh on both figures. That also follows data minimisation (Art 5(1)(c)). Option (b) is defensible only with a written risk acceptance, as Kultomat did provisionally in its decision 0017 before its own review.
- Verification: the decision record names the chosen option. Systerna's B1 reads and shows only the chosen figures. The notice describes only those.

## Draft notice wording (draft, for LEG-003)

*Draft; facts still open: the final list of figures (LEG-010). Option (a) shown.*

- Intro, EN: "This site is a personal portfolio, built to collect as little as possible. It has no forms, accounts, advertising or cookies, it loads no third-party scripts, fonts or embeds, and it counts visits only from its host's records."
- New paragraph in "When you visit the site", EN: "To know whether the site is visited, I read a daily total of the pages Cloudflare delivered, which Cloudflare counts from these records. I receive only that number per day, never your IP address or any other detail of your visit, and I keep the totals in my own monitoring tool. Nothing is stored on your device and no tracking script runs. The legal basis is my legitimate interest in knowing whether my portfolio is read (Article 6(1)(f) GDPR)."
- Replace "I do not receive, store or analyse these records, and I cannot identify individual visitors from them. The site has no logging or analytics of its own." with "I do not receive or store these records themselves, and I cannot identify individual visitors from the totals. The site has no logging or analytics of its own."
- Czech text to match. The page description must drop "No cookies or analytics".

## Coverage and limits

- **In scope:** GDPR basis, roles, transparency, record, minimisation; ePrivacy/§ 89(3) applicability; supplier contract coverage; the project's own LEG-005.
- **Not covered:**
  - Cloudflare's actual retention of raw request data. Its policy gives no fixed period (9 November review).
  - Systerna's own security and hosting terms: it holds no personal data under LEG-011.
  - Any breakdown beyond daily totals.
  - Other EU countries' implementations of Art 5(3).
- **Not verified:** S07's text and status (secondary sources only); the probe results (operator statement only); whether the figures will be shared from Systerna.

## Reconciled prior items

| ID | Previous status | Now |
| --- | --- | --- |
| LEG-003 | Supported after the Swiss-transfer fix | Still supported for today's processing. **Must change** before the new purpose (requirement above). |
| LEG-004 | Private record completed after 9 Nov (MILESTONES) | Not re-inspected. No new agreement needed. |
| LEG-005 | Supported | Supported (live `curl`, 15 Nov). Unaffected. |
| LEG-009 | Completed after 9 Nov (MILESTONES) | Needs one new entry. |
| P08 (9 Nov source note on § 89(3)) | Not verified | Resolved: the current text was read (S03). |
