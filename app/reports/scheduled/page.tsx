import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function ScheduledReportsPage(){return <AppShell><PageHeader eyebrow="Reports" title="Scheduled Reports" description="Schedule report delivery by email or export destination once authentication is enabled." /><WorkspacePanel title="Scheduled Delivery" eyebrow="Coming Online"><p className="text-sm text-slate-600">This page reserves the production workflow for weekly/monthly executive, accounting and operations reporting.</p></WorkspacePanel></AppShell>}
