# 0002. Budget-conscious CI

Date: 2026-11-04  
Status: accepted

## Context

The starter pack offers two CI strategies ([CI strategy recipe](https://github.com/Phunkhouse/ai-starter-pack/blob/main/recipes/ci-strategy/README.md)). Both require the same checks to pass before merge. Standard runs cloud CI on every PR update, including drafts; Budget-conscious keeps agent PRs in draft and defers cloud jobs until David authorises review. David chose Budget-conscious.

## Decision

- Use GitHub Actions with the pack's `budget-ci.yml` (required check `check`: format, lint, typecheck, tests if present, build) and, once Playwright exists, `budget-e2e.yml` (required result `playwright`).
- Agents open draft PRs, run checks locally and ask David before marking a PR ready.
- Record `CI strategy: Budget-conscious` in `AGENTS.md` in the same change that adds the workflows.
- Protect `main` with a ruleset requiring both checks from GitHub Actions and an up-to-date branch.

## Alternatives considered

- **Standard CI.** Simpler feedback on drafts, but runs cloud jobs on every push. Not chosen by David.

## Consequences

- Draft PRs show a deliberately red `check`. This is expected and never turned into a passing no-op.
- Feedback from Linux CI arrives later, so local `pnpm verify` must be run before asking for review.
- Vercel preview builds still run on every push (on Vercel, not GitHub Actions). If they become a cost or noise problem, add an ignore rule for draft branches.
- The repository is public, so Actions minutes on standard runners and rulesets are available without a paid plan; the strategy mainly reduces noise and queue time. Revisit if the repository becomes private.
