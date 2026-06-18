import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { prisma } from '@/lib/prisma';

export default async function CustomersPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.customer.findMany({ where: q ? { OR: [{ customerId: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }, { city: { contains: q, mode: 'insensitive' } }, { state: { contains: q, mode: 'insensitive' } }] } : undefined, orderBy: { customerId: 'asc' }, take: 500 }),
    prisma.customer.count()
  ]);
  return <AppShell><PageHeader title="Customers" description="Customer master records with clickable job and invoice relationships." />
    <EntityGrid title="Customers" description="Search and export the imported customer master." rows={rows} dataset="customers" q={q} placeholder="Search customer ID, name, city, state..." totalLabel={`${total.toLocaleString()} total customers`} columns={[{key:'customerId', label:'Customer', render:r=><RecordLink href={`/dashboard/customers/${r.customerId}`}>{r.customerId}</RecordLink>},{key:'name', label:'Name'},{key:'city', label:'City'},{key:'state', label:'State'},{key:'zipCode', label:'ZIP'},{key:'type', label:'Type'}]} />
  </AppShell>;
}
