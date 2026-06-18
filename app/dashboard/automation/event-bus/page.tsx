import { PageHeader } from '../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { prisma } from '../../../../lib/prisma';

export default async function EventBusPage() {
  const [events, subscriptions] = await Promise.all([
    prisma.platformEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.workflowEventSubscription.findMany({ orderBy: { eventType: 'asc' } }),
  ]);
  return <>
    <PageHeader title="Event Bus" description="The event bus is the heartbeat of SDI One. Events can feed timelines, workflows, notifications, search, audit, AI, and integrations." />
    <div className="grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Recent Events</h2><SimpleTable rows={events} columns={[
        { key: 'eventType', label: 'Event' },
        { key: 'title', label: 'Title' },
        { key: 'severity', label: 'Severity', render: (r:any) => <StatusBadge value={r.severity} /> },
        { key: 'entityType', label: 'Entity' },
      ]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Workflow Subscriptions</h2><SimpleTable rows={subscriptions} columns={[
        { key: 'eventType', label: 'Event' },
        { key: 'workflowKey', label: 'Workflow' },
        { key: 'enabled', label: 'Status', render: (r:any) => <StatusBadge value={r.enabled ? 'Enabled' : 'Disabled'} /> },
      ]} /></div>
    </div>
  </>;
}
