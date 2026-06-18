import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

import Link from 'next/link';
const cards = [['Users','/dashboard/admin/users'],['Roles','/dashboard/admin/roles'],['Company Access','/dashboard/admin/company-access'],['Import Mappings','/dashboard/admin/import-mappings'],['Data Dictionary','/dashboard/admin/data-dictionary'],['Audit Logs','/dashboard/admin/audit-logs'],['Feature Flags','/dashboard/admin/feature-flags'],['Settings','/dashboard/admin/settings']];
export default function AdminPage(){return <AppShell><PageHeader eyebrow="Administration" title="Admin Center" description="Operational controls for users, access, mappings, settings, audit, and platform configuration." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label,href]) => <Link key={href} href={href} className="card p-6 card-hover"><div className="section-title mb-3">Admin</div><div className="text-xl font-black">{label}</div><p className="mt-2 text-sm text-slate-600">Configure {label.toLowerCase()}.</p></Link>)}</div></AppShell>}
