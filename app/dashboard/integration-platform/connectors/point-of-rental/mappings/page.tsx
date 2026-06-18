import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { porFieldMaps } from '../../../../../../lib/integrations/point-of-rental/field-maps';

export default function PorMappingsPage() {
  const entries = Object.entries(porFieldMaps);
  return <>
    <PageHeader title="POR Field Mappings" description="Field-level mapping registry for POR equipment, repair costs, rental history, availability and outbound cost updates." />
    <div className="grid gap-5 lg:grid-cols-2">
      {entries.map(([objectKey, mapping]) => <div key={objectKey} className="card p-5">
        <div className="section-title">{objectKey}</div>
        <div className="mt-4 space-y-2">
          {Object.entries(mapping as Record<string, string>).map(([source, target]) => <div key={source} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-black">{source}</span><span className="badge badge-blue">{target}</span></div>)}
        </div>
      </div>)}
    </div>
  </>;
}
