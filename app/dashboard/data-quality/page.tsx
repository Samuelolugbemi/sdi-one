import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';

export default async function DataQualityPage() {
  const checks = await prisma.dataQualityCheck.findMany({ orderBy: { domain: 'asc' } }).catch(() => []);
  return <AppShell><PageHeader eyebrow="Milestone 1" title="Data Quality Center" description="Production readiness checks for imports, required fields, relationship integrity, missing job links, missing vendors and duplicate identifiers." />
    <SimpleTable rows={checks} columns={[{key:'domain', label:'Domain'},{key:'name', label:'Check'},{key:'severity', label:'Severity'},{key:'status', label:'Status'},{key:'resultCount', label:'Results'},{key:'description', label:'Description'}]} empty="Run npm run seed:mission-control to create the baseline data quality checks." />
  </AppShell>;
}
