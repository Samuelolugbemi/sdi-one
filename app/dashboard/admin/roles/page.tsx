import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const roles = await prisma.role.findMany({ include: { permissions: { include: { permission: true } }, users: true }, orderBy: { name: 'asc' } });
  const rows = roles.map((r) => ({
    id: r.id,
    role: <div><div className="font-black text-slate-900">{r.name}</div><div className="text-xs text-slate-500">{r.description}</div></div>,
    users: r.users.length,
    permissions: r.permissions.map((p) => p.permission.key).slice(0, 8).join(', ') + (r.permissions.length > 8 ? ` +${r.permissions.length - 8} more` : ''),
    system: r.isSystem ? 'Yes' : 'No',
  }));
  return <AppShell>
    <PageHeader eyebrow="Security" title="Roles" description="Role templates for executives, admins, project managers, accounting, operations and read-only users." />
    <SimpleTable rows={rows} columns={[
      { key: 'role', label: 'Role' },
      { key: 'users', label: 'Users' },
      { key: 'permissions', label: 'Permissions' },
      { key: 'system', label: 'System role' },
    ]} />
  </AppShell>;
}
