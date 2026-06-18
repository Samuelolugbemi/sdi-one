import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function PlanningBoardsPage() {
  const boards = await prisma.planningBoard.findMany({ include: { items: true, tasks: true }, orderBy: { name: 'asc' } });
  return <AppShell>
    <PageHeader title="Planning Boards" description="Board-level view of Monday.com and SDI planning boards." />
    <SimpleTable rows={boards} columns={[{key:'name',label:'Board',render:r=><RecordLink href={`/dashboard/planning?board=${r.boardKey}`}>{r.name}</RecordLink>},{key:'ownerTeam',label:'Team'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'sourceSystem',label:'Source'},{key:'mondayBoardId',label:'Monday ID'},{key:'items',label:'Items',render:r=>r.items.length},{key:'tasks',label:'Tasks',render:r=>r.tasks.length}]} />
  </AppShell>;
}
