import { Crown, Mail, Wallet, HelpCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import type { Tab } from '../types';

const TABS: { id: Tab; label: string; adminOnly?: boolean }[] = [
  { id: 'events', label: 'Events' },
  { id: 'ads', label: 'Ads Board' },
  { id: 'my-ads', label: 'My Ads' },
  { id: 'directory', label: 'Directory' },
  { id: 'stories', label: 'Stories' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'admin', label: 'Admin', adminOnly: true },
];

export default function Navbar() {
  const { activeTab, setActiveTab, user, wallet, unreadCount, openModal, logout } = useCommunity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleTabs = TABS.filter((t) => !t.adminOnly || user?.isAdmin);

  const go = (t: Tab) => {
    setActiveTab(t);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button onClick={() => go('events')} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-sm">
            <Crown size={20} />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-display text-lg font-bold text-brand-800">NWUK</span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-stone-500">
              Nigerian Women in the UK
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                activeTab === t.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal({ type: 'help' })}
            className="hidden rounded-full p-2.5 text-stone-500 transition hover:bg-stone-100 sm:block"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={() => openModal({ type: 'wallet' })}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Wallet size={17} />
            <span className="tabular-nums">£{wallet.toFixed(2)}</span>
          </button>
          <button
            onClick={() => openModal({ type: 'inbox' })}
            className="relative rounded-full p-2.5 text-stone-500 transition hover:bg-stone-100"
            aria-label="Inbox"
          >
            <Mail size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={() => openModal({ type: 'profile' })}
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-gold-500 text-sm font-bold text-white"
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => openModal({ type: 'auth' })}
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Sign in
            </button>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2.5 text-stone-600 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-stone-100 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {user && (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="mt-3 w-full rounded-xl bg-stone-100 px-3 py-2.5 text-sm font-semibold text-stone-600"
            >
              Sign out
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
