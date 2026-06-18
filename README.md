# SDI One Platform v1.5 — Monday.com + Project Planning

This release extends SDI One with project planning, Monday.com connector readiness, board/task modeling, job schedule intelligence, milestone tracking, resource loading, and planning-to-job relationship views.

## Run

```powershell
npm install
npx prisma@5.22.0 generate
npx prisma@5.22.0 migrate dev --name project_planning_v15
npm run seed:v15
npm run import:all
npm run dev
```

## New pages

```text
/dashboard/planning
/dashboard/planning/boards
/dashboard/planning/tasks
/dashboard/planning/timeline
/dashboard/planning/resource-load
/dashboard/integration-platform/connectors/monday-com/configure
/dashboard/integration-platform/connectors/monday-com/boards
/dashboard/integration-platform/connectors/monday-com/mappings
/dashboard/integration-platform/connectors/monday-com/sync
/dashboard/integration-platform/connectors/monday-com/logs
```

## What v1.5 adds

- Project planning workspace
- Monday.com connector metadata
- Board and item synchronization model
- Job schedule and milestone tracking
- Resource assignments
- Planning risk indicators
- Project timeline readiness
- Planning data seeded into dashboards

This is connector-ready. Production Monday.com API credentials are still required for live sync.
