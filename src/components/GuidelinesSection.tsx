import { ShieldCheck, AlertTriangle, Info, Heart } from 'lucide-react';
import { guidelines } from '../data/initialData';

const SEVERITY = {
  critical: { icon: AlertTriangle, cls: 'border-red-200 bg-red-50', iconCls: 'text-red-600', label: 'Critical' },
  warning: { icon: ShieldCheck, cls: 'border-amber-200 bg-amber-50', iconCls: 'text-amber-600', label: 'Important' },
  info: { icon: Info, cls: 'border-stone-200 bg-white', iconCls: 'text-brand-500', label: 'Guidance' },
} as const;

export default function GuidelinesSection() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          <Heart size={14} /> ASA-compliant · Community-first
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-stone-900">Editorial Guidelines</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-500">
          Our adverts follow UK Advertising Standards Authority (ASA) rules and our sisterhood code of conduct.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {guidelines.map((g) => {
          const s = SEVERITY[g.severity];
          return (
            <div key={g.id} className={`flex gap-4 rounded-2xl border p-5 ${s.cls}`}>
              <s.icon size={22} className={`mt-0.5 shrink-0 ${s.iconCls}`} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900">{g.title}</h3>
                  <span className={`rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase ${s.iconCls}`}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{g.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
