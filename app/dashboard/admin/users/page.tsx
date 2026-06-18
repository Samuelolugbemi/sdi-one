import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const users = await prisma.appUser.findMany({ include: { roles: { include: { role: true } }, companyAccess: true, jobAccess: true }, orderBy: { email: 'asc' } });
  const rows = users.map((u) => ({
    id: u.id,
    user: <div><div className="font-black text-slate-900">{u.name || u.email}</div><div className="text-xs text-slate-500">{u.email}</div></div>,
    status: <StatusBadge status={u.status} />,
    roles: u.roles.map((r) => r.role.name).join(', ') || 'No roles',
    companies: u.companyAccess.length ? u.companyAccess.map((c) => c.companyId).join(', ') : 'All if role permits / none assigned',
    jobs: u.jobAccess.length ? u.jobAccess.map((j) => j.jobId).join(', ') : 'None assigned',
    lastLogin: u.lastLoginAt ? u.lastLoginAt.toLocaleString() : 'Never',
  }));
  return <AppShell>
    <PageHeader eyebrow="Security" title="Users" description="Manage SDI One users, roles, company access and job-specific access." />
    <SimpleTable rows={rows} columns={[
      { key: 'user', label: 'User' },
      { key: 'status', label: 'Status' },
      { key: 'roles', label: 'Roles' },
      { key: 'companies', label: 'Company access' },
      { key: 'jobs', label: 'Job access' },
      { key: 'lastLogin', label: 'Last login' },
    ]} />
  </AppShell>;
}
