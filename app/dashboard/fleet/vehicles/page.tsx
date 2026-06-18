import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function FleetVehiclesPage(){
 const rows=await prisma.fleetVehicle.findMany({orderBy:{unitNumber:'asc'},take:500});
 return <AppShell><PageHeader title="Fleet Vehicles" description="Vehicle registry connected to equipment ownership, jobs, fuel, maintenance and telematics."/><SimpleTable rows={rows} columns={[{key:'unitNumber',label:'Unit',render:r=><RecordLink href={`/dashboard/fleet/vehicles?unit=${r.unitNumber}`}>{r.unitNumber}</RecordLink>},{key:'ownerCompanyId',label:'Company'},{key:'currentJobId',label:'Current Job'},{key:'vin',label:'VIN'},{key:'make',label:'Make'},{key:'model',label:'Model'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'healthStatus',label:'Health',render:r=><StatusBadge value={r.healthStatus}/>}]} /></AppShell>
}
