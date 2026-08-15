import { useMemo, useState } from 'react';
import { MapPin, Calendar, Ticket, Users } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { EventCategory } from '../types';
import { Badge } from './ui';

const CATEGORIES: (EventCategory | 'All')[] = ['All', 'Gala', 'Career', 'Cultural', 'Wellness', 'Retreat'];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsSection() {
  const { events, bookings, openModal, user } = useCommunity();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const [city, setCity] = useState('All');

  const cities = useMemo(() => ['All', ...Array.from(new Set(events.map((e) => e.city)))], [events]);

  const filtered = events.filter(
    (e) => (cat === 'All' || e.category === cat) && (city === 'All' || e.city === city)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {bookings.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl font-bold text-stone-900">My Bookings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => openModal({ type: 'ticket', bookingId: b.id })}
                className="group text-left rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Badge tone="green">
                    <Ticket size={12} /> {b.tierName} ×{b.quantity}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-stone-500">{b.reference}</span>
                </div>
                <h3 className="mt-2 font-semibold text-stone-900 group-hover:text-brand-700">{b.eventTitle}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                  <Calendar size={13} /> {fmtDate(b.date)} · {b.city}
                </p>
                <span className="mt-3 inline-block text-xs font-semibold text-brand-600">View pass →</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">Upcoming Events</h2>
          <p className="mt-1 text-sm text-stone-500">Galas, career masterclasses, cultural nights & international retreats.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:border-brand-400 focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
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

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => {
          const from = Math.min(...e.tiers.map((t) => t.price));
          return (
            <article
              key={e.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40" style={{ background: e.image }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge tone="gold">{e.category}</Badge>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <MapPin size={14} /> {e.city}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium">
                    <Users size={13} /> {e.spotsLeft} left
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  <Calendar size={13} /> {fmtDate(e.date)}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-stone-900">{e.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-stone-500">{e.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400">From</span>
                    <div className="text-lg font-bold text-stone-900">£{from}</div>
                  </div>
                  <button
                    onClick={() => (user ? openModal({ type: 'event', eventId: e.id }) : openModal({ type: 'auth' }))}
                    className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-stone-400">No events match your filters yet — check back soon.</p>
      )}
    </div>
  );
}
