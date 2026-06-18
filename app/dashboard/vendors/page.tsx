import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { prisma } from '@/lib/prisma';

export default async function VendorsPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.vendor.findMany({ where: q ? { OR: [{ vendorId: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }, { city: { contains: q, mode: 'insensitive' } }, { state: { contains: q, mode: 'insensitive' } }] } : undefined, orderBy: { vendorId: 'asc' }, take: 500 }),
    prisma.vendor.count()
  ]);
  return <AppShell><PageHeader title="Vendors" description="Vendor master with spend and invoice drill-through." />
    <EntityGrid title="Vendors" description="Search suppliers and jump into invoice history." rows={rows} dataset="vendors" q={q} placeholder="Search vendor ID, name, city, state..." totalLabel={`${total.toLocaleString()} total vendors`} columns={[{key:'vendorId', label:'Vendor', render:r=><RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendorId}</RecordLink>},{key:'name', label:'Name'},{key:'city', label:'City'},{key:'state', label:'State'},{key:'zipCode', label:'ZIP'},{key:'type', label:'Type'}]} />
  </AppShell>;
}
