import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const users = await prisma.appUser.findMany({ include: { roles: { include: { role: true } }, companyAccess: true, jobAccess: true }, orderBy: { email: 'asc' } });
  const rows = users.map((u) => {
    const roles = u.roles.map((r) => r.role.name);
    const allAccess = roles.includes('System Admin') || roles.includes('Executive');
    return {
      id: u.id,
      user: u.email,
      role: roles.join(', ') || 'No roles',
      companies: allAccess ? 'All companies' : (u.companyAccess.map((c) => c.companyId).join(', ') || 'No companies assigned'),
      jobs: allAccess ? 'All jobs' : (u.jobAccess.map((j) => j.jobId).join(', ') || 'No jobs assigned'),
    };
  });
  return <AppShell>
    <PageHeader eyebrow="Security" title="Company & Job Access" description="Company and job level access assignments. Executives and System Admins can see all records." />
    <SimpleTable rows={rows} columns={[
      { key: 'user', label: 'User' },
      { key: 'role', label: 'Role' },
      { key: 'companies', label: 'Company scope' },
      { key: 'jobs', label: 'Job scope' },
    ]} />
  </AppShell>;
}
