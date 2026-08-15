import { Calendar, Download, MapPin, Printer, CalendarPlus } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Modal, Badge } from './ui';
import { downloadIcs, downloadTicketPdf, qrDataUri } from '../utils/ticketPdfGenerator';

export default function TicketModal({ bookingId }: { bookingId: string }) {
  const { bookings, closeModal } = useCommunity();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  const qr = qrDataUri(`NWUK|${booking.reference}|${booking.eventId}|${booking.tierName}|${booking.quantity}`);

  return (
    <Modal title="Your Digital Pass" onClose={closeModal}>
      <div className="overflow-hidden rounded-3xl border border-stone-200">
        <div className="bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 px-6 py-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">Nigerian Women in the UK</p>
          <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{booking.eventTitle}</h3>
        </div>

        <div className="flex flex-col items-center gap-5 px-6 py-6 sm:flex-row sm:items-start">
          <div className="text-center">
            <img
              src={qr}
              alt="Check-in QR code"
              className="h-40 w-40 rounded-xl border-4 border-white shadow ring-1 ring-stone-200"
            />
            <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-400">Door reference</p>
            <p className="font-mono text-lg font-bold tracking-widest text-stone-900">{booking.reference}</p>
          </div>

          <div className="flex-1 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge tone="green">
                {booking.tierName} ×{booking.quantity}
              </Badge>
              <Badge tone="stone">£{booking.total.toFixed(2)} paid</Badge>
            </div>
            <p className="flex items-start gap-2 text-stone-600">
              <Calendar size={16} className="mt-0.5 text-brand-600" />
              {new Date(booking.date).toLocaleString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="flex items-start gap-2 text-stone-600">
              <MapPin size={16} className="mt-0.5 text-brand-600" />
              {booking.venue}, {booking.address}
            </p>
            {booking.guests.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Guests</p>
                <ul className="mt-1 space-y-0.5">
                  {booking.guests.map((g, i) => (
                    <li key={i} className="flex justify-between text-stone-600">
                      <span>{g.name || `Guest ${i + 1}`}</span>
                      <span className="text-stone-400">{g.dietary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={() => downloadTicketPdf(booking)}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Download size={16} /> Download PDF
        </button>
        <button
          onClick={() => downloadTicketPdf(booking)}
          className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
        >
          <Printer size={16} /> Print pass
        </button>
        <button
          onClick={() => downloadIcs(booking)}
          className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
        >
          <CalendarPlus size={16} /> Add to calendar
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-stone-400">
        Present the QR code at the door. The PDF opens a print dialog — choose “Save as PDF”.
      </p>
    </Modal>
  );
}
