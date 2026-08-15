import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Ad,
  AdStatus,
  Booking,
  Business,
  CommunityEvent,
  Guest,
  InboxMessage,
  Review,
  Tab,
  User,
  WalletTx,
} from '../types';
import { initialEvents } from '../data/initialData';
import { initialBusinesses } from '../data/membersData';

const STORAGE_KEY = 'nwuk-state-v1';

type ModalKind =
  | { type: 'none' }
  | { type: 'auth' }
  | { type: 'profile' }
  | { type: 'wallet' }
  | { type: 'inbox' }
  | { type: 'help' }
  | { type: 'event'; eventId: string }
  | { type: 'ticket'; bookingId: string }
  | { type: 'submitAd' }
  | { type: 'reviews'; businessId: string };

interface Toast {
  id: string;
  message: string;
  tone: 'success' | 'error' | 'info';
}

interface PersistedState {
  user: User | null;
  wallet: number;
  walletTx: WalletTx[];
  bookings: Booking[];
  ads: Ad[];
  businesses: Business[];
  inbox: InboxMessage[];
  events: CommunityEvent[];
}

interface CommunityContextValue extends PersistedState {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  modal: ModalKind;
  openModal: (m: ModalKind) => void;
  closeModal: () => void;
  toasts: Toast[];
  toast: (message: string, tone?: Toast['tone']) => void;
  // auth
  login: (name: string, email: string, city: string, asAdmin: boolean) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'city' | 'email'>>) => void;
  // wallet
  topUp: (amount: number, method: string) => void;
  charge: (amount: number, label: string) => boolean;
  // bookings
  createBooking: (
    event: CommunityEvent,
    tierName: string,
    price: number,
    guests: Guest[],
    method: 'wallet' | 'card'
  ) => Booking | null;
  // ads
  submitAd: (ad: Omit<Ad, 'id' | 'status' | 'authorName' | 'createdAt' | 'reach'>) => void;
  resubmitAd: (adId: string, patch: Partial<Ad>) => void;
  moderateAd: (adId: string, status: AdStatus, note?: string) => void;
  // reviews
  addReview: (businessId: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
  // inbox
  markRead: (id: string) => void;
  unreadCount: number;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 10);
}

function doorRef(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const n = () => letters[Math.floor(Math.random() * letters.length)];
  return `${n()}${n()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

const seedAds: Ad[] = [
  {
    id: 'ad-seed-1',
    tier: 'featured',
    title: 'Bespoke Aso-Ebi & Gele Styling',
    body: 'Coordinating your owambe? We handle fabric sourcing, tailoring and gele tying for the whole party. Bulk discounts for 10+.',
    category: 'Fashion',
    businessName: 'Zanzi Threads',
    whatsapp: '+44 7700 900666',
    priceRange: 'From £45',
    cta: 'Message on WhatsApp',
    image: 'linear-gradient(135deg,#7c3aed,#c4b5fd)',
    status: 'active',
    authorName: 'Community',
    createdAt: '2026-08-01T09:00:00Z',
    channels: ['WhatsApp', 'Facebook', 'Web Directory'],
    reach: 25400,
  },
  {
    id: 'ad-seed-2',
    tier: 'standard',
    title: 'Saturday Immigration Clinic',
    body: 'Free 20-minute consultations on spouse visas, ILR and citizenship. Community rate for full cases.',
    category: 'Legal/Immigration',
    businessName: 'Adeyemi Immigration Law',
    whatsapp: '+44 7700 900333',
    priceRange: 'Free consult',
    cta: 'Book a slot',
    image: 'linear-gradient(135deg,#0f7b5f,#2fa37c)',
    status: 'active',
    authorName: 'Community',
    createdAt: '2026-08-05T09:00:00Z',
    channels: ['WhatsApp'],
    reach: 4200,
  },
];

function welcomeMessage(): InboxMessage {
  return {
    id: uid('msg-'),
    subject: 'Welcome to the NWUK sisterhood 💛',
    preview: 'You’re now part of 25,000+ Nigerian women across the UK…',
    bodyHtml:
      '<p>Welcome, sister!</p><p>You’re now part of a network of <strong>25,000+ Nigerian women</strong> across the UK. Book events, advertise your business, and connect with verified community providers.</p><p>Your wallet has been credited with a <strong>£25 welcome bonus</strong> to get you started.</p>',
    from: 'NWUK Community',
    createdAt: new Date().toISOString(),
    read: false,
    kind: 'welcome',
  };
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();

  const [user, setUser] = useState<User | null>(persisted.user ?? null);
  const [wallet, setWallet] = useState<number>(persisted.wallet ?? 0);
  const [walletTx, setWalletTx] = useState<WalletTx[]>(persisted.walletTx ?? []);
  const [bookings, setBookings] = useState<Booking[]>(persisted.bookings ?? []);
  const [ads, setAds] = useState<Ad[]>(persisted.ads ?? seedAds);
  const [businesses, setBusinesses] = useState<Business[]>(persisted.businesses ?? initialBusinesses);
  const [inbox, setInbox] = useState<InboxMessage[]>(persisted.inbox ?? []);
  const [events, setEvents] = useState<CommunityEvent[]>(persisted.events ?? initialEvents);

  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [modal, setModal] = useState<ModalKind>({ type: 'none' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist to localStorage on any change.
  useEffect(() => {
    const state: PersistedState = { user, wallet, walletTx, bookings, ads, businesses, inbox, events };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [user, wallet, walletTx, bookings, ads, businesses, inbox, events]);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    const id = uid('t-');
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const openModal = useCallback((m: ModalKind) => setModal(m), []);
  const closeModal = useCallback(() => setModal({ type: 'none' }), []);

  const pushInbox = useCallback((msg: Omit<InboxMessage, 'id' | 'createdAt' | 'read'>) => {
    setInbox((prev) => [{ ...msg, id: uid('msg-'), createdAt: new Date().toISOString(), read: false }, ...prev]);
  }, []);

  const login = useCallback(
    (name: string, email: string, city: string, asAdmin: boolean) => {
      const newUser: User = { id: uid('u-'), name, email, city, isAdmin: asAdmin };
      setUser(newUser);
      // First-time welcome bonus if wallet empty and no history.
      setWallet((w) => (walletTx.length === 0 ? w + 25 : w));
      if (walletTx.length === 0) {
        setWalletTx((prev) => [
          { id: uid('tx-'), label: 'Welcome bonus', amount: 25, createdAt: new Date().toISOString() },
          ...prev,
        ]);
        setInbox((prev) => [welcomeMessage(), ...prev]);
      }
      closeModal();
      toast(`Welcome, ${name.split(' ')[0]}!`, 'success');
    },
    [walletTx.length, closeModal, toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    toast('Signed out', 'info');
  }, [toast]);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, 'name' | 'city' | 'email'>>) => {
      setUser((u) => (u ? { ...u, ...patch } : u));
      toast('Profile updated', 'success');
    },
    [toast]
  );

  const topUp = useCallback(
    (amount: number, method: string) => {
      setWallet((w) => w + amount);
      setWalletTx((prev) => [
        { id: uid('tx-'), label: `Top-up via ${method}`, amount, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      toast(`£${amount.toFixed(2)} added to your wallet`, 'success');
    },
    [toast]
  );

  const charge = useCallback(
    (amount: number, label: string): boolean => {
      let ok = false;
      setWallet((w) => {
        if (w >= amount) {
          ok = true;
          return w - amount;
        }
        return w;
      });
      if (ok) {
        setWalletTx((prev) => [
          { id: uid('tx-'), label, amount: -amount, createdAt: new Date().toISOString() },
          ...prev,
        ]);
      }
      return ok;
    },
    []
  );

  const createBooking = useCallback(
    (
      event: CommunityEvent,
      tierName: string,
      price: number,
      guests: Guest[],
      method: 'wallet' | 'card'
    ): Booking | null => {
      const quantity = guests.length;
      const total = price * quantity;
      if (method === 'wallet') {
        if (!charge(total, `${event.title} — ${tierName} ×${quantity}`)) {
          toast('Not enough wallet balance. Top up or pay by card.', 'error');
          return null;
        }
      }
      // Card / Apple Pay is simulated: no wallet movement is recorded.
      const booking: Booking = {
        id: uid('bk-'),
        eventId: event.id,
        eventTitle: event.title,
        city: event.city,
        venue: event.venue,
        address: event.address,
        date: event.date,
        endDate: event.endDate,
        tierName,
        quantity,
        guests,
        total,
        reference: doorRef(),
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [booking, ...prev]);
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, spotsLeft: Math.max(0, e.spotsLeft - quantity) } : e))
      );
      pushInbox({
        subject: `🎟️ Booking confirmed — ${event.title}`,
        preview: `Your ${tierName} pass (×${quantity}) is ready. Door ref ${booking.reference}.`,
        bodyHtml: `<p>Your booking is confirmed!</p><p><strong>${event.title}</strong><br/>${event.venue}, ${event.city}<br/>Ticket: ${tierName} × ${quantity}<br/>Door reference: <strong>${booking.reference}</strong></p><p>Total paid: £${total.toFixed(
          2
        )}. Open "My Bookings" to view your QR pass, download a PDF, or add it to your calendar.</p>`,
        from: 'NWUK Events',
        kind: 'booking',
      });
      toast('Booking confirmed! Pass added to My Bookings.', 'success');
      return booking;
    },
    [charge, pushInbox, toast]
  );

  const submitAd = useCallback(
    (ad: Omit<Ad, 'id' | 'status' | 'authorName' | 'createdAt' | 'reach'>) => {
      const newAd: Ad = {
        ...ad,
        id: uid('ad-'),
        status: 'pending',
        authorName: user?.name ?? 'Member',
        createdAt: new Date().toISOString(),
      };
      setAds((prev) => [newAd, ...prev]);
      pushInbox({
        subject: `📢 Ad submitted — ${ad.title}`,
        preview: 'Your ad is in the moderation queue. We’ll notify you once reviewed.',
        bodyHtml: `<p>Thanks! Your ad <strong>“${ad.title}”</strong> has been submitted for moderation.</p><p>Selected package: <strong>${ad.channels.join(
          ', '
        )}</strong>. You’ll receive an update once our team reviews it (usually within 24 hours).</p>`,
        from: 'NWUK Ads',
        kind: 'ad',
      });
      toast('Ad submitted for review!', 'success');
    },
    [user, pushInbox, toast]
  );

  const resubmitAd = useCallback(
    (adId: string, patch: Partial<Ad>) => {
      setAds((prev) =>
        prev.map((a) => (a.id === adId ? { ...a, ...patch, status: 'pending', moderatorNote: undefined } : a))
      );
      toast('Ad resubmitted for review', 'success');
    },
    [toast]
  );

  const moderateAd = useCallback(
    (adId: string, status: AdStatus, note?: string) => {
      setAds((prev) =>
        prev.map((a) => {
          if (a.id !== adId) return a;
          const reach =
            status === 'active'
              ? a.tier === 'elite'
                ? 31000
                : a.tier === 'featured'
                  ? 25400
                  : 4200
              : a.reach;
          return { ...a, status, moderatorNote: note, reach };
        })
      );
      const ad = ads.find((a) => a.id === adId);
      if (ad) {
        if (status === 'active') {
          pushInbox({
            subject: `✅ Ad approved & broadcast — ${ad.title}`,
            preview: `Your ad is now live across ${ad.channels.join(', ')}.`,
            bodyHtml: `<p>Great news! Your ad <strong>“${ad.title}”</strong> has been approved and broadcast across <strong>${ad.channels.join(
              ', '
            )}</strong>.</p><p>Estimated reach: community-wide. Track performance in "My Ads".</p>`,
            from: 'NWUK Moderation',
            kind: 'moderation',
          });
        } else if (status === 'revision') {
          pushInbox({
            subject: `✏️ Revision needed — ${ad.title}`,
            preview: note ?? 'Please review the moderator feedback.',
            bodyHtml: `<p>Your ad <strong>“${ad.title}”</strong> needs a small change before it can go live:</p><blockquote style="border-left:3px solid #b32844;padding-left:12px;color:#57534e">${
              note ?? 'Please review our guidelines.'
            }</blockquote><p>Edit and resubmit from "My Ads".</p>`,
            from: 'NWUK Moderation',
            kind: 'moderation',
          });
        } else if (status === 'rejected') {
          pushInbox({
            subject: `❌ Ad not approved — ${ad.title}`,
            preview: note ?? 'Your ad could not be approved.',
            bodyHtml: `<p>Unfortunately your ad <strong>“${ad.title}”</strong> was not approved.</p><blockquote style="border-left:3px solid #b32844;padding-left:12px;color:#57534e">${
              note ?? 'It did not meet our community guidelines.'
            }</blockquote>`,
            from: 'NWUK Moderation',
            kind: 'moderation',
          });
        }
      }
      toast(
        status === 'active'
          ? 'Ad approved & broadcast! 🎉'
          : status === 'revision'
            ? 'Revision requested'
            : 'Ad rejected',
        status === 'active' ? 'success' : 'info'
      );
    },
    [ads, pushInbox, toast]
  );

  const addReview = useCallback(
    (businessId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === businessId
            ? {
                ...b,
                reviews: [
                  { ...review, id: uid('r-'), createdAt: new Date().toISOString() },
                  ...b.reviews,
                ],
              }
            : b
        )
      );
      toast('Thank you for your review!', 'success');
    },
    [toast]
  );

  const markRead = useCallback((id: string) => {
    setInbox((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }, []);

  const unreadCount = useMemo(() => inbox.filter((m) => !m.read).length, [inbox]);

  const value: CommunityContextValue = {
    user,
    wallet,
    walletTx,
    bookings,
    ads,
    businesses,
    inbox,
    events,
    activeTab,
    setActiveTab,
    modal,
    openModal,
    closeModal,
    toasts,
    toast,
    login,
    logout,
    updateProfile,
    topUp,
    charge,
    createBooking,
    submitAd,
    resubmitAd,
    moderateAd,
    addReview,
    markRead,
    unreadCount,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
