import { useState } from 'react';
import { LogOut, ShieldCheck, Ticket, Megaphone } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { UK_CITIES } from '../data/initialData';
import { Modal, Badge } from './ui';

export default function UserProfileModal() {
  const { user, updateProfile, logout, closeModal, bookings, ads } = useCommunity();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [city, setCity] = useState(user?.city ?? UK_CITIES[0]);

  if (!user) return null;
  const myAds = ads.filter((a) => a.authorName === user.name).length;

  return (
    <Modal title="My Profile" onClose={closeModal}>
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-gold-500 text-2xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-stone-900">{user.name}</h3>
          <p className="text-sm text-stone-500">{user.email}</p>
          {user.isAdmin && (
            <Badge tone="brand">
              <ShieldCheck size={12} /> Moderator
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-stone-50 p-4">
          <Ticket size={18} className="text-brand-600" />
          <div className="mt-1 text-2xl font-bold text-stone-900">{bookings.length}</div>
          <div className="text-xs text-stone-500">Bookings</div>
        </div>
        <div className="rounded-2xl bg-stone-50 p-4">
          <Megaphone size={18} className="text-brand-600" />
          <div className="mt-1 text-2xl font-bold text-stone-900">{myAds}</div>
          <div className="text-xs text-stone-500">Ads submitted</div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">City</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none">
            {UK_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => {
            updateProfile({ name: name.trim() || user.name, email: email.trim() || user.email, city });
            closeModal();
          }}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Save changes
        </button>
        <button
          onClick={() => {
            logout();
            closeModal();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-200"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </Modal>
  );
}
