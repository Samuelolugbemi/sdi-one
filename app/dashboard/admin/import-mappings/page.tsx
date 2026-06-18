import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function Page(){return <AppShell><PageHeader eyebrow="Admin" title="Import Mappings" description="Map SDI CSV fields and external system fields into SDI One." /><WorkspacePanel title="Import Mappings Workspace" eyebrow="Configuration"><p className="text-sm leading-7 text-slate-600">This area is scaffolded in v0.2 so the platform has a permanent place for import mappings functionality. Live CRUD, validation and audit enforcement will be added as security and workflow services are activated.</p></WorkspacePanel></AppShell>}
