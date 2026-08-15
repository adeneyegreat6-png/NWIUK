export type Tab =
  | 'events'
  | 'ads'
  | 'my-ads'
  | 'directory'
  | 'stories'
  | 'guidelines'
  | 'admin';

export type EventCategory = 'Gala' | 'Career' | 'Cultural' | 'Wellness' | 'Retreat';

export interface TicketTier {
  id: string;
  name: string; // Standard, VIP, Early Sister
  price: number; // GBP
  perks: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: EventCategory;
  city: string;
  venue: string;
  address: string;
  date: string; // ISO
  endDate: string; // ISO
  image: string;
  summary: string;
  tiers: TicketTier[];
  spotsLeft: number;
}

export type Dietary = 'Halal' | 'Vegan' | 'Gluten-free' | 'Traditional' | 'None';

export interface Guest {
  name: string;
  dietary: Dietary;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  city: string;
  venue: string;
  address: string;
  date: string;
  endDate: string;
  tierName: string;
  quantity: number;
  guests: Guest[];
  total: number;
  reference: string; // door code
  createdAt: string;
}

export type AdTier = 'standard' | 'featured' | 'elite';

export interface AdPackage {
  id: AdTier;
  name: string;
  price: number;
  channels: string[];
  highlights: string[];
}

export type AdStatus = 'pending' | 'active' | 'revision' | 'rejected' | 'expired';

export interface Ad {
  id: string;
  tier: AdTier;
  title: string;
  body: string;
  category: string;
  businessName: string;
  whatsapp: string;
  priceRange: string;
  cta: string;
  image: string;
  status: AdStatus;
  moderatorNote?: string;
  authorName: string;
  createdAt: string;
  channels: string[];
  reach?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  verified: boolean;
  logo: string;
  whatsapp: string;
  reviews: Review[];
}

export interface InboxMessage {
  id: string;
  subject: string;
  preview: string;
  bodyHtml: string;
  from: string;
  createdAt: string;
  read: boolean;
  kind: 'booking' | 'ad' | 'moderation' | 'reminder' | 'welcome';
}

export interface WalletTx {
  id: string;
  label: string;
  amount: number; // +topup / -spend
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  isAdmin: boolean;
}

export interface Spotlight {
  name: string;
  profession: string;
  region: string;
  headline: string;
  journey: string;
  quote: string;
  impact: { label: string; value: string }[];
  advice: string;
  source: 'ai' | 'fallback';
}

export interface Guideline {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
