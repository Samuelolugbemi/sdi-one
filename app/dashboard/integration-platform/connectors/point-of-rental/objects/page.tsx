import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { porObjectCatalog } from '../../../../../../lib/integrations/point-of-rental/object-catalog';

export default function PorObjectsPage() {
  return <>
    <PageHeader title="POR Object Catalog" description="Objects and feeds SDI One expects from Point of Rental for equipment operations and profitability." />
    <SimpleTable rows={porObjectCatalog} columns={[
      { key: 'label', label: 'Object' },
      { key: 'sourceObject', label: 'POR Source' },
      { key: 'targetEntity', label: 'Target Entity' },
      { key: 'syncDirection', label: 'Direction' },
      { key: 'readiness', label: 'Readiness', render: r => <StatusBadge value={r.readiness} /> },
    ]} />
  </>;
}
