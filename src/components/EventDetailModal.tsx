import { useState } from 'react';
import { Check, CreditCard, Wallet, MapPin, Calendar } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import type { Dietary, Guest } from '../types';
import { Modal, Badge } from './ui';

const DIETARY: Dietary[] = ['None', 'Halal', 'Vegan', 'Gluten-free', 'Traditional'];

export default function EventDetailModal({ eventId }: { eventId: string }) {
  const { events, closeModal, createBooking, wallet, openModal } = useCommunity();
  const event = events.find((e) => e.id === eventId);

  const [tierId, setTierId] = useState(event?.tiers[0]?.id ?? '');
  const [guests, setGuests] = useState<Guest[]>([{ name: '', dietary: 'None' }]);
  const [pay, setPay] = useState<'wallet' | 'card'>('wallet');

  if (!event) return null;
  const tier = event.tiers.find((t) => t.id === tierId) ?? event.tiers[0];
  const total = tier.price * guests.length;
  const canWallet = wallet >= total;

  const setQty = (q: number) => {
    const next = Math.max(1, Math.min(8, q));
    setGuests((prev) => {
      const copy = [...prev];
      while (copy.length < next) copy.push({ name: '', dietary: 'None' });
      return copy.slice(0, next);
    });
  };

  const updateGuest = (i: number, patch: Partial<Guest>) =>
    setGuests((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  const handleBook = () => {
    if (pay === 'wallet' && !canWallet) return;
    const booking = createBooking(event, tier.name, tier.price, guests, pay);
    if (booking) {
      closeModal();
      openModal({ type: 'ticket', bookingId: booking.id });
    }
  };

  return (
    <Modal title={event.title} onClose={closeModal} wide>
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="h-32 rounded-2xl" style={{ background: event.image }} />
          <div className="mt-3 space-y-1.5 text-sm text-stone-600">
            <p className="flex items-center gap-1.5">
              <Calendar size={15} className="text-brand-600" />
              {new Date(event.date).toLocaleString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin size={15} className="text-brand-600" />
              {event.venue}, {event.address}
            </p>
          </div>
          <p className="mt-3 text-sm text-stone-500">{event.summary}</p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-stone-800">Choose your ticket</h3>
          <div className="mt-2 space-y-2">
            {event.tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setTierId(t.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                  tierId === t.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{t.name}</span>
                    {t.name === 'Early Sister' && <Badge tone="green">Discount</Badge>}
                    {t.name === 'VIP' && <Badge tone="gold">VIP</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500">{t.perks.join(' · ')}</p>
                </div>
                <span className="text-lg font-bold text-stone-900">£{t.price}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-800">Guests</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(guests.length - 1)}
                className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-lg font-bold text-stone-600 hover:bg-stone-200"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{guests.length}</span>
              <button
                onClick={() => setQty(guests.length + 1)}
                className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-lg font-bold text-stone-600 hover:bg-stone-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {guests.map((g, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={g.name}
                  onChange={(e) => updateGuest(i, { name: e.target.value })}
                  placeholder={`Guest ${i + 1} name`}
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                />
                <select
                  value={g.dietary}
                  onChange={(e) => updateGuest(i, { dietary: e.target.value as Dietary })}
                  className="rounded-xl border border-stone-200 px-2 py-2 text-sm focus:border-brand-400 focus:outline-none"
                >
                  {DIETARY.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">
                {tier.name} × {guests.length}
              </span>
              <span className="text-xl font-bold text-stone-900">£{total.toFixed(2)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPay('wallet')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition ${
                  pay === 'wallet' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600'
                }`}
              >
                <Wallet size={15} /> Wallet (£{wallet.toFixed(0)})
              </button>
              <button
                onClick={() => setPay('card')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition ${
                  pay === 'card' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-600'
                }`}
              >
                <CreditCard size={15} /> Card / Apple Pay
              </button>
            </div>
            {pay === 'wallet' && !canWallet && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Insufficient balance. Top up your wallet or pay by card.
              </p>
            )}
            <button
              onClick={handleBook}
              disabled={pay === 'wallet' && !canWallet}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} /> Confirm & pay £{total.toFixed(2)}
            </button>
            <p className="mt-2 text-center text-[11px] text-stone-400">Card payments are simulated for this demo.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
