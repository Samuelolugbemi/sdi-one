import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel } from '@/components/ui/WorkspacePanel';

const graph = [
  ['Customer', 'owns / funds', 'Job'],
  ['Job', 'receives costs from', 'Invoice Lines'],
  ['Invoice Lines', 'come from', 'Vendor'],
  ['Job', 'uses', 'Inventory'],
  ['Job', 'uses', 'Equipment'],
  ['Equipment', 'will receive', 'Fuel / Telematics / Maintenance'],
  ['Invoice', 'contains', 'Invoice Lines'],
  ['Everything', 'creates', 'Timeline + Search + AI Context'],
];

export default function DigitalTwinPage() {
  return <AppShell><PageHeader eyebrow="Milestone 3" title="SDI Digital Twin" description="A relationship-first model of the company: customers, jobs, vendors, invoices, equipment, inventory, events and future integrations connected as one operational graph." />
    <WorkspacePanel title="Company Graph" eyebrow="Digital Twin"><div className="grid gap-3">{graph.map(([from, verb, to]) => <div key={`${from}-${to}`} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700 md:grid-cols-[1fr_auto_1fr]"><span>{from}</span><span className="rounded-full bg-blue-600 px-3 py-1 text-center text-xs uppercase tracking-wide text-white">{verb}</span><span>{to}</span></div>)}</div></WorkspacePanel>
  </AppShell>;
}
