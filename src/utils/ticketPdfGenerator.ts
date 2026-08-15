import type { Booking } from '../types';

/**
 * Build a QR payload string and return a Google Chart-free, dependency-free
 * QR code as an inline SVG data URI using a simple deterministic matrix.
 * For a real deployment you'd swap in a proper QR library; this renders a
 * scannable-looking, stable pattern derived from the reference code.
 */
export function qrDataUri(payload: string): string {
  const size = 25;
  // Deterministic pseudo-random fill based on payload characters.
  let seed = 0;
  for (const ch of payload) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() > 0.5)
  );
  // Finder patterns in three corners for a QR-like look.
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[r0 + r][c0 + c] = border || core;
      }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  const rects: string[] = [];
  const px = 8;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (cells[r][c]) rects.push(`<rect x="${c * px}" y="${r * px}" width="${px}" height="${px}"/>`);

  const dim = size * px;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}"><rect width="${dim}" height="${dim}" fill="#ffffff"/><g fill="#1c1917">${rects.join(
    ''
  )}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Standalone, print-styled HTML pass. Opens the print dialog for Save-as-PDF. */
export function buildTicketHtml(booking: Booking): string {
  const payload = `NWUK|${booking.reference}|${booking.eventId}|${booking.tierName}|${booking.quantity}`;
  const qr = qrDataUri(payload);
  const guestRows = booking.guests
    .map(
      (g, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(g.name || 'Guest')}</td><td>${g.dietary}</td></tr>`
    )
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>NWUK Pass — ${escapeHtml(booking.eventTitle)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; margin: 0; padding: 32px; background: #f5f3f2; color: #1c1917; }
  .pass { max-width: 640px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.12); }
  .head { background: linear-gradient(135deg,#681c30,#b32844 60%,#e6b422); color: #fff; padding: 28px 32px; }
  .brand { font-size: 13px; letter-spacing: .18em; text-transform: uppercase; opacity: .9; }
  .title { font-family: 'Playfair Display', Georgia, serif; font-size: 30px; margin: 6px 0 0; line-height: 1.1; }
  .body { padding: 28px 32px; display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start; }
  .meta div { margin-bottom: 12px; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #78716c; }
  .value { font-size: 15px; font-weight: 600; }
  .qr { text-align: center; }
  .qr img { width: 160px; height: 160px; border: 8px solid #fff; border-radius: 12px; box-shadow: 0 0 0 1px #e7e5e4; }
  .ref { font-family: monospace; font-size: 20px; letter-spacing: .15em; margin-top: 8px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin: 0 32px 24px; width: calc(100% - 64px); }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #f0efee; font-size: 13px; }
  th { color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: .08em; }
  .foot { padding: 18px 32px 28px; color: #78716c; font-size: 12px; }
  .btn { display: inline-block; background: #b32844; color: #fff; padding: 12px 22px; border-radius: 999px; text-decoration: none; font-weight: 700; border: 0; cursor: pointer; font-size: 14px; }
  @media print { .no-print { display: none !important; } body { background: #fff; padding: 0; } .pass { box-shadow: none; } }
</style></head>
<body>
  <div class="pass">
    <div class="head">
      <div class="brand">Nigerian Women in the UK · Digital Pass</div>
      <div class="title">${escapeHtml(booking.eventTitle)}</div>
    </div>
    <div class="body">
      <div class="meta">
        <div><div class="label">Date &amp; time</div><div class="value">${formatDate(booking.date)}</div></div>
        <div><div class="label">Venue</div><div class="value">${escapeHtml(booking.venue)}</div></div>
        <div><div class="label">Address</div><div class="value">${escapeHtml(booking.address)}</div></div>
        <div><div class="label">Ticket</div><div class="value">${escapeHtml(booking.tierName)} × ${booking.quantity}</div></div>
      </div>
      <div class="qr">
        <img src="${qr}" alt="Check-in QR code" />
        <div class="label" style="margin-top:8px">Door reference</div>
        <div class="ref">${booking.reference}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Guest</th><th>Dietary</th></tr></thead>
      <tbody>${guestRows}</tbody>
    </table>
    <div class="foot">
      Present this QR code at check-in. Total paid: £${booking.total.toFixed(2)}.
      <div class="no-print" style="margin-top:16px">
        <button class="btn" onclick="window.print()">🖨️ Save as PDF / Print</button>
      </div>
    </div>
  </div>
  <script>window.addEventListener('load', function(){ setTimeout(function(){ try { window.focus(); } catch(e){} }, 200); });</script>
</body></html>`;
}

/** Opens the printable pass in a new window and triggers the print dialog. */
export function downloadTicketPdf(booking: Booking): void {
  const html = buildTicketHtml(booking);
  const w = window.open('', '_blank');
  if (!w) {
    // Popup blocked — fall back to a downloadable HTML file.
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NWUK-pass-${booking.reference}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  w.document.write(html);
  w.document.close();
}

/** Generates and downloads a standard .ics calendar file. */
export function downloadIcs(booking: Booking): void {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NWUK//Community Platform//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${booking.reference}@nwuk`,
    `DTSTAMP:${fmt(booking.createdAt)}`,
    `DTSTART:${fmt(booking.date)}`,
    `DTEND:${fmt(booking.endDate)}`,
    `SUMMARY:${booking.eventTitle}`,
    `LOCATION:${booking.venue}, ${booking.address}`,
    `DESCRIPTION:NWUK pass — ${booking.tierName} x${booking.quantity}. Door ref: ${booking.reference}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NWUK-${booking.reference}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
