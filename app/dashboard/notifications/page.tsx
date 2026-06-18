import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function NotificationsPage() {
  const items = [['Import failure','Notify admins when an import job fails.'],['Low job margin','Notify company admins/project managers when job margin drops.'],['Equipment repair alert','Notify operations when equipment repair costs cross threshold.'],['Vendor spend spike','Notify accounting and executives of unusual spend.'],['Integration stale','Notify owners when a connector has not synced.']];
  return <AppShell><PageHeader eyebrow="Notification Engine" title="Notification Center" description="Rules and alerts that will turn SDI One from a reporting system into an operating system." />
    <div className="grid gap-4">{items.map(([a,b]) => <div className="card flex items-center justify-between gap-4 p-5" key={a}><div><div className="font-black">{a}</div><p className="mt-1 text-sm text-slate-600">{b}</p></div><span className="badge badge-amber">Rule ready</span></div>)}</div>
  </AppShell>;
}
