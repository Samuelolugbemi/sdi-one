import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { prisma } from '../../../../../../lib/prisma';
import { derivePorEquipmentOwnerCompany } from '../../../../../../lib/integrations/point-of-rental/validators';

export default async function PorEquipmentCostsPage() {
  const equipment = await prisma.equipment.findMany({ orderBy: { equipmentId: 'asc' }, take: 30 });
  const rows = equipment.map(e => ({ ...e, ownerCompany: derivePorEquipmentOwnerCompany(e.equipmentId), porReadiness: 'Ready for POR enrichment' }));
  return <>
    <PageHeader title="POR Equipment Cost Bridge" description="Staging view for tying POR repair cost MTD/LTD and rental availability into SDI One equipment profitability." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Equipment" value={String(equipment.length)} sub="Preview rows" tone="blue" />
      <KpiCard label="Owner Rule" value="Prefix" sub="24-1234 → 24" tone="green" />
      <KpiCard label="Cost Direction" value="POR → SDI" sub="Snapshot ingest" tone="amber" />
      <KpiCard label="Outbound" value="SDI → POR" sub="Validated cost push" tone="slate" />
    </div>
    <div className="mt-6"><SimpleTable rows={rows} columns={[
      { key: 'equipmentId', label: 'Equipment' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
      { key: 'ownerCompany', label: 'Owner Company' },
      { key: 'porReadiness', label: 'POR Status' },
    ]} /></div>
  </>;
}
