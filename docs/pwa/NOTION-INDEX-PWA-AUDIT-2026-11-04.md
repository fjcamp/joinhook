# Audit: Notion ↔ Índice HTML ↔ PWA móvil

- Fecha: 2026-11-04
- Estado: AUDITED / IMPLEMENTATION BLOCKED BY INTEGRATION CONFIGURATION
- Repositorio: fjcamp/joinhook
- Rama de trabajo: feature/notion-index-pwa-review-2026-11-04
- Base: main @ 26ce25947e261a2eedf3e18c006510d4ea292804
- Notion architecture record: https://app.notion.com/p/40eb7fe8cfac81e693dacd05d05674a2

## Executive result

The generated standalone HTML is a local prototype. It has no Notion API client, no sync endpoint, no content version exchange, and no durable update mechanism from Notion. It can render its embedded static data offline, but it cannot synchronize with Notion.

The current JoinHook web repository already contains a separate PWA experiment for JoinHook Local:
- `/local` route and `public/local.webmanifest`
- `public/local-sw.js`
- `src/features/local/LocalShell.tsx` registers that worker with scope `/`
- The worker caches the `/local` shell and same-origin GET requests.
- The Local manifest has no icons array, so it is not a suitable installability template without additional work.
- A separate EGO PWA exists under `/app/` with its own manifest and scoped worker.

These existing PWAs are separate applications. They do not synchronize the report index with Notion. Do not repurpose the Local or EGO worker or manifest for the report index.

## Findings

1. No Notion API synchronization endpoint was found in the inspected `src/pages/api` routes.
2. No Notion integration credentials or documented environment variables were found in the inspected repository metadata.
3. The current HTML contains embedded summary text for 15 parts / 68 chapters and a connection indicator only. Its online state is based on `navigator.onLine`; this is not a successful Notion sync indicator.
4. The standalone HTML has no web app manifest, service worker, app icons, install prompt, or scoped cache.
5. The existing `/local` service worker uses scope `/`; the report index should use an isolated scope such as `/informe/` to avoid collisions.
6. Notion is the master source. The first release should be read-only from Notion to the PWA; editing the same content from both sides would create conflict and audit risks.

## Required architecture

- Dedicated PWA route and assets under `/informe/`.
- Manifest with `display: standalone`, stable `id`, `start_url`, scope `/informe/`, and 192x192 + 512x512 icons (including maskable purpose).
- Service worker scoped to `/informe/`, caching the app shell and the last successfully downloaded content snapshot.
- IndexedDB or Cache Storage for the last synchronized index snapshot and version metadata.
- Same-origin backend endpoint such as `/api/notion-index` to query Notion server-side.
- Server-only environment variables: `NOTION_API_KEY` and `NOTION_INDEX_PAGE_ID`; never expose these as `NEXT_PUBLIC_*` or embed them in client files.
- Share the target Notion page with the integration using minimum read permissions.
- Backend should traverse Notion block children recursively, handle pagination, apply timeouts, return a normalized JSON snapshot and a stable content version / last-edited timestamp.
- Client should update the local snapshot only after a complete successful response. On failure/offline, retain the previous snapshot and show its actual last-sync time.
- UI status must distinguish online, offline, syncing, synced, stale, and error. `navigator.onLine` alone must never be labeled "synced".
- Sync on app launch and on an online event while the app is open; provide a manual refresh. Background sync while fully closed is best-effort and cannot be promised on all Android browsers.

## Deployment and installation

A PWA must be served over HTTPS (or localhost for development). A file opened directly from Downloads using `file://` is not installable as a proper PWA and cannot register a service worker. Publish to a stable HTTPS URL, open it in Chrome on Android, then use browser menu → Install app / Add to Home screen. The app must be tested after the first online sync by enabling airplane mode and reopening it.

No deployment was performed during this audit. No production domain, BlueHosting Passenger process, or current Vercel project was modified.

## Acceptance tests

- PWA installs from HTTPS and opens in standalone display mode.
- First online load fetches all available chapters and stores a complete local snapshot.
- Airplane-mode test opens the app and expands chapters from the last snapshot.
- A controlled change in Notion is visible after manual refresh / app reopen.
- Failed API response does not erase the last good offline snapshot.
- Status and timestamp reflect the last successful sync, not merely network connectivity.
- Integration token is absent from client bundle, HTML, Git history, and browser storage.
- Service worker scope is limited to `/informe/` and does not intercept unrelated JoinHook routes.

## Next implementation gates

1. Confirm integration access to the target Notion index page and create a dedicated read-only Notion integration.
2. Configure `NOTION_API_KEY` and `NOTION_INDEX_PAGE_ID` only in the server hosting environment.
3. Implement backend read endpoint and recursive block retrieval.
4. Implement the dedicated `/informe/` PWA shell, manifest, icons, service worker, local snapshot and truthful sync status.
5. Run lint, build, route smoke tests, installability checks, online/offline tests, and secret scan.
6. Deploy to a preview/staging URL; do not publish to production until the user reviews and approves.

## Evidence boundary

This is a repository inspection and architecture audit. It is not evidence that the PWA is deployed, installed on the user's phone, connected to Notion, or synchronizing. No secrets were created or stored. No production branch was changed.
