import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function EquipmentPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.equipment.findMany({ where: q ? { OR: [{ equipmentId: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { status: { contains: q, mode: 'insensitive' } }] } : undefined, orderBy: { equipmentId: 'asc' }, take: 500 }),
    prisma.equipment.count()
  ]);
  return <AppShell><PageHeader title="Equipment" description="Asset register, ready for POR, repair, utilization, and fleet enrichment." />
    <EntityGrid title="Equipment" description="Browse every imported asset and status." rows={rows} dataset="equipment" q={q} placeholder="Search equipment ID, description, status..." totalLabel={`${total.toLocaleString()} total assets`} columns={[{key:'equipmentId', label:'Equipment', render:r=><RecordLink href={`/dashboard/equipment/${r.equipmentId}`}>{r.equipmentId}</RecordLink>},{key:'description', label:'Description'},{key:'status', label:'Status', render:r=><StatusBadge value={r.status} />}]} />
  </AppShell>;
}
