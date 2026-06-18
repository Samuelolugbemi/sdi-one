import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const rows = await prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
  return <AppShell>
    <PageHeader eyebrow="Security" title="Permissions" description="Atomic permissions used by the SDI One RBAC engine." />
    <SimpleTable rows={rows} columns={[
      { key: 'key', label: 'Permission' },
      { key: 'module', label: 'Module' },
      { key: 'action', label: 'Action' },
      { key: 'description', label: 'Description' },
    ]} />
  </AppShell>;
}
