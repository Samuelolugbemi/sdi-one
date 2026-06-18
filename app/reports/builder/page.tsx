import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export default function ReportBuilderPage(){const fields=['Customer','Job','Vendor','Invoice Amount','Invoice Date','Cost Code','Equipment','Inventory Amount','Company'];return <AppShell><PageHeader eyebrow="Reports" title="Report Builder" description="Foundation for saved reports, field selection, filters, exports and scheduled delivery." /><WorkspacePanel title="Available Fields" eyebrow="Semantic Layer"><div className="flex flex-wrap gap-2">{fields.map(f=><span className="badge badge-blue" key={f}>{f}</span>)}</div></WorkspacePanel></AppShell>}
