import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getFleetDashboard } from '@/lib/fleet-intelligence';
import { formatCurrency } from '@/lib/format';

export default async function FleetPage() {
  const { vehicles, alerts, metrics } = await getFleetDashboard();
  return <AppShell>
    <PageHeader title="Fleet Intelligence" description="Mileage, fuel cost, maintenance, utilization and telematics-ready operating view for SDI fleet assets." />
    <div className="grid gap-4 md:grid-cols-5">
      <KpiCard label="Fleet Units" value={String(metrics.totalVehicles)} tone="blue" />
      <KpiCard label="Active / In Use" value={String(metrics.activeVehicles)} tone="green" />
      <KpiCard label="Fuel Cost MTD" value={formatCurrency(metrics.totalFuelCost)} tone="amber" />
      <KpiCard label="Fuel Gallons" value={metrics.totalGallons.toFixed(1)} tone="slate" />
      <KpiCard label="Open Alerts" value={String(metrics.openAlerts)} tone="red" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2"><h2 className="mb-3 text-xl font-black">Fleet Register</h2><SimpleTable rows={vehicles} columns={[{key:'unitNumber',label:'Unit',render:r=><RecordLink href={`/dashboard/fleet/vehicles?unit=${r.unitNumber}`}>{r.unitNumber}</RecordLink>},{key:'make',label:'Make'},{key:'model',label:'Model'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'healthStatus',label:'Health',render:r=><StatusBadge value={r.healthStatus}/>},{key:'mpg',label:'MPG'},{key:'utilizationPct',label:'Utilization %'}]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Maintenance Alerts</h2><SimpleTable rows={alerts} columns={[{key:'unitNumber',label:'Unit'},{key:'severity',label:'Severity',render:r=><StatusBadge value={r.severity}/>},{key:'title',label:'Alert'}]} /></div>
    </div>
  </AppShell>;
}
