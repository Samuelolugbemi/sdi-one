import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { prisma } from '@/lib/prisma';
import { money, date } from '@/lib/format';

export default async function InvoicesPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.invoice.findMany({ where: q ? { OR: [{ sageId: { contains: q, mode: 'insensitive' } }, { vendorId: { contains: q, mode: 'insensitive' } }, { invoice: { contains: q, mode: 'insensitive' } }, { vendorInvoiceNumber: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : undefined, include: { vendor: true }, orderBy: { invoiceDate: 'desc' }, take: 500 }),
    prisma.invoice.count()
  ]);
  return <AppShell><PageHeader title="Invoices" description="Invoice headers with vendor relationships and line item drill-through." />
    <EntityGrid title="Invoices" description="Search AP invoice headers and drill into line items." rows={rows} dataset="invoices" q={q} placeholder="Search Sage ID, invoice, vendor, description..." totalLabel={`${total.toLocaleString()} total invoices`} columns={[{key:'sageId', label:'Sage ID', render:r=><RecordLink href={`/dashboard/invoices/${r.sageId}`}>{r.sageId}</RecordLink>},{key:'invoiceDate', label:'Date', render:r=>date(r.invoiceDate)},{key:'vendorId', label:'Vendor', render:r=>r.vendorId ? <RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink> : '—'},{key:'invoice', label:'Invoice'},{key:'vendorInvoiceNumber', label:'Vendor Invoice #'},{key:'amount', label:'Amount', align:'right', render:r=>money(r.amount)}]} />
  </AppShell>;
}
