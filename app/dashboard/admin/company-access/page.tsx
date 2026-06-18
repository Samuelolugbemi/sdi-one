import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function Page(){return <AppShell><PageHeader eyebrow="Admin" title="Company Access" description="Assign users to one or more companies/entities." /><WorkspacePanel title="Company Access Workspace" eyebrow="Configuration"><p className="text-sm leading-7 text-slate-600">This area is scaffolded in v0.2 so the platform has a permanent place for company access functionality. Live CRUD, validation and audit enforcement will be added as security and workflow services are activated.</p></WorkspacePanel></AppShell>}
