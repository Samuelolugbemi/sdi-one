import { prisma } from '../../../../lib/prisma';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';

export default async function AutomationRulesPage() {
  const rules = await prisma.automationRule.findMany({ orderBy: { domain: 'asc' }});
  return <>
    <PageHeader title="Business Rule Engine" description="Centralized validation, routing, alerts, and actions. These rules will eventually run when platform events occur." />
    <SimpleTable rows={rules} columns={[
      { key: 'name', label: 'Rule' },
      { key: 'domain', label: 'Domain' },
      { key: 'entityType', label: 'Entity' },
      { key: 'triggerType', label: 'Trigger' },
      { key: 'severity', label: 'Severity', render: r => <StatusBadge value={r.severity} /> },
      { key: 'enabled', label: 'Status', render: r => <StatusBadge value={r.enabled ? 'Enabled' : 'Disabled'} /> },
    ]} />
  </>;
}
