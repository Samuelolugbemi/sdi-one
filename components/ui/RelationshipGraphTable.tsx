import Link from 'next/link';
import type { RelationshipEdge } from '@/lib/relationship-engine';

export function RelationshipGraphTable({ edges }: { edges: RelationshipEdge[] }) {
  if (!edges.length) return <div className="card p-8 text-center text-sm font-semibold text-slate-500">No relationships found.</div>;
  return <div className="card overflow-hidden"><table className="min-w-full"><thead><tr><th className="table-th">Source</th><th className="table-th">Relationship</th><th className="table-th">Target</th><th className="table-th">Strength</th></tr></thead><tbody>{edges.map((e, i) => <tr key={`${e.source.type}-${e.source.key}-${e.target.type}-${e.target.key}-${i}`} className="hover:bg-blue-50/40"><td className="table-td"><Link href={e.source.href} className="font-black text-blue-700 hover:underline">{e.source.label}: {e.source.key}</Link></td><td className="table-td font-semibold">{e.relationship}</td><td className="table-td"><Link href={e.target.href} className="font-black text-blue-700 hover:underline">{e.target.label}: {e.target.key}</Link></td><td className="table-td"><span className={`rounded-full px-2.5 py-1 text-xs font-black ${e.strength === 'direct' ? 'bg-emerald-50 text-emerald-700' : e.strength === 'derived' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{e.strength}</span></td></tr>)}</tbody></table></div>;
}
