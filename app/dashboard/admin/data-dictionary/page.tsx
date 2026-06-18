import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function Page(){return <AppShell><PageHeader eyebrow="Admin" title="Data Dictionary" description="Business definitions, field ownership and source systems." /><WorkspacePanel title="Data Dictionary Workspace" eyebrow="Configuration"><p className="text-sm leading-7 text-slate-600">This area is scaffolded in v0.2 so the platform has a permanent place for data dictionary functionality. Live CRUD, validation and audit enforcement will be added as security and workflow services are activated.</p></WorkspacePanel></AppShell>}
