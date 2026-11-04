# Audit: Notion ↔ Índice HTML ↔ PWA móvil

- Fecha: 2026-11-04
- Estado: PWA SHELL IMPLEMENTED / PENDING VERIFICATION; NOTION SYNC BLOCKED ON INTEGRATION CONFIGURATION
- Repositorio: fjcamp/joinhook
- Rama: feature/notion-index-pwa-review-2026-11-04
- Base: main @ 26ce25947e261a2eedf3e18c006510d4ea292804
- Notion record: https://app.notion.com/p/40eb7fe8cfac81e693dacd05d05674a2

## Executive result

The generated standalone HTML prototype is not connected to Notion. It embeds a static snapshot and has no Notion API client, sync endpoint, content version exchange, or durable update mechanism from Notion. Its `navigator.onLine` indicator only reports network connectivity and must not be interpreted as a successful sync.

A dedicated static PWA shell has now been added to this feature branch under `public/informe/`. It is an isolated offline-capable shell, not a Notion-connected release and not yet deployed.

## Existing repository findings

The JoinHook repository already contains separate PWA implementations:
- JoinHook Local: `/local`, `public/local.webmanifest`, `public/local-sw.js`.
- Its client registers the worker with scope `/`; it is unrelated to the report and must not be reused for the new app.
- The Local manifest has no app icon entries and is not a suitable installation template without additional work.
- EGO has a separate PWA under `/app/`, also unrelated.
- No Notion sync endpoint was found in the inspected API routes.
- No Notion integration environment variables were found in the inspected repository metadata.

## Changes committed on the feature branch

- `public/informe/index.html`: responsive 15-part / 68-chapter index, search, accordions, honest online/offline status, and scoped service-worker registration.
- `public/informe/manifest.webmanifest`: standalone app manifest with explicit `/informe/index.html` start URL and isolated scope.
- `public/informe/sw.js`: offline shell cache and network-first navigation fallback restricted to `/informe/`.
- `public/informe/icon.svg`: app icon.
- `docs/pwa/NOTION-INDEX-PWA-AUDIT-2026-11-04.md`: audit and implementation gates.

The service worker uses a dedicated cache namespace and route scope. It does not intentionally intercept unrelated JoinHook routes.

## CI evidence

- Draft PR: https://github.com/fjcamp/joinhook/pull/50
- Secret History Scan: SUCCESS.
- Redesign CI run #441: FAILURE, with GitHub reporting zero jobs. This run therefore provides no build, lint, or runtime-smoke-test evidence. Do not classify this change as VERIFIED.
- PR remains draft and unmerged. No production deployment occurred.

## Required Notion synchronization architecture

1. Notion remains the master source.
2. A backend server endpoint reads the authorised Notion index page using the official API.
3. Server-only secrets: `NOTION_API_KEY` and `NOTION_INDEX_PAGE_ID`. Never use `NEXT_PUBLIC_*` for these values and never commit them.
4. The backend recursively reads Notion block children and handles pagination, timeouts and partial failures.
5. The PWA downloads a normalized JSON snapshot and saves it locally only after a complete successful response.
6. On offline/API failure, keep the last known-good snapshot and show the actual last successful sync timestamp.
7. Initial mobile experience is read-only; Notion remains the only editing surface to avoid dual-write conflicts.
8. Sync on app open, online recovery while the app is open, and manual refresh. Background sync with the app fully closed is best-effort only and cannot be promised on all Android browsers.
9. Status labels must distinguish online, offline, syncing, synced, stale and error. Network connectivity alone never means synced.

## Deployment and installation

- PWA must be served over HTTPS (or localhost for development).
- Directly opening a file from Downloads with `file://` does not provide a normal PWA installation or service-worker context.
- Once a preview deployment exists, open `/informe/index.html` in Chrome on Android and use the browser menu to install/add to Home screen.
- Confirm standalone launch, close/reopen, first online cache, and airplane-mode reopen on the actual phone.
- The current SVG icon and manifest have not yet passed Android installability testing. Add raster 192x192 and 512x512 icons if Chrome/device validation requires them.

## Remaining gates

1. Create a dedicated read-only Notion integration and share the Index Master page with it.
2. Configure `NOTION_API_KEY` and `NOTION_INDEX_PAGE_ID` only in the server hosting environment.
3. Implement the server-side Notion reader endpoint with pagination and recursive block traversal.
4. Connect the PWA client to the endpoint with versioning and IndexedDB/cache persistence.
5. Fix or explain the zero-job Redesign CI failure; obtain successful lint/build/security and route smoke tests.
6. Validate manifest/installability, service-worker scope, cache recovery, and offline operation.
7. Deploy to preview/staging first. Do not merge or deploy production without review and explicit approval.

## Evidence boundary

The static PWA shell is committed, but it is not deployed, not installed on the user's phone, and not synchronized with Notion. No integration secrets were created or stored. No production branch or runtime was changed.
