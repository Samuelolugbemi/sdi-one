import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toCsv } from '@/lib/csv';
import { getExecutiveMetrics, revenueByJob, spendByVendor } from '@/lib/queries';

function response(name: string, rows: Record<string, unknown>[]) {
  const csv = toCsv(rows);
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${name}-${new Date().toISOString().slice(0,10)}.csv"` } });
}
export async function GET(req: NextRequest) {
  const dataset = req.nextUrl.searchParams.get('dataset') || 'executive';
  if (dataset === 'executive') {
    const m = await getExecutiveMetrics();
    return response('executive-dashboard', [{ customers:m.customers, jobs:m.jobs, vendors:m.vendors, equipment:m.equipment, invoiceCount:m.invoiceCount, invoiceTotal:m.invoiceTotal, invoiceLineCount:m.invoiceLineCount, invoiceLineTotal:m.lineTotal, inventoryCount:m.inventoryCount, inventoryTotal:m.inventoryTotal }]);
  }
  if (dataset === 'financial') {
    const jobs = await revenueByJob(100);
    const vendors = await spendByVendor(100);
    return response('financial-dashboard', [...jobs.map(j=>({ type:'job', id:j.jobId, name:j.job?.description ?? '', amount:j.amount, count:j.count })), ...vendors.map(v=>({ type:'vendor', id:v.vendorId, name:v.vendor?.name ?? '', amount:v.amount, count:v.count }))]);
  }
  if (dataset === 'customers') return response('customers', (await prisma.customer.findMany({ orderBy:{customerId:'asc'} })).map(r=>({ customer:r.customerId, name:r.name, address:r.address1, city:r.city, state:r.state, zip:r.zipCode, type:r.type })));
  if (dataset === 'vendors') return response('vendors', (await prisma.vendor.findMany({ orderBy:{vendorId:'asc'} })).map(r=>({ vendor:r.vendorId, name:r.name, address:r.address1, city:r.city, state:r.state, zip:r.zipCode, type:r.type })));
  if (dataset === 'jobs' || dataset === 'projects') return response('jobs', (await prisma.job.findMany({ orderBy:{jobId:'asc'} })).map(r=>({ job:r.jobId, well:r.well, description:r.description, county:r.county, uniqueJob:r.uniqueJob, recordType:r.recordTypeName, status:r.status, customer:r.customerId, workTypeId:r.workTypeId })));
  if (dataset === 'invoices') return response('invoices', (await prisma.invoice.findMany({ orderBy:{invoiceDate:'desc'} })).map(r=>({ sageId:r.sageId, vendor:r.vendorId, invoiceDate:r.invoiceDate, invoice:r.invoice, vendorInvoiceNumber:r.vendorInvoiceNumber, description:r.description, amount:r.amount })));
  if (dataset === 'invoice-lines') return response('invoice-lines', (await prisma.invoiceLine.findMany({ orderBy:{transactionDate:'desc'} })).map(r=>({ sageId:r.sageId, invoiceSageId:r.invoiceSageId, parentInvoiceSageId:r.parentInvoiceSageId, job:r.jobId, uniqueJob:r.uniqueJob, costCode:r.costCode, transactionDate:r.transactionDate, amount:r.amount, vendor:r.vendorId, expenseAccount:r.expenseAccount, description:r.description })));
  if (dataset === 'equipment') return response('equipment', (await prisma.equipment.findMany({ orderBy:{equipmentId:'asc'} })).map(r=>({ equipment:r.equipmentId, description:r.description, status:r.status })));
  if (dataset === 'inventory') return response('inventory', (await prisma.inventoryTransaction.findMany({ orderBy:{transactionDate:'desc'} })).map(r=>({ rowId:r.rowId, accountingDate:r.accountingDate, amount:r.amount, description:r.description, transactionDate:r.transactionDate, unitCost:r.unitCost, units:r.units, costCode:r.costCode, job:r.jobId, uniqueJob:r.uniqueJobNumber })));
  if (dataset === 'import-runs') return response('import-runs', (await prisma.importRun.findMany({ orderBy:{startedAt:'desc'} })).map(r=>({ source:r.source, fileName:r.fileName, status:r.status, imported:r.rowsImported, failed:r.rowsFailed, startedAt:r.startedAt, finishedAt:r.finishedAt, message:r.message })));
  return new Response('Unknown dataset', { status: 400 });
}
