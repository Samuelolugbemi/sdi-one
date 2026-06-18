import { ReactNode } from 'react';

export function MetadataTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{columns.map(column => <th key={column} className="px-5 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => <tr key={index} className="hover:bg-slate-50/70">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 align-top text-slate-700">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
