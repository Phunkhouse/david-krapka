# 0014. Count page requests server-side, without a script or unique visitors

Date: 2026-11-15  
Status: accepted (David, 15 November 2026)

## Context

David wants to know whether the portfolio is visited, and to follow it in his monitoring tool, Systerna, next to Kultomat. The site promises to store nothing on visitors' devices and to load no third-party scripts ([LEG-005](../SPEC.md#legal-requirements)). That promise is why it has no cookie banner.

Cloudflare Web Analytics, which Kultomat uses, runs a script in the browser. Kultomat found it needs prior consent (its decision 0017, amended 8 November 2026). Here that would break LEG-005 and need a consent prompt.

The site is already served by Cloudflare, which records every request it delivers and computes traffic figures for every zone. Systerna's probes (its ADR 0032, proposed amendment B1) showed these figures can be read with a read-only token.

The [legal planning review of 15 November](../audits/2026-11-15/legal-planning.md) found:

- **Legal basis:** legitimate interest (Art 6(1)(f) GDPR) covers server-side statistics, as a use compatible with running the site.
- **The privacy notice must change first** (LEG-003).
- **Systerna holds no personal data** while it keeps daily site-wide totals only (LEG-011).
- **Unique visitors carry an ePrivacy risk.** A count of distinct IP addresses ("Unique visitors (IP)") may fall under the ePrivacy consent rule (Art 5(3) of the ePrivacy Directive and § 89(3) of the Czech Electronic Communications Act) on the EDPB's reading. There is no exemption for statistics today (LEG-010).

## Decision

- **One figure: page requests per day,** counted by Cloudflare from the requests it served. Systerna stores only the site, the date and the count.
- **No unique-visitor figure** (LEG-010, option a). Nothing that tells visitors apart is read.
- **No breakdown** by path, country, browser, referrer or hour, and no IP addresses or user agents leave Cloudflare (LEG-011).
- **Nothing changes on the site itself:** no script, beacon, cookie or storage. LEG-005 stays as it is, and Web Analytics' automatic beacon setup stays off.
- **The privacy notice says so** in both languages, and is published before Systerna stores the first figure (LEG-003). The private record of processing gains a "Visit statistics" entry (LEG-009).
- **Systerna's side** (reading the figure, the token's permission, the card) is decided in Systerna's ADR 0032 amendment B1, which must follow this record: page requests only.

## Alternatives considered

- **Cloudflare Web Analytics with a consent prompt**, as in Kultomat:
  - for: visits and load times, and the same figures as Kultomat in Systerna;
  - against: breaks LEG-005, adds the site's first third-party script and a prompt, and counts only visitors who accept.
- **Page requests and unique visitors:**
  - for: closer to the beacon's figures;
  - against: an open ePrivacy question for little extra insight on a small site, where bots weigh on both figures.
- **A Worker in front of the static files writing to Workers Analytics Engine:** own code to run, with no gain over Cloudflare's own counts.
- **No statistics:** keeps today's state, but David cannot tell whether the site is read.

## Consequences

- **The figure is rough.** It counts bots and crawlers, has no visits and no load time, and is not comparable with Kultomat's beacon figures. Systerna labels it "Page requests" and "Includes bots".
- **The notice no longer says "no analytics"**, and the SPEC's "no analytics" line changes. The site still has no tracking script and no banner.
- **Revisit:**
  - when the EU's planned exemption for first-party aggregated audience measurement becomes law;
  - if the ÚOOÚ or the EDPB publishes guidance on server-side counting;
  - if a breakdown or the unique-visitor figure is wanted;
  - if the figures are shared from Systerna beyond David.
