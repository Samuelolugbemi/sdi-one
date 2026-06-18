import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

import { platformModules } from '@/lib/platform';

export default function AiInsightsPage() {
  const insights = [
    ['Executive Briefing', 'Daily summary of business health, exceptions and next actions.'],
    ['Job Risk Insights', 'Explains job margin erosion using invoices, inventory, equipment, fuel and timeline events.'],
    ['Equipment Profitability', 'Identifies assets that cost more than they generate.'],
    ['Vendor Spend Alerts', 'Detects unusual vendor spend patterns and job-level impact.'],
    ['Customer Revenue Summary', 'Summarizes customer jobs, invoice activity and profitability.'],
  ];
  return <AppShell><PageHeader eyebrow="AI Layer" title="AI Insights Center" description="AI-ready operating intelligence. The UI and context model are prepared; live recommendations activate as integrations and rules are connected." />
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{insights.map(([title, desc]) => <div key={title} className="card p-6 card-hover"><div className="section-title mb-3">Insight</div><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p><div className="mt-5"><span className="badge badge-blue">AI-ready</span></div></div>)}</div>
    <div className="mt-6"><WorkspacePanel title="Context Engines" eyebrow="Platform"><div className="grid gap-4 md:grid-cols-3">{platformModules.map(m => <div key={m.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black">{m.name}</div><div className="mt-1 text-xs font-black text-blue-700">{m.status}</div><p className="mt-2 text-sm text-slate-600">{m.description}</p></div>)}</div></WorkspacePanel></div>
  </AppShell>;
}
