'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { documentCategories, documentEntityTypes } from '@/lib/document-engine';

export function DocumentUploadForm({ defaultEntityType = 'job', defaultEntityKey = '' }: { defaultEntityType?: string; defaultEntityKey?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  async function submit(formData: FormData) {
    setIsUploading(true);
    setStatus('Uploading document...');
    const response = await fetch('/api/documents/upload', { method: 'POST', body: formData });
    if (!response.ok) {
      setStatus('Upload failed. Check file and required fields.');
      setIsUploading(false);
      return;
    }
    setStatus('Document uploaded successfully.');
    setIsUploading(false);
    router.refresh();
  }

  return <form action={submit} className="card p-6 space-y-5">
    <div>
      <div className="section-title">Upload Document</div>
      <p className="mt-2 text-sm text-slate-600">Attach files to customers, jobs, invoices, equipment, vendors or platform records.</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm font-bold text-slate-700">Entity Type
        <select name="entityType" defaultValue={defaultEntityType} className="input">
          {documentEntityTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          <option value="invoice">Invoices</option>
          <option value="platform">Platform</option>
        </select>
      </label>
      <label className="space-y-2 text-sm font-bold text-slate-700">Entity Key
        <input name="entityKey" defaultValue={defaultEntityKey} required className="input" placeholder="e.g. 07194-26-01, C000003, 56-7065" />
      </label>
      <label className="space-y-2 text-sm font-bold text-slate-700">Entity Label
        <input name="entityLabel" className="input" placeholder="Optional readable name" />
      </label>
      <label className="space-y-2 text-sm font-bold text-slate-700">Category
        <select name="category" className="input">
          {documentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
    </div>

    <label className="space-y-2 text-sm font-bold text-slate-700 block">Description
      <textarea name="description" className="input min-h-24" placeholder="What is this document and why does it matter?" />
    </label>

    <label className="space-y-2 text-sm font-bold text-slate-700 block">File
      <input name="file" required type="file" className="input" />
    </label>

    <button disabled={isUploading} className="btn-primary" type="submit">{isUploading ? 'Uploading...' : 'Upload Document'}</button>
    {status && <p className="text-sm font-bold text-blue-700">{status}</p>}
  </form>;
}
