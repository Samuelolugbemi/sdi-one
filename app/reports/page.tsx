import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { ExportButton } from '@/components/ui/ExportButton';
export default function ReportsPage(){return <AppShell><PageHeader title="Reports" description="Direct exports for every implemented dataset."/><div className="grid gap-4 md:grid-cols-3">{['executive','financial','customers','jobs','vendors','invoices','invoice-lines','equipment','inventory','import-runs'].map(d=><div className="card p-5" key={d}><div className="mb-3 font-bold capitalize">{d.replace('-', ' ')}</div><ExportButton dataset={d}/></div>)}</div></AppShell>}
