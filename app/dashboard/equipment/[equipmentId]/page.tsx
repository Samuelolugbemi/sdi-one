import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { prisma } from '@/lib/prisma';

export default async function EquipmentDetail({ params }: { params: { equipmentId: string } }) {
  const equipmentId = decodeURIComponent(params.equipmentId);
  const asset = await prisma.equipment.findUnique({ where: { equipmentId } });
  if (!asset) notFound();
  return <AppShell><PageHeader title={asset.equipmentId} description={asset.description ?? 'Equipment asset'} />
    <div className="grid gap-4 md:grid-cols-3"><KpiCard label="Status" value={asset.status ?? '—'} /><KpiCard label="Repair Cost" value="Awaiting POR/Intacct cost data" /><KpiCard label="Utilization" value="Awaiting POR/Ford data" /></div>
    <div className="mt-6 card p-5"><h2 className="mb-4 text-lg font-bold">Equipment Profile</h2><div className="grid gap-3 text-sm md:grid-cols-2"><div><b>Equipment:</b> {asset.equipmentId}</div><div><b>Description:</b> {asset.description || '—'}</div><div><b>Status:</b> {asset.status || '—'}</div></div></div>
  </AppShell>;
}
