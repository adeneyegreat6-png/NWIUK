import { useState } from 'react';
import { CreditCard, Smartphone, Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Modal } from './ui';

const AMOUNTS = [10, 25, 50, 100];
const METHODS = [
  { id: 'UK Debit Card', icon: CreditCard },
  { id: 'Apple Pay', icon: Smartphone },
  { id: 'Bank Transfer', icon: Landmark },
];

export default function WalletTopUpModal() {
  const { wallet, walletTx, topUp, closeModal } = useCommunity();
  const [amount, setAmount] = useState(25);
  const [method, setMethod] = useState('UK Debit Card');

  return (
    <Modal title="Member Wallet" onClose={closeModal}>
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 px-6 py-6 text-white">
        <p className="text-xs uppercase tracking-wider text-white/80">Available balance</p>
        <p className="mt-1 font-display text-4xl font-bold">£{wallet.toFixed(2)}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-stone-700">Top up</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                amount === a ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600'
              }`}
            >
              £{a}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition ${
                method === m.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-600'
              }`}
            >
              <m.icon size={18} />
              {m.id}
            </button>
          ))}
        </div>

        <button
          onClick={() => topUp(amount, method)}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Add £{amount.toFixed(2)} via {method}
        </button>
        <p className="mt-2 text-center text-[11px] text-stone-400">Payments are simulated for this demo.</p>
      </div>

      {walletTx.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-700">Recent activity</p>
          <ul className="mt-2 divide-y divide-stone-100">
            {walletTx.slice(0, 8).map((tx) => (
              <li key={tx.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`grid h-8 w-8 place-items-center rounded-full ${tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                    {tx.amount > 0 ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div>
                    <p className="text-sm text-stone-700">{tx.label}</p>
                    <p className="text-[11px] text-stone-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-stone-700'}`}>
                  {tx.amount > 0 ? '+' : '−'}£{Math.abs(tx.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
