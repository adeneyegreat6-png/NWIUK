import { useMemo, useState } from 'react';
import { BadgeCheck, MessageCircle, Search, Star } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Badge } from './ui';

export default function BusinessDirectory() {
  const { businesses, openModal } = useCommunity();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [city, setCity] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(businesses.map((b) => b.category)))], [businesses]);
  const cities = useMemo(() => ['All', ...Array.from(new Set(businesses.map((b) => b.city)))], [businesses]);

  const filtered = businesses.filter((b) => {
    const okQ =
      !q ||
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      b.description.toLowerCase().includes(q.toLowerCase());
    return okQ && (cat === 'All' || b.category === cat) && (city === 'All' || b.city === city);
  });

  const avg = (b: (typeof businesses)[number]) =>
    b.reviews.length ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="font-display text-2xl font-bold text-stone-900">Verified Business Directory</h2>
      <p className="mt-1 text-sm text-stone-500">Trusted diaspora providers, reviewed by the community.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search businesses…"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700">
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700">
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => {
          const rating = avg(b);
          return (
            <article key={b.id} className="flex flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-2xl">{b.logo}</div>
                {b.verified && (
                  <Badge tone="green">
                    <BadgeCheck size={13} /> Verified
                  </Badge>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-stone-900">{b.name}</h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-500">
                <span>{b.category}</span>·<span>{b.city}</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-stone-500">{b.description}</p>

              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} className={n <= Math.round(rating) ? 'fill-gold-500 text-gold-500' : 'text-stone-300'} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  {rating ? rating.toFixed(1) : 'New'} · {b.reviews.length} review{b.reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openModal({ type: 'reviews', businessId: b.id })}
                  className="flex-1 rounded-full bg-stone-100 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
                >
                  Reviews
                </button>
                <a
                  href={`https://wa.me/${b.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <MessageCircle size={14} /> Contact
                </a>
              </div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="mt-10 text-center text-stone-400">No businesses match your search.</p>}
    </div>
  );
}
