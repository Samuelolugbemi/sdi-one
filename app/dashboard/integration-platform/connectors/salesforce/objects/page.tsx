import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { salesforceObjectCatalog } from '../../../../../../lib/integrations/salesforce/object-catalog';

export default function SalesforceObjectsPage() {
  return <>
    <PageHeader title="Salesforce Object Catalog" description="Objects SDI One will synchronize with Salesforce through API or existing Data Loader bridge flows." />
    <SimpleTable rows={salesforceObjectCatalog as any[]} columns={[
      { key: 'label', label: 'Object' },
      { key: 'sourceObject', label: 'Salesforce Object' },
      { key: 'targetEntity', label: 'Target Entity' },
      { key: 'externalId', label: 'External ID' },
      { key: 'readiness', label: 'Readiness', render: row => <StatusBadge value={row.readiness} /> },
      { key: 'recommendedCadence', label: 'Cadence' },
    ]} />
  </>;
}
