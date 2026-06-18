export function SearchForm({ placeholder = 'Search...', defaultValue = '' }: { placeholder?: string; defaultValue?: string }) {
  return <form className="mb-4 flex gap-2"><input className="input w-full max-w-lg" name="q" defaultValue={defaultValue} placeholder={placeholder} /><button className="btn" type="submit">Search</button></form>;
}
