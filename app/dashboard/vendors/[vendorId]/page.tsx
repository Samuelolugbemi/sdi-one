import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { money, num, date } from '@/lib/format';

export default async function VendorDetail({ params }: { params: { vendorId: string } }) {
  const vendorId = decodeURIComponent(params.vendorId);
  const vendor = await prisma.vendor.findUnique({ where: { vendorId } });
  if (!vendor) notFound();
  const [invoices, lines, invAgg, lineAgg] = await Promise.all([
    prisma.invoice.findMany({ where: { vendorId }, orderBy: { invoiceDate: 'desc' }, take: 100 }),
    prisma.invoiceLine.findMany({ where: { vendorId }, include: { job: true, invoice: true }, orderBy: { transactionDate: 'desc' }, take: 100 }),
    prisma.invoice.aggregate({ where: { vendorId }, _sum: { amount: true }, _count: true }),
    prisma.invoiceLine.aggregate({ where: { vendorId }, _sum: { amount: true }, _count: true })
  ]);
  return <AppShell><PageHeader title={vendor.name ?? vendor.vendorId} description={`Vendor ${vendor.vendorId}`} />
    <div className="grid gap-4 md:grid-cols-4"><KpiCard label="Invoices" value={num(invAgg._count)} /><KpiCard label="Invoice Amount" value={money(invAgg._sum.amount)} /><KpiCard label="Invoice Lines" value={num(lineAgg._count)} /><KpiCard label="Line Amount" value={money(lineAgg._sum.amount)} /></div>
    <div className="mt-6 card p-5"><h2 className="mb-4 text-lg font-bold">Vendor Profile</h2><div className="grid gap-3 text-sm md:grid-cols-3"><div><b>Address:</b> {vendor.address1 || '—'}</div><div><b>City:</b> {vendor.city || '—'}</div><div><b>State:</b> {vendor.state || '—'}</div><div><b>ZIP:</b> {vendor.zipCode || '—'}</div><div><b>Type:</b> {vendor.type || '—'}</div></div></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Invoices</h2><SimpleTable rows={invoices} columns={[{key:'sageId', label:'Sage ID', render:r=><RecordLink href={`/dashboard/invoices/${r.sageId}`}>{r.sageId}</RecordLink>},{key:'invoiceDate', label:'Date', render:r=>date(r.invoiceDate)},{key:'invoice', label:'Invoice'},{key:'vendorInvoiceNumber', label:'Vendor Invoice #'},{key:'amount', label:'Amount', render:r=>money(r.amount)}]} /></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Invoice Lines</h2><SimpleTable rows={lines} columns={[{key:'sageId', label:'Line'},{key:'jobId', label:'Job', render:r=>r.jobId ? <RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink> : '—'},{key:'costCode', label:'Cost Code'},{key:'amount', label:'Amount', render:r=>money(r.amount)},{key:'description', label:'Description'}]} /></div>
  </AppShell>;
}
