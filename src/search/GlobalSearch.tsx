import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { SearchDoc, SearchSource, SOURCE_LABEL, searchDocs } from './searchEngine';

interface Props {
  docs: SearchDoc[];
  query: string;
  onQueryChange: (query: string) => void;
  /** وقتی کاربر نتیجه‌ای را انتخاب می‌کند: تب مقصد و شناسه آیتم */
  onSelect: (tab: string, id: string) => void;
}


const ORDER: SearchSource[] = ['law', 'faq', 'template'];

export default function GlobalSearch({ docs, query, onQueryChange, onSelect }: Props) {
  const results = useMemo(() => searchDocs(docs, query, 60), [docs, query]);

  const grouped = ORDER.map(src => ({ src, items: results.filter(r => r.source === src) })).filter(g => g.items.length);

  return (
    <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        <input
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="جستجو در قوانین، پرسش‌ها و قالب‌ها..."
          className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
        />
        {query && (
          <button onClick={() => onQueryChange('')} className="absolute left-3 top-2.5 text-slate-400" aria-label="پاک کردن">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {query.trim() && results.length === 0 && (
        <p className="text-xs text-slate-500 text-center">نتیجه‌ای یافت نشد.</p>
      )}

      {grouped.map(g => (
        <div key={g.src} className="space-y-2">
          <h4 className="text-[11px] font-black text-slate-500">{SOURCE_LABEL[g.src]} ({g.items.length})</h4>
          {g.items.map(r => (
            <button
              key={`${r.source}-${r.id}`}
              onClick={() => { onSelect(r.tab, r.id); onQueryChange(''); }}
              className="w-full text-right p-3 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              <div className="text-xs font-bold text-slate-800">{r.title}</div>
              {r.subject && <div className="text-[10px] text-slate-500 mt-0.5">{r.subject}</div>}
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{r.content}</p>
            </button>
          ))}
        </div>
      ))}
    </section>
  );
}
