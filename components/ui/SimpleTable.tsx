import Link from 'next/link';

export type Column<T> = { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode; align?: 'left' | 'right' | 'center' };

export function SimpleTable<T extends Record<string, any>>({ rows, columns, empty = 'No records found.' }: { rows: T[]; columns: Column<T>[]; empty?: string }) {
  if (!rows.length) return <div className="card p-10 text-center text-sm font-semibold text-slate-500">{empty}</div>;
  return <div className="card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead><tr>{columns.map(c => <th className={`table-th ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`} key={String(c.key)}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={row.id ?? row.sageId ?? row.customerId ?? row.jobId ?? row.vendorId ?? row.equipmentId ?? i} className="transition hover:bg-blue-50/40">{columns.map(c => <td className={`table-td ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`} key={String(c.key)}>{c.render ? c.render(row) : (row[c.key as string] ?? '—')}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </div>;
}

export function RecordLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="font-black text-blue-700 hover:text-blue-900 hover:underline" href={href}>{children}</Link>;
}
