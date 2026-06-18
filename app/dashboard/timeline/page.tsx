import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TimelineList } from '@/components/ui/TimelineList';
import { WorkspaceTabs } from '@/components/ui/WorkspacePanel';
import { getTimeline } from '@/lib/timeline-engine';

export default async function TimelinePage({ searchParams }: { searchParams?: { entity?: string; key?: string } }) {
  const items = await getTimeline(searchParams?.entity, searchParams?.key, 100);
  const scoped = searchParams?.entity && searchParams?.key;
  return <AppShell><PageHeader eyebrow="Timeline Engine" title={scoped ? `Timeline: ${searchParams!.entity} ${searchParams!.key}` : 'Universal Business Timeline'} description="A chronological operational history across imports, jobs, invoices, inventory, documents, and future integrations." />
    <WorkspaceTabs tabs={['All Events','Financial','Inventory','Imports','Workflow']} />
    <TimelineList items={items} />
  </AppShell>;
}
