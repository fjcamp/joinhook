# AI HANDOFF — Sitio corporativo y JoinHook V2

Repository: fjcamp/joinhook
Working branch: main
Audience: ChatGPT, Claude, Codex, Gemini and other authorized AI collaborators.
GitHub is the technical source of truth.

## 1. Purpose
Sitio corporativo y JoinHook V2

## 2. Current state
State: IMPLEMENTED / verification pending
HEAD 802aab49. Redesign CI y Secret History Scan recientes están en verde sobre 022ecba4. Production Artifact #94 fue SUCCESS en la línea documentada.

## 3. Current blocker / next gate
Cerrar staging, gate de publicación y verificación externa antes de promover V2 a joinhook.cl

## 4. Technology and tools
Known stack: Next.js/React + servicios web/Supabase; GitHub Actions

- GitHub: source, branches, commits, CI, issues and checkpoints.
- Notion: operational index, decisions and relationships.
- Google Drive: originals and heavy binary files when applicable.
- ChatGPT/Claude/other AI: analysis, implementation, review and test interpretation.
- GitHub Actions: authoritative CI evidence.

## 5. AI working method
1. Read this file and the newest checkpoint before changing code.
2. Inspect actual branch/HEAD and CI; never trust memory over GitHub.
3. Define the change and its verification criteria.
4. Implement the smallest coherent change.
5. Run tests/typecheck/build or the closest available gate.
6. If CI fails, capture run, job, step, root cause and correction before proceeding.
7. Update the checkpoint with evidence.
8. Never mark VERIFIED or PRODUCTION READY without executable evidence.
9. Never place secrets, tokens, passwords or private authorization codes in documentation.
10. Leave the repository reproducible for the next AI.

## 6. Evidence states
DESIGNED / IMPLEMENTED / VERIFIED / BETA / PRODUCTION / BLOCKED / PENDING VERIFICATION

NO EVIDENCE = NO CLAIM.

## 7. Handoff contract
Every meaningful iteration leaves: change → test → CI → evidence → checkpoint → next action.

## 8. User-learning gate
Before end-user exposure, demonstrate the relevant workflow end-to-end with one success case and one controlled negative case. Record persistence, permissions, state transitions, errors, recovery, auditability, and UI behavior when applicable.

## 9. Current checkpoint
See docs/checkpoints/2026-09-22-ai-continuity-baseline.md.