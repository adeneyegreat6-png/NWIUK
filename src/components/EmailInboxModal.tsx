import { useState } from 'react';
import { Mail, ChevronLeft, Inbox } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Modal } from './ui';

export default function EmailInboxModal() {
  const { inbox, closeModal, markRead } = useCommunity();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = inbox.find((m) => m.id === openId);

  const select = (id: string) => {
    setOpenId(id);
    markRead(id);
  };

  return (
    <Modal
      title={
        open ? (
          <button onClick={() => setOpenId(null)} className="flex items-center gap-1 text-stone-600">
            <ChevronLeft size={18} /> Inbox
          </button>
        ) : (
          'Inbox'
        )
      }
      onClose={closeModal}
    >
      {!open ? (
        inbox.length === 0 ? (
          <div className="py-14 text-center">
            <Inbox size={32} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-stone-400">No messages yet. Book an event or submit an ad to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {inbox.map((m) => (
              <li key={m.id}>
                <button onClick={() => select(m.id)} className="flex w-full items-start gap-3 py-3 text-left transition hover:bg-stone-50">
                  <div className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full ${m.read ? 'bg-stone-100 text-stone-400' : 'bg-brand-100 text-brand-600'}`}>
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${m.read ? 'font-medium text-stone-600' : 'font-bold text-stone-900'}`}>
                        {m.subject}
                      </span>
                      {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                    </div>
                    <p className="truncate text-xs text-stone-500">{m.preview}</p>
                    <p className="mt-0.5 text-[11px] text-stone-400">
                      {m.from} · {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div>
          <h3 className="font-display text-xl font-bold text-stone-900">{open.subject}</h3>
          <p className="mt-1 text-xs text-stone-400">
            From {open.from} · {new Date(open.createdAt).toLocaleString('en-GB')}
          </p>
          <div
            className="prose prose-sm mt-4 max-w-none text-stone-700 [&_blockquote]:my-2 [&_p]:my-2 [&_strong]:text-stone-900"
            dangerouslySetInnerHTML={{ __html: open.bodyHtml }}
          />
        </div>
      )}
    </Modal>
  );
}
