import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { salesforceFieldMaps } from '../../../../../../lib/integrations/salesforce/field-maps';

export default function SalesforceMappingsPage() {
  const rows = Object.entries(salesforceFieldMaps).flatMap(([source, map]) => Object.entries(map).map(([from, to]) => ({ id: `${source}-${from}`, source, from, to })));
  return <>
    <PageHeader title="Salesforce Field Mappings" description="Canonical Salesforce field mappings for SDI One entities, including the existing Third Party Invoice and Invoice Line bridge." />
    <SimpleTable rows={rows} columns={[
      { key: 'source', label: 'Source Dataset' },
      { key: 'from', label: 'Salesforce Field' },
      { key: 'to', label: 'SDI One Field' },
    ]} />
  </>;
}
