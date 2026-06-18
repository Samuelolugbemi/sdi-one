import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { sageIntacctFieldMaps } from '../../../../../../lib/integrations/sage-intacct/field-maps';

export default function SageIntacctMappingsPage() {
  const rows = Object.entries(sageIntacctFieldMaps).flatMap(([source, map]) => Object.entries(map).map(([from, to]) => ({ id: `${source}-${from}`, source, from, to })));
  return <>
    <PageHeader title="Sage Intacct Field Mappings" description="Canonical field mappings from SDI's current Sage exports into SDI One business entities." />
    <SimpleTable rows={rows} columns={[
      { key: 'source', label: 'Source Dataset' },
      { key: 'from', label: 'Sage / CSV Field' },
      { key: 'to', label: 'SDI One Field' },
    ]} />
  </>;
}
