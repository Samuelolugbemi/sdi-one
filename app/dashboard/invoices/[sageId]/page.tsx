import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { money, num, date } from '@/lib/format';

export default async function InvoiceDetail({ params }: { params: { sageId: string } }) {
  const sageId = decodeURIComponent(params.sageId);
  const invoice = await prisma.invoice.findUnique({ where: { sageId }, include: { vendor: true, lines: { include: { job: true, vendor: true }, orderBy: { transactionDate: 'desc' } } } });
  if (!invoice) notFound();
  const total = invoice.lines.reduce((s, l) => s + Number(l.amount ?? 0), 0);
  return <AppShell><PageHeader title={`Invoice ${invoice.sageId}`} description={invoice.description ?? invoice.invoice ?? 'Invoice detail'} />
    <div className="grid gap-4 md:grid-cols-4"><KpiCard label="Header Amount" value={money(invoice.amount)} /><KpiCard label="Line Total" value={money(total)} /><KpiCard label="Line Count" value={num(invoice.lines.length)} /><KpiCard label="Invoice Date" value={date(invoice.invoiceDate)} /></div>
    <div className="mt-6 card p-5"><h2 className="mb-4 text-lg font-bold">Invoice Profile</h2><div className="grid gap-3 text-sm md:grid-cols-3"><div><b>Vendor:</b> {invoice.vendorId ? <RecordLink href={`/dashboard/vendors/${invoice.vendorId}`}>{invoice.vendor?.name ?? invoice.vendorId}</RecordLink> : '—'}</div><div><b>Invoice:</b> {invoice.invoice || '—'}</div><div><b>Vendor Invoice #:</b> {invoice.vendorInvoiceNumber || '—'}</div></div></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Line Items</h2><SimpleTable rows={invoice.lines} columns={[{key:'sageId', label:'Line ID'},{key:'transactionDate', label:'Date', render:r=>date(r.transactionDate)},{key:'jobId', label:'Job', render:r=>r.jobId ? <RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink> : '—'},{key:'costCode', label:'Cost Code'},{key:'expenseAccount', label:'Expense Account'},{key:'amount', label:'Amount', render:r=>money(r.amount)},{key:'description', label:'Description'}]} /></div>
  </AppShell>;
}
