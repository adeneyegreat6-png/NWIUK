import { CheckCircle2, XCircle, Info, Crown } from 'lucide-react';
import { useCommunity } from './context/CommunityContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import EventsSection from './components/EventsSection';
import AdsSection from './components/AdsSection';
import MyAdsSection from './components/MyAdsSection';
import BusinessDirectory from './components/BusinessDirectory';
import InspiringStoriesSection from './components/InspiringStoriesSection';
import GuidelinesSection from './components/GuidelinesSection';
import AdminModerationPortal from './components/AdminModerationPortal';

import EventDetailModal from './components/EventDetailModal';
import TicketModal from './components/TicketModal';
import SubmitAdModal from './components/SubmitAdModal';
import BusinessReviewsModal from './components/BusinessReviewsModal';
import EmailInboxModal from './components/EmailInboxModal';
import WalletTopUpModal from './components/WalletTopUpModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import HelpFaqModal from './components/HelpFaqModal';

export default function App() {
  const { activeTab, modal, toasts } = useCommunity();

  return (
    <div className="min-h-screen">
      <Navbar />

      {activeTab === 'events' && <HeroBanner />}

      <main className="pb-16">
        {activeTab === 'events' && <EventsSection />}
        {activeTab === 'ads' && <AdsSection />}
        {activeTab === 'my-ads' && <MyAdsSection />}
        {activeTab === 'directory' && <BusinessDirectory />}
        {activeTab === 'stories' && <InspiringStoriesSection />}
        {activeTab === 'guidelines' && <GuidelinesSection />}
        {activeTab === 'admin' && <AdminModerationPortal />}
      </main>

      <Footer />

      {/* Modals */}
      {modal.type === 'event' && <EventDetailModal eventId={modal.eventId} />}
      {modal.type === 'ticket' && <TicketModal bookingId={modal.bookingId} />}
      {modal.type === 'submitAd' && <SubmitAdModal />}
      {modal.type === 'reviews' && <BusinessReviewsModal businessId={modal.businessId} />}
      {modal.type === 'inbox' && <EmailInboxModal />}
      {modal.type === 'wallet' && <WalletTopUpModal />}
      {modal.type === 'auth' && <AuthModal />}
      {modal.type === 'profile' && <UserProfileModal />}
      {modal.type === 'help' && <HelpFaqModal />}

      {/* Toasts */}
      <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => {
          const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? XCircle : Info;
          const cls =
            t.tone === 'success'
              ? 'bg-emerald-600'
              : t.tone === 'error'
                ? 'bg-red-600'
                : 'bg-stone-800';
          return (
            <div
              key={t.id}
              className={`animate-float-in flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg ${cls}`}
            >
              <Icon size={17} /> {t.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 text-white">
            <Crown size={17} />
          </span>
          <div>
            <p className="font-display font-bold text-brand-800">Nigerian Women in the UK</p>
            <p className="text-xs text-stone-500">Community · Enterprise · Sisterhood</p>
          </div>
        </div>
        <p className="text-xs text-stone-400">
          Built for the NWUK diaspora community. Payments & AI are simulated for this demo.
        </p>
      </div>
    </footer>
  );
}
