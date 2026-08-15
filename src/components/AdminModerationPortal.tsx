import { useState } from 'react';
import { Check, X, MessageSquareWarning, TrendingUp, Banknote, Radio, Clock } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { adPackages } from '../data/initialData';
import type { Ad, AdStatus } from '../types';
import { Badge, fireConfetti } from './ui';

const FILTERS: { id: AdStatus | 'all'; label: string }[] = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'active', label: 'Approved' },
  { id: 'revision', label: 'Needs Revision' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
];

export default function AdminModerationPortal() {
  const { ads, moderateAd, user } = useCommunity();
  const [filter, setFilter] = useState<AdStatus | 'all'>('pending');
  const [feedbackFor, setFeedbackFor] = useState<{ ad: Ad; mode: 'revision' | 'rejected' } | null>(null);

  if (!user?.isAdmin) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-stone-400">Admin access required.</div>;
  }

  const filtered = filter === 'all' ? ads : ads.filter((a) => a.status === filter);
  const pending = ads.filter((a) => a.status === 'pending').length;
  const revenue = ads
    .filter((a) => a.status === 'active')
    .reduce((sum, a) => sum + (adPackages.find((p) => p.id === a.tier)?.price ?? 0), 0);
  const totalReach = ads.filter((a) => a.status === 'active').reduce((s, a) => s + (a.reach ?? 0), 0);

  const approve = (ad: Ad) => {
    moderateAd(ad.id, 'active');
    fireConfetti();
  };

  const metrics = [
    { icon: Banknote, label: 'Ad revenue', value: `£${revenue}`, tone: 'text-emerald-600' },
    { icon: TrendingUp, label: 'Broadcast reach', value: `${totalReach.toLocaleString()}+`, tone: 'text-brand-600' },
    { icon: Clock, label: 'Pending queue', value: String(pending), tone: 'text-amber-600' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="font-display text-2xl font-bold text-stone-900">Admin Moderation Portal</h2>
      <p className="mt-1 text-sm text-stone-500">Review, approve and broadcast community adverts.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-stone-200 bg-white p-5">
            <m.icon size={20} className={m.tone} />
            <div className="mt-2 text-2xl font-bold text-stone-900">{m.value}</div>
            <div className="text-xs text-stone-500">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.id ? 'bg-brand-600 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {f.label}
            {f.id === 'pending' && pending > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-[10px] text-white">{pending}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((ad) => (
          <div key={ad.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-col gap-4 p-5 lg:flex-row">
              <div className="h-24 w-full shrink-0 rounded-xl lg:w-40" style={{ background: ad.image }} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-stone-900">{ad.title}</h3>
                  <Badge tone="stone">{ad.category}</Badge>
                  <span className="text-xs text-stone-400">by {ad.authorName}</span>
                </div>
                <p className="text-xs font-semibold text-brand-600">{ad.businessName}</p>
                <p className="mt-1.5 text-sm text-stone-500">{ad.body}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Radio size={13} /> {ad.channels.join(', ')}
                  </span>
                  <span>{ad.priceRange}</span>
                  <span className="font-semibold text-stone-700">
                    £{adPackages.find((p) => p.id === ad.tier)?.price}
                  </span>
                </div>
                {ad.moderatorNote && (
                  <p className="mt-2 rounded-lg bg-stone-50 p-2 text-xs text-stone-500">Note: {ad.moderatorNote}</p>
                )}
              </div>

              {ad.status === 'pending' && (
                <div className="flex flex-row gap-2 lg:flex-col">
                  <button
                    onClick={() => approve(ad)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    onClick={() => setFeedbackFor({ ad, mode: 'revision' })}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                  >
                    <MessageSquareWarning size={15} /> Revise
                  </button>
                  <button
                    onClick={() => setFeedbackFor({ ad, mode: 'rejected' })}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              )}
              {ad.status !== 'pending' && (
                <div className="flex items-start">
                  <Badge tone={ad.status === 'active' ? 'green' : ad.status === 'revision' ? 'blue' : 'red'}>
                    {ad.status === 'active' ? 'Broadcasted' : ad.status === 'revision' ? 'Revision sent' : 'Rejected'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-stone-400">Nothing in this queue.</p>}
      </div>

      {feedbackFor && (
        <FeedbackModal
          mode={feedbackFor.mode}
          onClose={() => setFeedbackFor(null)}
          onSubmit={(note) => {
            moderateAd(feedbackFor.ad.id, feedbackFor.mode, note);
            setFeedbackFor(null);
          }}
        />
      )}
    </div>
  );
}

function FeedbackModal({
  mode,
  onClose,
  onSubmit,
}: {
  mode: 'revision' | 'rejected';
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState('');
  const presets =
    mode === 'revision'
      ? ['Please add your UK food hygiene rating.', 'Clarify pricing (include VAT).', 'Add a clearer call to action.']
      : ['Breaches ASA financial rules.', 'Unproven medical/health claims.', 'Incomplete or misleading information.'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div className="animate-float-in w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-lg font-bold text-stone-900">
          {mode === 'revision' ? 'Request revision' : 'Reject ad'}
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          {mode === 'revision'
            ? 'Tell the member exactly what to amend. This is delivered to their inbox.'
            : 'Document the policy reason. This is delivered to their inbox.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setNote(p)}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200"
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Your feedback…"
          className="mt-3 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl bg-stone-100 py-2.5 text-sm font-semibold text-stone-600">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(note.trim() || presets[0])}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white ${
              mode === 'revision' ? 'bg-blue-600' : 'bg-red-600'
            }`}
          >
            {mode === 'revision' ? 'Send revision' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
