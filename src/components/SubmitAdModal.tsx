import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CreditCard, Wallet } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { AD_CATEGORIES, adPackages } from '../data/initialData';
import type { AdTier } from '../types';
import { Modal, Badge } from './ui';

const BANNER_GRADIENTS = [
  'linear-gradient(135deg,#b32844,#e26a7d)',
  'linear-gradient(135deg,#0f7b5f,#2fa37c)',
  'linear-gradient(135deg,#7c3aed,#c4b5fd)',
  'linear-gradient(135deg,#b45309,#f59e0b)',
  'linear-gradient(135deg,#1e3a8a,#3b82f6)',
];

// Client-side ASA compliance check for forbidden claims.
const FORBIDDEN = [
  { re: /guarante?ed?\s+(returns?|profit|income|money)/i, msg: 'Remove guaranteed financial return claims.' },
  { re: /double\s+your\s+money/i, msg: '“Double your money” breaches financial promotion rules.' },
  { re: /(cure|cures|heals?)\s+(all|every|any)?\s*(disease|cancer|illness)/i, msg: 'Remove unproven medical cure claims.' },
  { re: /miracle/i, msg: 'Avoid “miracle” language for health or cosmetic products.' },
  { re: /100%\s+(guaranteed|effective)/i, msg: 'Avoid absolute “100% guaranteed/effective” claims.' },
];

export default function SubmitAdModal() {
  const { closeModal, submitAd, wallet, charge, toast } = useCommunity();

  const [tier, setTier] = useState<AdTier>('featured');
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(AD_CATEGORIES[0]);
  const [body, setBody] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [cta, setCta] = useState('Message on WhatsApp');
  const [gradient, setGradient] = useState(BANNER_GRADIENTS[0]);
  const [pay, setPay] = useState<'wallet' | 'card'>('wallet');

  const pkg = adPackages.find((p) => p.id === tier)!;

  const violations = useMemo(() => {
    const text = `${title} ${body}`;
    return FORBIDDEN.filter((f) => f.re.test(text)).map((f) => f.msg);
  }, [title, body]);

  const canSubmit = title.trim() && businessName.trim() && body.trim() && whatsapp.trim() && violations.length === 0;
  const canWallet = wallet >= pkg.price;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast('Please complete all fields and resolve any compliance flags.', 'error');
      return;
    }
    if (pay === 'wallet') {
      if (!charge(pkg.price, `Ad package — ${pkg.name}`)) {
        toast('Not enough wallet balance. Top up or pay by card.', 'error');
        return;
      }
    }
    submitAd({
      tier,
      title: title.trim(),
      body: body.trim(),
      category,
      businessName: businessName.trim(),
      whatsapp: whatsapp.trim(),
      priceRange: priceRange.trim() || 'Contact for pricing',
      cta: cta.trim() || 'Message on WhatsApp',
      image: gradient,
      channels: pkg.channels,
    });
    closeModal();
  };

  return (
    <Modal title="Submit an Advert" onClose={closeModal} wide>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Package</label>
            <div className="space-y-2">
              {adPackages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTier(p.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                    tier === p.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-stone-200'
                  }`}
                >
                  <div>
                    <span className="text-sm font-semibold text-stone-900">{p.name}</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.channels.map((c) => (
                        <span key={c} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">£{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          <Field label="Ad title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Bespoke Aso-Ebi Styling" />
          </Field>
          <Field label="Business name">
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputCls} placeholder="Your business" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {AD_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Price range">
              <input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={inputCls} placeholder="From £45" />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className={inputCls} placeholder="Describe your offer…" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="WhatsApp contact">
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} placeholder="+44 7700 900000" />
            </Field>
            <Field label="Call to action">
              <input value={cta} onChange={(e) => setCta(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Banner colour">
            <div className="flex gap-2">
              {BANNER_GRADIENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGradient(g)}
                  style={{ background: g }}
                  className={`h-9 w-9 rounded-lg transition ${gradient === g ? 'ring-2 ring-brand-500 ring-offset-2' : ''}`}
                  aria-label="Banner colour"
                />
              ))}
            </div>
          </Field>
        </div>

        {/* Preview + compliance + pay */}
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-stone-700">Live preview</p>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="relative h-24" style={{ background: gradient }}>
                <div className="absolute right-3 top-3">
                  <Badge tone="gold">{category}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-stone-900">{title || 'Your ad title'}</h3>
                <p className="text-xs font-semibold text-brand-600">{businessName || 'Your business'}</p>
                <p className="mt-2 text-sm text-stone-500">{body || 'Your description will appear here…'}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pkg.channels.map((c) => (
                    <Badge key={c} tone="stone">
                      {c}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">{priceRange || 'Price range'}</span>
                  <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                    {cta || 'Message'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {violations.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-red-700">
                <AlertTriangle size={16} /> ASA compliance flags
              </p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-xs text-red-600">
                {violations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          ) : (
            (title || body) && (
              <p className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <Check size={16} /> Passes automatic ASA compliance checks.
              </p>
            )
          )}

          <div className="rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">{pkg.name}</span>
              <span className="text-xl font-bold text-stone-900">£{pkg.price}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPay('wallet')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition ${
                  pay === 'wallet' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600'
                }`}
              >
                <Wallet size={15} /> Wallet
              </button>
              <button
                onClick={() => setPay('card')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition ${
                  pay === 'card' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-600'
                }`}
              >
                <CreditCard size={15} /> Card
              </button>
            </div>
            {pay === 'wallet' && !canWallet && (
              <p className="mt-2 text-xs font-medium text-red-600">Insufficient balance — top up or pay by card.</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || (pay === 'wallet' && !canWallet)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit for review · £{pkg.price}
            </button>
            <p className="mt-2 text-center text-[11px] text-stone-400">
              Your ad enters the moderation queue before broadcast.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const inputCls =
  'w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  );
}
