import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { universalSearch } from '@/lib/search-engine';

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q ?? '';
  const results = await universalSearch(q);
  return <AppShell><PageHeader eyebrow="Universal Search" title="Search SDI One" description="Search across customers, jobs, vendors, invoices, equipment, inventory, and future connected systems from one place." />
    <form className="card mb-6 flex gap-3 p-4" action="/search"><input name="q" defaultValue={q} placeholder="Search customer, job, invoice, vendor, equipment..." className="input flex-1" /><button className="btn-primary">Search</button></form>
    <div className="card overflow-hidden"><table className="min-w-full"><thead><tr><th className="table-th">Type</th><th className="table-th">Record</th><th className="table-th">Description</th></tr></thead><tbody>{results.map(r => <tr key={`${r.type}-${r.key}`} className="hover:bg-blue-50/40"><td className="table-td"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{r.type}</span></td><td className="table-td"><Link className="font-black text-blue-700 hover:underline" href={r.href}>{r.key}</Link></td><td className="table-td"><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs font-semibold text-slate-500">{r.subtitle}</div></td></tr>)}</tbody></table>{!q && <div className="p-8 text-center text-sm font-semibold text-slate-500">Enter a search term to search across SDI One.</div>}{q && !results.length && <div className="p-8 text-center text-sm font-semibold text-slate-500">No results found.</div>}</div>
  </AppShell>;
}
