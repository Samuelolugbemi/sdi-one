import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/format';

export default async function FleetFuelPage(){
 const rows=await prisma.fuelTransaction.findMany({orderBy:{transactionDate:'desc'},take:500});
 const total=rows.reduce((s,r)=>s+Number(r.amount??0),0); const gallons=rows.reduce((s,r)=>s+Number(r.gallons??0),0);
 return <AppShell><PageHeader title="Fuel Intelligence" description="Fuel transactions, fuel cost, gallons, card/vendor data and exception-ready fleet fuel reporting."/><div className="mb-6 grid gap-4 md:grid-cols-3"><KpiCard label="Fuel Spend" value={formatCurrency(total)} tone="amber"/><KpiCard label="Gallons" value={gallons.toFixed(1)} tone="blue"/><KpiCard label="Avg Cost/Gal" value={gallons?formatCurrency(total/gallons):'$0'} tone="green"/></div><SimpleTable rows={rows} columns={[{key:'transactionDate',label:'Date',render:r=>r.transactionDate?.toLocaleDateString?.()??'—'},{key:'unitNumber',label:'Unit'},{key:'vendorName',label:'Vendor'},{key:'gallons',label:'Gallons'},{key:'amount',label:'Amount',render:r=>formatCurrency(Number(r.amount??0))},{key:'location',label:'Location'}]} /></AppShell>
}
