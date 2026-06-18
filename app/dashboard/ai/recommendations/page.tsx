import { prisma } from '../../../../lib/prisma';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';

export default async function AiRecommendationsPage() {
  const recs = await prisma.aiRecommendation.findMany({ orderBy: { createdAt: 'desc' }});
  return <>
    <PageHeader title="AI Recommendations" description="Rule-based and LLM-generated recommendations that will become actionable tasks, alerts, and workflows." />
    <SimpleTable rows={recs} columns={[
      { key: 'title', label: 'Recommendation' },
      { key: 'category', label: 'Category' },
      { key: 'impact', label: 'Impact' },
      { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
      { key: 'source', label: 'Source' },
    ]} />
  </>;
}
