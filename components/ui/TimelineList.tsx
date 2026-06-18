import Link from 'next/link';
import { date } from '@/lib/format';

export function TimelineList({ items }: { items: { id: string; title: string; description?: string; occurredAt: Date; source: string; href?: string }[] }) {
  if (!items.length) return <div className="card p-8 text-center text-sm font-semibold text-slate-500">No timeline events yet.</div>;
  return <div className="card divide-y divide-slate-100 overflow-hidden">
    {items.map(item => <div key={item.id} className="flex gap-4 p-4 hover:bg-blue-50/40">
      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600 ring-4 ring-blue-100" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black text-slate-950">{item.href ? <Link className="hover:text-blue-700" href={item.href}>{item.title}</Link> : item.title}</div><div className="text-xs font-bold text-slate-500">{date(item.occurredAt)}</div></div>
        {item.description && <div className="mt-1 text-sm font-semibold leading-6 text-slate-600">{item.description}</div>}
        <div className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{item.source}</div>
      </div>
    </div>)}
  </div>;
}
