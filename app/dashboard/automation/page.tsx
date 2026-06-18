import { prisma } from '../../../lib/prisma';
import { PageHeader } from '../../../components/ui/PageHeader';
import { KpiCard } from '../../../components/ui/KpiCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { SimpleTable } from '../../../components/ui/SimpleTable';

export default async function AutomationPage() {
  const [rules, jobs, approvals, tasks] = await Promise.all([
    prisma.automationRule.findMany({ orderBy: [{ enabled: 'desc' }, { domain: 'asc' }] }),
    prisma.scheduledJobDefinition.findMany({ orderBy: { name: 'asc' } }),
    prisma.approvalPolicy.findMany({ orderBy: { domain: 'asc' } }),
    prisma.taskItem.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);
  const enabledRules = rules.filter(r => r.enabled).length;
  return <>
    <PageHeader title="Enterprise Automation" description="Milestone 6 turns SDI One into an active platform: workflows, rules, scheduled jobs, approvals, tasks, and notifications." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Automation Rules" value={String(rules.length)} sub={`${enabledRules} enabled`} tone="blue" />
      <KpiCard label="Scheduled Jobs" value={String(jobs.length)} sub="Imports, KPIs, reports" tone="green" />
      <KpiCard label="Approval Policies" value={String(approvals.length)} sub="Configurable routing" tone="amber" />
      <KpiCard label="Open Tasks" value={String(tasks.filter(t=>t.status==='Open').length)} sub="Action queue" tone="slate" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div>
        <h2 className="mb-3 text-xl font-black">Business Rules</h2>
        <SimpleTable rows={rules} columns={[
          { key: 'name', label: 'Rule' },
          { key: 'domain', label: 'Domain' },
          { key: 'entityType', label: 'Entity' },
          { key: 'triggerType', label: 'Trigger' },
          { key: 'severity', label: 'Severity', render: r => <StatusBadge value={r.severity} /> },
        ]} />
      </div>
      <div>
        <h2 className="mb-3 text-xl font-black">Scheduled Jobs</h2>
        <SimpleTable rows={jobs} columns={[
          { key: 'name', label: 'Job' },
          { key: 'schedule', label: 'Schedule' },
          { key: 'jobType', label: 'Type' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        ]} />
      </div>
    </div>
  </>;
}
