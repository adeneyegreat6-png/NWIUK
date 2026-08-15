import { useState } from 'react';
import { Crown, ShieldCheck } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { UK_CITIES } from '../data/initialData';
import { Modal } from './ui';

export default function AuthModal() {
  const { login, closeModal } = useCommunity();
  const [mode, setMode] = useState<'signin' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(UK_CITIES[0]);
  const [asAdmin, setAsAdmin] = useState(false);

  const submit = () => {
    const finalName = name.trim() || (mode === 'signin' ? 'Sister' : '');
    if (!finalName || !email.trim()) return;
    login(finalName, email.trim(), city, asAdmin);
  };

  return (
    <Modal title={mode === 'register' ? 'Join the sisterhood' : 'Welcome back'} onClose={closeModal}>
      <div className="mb-4 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
        {(['register', 'signin'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mode === m ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-500'
            }`}
          >
            {m === 'register' ? 'Register' : 'Sign in'}
          </button>
        ))}
      </div>

      <div className="grid place-items-center py-2">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-gold-500 text-white">
          <Crown size={26} />
        </div>
      </div>

      <div className="mt-2 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amara Okafor"
            className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-stone-700">Your city</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
          >
            {UK_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setAsAdmin((v) => !v)}
          className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
            asAdmin ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-500'
          }`}
        >
          <ShieldCheck size={16} />
          Sign in as moderator (demo admin access)
          <span className={`ml-auto h-5 w-9 rounded-full p-0.5 transition ${asAdmin ? 'bg-brand-500' : 'bg-stone-300'}`}>
            <span className={`block h-4 w-4 rounded-full bg-white transition ${asAdmin ? 'translate-x-4' : ''}`} />
          </span>
        </button>

        <button
          onClick={submit}
          disabled={!name.trim() || !email.trim()}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {mode === 'register' ? 'Create account' : 'Sign in'}
        </button>
        <p className="text-center text-[11px] text-stone-400">
          New members receive a £25 welcome bonus. Authentication is simulated for this demo.
        </p>
      </div>
    </Modal>
  );
}
