'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function BarChartCard({ title, data, xKey, yKey }: { title: string; data: any[]; xKey: string; yKey: string }) {
  return <div className="card p-5"><h3 className="mb-4 font-bold text-slate-900">{title}</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey={xKey} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey={yKey} fill="#2563eb" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div></div>;
}
