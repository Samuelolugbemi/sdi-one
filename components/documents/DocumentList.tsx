import Link from 'next/link';
import { formatDate } from '@/lib/format';

export function formatBytes(size?: number | null) {
  if (!size) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({ documents }: { documents: any[] }) {
  if (!documents.length) return <div className="card p-10 text-center text-sm font-semibold text-slate-500">No documents yet.</div>;
  return <div className="card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead><tr>
          <th className="table-th">Document</th>
          <th className="table-th">Entity</th>
          <th className="table-th">Category</th>
          <th className="table-th">Size</th>
          <th className="table-th">Uploaded</th>
          <th className="table-th">Actions</th>
        </tr></thead>
        <tbody>{documents.map(doc => <tr key={doc.id} className="transition hover:bg-blue-50/40">
          <td className="table-td"><Link href={`/dashboard/documents/${doc.id}`} className="font-black text-blue-700 hover:underline">{doc.originalName || doc.fileName}</Link><div className="text-xs text-slate-500">{doc.description || doc.mimeType || 'Document'}</div></td>
          <td className="table-td"><span className="font-black">{doc.entityType}</span><div className="text-xs text-slate-500">{doc.entityKey}</div></td>
          <td className="table-td">{doc.category || 'Other'}</td>
          <td className="table-td">{formatBytes(doc.sizeBytes)}</td>
          <td className="table-td">{formatDate(doc.createdAt)}</td>
          <td className="table-td"><a href={`/api/documents/${doc.id}/download`} className="font-black text-blue-700 hover:underline">Download</a></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}
