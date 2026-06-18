export function money(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
export function num(value: number | string | null | undefined) {
  return new Intl.NumberFormat('en-US').format(Number(value ?? 0));
}
export function date(value: Date | string | null | undefined) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US');
}
export function pct(value: number | null | undefined) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}
