import { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { faqs } from '../data/initialData';
import { Modal } from './ui';
import { useCommunity } from '../context/CommunityContext';

export default function HelpFaqModal() {
  const { closeModal } = useCommunity();
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filtered = useMemo(() => {
    if (!q) return faqs;
    const term = q.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term) ||
        f.category.toLowerCase().includes(term)
    );
  }, [q]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof faqs>();
    for (const f of filtered) {
      map.set(f.category, [...(map.get(f.category) ?? []), f]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Modal title="Help & FAQ" onClose={closeModal}>
      <div className="relative">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help articles…"
          className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-5">
        {grouped.map(([category, items]) => (
          <div key={category}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">{category}</p>
            <div className="space-y-2">
              {items.map((f) => {
                const isOpen = openId === f.id;
                return (
                  <div key={f.id} className="overflow-hidden rounded-xl border border-stone-200">
                    <button
                      onClick={() => setOpenId(isOpen ? null : f.id)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-stone-800">{f.question}</span>
                      <ChevronDown size={17} className={`shrink-0 text-stone-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="px-4 pb-4 text-sm text-stone-600">{f.answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No results for “{q}”.</p>}
      </div>
    </Modal>
  );
}
