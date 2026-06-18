import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function FleetMaintenancePage(){
 const rows=await prisma.maintenanceAlert.findMany({orderBy:[{status:'asc'},{severity:'desc'},{createdAt:'desc'}],take:500});
 return <AppShell><PageHeader title="Fleet Maintenance" description="Maintenance alerts, diagnostic issues, service reminders and readiness exceptions."/><SimpleTable rows={rows} columns={[{key:'unitNumber',label:'Unit'},{key:'severity',label:'Severity',render:r=><StatusBadge value={r.severity}/>},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'category',label:'Category'},{key:'title',label:'Alert'},{key:'description',label:'Description'}]} /></AppShell>
}
