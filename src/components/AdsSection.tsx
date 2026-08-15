import { useState } from 'react';
import { MessageCircle, Plus, Radio } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { AD_CATEGORIES, adPackages } from '../data/initialData';
import { Badge } from './ui';

const CHANNEL_TONE: Record<string, string> = {
  WhatsApp: 'green',
  Facebook: 'blue',
  Telegram: 'blue',
  'Web Directory': 'stone',
  'Email Newsletter': 'gold',
};

export default function AdsSection() {
  const { ads, openModal, user } = useCommunity();
  const [cat, setCat] = useState('All');

  const active = ads.filter((a) => a.status === 'active');
  const filtered = active.filter((a) => cat === 'All' || a.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">Community Ads Board</h2>
          <p className="mt-1 text-sm text-stone-500">
            Diaspora businesses broadcast across our WhatsApp, Facebook & Telegram channels.
          </p>
        </div>
        <button
          onClick={() => (user ? openModal({ type: 'submitAd' }) : openModal({ type: 'auth' }))}
          className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={17} /> Submit an ad
        </button>
      </div>

      {/* Packages */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {adPackages.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border p-5 ${
              p.id === 'featured' ? 'border-brand-400 bg-brand-50/50 ring-1 ring-brand-300' : 'border-stone-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900">{p.name}</h3>
              {p.id === 'featured' && <Badge tone="brand">Popular</Badge>}
            </div>
            <p className="mt-1 text-2xl font-bold text-stone-900">£{p.price}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <Radio size={15} className="mt-0.5 shrink-0 text-brand-500" /> {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {['All', ...AD_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              cat === c ? 'bg-brand-600 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Ads grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ad) => (
          <article
            key={ad.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-28" style={{ background: ad.image }}>
              <div className="absolute right-3 top-3">
                <Badge tone="gold">{ad.category}</Badge>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-bold text-stone-900">{ad.title}</h3>
              <p className="text-xs font-semibold text-brand-600">{ad.businessName}</p>
              <p className="mt-2 flex-1 text-sm text-stone-500">{ad.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ad.channels.map((ch) => (
                  <Badge key={ch} tone={CHANNEL_TONE[ch] ?? 'stone'}>
                    {ch}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-stone-900">{ad.priceRange}</span>
                <a
                  href={`https://wa.me/${ad.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <MessageCircle size={15} /> {ad.cta}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-stone-400">No live ads in this category yet. Be the first to advertise!</p>
      )}
    </div>
  );
}
