# 0015. Standard CI

Date: 2026-11-19  
Status: accepted (David, 19 November 2026)  
Supersedes: [0002](0002-budget-conscious-ci.md)

## Context

[0002](0002-budget-conscious-ci.md) chose Budget-conscious CI: agents open draft PRs, cloud jobs skip drafts, and David's permission is needed to mark a PR ready. The repository is public, so standard GitHub-hosted runner minutes are free, and a ready run takes about 2.6 minutes ([test/CI audit](../audits/2026-11-19/test-ci.md)). The draft step added a permission round trip to every PR without saving money. David said on 19 November 2026 that the project does not operate on a budget and PRs do not need to be drafts.

## Decision

- Use the starter pack's Standard strategy ([CI strategy recipe](https://github.com/Phunkhouse/ai-starter-pack/blob/main/recipes/ci-strategy/README.md)): `check` and `playwright` run on every PR update (`opened`, `synchronize`, `reopened`), drafts included.
- Agents open PRs as ready for review. A draft is still allowed when David asks for one, and it runs CI like any other PR.
- Required checks, the `protect-main` ruleset (both checks, up-to-date branch) and the `playwright` gate job are unchanged. Merging stays David's call.

## Alternatives considered

- **Keep the draft skip and stop opening drafts.** Agents would mostly avoid the skip, but CI behaviour would depend on how a PR was opened, and the docs would keep describing a policy nobody uses.

## Consequences

- Every push to a PR runs both workflows: about 1 runner-minute for `check` and 2.5 for E2E, free on a public repository.
- Marking a draft ready no longer starts a new run; it was already validated.
- The draft-skip concurrency race noted in the audit goes away, because no run skips.
- Revisit if the repository becomes private (runner minutes become billed and runners drop to 2 vCPU) or if CI noise becomes a problem.
