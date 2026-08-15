import type { AdPackage, CommunityEvent, FaqItem, Guideline } from '../types';

export const AD_CATEGORIES = [
  'Catering',
  'Hair & Beauty',
  'Legal/Immigration',
  'Accounting',
  'Relocation Coaches',
  'Fashion',
  'Events & Décor',
  'Health & Wellness',
  'Property',
  'Other',
];

export const UK_CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh'];

export const initialEvents: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'NWUK Annual Sisterhood Gala',
    category: 'Gala',
    city: 'London',
    venue: 'The Landmark Ballroom',
    address: '222 Marylebone Rd, London NW1 6JQ',
    date: '2026-09-19T18:30:00Z',
    endDate: '2026-09-19T23:30:00Z',
    image: 'linear-gradient(135deg,#681c30,#b32844 60%,#e6b422)',
    summary:
      'A black-tie celebration of Nigerian women’s excellence across the UK. Dinner, awards, live band and dancing till late.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 75, perks: ['3-course dinner', 'Welcome drink', 'Awards ceremony'] },
      { id: 't-vip', name: 'VIP', price: 140, perks: ['Front table', 'Champagne reception', 'Goodie bag', 'Photo wall'] },
      { id: 't-early', name: 'Early Sister', price: 60, perks: ['3-course dinner', 'Welcome drink', 'Limited discount'] },
    ],
    spotsLeft: 42,
  },
  {
    id: 'evt-2',
    title: 'High-Tea Sisterhood Meetup',
    category: 'Cultural',
    city: 'Manchester',
    venue: 'The Midland Tea Room',
    address: 'Peter St, Manchester M60 2DS',
    date: '2026-08-30T14:00:00Z',
    endDate: '2026-08-30T17:00:00Z',
    image: 'linear-gradient(135deg,#0f7b5f,#2fa37c 60%,#e6b422)',
    summary: 'Afternoon tea, honest conversations and new friendships. Bring a sister, leave with ten.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 28, perks: ['Afternoon tea', 'Networking'] },
      { id: 't-vip', name: 'VIP', price: 45, perks: ['Reserved seating', 'Gift bag', 'Priority Q&A'] },
    ],
    spotsLeft: 18,
  },
  {
    id: 'evt-3',
    title: 'Diaspora Career Masterclass',
    category: 'Career',
    city: 'Birmingham',
    venue: 'Innovation Hub',
    address: 'Holt St, Birmingham B7 4BB',
    date: '2026-09-05T10:00:00Z',
    endDate: '2026-09-05T16:00:00Z',
    image: 'linear-gradient(135deg,#1e3a8a,#3b82f6 60%,#22d3ee)',
    summary: 'CV clinics, salary negotiation, NHS & fintech pathways, and 1:1 mentoring from senior sisters.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 35, perks: ['All sessions', 'Workbook', 'Lunch'] },
      { id: 't-vip', name: 'VIP', price: 70, perks: ['All sessions', '1:1 mentoring slot', 'CV review', 'Lunch'] },
      { id: 't-early', name: 'Early Sister', price: 25, perks: ['All sessions', 'Workbook'] },
    ],
    spotsLeft: 63,
  },
  {
    id: 'evt-4',
    title: 'Marrakech Wellness Retreat',
    category: 'Retreat',
    city: 'Marrakech',
    venue: 'Riad Al-Sisi',
    address: 'Medina, Marrakech, Morocco',
    date: '2026-10-17T09:00:00Z',
    endDate: '2026-10-21T18:00:00Z',
    image: 'linear-gradient(135deg,#b45309,#f59e0b 60%,#fcd34d)',
    summary: 'Four nights of rest, yoga, journalling and sisterhood in a private riad. Flights not included.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 890, perks: ['Shared riad room', 'All meals', 'Daily yoga', 'Excursions'] },
      { id: 't-vip', name: 'VIP', price: 1290, perks: ['Private suite', 'All meals', 'Spa day', 'Airport transfer'] },
    ],
    spotsLeft: 9,
  },
  {
    id: 'evt-5',
    title: 'Zanzibar Founders Escape',
    category: 'Retreat',
    city: 'Zanzibar',
    venue: 'Ocean Pearl Resort',
    address: 'Nungwi Beach, Zanzibar',
    date: '2026-11-14T09:00:00Z',
    endDate: '2026-11-19T18:00:00Z',
    image: 'linear-gradient(135deg,#0e7490,#06b6d4 60%,#67e8f9)',
    summary: 'A retreat for founders and executives: strategy mornings, beach afternoons, deep rest.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 1150, perks: ['Beachfront room', 'All meals', 'Mastermind sessions'] },
      { id: 't-vip', name: 'VIP', price: 1650, perks: ['Ocean suite', 'All meals', '1:1 coaching', 'Sunset cruise'] },
    ],
    spotsLeft: 6,
  },
  {
    id: 'evt-6',
    title: 'Edinburgh Culture & Fashion Night',
    category: 'Cultural',
    city: 'Edinburgh',
    venue: 'Assembly Rooms',
    address: '54 George St, Edinburgh EH2 2LR',
    date: '2026-09-27T18:00:00Z',
    endDate: '2026-09-27T22:00:00Z',
    image: 'linear-gradient(135deg,#4c1d95,#7c3aed 60%,#c4b5fd)',
    summary: 'Ankara runway, Afrobeats, market stalls and food. A celebration of heritage in Scotland.',
    tiers: [
      { id: 't-std', name: 'Standard', price: 22, perks: ['Runway show', 'Market access'] },
      { id: 't-vip', name: 'VIP', price: 48, perks: ['Front row', 'Backstage', 'Welcome cocktail'] },
    ],
    spotsLeft: 74,
  },
];

export const adPackages: AdPackage[] = [
  {
    id: 'standard',
    name: 'Standard WhatsApp Broadcast',
    price: 15,
    channels: ['WhatsApp'],
    highlights: ['Targeted blast to regional WhatsApp groups', '7-day listing', 'Basic analytics'],
  },
  {
    id: 'featured',
    name: 'Featured Multi-Channel',
    price: 35,
    channels: ['WhatsApp', 'Facebook', 'Web Directory'],
    highlights: [
      'WhatsApp + 25k+ member Facebook group',
      'Top listing in web directory',
      '14-day listing',
      'Priority support',
    ],
  },
  {
    id: 'elite',
    name: 'Elite Community Partner',
    price: 65,
    channels: ['WhatsApp', 'Facebook', 'Telegram', 'Email Newsletter'],
    highlights: [
      'WhatsApp + Facebook + Telegram',
      'Monthly email newsletter feature',
      '30-day sticky banner',
      'Verified partner badge',
    ],
  },
];

export const guidelines: Guideline[] = [
  {
    id: 'g1',
    title: 'Food hygiene rating required',
    body: 'Any catering or food business must display a current UK Food Hygiene Rating (0–5). Listings without one may be asked to revise.',
    severity: 'warning',
  },
  {
    id: 'g2',
    title: 'No guaranteed financial returns',
    body: 'Adverts must not promise guaranteed returns, "double your money", or unregulated investment schemes. This breaches ASA rules and UK financial promotion law.',
    severity: 'critical',
  },
  {
    id: 'g3',
    title: 'No unproven medical or health claims',
    body: 'Health, wellness and cosmetic products must not claim to cure, treat or prevent disease without approved evidence. Avoid "miracle" language.',
    severity: 'critical',
  },
  {
    id: 'g4',
    title: 'Honest pricing & availability',
    body: 'Prices must be clear and inclusive of VAT where applicable. "From £X" must reflect a genuinely available option.',
    severity: 'info',
  },
  {
    id: 'g5',
    title: 'Sisterhood code of conduct',
    body: 'We are a community of respect. No harassment, discrimination, or targeting of members. Reviews must be genuine and based on real experiences.',
    severity: 'info',
  },
  {
    id: 'g6',
    title: 'Refund policy',
    body: 'Event tickets are refundable up to 14 days before the event, minus a 5% processing fee. Retreats follow the operator’s separate terms. Ad fees are non-refundable once broadcast.',
    severity: 'info',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    category: 'Event Passes',
    question: 'How do I access my ticket after booking?',
    answer:
      'Your digital pass appears instantly under "My Bookings" and is emailed to your in-app inbox. Open it to view your QR code, door reference, download a printable PDF, or add it to your calendar.',
  },
  {
    id: 'f2',
    category: 'Event Passes',
    question: 'Can I add multiple guests with different dietary needs?',
    answer:
      'Yes. When booking, set the ticket quantity and enter each attendee’s name and dietary requirement (Halal, Vegan, Gluten-free, Traditional). This is shared with the caterer.',
  },
  {
    id: 'f3',
    category: 'Ad Guidelines',
    question: 'Why was my ad marked "Needs Revision"?',
    answer:
      'A moderator reviewed it against our ASA-compliant guidelines. Open the moderator note in "My Ads" or your inbox to see exactly what to amend, then resubmit.',
  },
  {
    id: 'f4',
    category: 'Ad Guidelines',
    question: 'Which channels does my ad broadcast to?',
    answer:
      'It depends on your package. Standard reaches WhatsApp groups; Featured adds Facebook and the web directory; Elite adds Telegram and the monthly email newsletter.',
  },
  {
    id: 'f5',
    category: 'Payments',
    question: 'How does the member wallet work?',
    answer:
      'Top up your GBP balance via UK debit card, Apple Pay or bank transfer (simulated). Bookings and ad fees are deducted automatically. You can always pay by card at checkout instead.',
  },
  {
    id: 'f6',
    category: 'Membership Verification',
    question: 'How does a business get the Verified Diaspora badge?',
    answer:
      'Verified listings have confirmed their business registration and community references. Look for the badge when choosing a provider — it signals a trusted community member.',
  },
];
