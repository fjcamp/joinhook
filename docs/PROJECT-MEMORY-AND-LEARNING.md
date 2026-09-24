# Project Memory, Evidence & Learning Protocol

**Status:** ACTIVE  
**Owner:** JoinHook  
**Canonical transversal memory:** `fjcamp/reporting`

## Purpose

This repository is an operational source for its own code, decisions, checkpoints and evidence. Reusable learning is also published to Reporting so JoinHook can accumulate knowledge across projects and future AI agents.

## Mandatory logic

```
OBSERVE → CAPTURE → VERIFY → CLASSIFY → ACT → RE-VERIFY → CHECKPOINT → LEARN → UPDATE
```

Apply this lifecycle to meaningful engineering, deployment, operational and incident work.

## Source-of-truth rule

- This repository remains the **primary source** for its own code, Git history, local checkpoints and project-specific evidence.
- `fjcamp/reporting` is the **transversal memory and learning system**, not a replacement for this repository.
- Reporting receives the relevant checkpoint, backup/chat record, evidence and reusable learning needed for cross-project continuity.

## Evidence rules

- **NO EVIDENCE = NO CLAIM.**
- Do not mark production, deployment, tests, security or functionality as VERIFIED without current evidence.
- Distinguish `OBSERVED`, `INFERRED`, `PROPOSED` and `UNRESOLVED`.
- Never promote an inference to a fact without new evidence.
- Preserve failures and corrections; they are learning assets, not disposable noise.

## Closure

For work that produces a reusable lesson:

**NO LEARNING = NO CLOSURE.**

A completed task should leave enough information for another engineer or AI agent to understand what happened, what proved it, what changed, and what should be repeated or avoided.

## Checkpoint + Reporting handoff

For significant work, preserve in this repository:

1. checkpoint with exact date, branch/HEAD, objective, changes, verification, blockers and next action;
2. chat/AI handoff when the interaction contains material decisions or context;
3. relevant evidence;
4. reusable learning when applicable.

Then publish the relevant copies/evidence/learning to `fjcamp/reporting`.

## Instructions for future AI agents

Before changing this repository:

1. Read this protocol.
2. Read the latest project checkpoint and relevant handoff.
3. Inspect the current Git state/HEAD.
4. Verify current CI/tests/deployment evidence before relying on historical claims.
5. Continue from the highest-impact **verified** next action.
6. Preserve known failures and blockers.
7. After material changes, re-run the real verification gate.
8. Create/update the project checkpoint.
9. Send the relevant checkpoint/evidence/learning to Reporting.
10. Never claim a stronger state than the evidence supports.

### Required questions

- What happened?
- What proves it?
- What did we learn?
- What should we repeat?
- What must we avoid?

## Relationship

```
PROJECT REPOSITORY
  ├─ code / Git history
  ├─ project checkpoint
  ├─ project evidence
  └─ project-specific backups/handoffs
             │
             ├── relevant evidence / copies / learning
             ▼
       fjcamp/reporting
             │
             ├─ transversal memory
             ├─ cross-project evidence
             ├─ reusable lessons
             └─ procedures / standards
```

This protocol is part of the project's operating discipline and must be respected by human contributors and AI agents.
