import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  tone?: 'blue' | 'green' | 'amber' | 'slate';
};

const toneClasses = {
  blue: 'from-blue-600/10 to-cyan-500/10 text-blue-700',
  green: 'from-emerald-600/10 to-teal-500/10 text-emerald-700',
  amber: 'from-amber-500/10 to-orange-500/10 text-amber-700',
  slate: 'from-slate-700/10 to-slate-400/10 text-slate-700'
};

export function KpiCard({ label, value, sub, href, tone = 'blue' }: Props) {
  const inner = <div className="card card-hover group relative overflow-hidden p-5">
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClasses[tone]}`} />
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-black text-slate-500">{label}</div>
        <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>
      </div>
      {href && <div className="rounded-2xl bg-slate-50 p-2 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></div>}
    </div>
    {sub && <div className="mt-3 text-xs font-semibold text-slate-500">{sub}</div>}
  </div>;
  return href ? <Link href={href}>{inner}</Link> : inner;
}
