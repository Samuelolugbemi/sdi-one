export function ExportButton({ dataset }: { dataset: string }) {
  return <a className="btn btn-primary" href={`/api/export?dataset=${encodeURIComponent(dataset)}`}>Export CSV</a>;
}
