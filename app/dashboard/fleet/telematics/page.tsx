import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function FleetTelematicsPage(){
 const rows=await prisma.telematicsSnapshot.findMany({orderBy:{capturedAt:'desc'},take:500});
 const communicating=rows.filter(r=>r.isCommunicating).length; const faults=rows.reduce((s,r)=>s+(r.faultCount??0),0);
 return <AppShell><PageHeader title="Fleet Telematics" description="GPS, speed, odometer, state duration, diagnostics and live-location-ready snapshots."/><div className="mb-6 grid gap-4 md:grid-cols-3"><KpiCard label="Snapshots" value={String(rows.length)} tone="blue"/><KpiCard label="Communicating" value={String(communicating)} tone="green"/><KpiCard label="Open Faults" value={String(faults)} tone="red"/></div><SimpleTable rows={rows} columns={[{key:'unitNumber',label:'Unit'},{key:'sourceSystem',label:'Source'},{key:'isCommunicating',label:'Communicating',render:r=><StatusBadge value={r.isCommunicating?'Yes':'No'}/>},{key:'currentState',label:'State'},{key:'speedMph',label:'Speed'},{key:'faultCount',label:'Faults'},{key:'capturedAt',label:'Captured',render:r=>r.capturedAt?.toLocaleString?.()??'—'}]} /></AppShell>
}
