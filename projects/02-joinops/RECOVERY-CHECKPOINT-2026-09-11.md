# JoinOps — recovery checkpoint

## GitHub
- Repository: `fjcamp/joinhook`
- Branch: `joinops/foundation-2026-09-11`
- PR: #44
- Checkpoint commit: `e24e4b27b2bc2ba0f0053c9fff808e428b43658b`

## Cloud database
- Provider: Neon
- Project: `JoinOps`
- Project ID: `dry-meadow-93985554`
- Main branch: `br-blue-sky-axozi63p`
- Existing snapshot: `joinops-mvp-2026-09-11`

## Recovery rule
To recover the application state, restore the GitHub branch/PR code and the Neon database from the latest available snapshot/checkpoint, then rerun database migrations from `projects/02-joinops/app/db/` in order.

## Current critical path
Identity/RBAC → Cash close/reconciliation → Payment & Settlement expansion → Inventory/FEFO → Procurement → Recipes/Production → Finance/Tax → SII certification → Migration Factory → QA/restore drills → production cloud deployment → signed Windows installer.
