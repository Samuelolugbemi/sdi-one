import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
type Source = 'customers' | 'vendors' | 'jobs' | 'invoices' | 'invoice-lines' | 'equipment' | 'inventory';

function get(row: Record<string,string>, ...keys: string[]) {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return null;
}
function dec(v: string | null) {
  if (!v) return null;
  const cleaned = v.replace(/[$,]/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? new Prisma.Decimal(n) : null;
}
function dt(v: string | null) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
async function checkDb() { await prisma.$queryRaw`SELECT 1`; }
async function run(source: Source, filePath: string) {
  await checkDb();
  const absolute = path.resolve(filePath);
  if (!fs.existsSync(absolute)) throw new Error(`File not found: ${absolute}`);
  const text = fs.readFileSync(absolute, 'utf8');
  const rows = parse(text, { columns: true, skip_empty_lines: true, bom: true, relax_column_count: true, trim: true }) as Record<string,string>[];
  const importRun = await prisma.importRun.create({ data: { source, fileName: path.basename(filePath), status: 'Running' } });
  let imported = 0, failed = 0;
  const errors: string[] = [];
  for (const row of rows) {
    try {
      if (source === 'customers') {
        const id = get(row, 'Customer', 'customerId', 'CUSTOMERID'); if (!id) throw new Error('Missing Customer');
        await prisma.customer.upsert({ where: { customerId: id }, update: { name: get(row,'Name'), address1:get(row,'Address_1','Address'), city:get(row,'City'), state:get(row,'State'), zipCode:get(row,'ZIP_Code','ZIP'), type:get(row,'Type'), raw: row }, create: { customerId: id, name: get(row,'Name'), address1:get(row,'Address_1','Address'), city:get(row,'City'), state:get(row,'State'), zipCode:get(row,'ZIP_Code','ZIP'), type:get(row,'Type'), raw: row } });
      } else if (source === 'vendors') {
        const id = get(row, 'Vendor', 'vendorId', 'VENDORID'); if (!id) throw new Error('Missing Vendor');
        await prisma.vendor.upsert({ where: { vendorId: id }, update: { name:get(row,'Name'), address1:get(row,'Address_1','Address'), city:get(row,'City'), state:get(row,'State'), zipCode:get(row,'ZIP','ZIP_Code'), type:get(row,'Type'), raw: row }, create: { vendorId: id, name:get(row,'Name'), address1:get(row,'Address_1','Address'), city:get(row,'City'), state:get(row,'State'), zipCode:get(row,'ZIP','ZIP_Code'), type:get(row,'Type'), raw: row } });
      } else if (source === 'jobs') {
        const id = get(row, 'Job', 'Project', 'PROJECTID'); if (!id) throw new Error('Missing Job');
        const customerId = get(row,'AR_Customer','Customer','CUSTOMERID');
        await prisma.job.upsert({ where: { jobId: id }, update: { well:get(row,'Well'), description:get(row,'Description','Name'), county:get(row,'County'), uniqueJob:get(row,'Unique_Job','Unique_Job_Number'), recordTypeName:get(row,'Record_Type_Name'), status:get(row,'Status'), customerId, workTypeId:get(row,'WorkTypeId'), raw: row }, create: { jobId: id, well:get(row,'Well'), description:get(row,'Description','Name'), county:get(row,'County'), uniqueJob:get(row,'Unique_Job','Unique_Job_Number'), recordTypeName:get(row,'Record_Type_Name'), status:get(row,'Status'), customerId, workTypeId:get(row,'WorkTypeId'), raw: row } });
      } else if (source === 'invoices') {
        const id = get(row, 'Sage_ID', 'RECORDNO'); if (!id) throw new Error('Missing Sage_ID');
        await prisma.invoice.upsert({ where: { sageId: id }, update: { vendorId:get(row,'Vendor','Vendor_Sage_ID','VENDORID'), invoiceDate:dt(get(row,'Invoice_Date','Date')), invoice:get(row,'Invoice'), vendorInvoiceNumber:get(row,'Vendor_Invoice_Number','Invoice_Number'), description:get(row,'Description'), amount:dec(get(row,'Amount')), raw: row }, create: { sageId: id, vendorId:get(row,'Vendor','Vendor_Sage_ID','VENDORID'), invoiceDate:dt(get(row,'Invoice_Date','Date')), invoice:get(row,'Invoice'), vendorInvoiceNumber:get(row,'Vendor_Invoice_Number','Invoice_Number'), description:get(row,'Description'), amount:dec(get(row,'Amount')), raw: row } });
      } else if (source === 'invoice-lines') {
        const id = get(row, 'Sage_ID', 'RECORDNO'); if (!id) throw new Error('Missing Sage_ID');
        await prisma.invoiceLine.upsert({ where: { sageId: id }, update: { invoiceSageId:get(row,'Invoice_Sage_ID'), parentInvoiceSageId:get(row,'Parent_Invoice_Sage_ID'), jobId:get(row,'Job'), uniqueJob:get(row,'Unique_Job'), costCode:get(row,'Cost_Code'), activityStatus:get(row,'Activity_Status'), activityDate:dt(get(row,'Activity_Date')), transactionDate:dt(get(row,'Transaction_Date')), amount:dec(get(row,'Amount')), vendorId:get(row,'Vendor_Sage_ID','Vendor'), expenseAccount:get(row,'Expense_Account'), description:get(row,'Description'), raw: row }, create: { sageId: id, invoiceSageId:get(row,'Invoice_Sage_ID'), parentInvoiceSageId:get(row,'Parent_Invoice_Sage_ID'), jobId:get(row,'Job'), uniqueJob:get(row,'Unique_Job'), costCode:get(row,'Cost_Code'), activityStatus:get(row,'Activity_Status'), activityDate:dt(get(row,'Activity_Date')), transactionDate:dt(get(row,'Transaction_Date')), amount:dec(get(row,'Amount')), vendorId:get(row,'Vendor_Sage_ID','Vendor'), expenseAccount:get(row,'Expense_Account'), description:get(row,'Description'), raw: row } });
      } else if (source === 'equipment') {
        const id = get(row, 'Equipment', 'equipmentId', 'Asset'); if (!id) throw new Error('Missing Equipment');
        await prisma.equipment.upsert({ where: { equipmentId: id }, update: { description:get(row,'Description','Name'), status:get(row,'Status'), raw: row }, create: { equipmentId: id, description:get(row,'Description','Name'), status:get(row,'Status'), raw: row } });
      } else if (source === 'inventory') {
        const id = get(row, 'Row_ID', 'ROW_ID'); if (!id) throw new Error('Missing Row_ID');
        await prisma.inventoryTransaction.upsert({ where: { rowId: id }, update: { accountingDate:dt(get(row,'Accounting_Date')), amount:dec(get(row,'Amount')), dateStamp:dt(get(row,'Date_Stamp')), description:get(row,'Description'), jcTransactionType:get(row,'JC_Transaction_Type'), transactionDate:dt(get(row,'Transaction_Date')), unitCost:dec(get(row,'Unit_Cost')), units:dec(get(row,'Units')), costCode:get(row,'Cost_Code'), jobId:get(row,'Job'), uniqueJobNumber:get(row,'Unique_Job_Number'), raw: row }, create: { rowId: id, accountingDate:dt(get(row,'Accounting_Date')), amount:dec(get(row,'Amount')), dateStamp:dt(get(row,'Date_Stamp')), description:get(row,'Description'), jcTransactionType:get(row,'JC_Transaction_Type'), transactionDate:dt(get(row,'Transaction_Date')), unitCost:dec(get(row,'Unit_Cost')), units:dec(get(row,'Units')), costCode:get(row,'Cost_Code'), jobId:get(row,'Job'), uniqueJobNumber:get(row,'Unique_Job_Number'), raw: row } });
      }
      imported++;
    } catch (e: any) { failed++; if (errors.length < 10) errors.push(e.message); }
  }
  await prisma.importRun.update({ where: { id: importRun.id }, data: { status: failed ? 'Completed with errors' : 'Success', rowsImported: imported, rowsFailed: failed, message: errors.join(' | ') || null, finishedAt: new Date() } });
  console.log(`[${failed ? 'PARTIAL' : 'SUCCESS'}] ${source}: imported=${imported}, failed=${failed}`);
  if (errors.length) console.log(errors.join('\n'));
}
async function main() {
  const source = process.argv[2] as Source | undefined;
  const file = process.argv[3];
  if (!source || !file) throw new Error('Usage: npm run import:data -- <customers|vendors|jobs|invoices|invoice-lines|equipment|inventory> <path.csv>');
  await run(source, file);
}
main().catch(e => { console.error(e.message || e); process.exit(1); }).finally(async()=>prisma.$disconnect());
