export function MetadataStat({ label, value, help }: { label: string; value: string | number; help?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
      {help ? <p className="mt-2 text-sm leading-6 text-slate-500">{help}</p> : null}
    </div>
  );
}
