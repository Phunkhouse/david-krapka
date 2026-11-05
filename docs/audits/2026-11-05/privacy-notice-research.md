# Privacy notice research (milestone 6, PR D)

Date: 5 November 2026. Purpose: close the “Not verified” rows of the [legal planning audit](../2026-11-04/legal-planning.md#not-verified) that block the privacy notice (LEG-003). Not legal advice. Sources were read on cloudflare.com and developers.cloudflare.com on the date above; Cloudflare may change them, so re-read before launch (PR F).

## Findings

| Question | Answer | Source |
| --- | --- | --- |
| Who is controller and who is processor for visitors of David's site? | David is the controller. Cloudflare is the processor under its Customer DPA (version 6.4, effective 3 April 2026), which forms part of the Self-Serve Subscription Agreement and prevails on personal data (§ 2.3, § 9.1). | [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| Does Cloudflare also act as an independent controller? | Its privacy policy says it is the controller for personal information collected from the data subject categories it lists, including network data used “to identify, analyze, mitigate, prevent, and block malicious activities”, and a processor for content customers and end users provide. It also says it has “no direct relationship with End Users”. The DPA names no independent-controller carve-out. The notice therefore says Cloudflare processes for David and, per its own policy, is controller for some data it collects to run its network. | [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) (effective 4 November 2025), § 2, § 3, § 6, § 8 |
| What data does Cloudflare receive per visit? | IP addresses, traffic routing data and similar network data; the policy does not list the user agent by name, but a browser sends it with every request, so the notice mentions it. | Privacy Policy § 2 |
| How long does Cloudflare keep it for this setup? | **Not published** for End User data. The policy says only “a period of time that is consistent with the business purposes” (§ 11). A 2013 Cloudflare blog post says standard access logs were discarded within 4 hours; it is old and does not mention Workers, so it is not cited in the notice. The Workers docs for static assets say nothing about request logs. The notice states that Cloudflare controls retention and gives no fixed period. | Privacy Policy § 11; [What Cloudflare logs](https://blog.cloudflare.com/what-cloudflare-logs/); [static assets billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) |
| Does David's side keep any visitor logs? | No. A static-assets-only Worker offers no Workers Logs, Logpush or Tail Workers (checked in the dashboard on 5 November 2026, LEG-004), and `wrangler.jsonc` has no `observability` block. | Dashboard check; [milestone 6 checklist A4](../../milestone-6-checklist.md) |
| Transfers outside the EEA | EU–US Data Privacy Framework, with EU SCCs as fallback in the privacy policy (§ 7). The DPA applies EU SCCs Module Two or Three (§ 6.2(a)), treats transfers under the DPF as not restricted, and deems them restricted if the certification lapses (§ 6.4). | Privacy Policy § 7; DPA § 6 |
| Sub-processors | General written authorisation; list published at cloudflare.com/gdpr/subprocessors/ with 30 days' notice of additions; objection within ten days (§ 4.3–4.4). The list's contents were not retrieved. | DPA § 4 |
| Regulator | Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7; web uoou.gov.cz (address from the office's own documents; confirm in a browser before launch). | uoou.gov.cz documents (search results) |

## Decisions made in the draft (David to confirm)

- **Email retention:** conversations are kept while useful and deleted twelve months after the last message. This period is a proposal, not a fact David supplied.
- **Email providers:** the notice names none; it says “my email hosting provider and the provider of the inbox I read”. Name them if that is preferred (the alias is set up at Active24).
- **Legal basis for messages:** legitimate interest, plus pre-contract steps at the person's request when they ask about a job or project.
- **Case study names and screenshots:** legitimate interest, with a promise to change or remove on request. This matches the accepted risk in [0012](../../decisions/0012-skip-permission-requests-for-case-studies.md) but does not replace it.
- **Controller identity:** name, country and email only. A postal address is not given; add it with the business identification (LEG-002) when the IČO is reactivated.

## Still not verified

- The Self-Serve agreement and DPA versions this account accepted (private record, LEG-004).
- The contents of Cloudflare's sub-processor list.
- Whether a transfer impact assessment is needed (not reviewed; the DPF and SCCs are Cloudflare's mechanisms).
