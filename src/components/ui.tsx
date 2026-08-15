import { useEffect, type ReactNode } from 'react';
import { X, Star } from 'lucide-react';

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`animate-float-in my-4 w-full ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        } rounded-3xl bg-white shadow-2xl ring-1 ring-stone-900/5`}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="scroll-thin max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function StarRating({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer transition hover:scale-110' : 'cursor-default'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={n <= value ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}
          />
        </button>
      ))}
    </div>
  );
}

/** Lightweight canvas-free confetti burst. */
export function fireConfetti() {
  const colors = ['#b32844', '#e6b422', '#0f7b5f', '#e26a7d', '#d4a017'];
  const count = 90;
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 8;
    p.style.cssText = `position:absolute;top:-20px;left:${Math.random() * 100}%;width:${size}px;height:${
      size * 0.6
    }px;background:${colors[i % colors.length]};opacity:${0.7 + Math.random() * 0.3};border-radius:2px;transform:rotate(${
      Math.random() * 360
    }deg)`;
    container.appendChild(p);
    const fall = 400 + Math.random() * 600;
    const drift = (Math.random() - 0.5) * 240;
    p.animate(
      [
        { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${drift}px,${window.innerHeight + fall}px) rotate(${720 + Math.random() * 720}deg)`, opacity: 0.9 },
      ],
      { duration: 1800 + Math.random() * 1200, easing: 'cubic-bezier(.2,.6,.4,1)' }
    );
  }
  setTimeout(() => container.remove(), 3200);
}

export function Badge({ children, tone = 'stone' }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    stone: 'bg-stone-100 text-stone-600',
    brand: 'bg-brand-100 text-brand-700',
    green: 'bg-emerald-100 text-emerald-700',
    gold: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
