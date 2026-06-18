# SDI One v1.1 — Sage Intacct Connector

v1.1 adds the Sage Intacct production connector layer while preserving the verified CSV importer.

## Included

- Sage object catalog for customers, vendors, jobs, AP bills, invoice lines, equipment, inventory, GL entries, dimensions and attachments.
- Canonical field mappings from current SDI exports into SDI One entities.
- Credential readiness validation for Sage Intacct Web Services.
- XML API envelope builder and readByQuery request builder.
- Sync plan generator with CSV fallback and future API sync safeguards.
- Integration run/log seeding.
- Connector workspaces for configure, object catalog, mappings, sync plan and logs.
- API endpoints for connector health, sync plan and test-connection readiness.

## Environment Variables

```env
INTACCT_API_ENDPOINT="https://api.intacct.com/ia/xml/xmlgw.phtml"
INTACCT_COMPANY_ID=""
INTACCT_USER_ID=""
INTACCT_USER_PASSWORD=""
INTACCT_SENDER_ID=""
INTACCT_SENDER_PASSWORD=""
```

## Run

```powershell
npm run seed:v11
npm run import:all
npm run dev
```

## Key Pages

```text
/dashboard/integration-platform/connectors/sage-intacct
/dashboard/integration-platform/connectors/sage-intacct/configure
/dashboard/integration-platform/connectors/sage-intacct/objects
/dashboard/integration-platform/connectors/sage-intacct/mappings
/dashboard/integration-platform/connectors/sage-intacct/sync
/dashboard/integration-platform/connectors/sage-intacct/logs
```

## API Endpoints

```text
/api/integrations/sage-intacct/health
/api/integrations/sage-intacct/sync-plan
/api/integrations/sage-intacct/test-connection
```

## Production Notes

CSV import remains the fallback until Sage Intacct Web Services credentials are approved, tested and compared against the current exports. API sync should be enabled first in staging and then promoted to production after reconciliation.
