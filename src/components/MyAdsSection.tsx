import { useState } from 'react';
import { Plus, Pencil, Radio, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { Ad, AdStatus } from '../types';
import { Badge } from './ui';

const STATUS_META: Record<AdStatus, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', tone: 'gold', icon: Clock },
  active: { label: 'Active & Broadcasted', tone: 'green', icon: CheckCircle2 },
  revision: { label: 'Needs Revision', tone: 'blue', icon: AlertTriangle },
  rejected: { label: 'Rejected', tone: 'red', icon: XCircle },
  expired: { label: 'Expired', tone: 'stone', icon: Clock },
};

export default function MyAdsSection() {
  const { ads, user, openModal, resubmitAd } = useCommunity();
  const [editing, setEditing] = useState<Ad | null>(null);

  // Ads authored by this member (seed ads are attributed to "Community").
  const mine = ads.filter((a) => a.authorName === user?.name);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-900">Sign in to manage your ads</h2>
        <button
          onClick={() => openModal({ type: 'auth' })}
          className="mt-4 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">My Ads</h2>
          <p className="mt-1 text-sm text-stone-500">Track status, reach and moderator feedback.</p>
        </div>
        <button
          onClick={() => openModal({ type: 'submitAd' })}
          className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={17} /> New ad
        </button>
      </div>

      {mine.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 py-16 text-center">
          <p className="text-stone-400">You haven’t submitted any ads yet.</p>
          <button
            onClick={() => openModal({ type: 'submitAd' })}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Submit your first ad
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {mine.map((ad) => {
            const meta = STATUS_META[ad.status];
            return (
              <div key={ad.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  <div className="h-20 w-full shrink-0 rounded-xl sm:w-32" style={{ background: ad.image }} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-stone-900">{ad.title}</h3>
                      <Badge tone={meta.tone}>
                        <meta.icon size={12} /> {meta.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">{ad.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Radio size={13} /> {ad.channels.join(', ')}
                      </span>
                      {ad.status === 'active' && ad.reach && (
                        <span className="font-semibold text-emerald-600">Reach {ad.reach.toLocaleString()}+</span>
                      )}
                    </div>
                    {ad.moderatorNote && (
                      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-sm text-blue-800">
                        <span className="font-semibold">Moderator: </span>
                        {ad.moderatorNote}
                      </div>
                    )}
                  </div>
                  {ad.status === 'revision' && (
                    <button
                      onClick={() => setEditing(ad)}
                      className="flex h-fit items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      <Pencil size={14} /> Revise
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <ReviseModal
          ad={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            resubmitAd(editing.id, patch);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ReviseModal({
  ad,
  onClose,
  onSave,
}: {
  ad: Ad;
  onClose: () => void;
  onSave: (patch: Partial<Ad>) => void;
}) {
  const [title, setTitle] = useState(ad.title);
  const [body, setBody] = useState(ad.body);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div className="animate-float-in w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-lg font-bold text-stone-900">Revise your ad</h3>
        {ad.moderatorNote && (
          <p className="mt-2 rounded-lg bg-blue-50 p-2.5 text-sm text-blue-800">{ad.moderatorNote}</p>
        )}
        <label className="mt-4 block text-sm font-semibold text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <label className="mt-3 block text-sm font-semibold text-stone-700">Description</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl bg-stone-100 py-2.5 text-sm font-semibold text-stone-600">
            Cancel
          </button>
          <button
            onClick={() => onSave({ title: title.trim(), body: body.trim() })}
            className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white"
          >
            Resubmit
          </button>
        </div>
      </div>
    </div>
  );
}
