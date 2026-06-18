import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { WorkspacePanel } from '@/components/ui/WorkspacePanel';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';

export default async function Page() {
  const [users, roles, permissions, sessions] = await Promise.all([
    prisma.appUser.count(),
    prisma.role.count(),
    prisma.permission.count(),
    prisma.userSession.count({ where: { revokedAt: null } }),
  ]);

  await requirePermission("user.manage");
  return <AppShell>
    <PageHeader eyebrow="Security" title="Authentication & RBAC" description="The v0.7 security layer adds real sessions, seeded users, role-based permissions, company access and job-specific access." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Users" value={String(users)} sub="Seeded and managed users" />
      <KpiCard label="Roles" value={String(roles)} sub="Permission groups" />
      <KpiCard label="Permissions" value={String(permissions)} sub="Atomic access rules" />
      <KpiCard label="Active Sessions" value={String(sessions)} sub="Non-revoked sessions" />
    </div>
    <div className="mt-6">
      <WorkspacePanel title="Security model" eyebrow="RBAC + scope">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5"><div className="font-black">Role permissions</div><p className="mt-2 text-sm leading-6 text-slate-600">System Admin, Executive, Company Admin, Project Manager, Accounting, Operations and Read Only roles are seeded.</p></div>
          <div className="rounded-3xl bg-slate-50 p-5"><div className="font-black">Company access</div><p className="mt-2 text-sm leading-6 text-slate-600">Users can be scoped to one or more companies. Executives and System Admins inherit all-company access.</p></div>
          <div className="rounded-3xl bg-slate-50 p-5"><div className="font-black">Job access</div><p className="mt-2 text-sm leading-6 text-slate-600">Project managers can be assigned specific jobs manually or by future Salesforce/Intacct synchronization.</p></div>
        </div>
      </WorkspacePanel>
    </div>
  </AppShell>;
}
