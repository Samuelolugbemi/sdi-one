export function StatusBadge({ value }: { value?: string | null }) {
  const v = (value || 'Unknown').toString();
  const lower = v.toLowerCase();
  const cls = lower.includes('success') || lower.includes('active') || lower.includes('complete')
    ? 'badge-green'
    : lower.includes('error') || lower.includes('failed') || lower.includes('inactive')
      ? 'badge-amber'
      : lower.includes('open') || lower.includes('live')
        ? 'badge-blue'
        : 'badge-slate';
  return <span className={`badge ${cls}`}>{v}</span>;
}
