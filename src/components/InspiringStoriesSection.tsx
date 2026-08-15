import { useState } from 'react';
import { Sparkles, Quote, Loader2, RefreshCw } from 'lucide-react';
import type { Spotlight } from '../types';
import { Badge } from './ui';

const PROFESSIONS = ['Any', 'NHS Doctor', 'Solicitor', 'Fintech Founder', 'Creative Director', 'Academic'];
const REGIONS = ['Any', 'London', 'Midlands', 'North West', 'Scotland'];

export default function InspiringStoriesSection() {
  const [profession, setProfession] = useState('Any');
  const [region, setRegion] = useState('Any');
  const [loading, setLoading] = useState(false);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [error, setError] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: profession === 'Any' ? undefined : profession,
          region: region === 'Any' ? undefined : region,
        }),
      });
      const data: Spotlight = await res.json();
      setSpotlight(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          <Sparkles size={14} /> AI-powered spotlights
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-stone-900">Inspiring Diaspora Stories</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-500">
          Generate uplifting career spotlights of Nigerian women leaders across the UK — filter by profession and region.
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-end justify-center gap-3">
        <label className="flex-1 min-w-[160px]">
          <span className="mb-1 block text-xs font-semibold text-stone-600">Profession</span>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"
          >
            {PROFESSIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="mb-1 block text-xs font-semibold text-stone-600">UK Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"
          >
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
          {spotlight ? 'Regenerate' : 'Generate spotlight'}
        </button>
      </div>

      {error && (
        <p className="mt-6 text-center text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      {spotlight && !loading && (
        <article className="animate-float-in mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg">
          <div className="bg-gradient-to-br from-brand-800 via-brand-600 to-gold-500 px-8 py-8 text-white">
            <div className="flex items-center justify-between">
              <Badge tone="gold">{spotlight.profession}</Badge>
              <span className="text-xs text-white/70">
                {spotlight.source === 'ai' ? '✨ Gemini generated' : '📚 Curated profile'}
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-bold">{spotlight.name}</h3>
            <p className="mt-1 text-white/85">
              {spotlight.headline} · {spotlight.region}
            </p>
          </div>

          <div className="px-8 py-6">
            <p className="text-stone-600">{spotlight.journey}</p>

            <blockquote className="my-6 flex gap-3 rounded-2xl bg-brand-50 p-5">
              <Quote size={28} className="shrink-0 text-brand-400" />
              <p className="font-display text-lg italic text-brand-800">“{spotlight.quote}”</p>
            </blockquote>

            <div className="grid grid-cols-3 gap-3">
              {spotlight.impact.map((m) => (
                <div key={m.label} className="rounded-2xl bg-stone-50 p-4 text-center">
                  <div className="font-display text-2xl font-bold text-brand-700">{m.value}</div>
                  <div className="mt-1 text-[11px] leading-tight text-stone-500">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gold-500/30 bg-amber-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">Sisterhood advice</p>
              <p className="mt-1 text-stone-700">{spotlight.advice}</p>
            </div>
          </div>
        </article>
      )}

      {!spotlight && !loading && (
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-dashed border-stone-300 py-14 text-center">
          <RefreshCw size={28} className="mx-auto text-stone-300" />
          <p className="mt-3 text-sm text-stone-400">Choose your filters and generate a spotlight.</p>
        </div>
      )}
    </div>
  );
}
