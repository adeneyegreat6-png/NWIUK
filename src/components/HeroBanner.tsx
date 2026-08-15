import { Sparkles, Users, MapPin, CalendarHeart } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';

export default function HeroBanner() {
  const { events, setActiveTab } = useCommunity();

  const stats = [
    { icon: Users, label: 'Community members', value: '25,000+' },
    { icon: CalendarHeart, label: 'Upcoming events', value: String(events.length) },
    { icon: MapPin, label: 'UK cities', value: '5+' },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} /> Sisterhood · Enterprise · Community
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Where Nigerian women in the UK rise together.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
              Book galas and retreats, broadcast your business across our 25,000+ member channels, and connect with
              verified diaspora providers — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('events')}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                Browse events
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className="rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-stone-900 shadow-sm transition hover:bg-gold-400"
              >
                Advertise your business
              </button>
            </div>
          </div>

          <div className="relative mt-10 grid grid-cols-3 gap-3 sm:max-w-lg">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <s.icon size={20} className="text-gold-400" />
                <div className="mt-2 text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
