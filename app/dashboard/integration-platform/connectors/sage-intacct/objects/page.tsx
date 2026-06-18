import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { sageIntacctObjectCatalog } from '../../../../../../lib/integrations/sage-intacct/object-catalog';

export default function SageIntacctObjectsPage() {
  return <>
    <PageHeader title="Sage Intacct Object Catalog" description="The source objects SDI One can ingest from Sage Intacct through CSV today and API sync when credentials are approved." />
    <SimpleTable rows={sageIntacctObjectCatalog as any[]} columns={[
      { key: 'label', label: 'Object' },
      { key: 'sourceObject', label: 'Source' },
      { key: 'targetEntity', label: 'Target Entity' },
      { key: 'primaryKey', label: 'Primary Key' },
      { key: 'readiness', label: 'Readiness', render: row => <StatusBadge value={row.readiness} /> },
      { key: 'recommendedCadence', label: 'Cadence' },
    ]} />
  </>;
}
