# 0012. Skip written permission requests for case study projects

Date: 2026-11-05  
Status: accepted

## Context

The [legal planning audit](../audits/2026-11-04/legal-planning.md) recommended (LEG-006) a written OK per project for names, logos, screenshots and quotes, an OK from every identifiable person shown (Civil Code § 84–85), and asking named collaborators before naming them, with the date and form of each OK recorded in the project card. The reasons: a person's likeness and name need consent, screenshots reproduce other people's designs, photos and texts, and collaborators' names are personal data published on a public site.

David stated on 5 November 2026 that the clients and people involved in the projects he will feature (Kultomat, Eucal, Vladan Vaněk, UpVideo) are all his relatives or friends, and that he does not want to ask them.

## Decision

- No permission requests are sent for the case study projects, and no per-project Permissions entry is required in the project cards. This decision is the record.
- The milestone 5 acceptance check on permissions is met by this decision, not by per-project entries.
- Applies to the four projects named above, with the people known to David today. It is not a general waiver.

## Alternatives considered

- **A short informal message per person, recorded as date and form** (the audit's recommendation, with the effort lowered). Cheap and the strongest evidence if anyone objects. David chose not to.
- **Crop or blur every identifiable person and leave out collaborators' names.** Removes the likeness and collaborator-data questions without asking anyone, but not the client or copyright questions, and it weakens the case studies, which must state who worked on what.

## Consequences

- This is an accepted risk owned by David, not a legal conclusion. The audit does not clear it, and this is not legal advice. Consent can be given informally or tacitly, but without a record a dispute is harder to settle, and the repository is public, so published images and names are hard to retract.
- Even between friends, anyone can later ask to have their name, likeness or work removed. If that happens, remove it promptly (the case study text, the images and the committed files; Git history stays public).
- Screenshots may still contain third-party content: other people's photos, texts or designs. Prefer cropping or choosing screens without them.
- The Pre-launch legal audit in milestone 6 should list LEG-006 as an accepted risk under this decision.
- Revisit before publishing any project for a client or person who is not a relative or friend, before showing a stranger identifiably, before quoting someone who has not seen the quote, if the IČO is active and the work is commissioned work (copyright in client deliverables, which the audit did not retrieve), and whenever anyone raises an objection.
