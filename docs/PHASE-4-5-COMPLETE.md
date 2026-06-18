# SDI One Platform Upgrade v0.4 — Phase 4 and 5

## Phase 4 — Platform Core

This milestone adds the platform services every module inherits:

- Metadata Entity Engine
- Relationship Engine
- Timeline Engine
- Universal Search Engine
- Document Engine foundation
- Notification Engine foundation
- Workflow Engine foundation
- Security/RBAC model
- Workspace Favorite/Activity/Search models

## Phase 5 — Enterprise Workspaces

This milestone adds the reusable workspace architecture:

- Workspace shell
- Generic workspace route
- Entity-aware overview section
- Relationship graph section
- Timeline section
- AI operational brief panel
- Workspace capability panel

Supported workspace entities:

- Customer
- Job
- Vendor
- Invoice
- Equipment

## New Pages

- `/dashboard/workspaces`
- `/dashboard/workspaces/[entityType]/[entityKey]`
- `/dashboard/workflows`
- `/dashboard/relationships?entity=job&key=07194-26-01`
- `/dashboard/timeline?entity=job&key=07194-26-01`
- `/search?q=...`

## Migration

Run:

```powershell
npx prisma migrate dev --name phase_4_5_platform_core
npm run seed:entities
```

