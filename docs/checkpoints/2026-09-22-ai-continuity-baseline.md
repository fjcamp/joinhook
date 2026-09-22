# Checkpoint — AI Continuity Baseline — 2026-09-22

Repository: fjcamp/joinhook
Working branch: main
Project role: Sitio corporativo y JoinHook V2
Current state: IMPLEMENTED / verification pending
Baseline evidence: HEAD 802aab49. Redesign CI y Secret History Scan recientes están en verde sobre 022ecba4. Production Artifact #94 fue SUCCESS en la línea documentada.
Current blocker: Cerrar staging, gate de publicación y verificación externa antes de promover V2 a joinhook.cl

## Multi-AI continuity protocol
This repository can be worked on by multiple AI systems without depending on one chat history.

Required order:
1. Read docs/AI_HANDOFF.md.
2. Read the newest checkpoint.
3. Inspect current branch/HEAD and CI.
4. Define a measurable change.
5. Implement and test.
6. Capture CI evidence.
7. Update/create the next checkpoint.

## Functional learning gate
Before user exposure, run a reproducible demonstration from input to observable outcome, including success and negative scenarios.

Where applicable verify:
- persistence
- permissions
- state transitions
- error handling
- recovery
- auditability
- desktop/mobile behavior
- integration boundaries

## Completion rule
DESIGNED → IMPLEMENTED → VERIFIED → BETA → PRODUCTION

Do not advance a state without evidence.

## Open work
NaN

## Integrity
NO EVIDENCE = NO CLAIM.