import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { Column, SimpleTable } from './SimpleTable';

export function EntityGrid<T extends Record<string, any>>({
  title,
  description,
  rows,
  columns,
  dataset,
  q,
  placeholder,
  totalLabel,
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  dataset: string;
  q?: string;
  placeholder?: string;
  totalLabel?: string;
}) {
  return <div className="space-y-4">
    <div className="card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="section-title">Data Explorer</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form className="relative" action="">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input name="q" defaultValue={q ?? ''} className="input w-full pl-9 sm:w-80" placeholder={placeholder ?? 'Search records...'} />
          </form>
          <ExportButton dataset={dataset} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
        <span className="badge badge-blue">{rows.length.toLocaleString()} shown</span>
        {totalLabel && <span className="badge badge-slate">{totalLabel}</span>}
        <span className="badge badge-green">Live database</span>
      </div>
    </div>
    <SimpleTable rows={rows} columns={columns} empty={`No ${title.toLowerCase()} found.`} />
  </div>;
}

export function RecordLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="font-black text-blue-700 hover:text-blue-900 hover:underline" href={href}>{children}</Link>;
}
