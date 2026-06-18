import { PageHeader } from '../../../../components/ui/PageHeader';
import { ExecutiveBriefingLive } from '../../../../components/ai/ExecutiveBriefingLive';

export default function ExecutiveBriefingPage() {
  return <>
    <PageHeader title="Executive Briefing" description="A data-driven operating summary for executives, combining imported accounting, job, vendor, equipment, and inventory context." />
    <ExecutiveBriefingLive />
  </>;
}
