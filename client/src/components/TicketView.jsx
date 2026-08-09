import React from 'react';
import { Calendar, Clock, MapPin, Ticket, X, ShieldCheck, Printer, Music, User, Armchair, Download } from 'lucide-react';

export default function TicketView({ registration, userName, onClose }) {
  if (!registration) return null;

  const event = registration.events || registration.event || {};
  const singerName = registration.singer_name || event.singer_name || 'Concert Artist';
  const seatNumber = registration.seat_number || event.seat_number || 'General · Seat TBA';
  const amountPaid = registration.amount_paid || event.price || '₹2,499';

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Aug 25, 2026';

  const passCode = registration.ticket_id || (registration.id
    ? `VIP-${registration.id.substring(0, 8).toUpperCase()}`
    : 'CONCERT-2026-88412');

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><defs><linearGradient id="background" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#090718"/><stop offset="1" stop-color="#4b2706"/></linearGradient></defs><rect width="1200" height="700" rx="44" fill="url(#background)"/><rect x="24" y="24" width="1152" height="652" rx="32" fill="none" stroke="#fbbf24" stroke-width="4"/><text x="80" y="105" fill="#fbbf24" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="4">CONCERTS MANAGER • DIGITAL CONCERT PASS</text><text x="80" y="190" fill="white" font-family="Arial, sans-serif" font-size="54" font-weight="800">${escape(singerName)} LIVE</text><text x="80" y="240" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="26">${escape(event.title || `${singerName} - Live in Concert`)}</text><line x1="80" y1="285" x2="1120" y2="285" stroke="#fbbf24" stroke-opacity=".45"/><text x="80" y="350" fill="#94a3b8" font-family="Arial, sans-serif" font-size="22">ATTENDEE</text><text x="80" y="390" fill="white" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escape(userName || 'VIP Concert Fan')}</text><text x="470" y="350" fill="#94a3b8" font-family="Arial, sans-serif" font-size="22">SEAT</text><text x="470" y="390" fill="#6ee7b7" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escape(seatNumber)}</text><text x="80" y="470" fill="#fbbf24" font-family="Arial, sans-serif" font-size="24">${escape(formattedDate)} • ${escape(event.event_time || '06:30 PM IST')}</text><text x="80" y="515" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="24">${escape(event.location || 'Concert Venue')}</text><text x="80" y="610" fill="white" font-family="Arial, sans-serif" font-size="26" font-weight="700">TICKET ID: ${escape(passCode)}</text><text x="780" y="610" fill="#fbbf24" font-family="Arial, sans-serif" font-size="28" font-weight="700">${escape(amountPaid)} PAID</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${singerName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}-concert-pass.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pass Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            <ShieldCheck className="w-4 h-4" />
            <span>DEMO CONCERT TICKET PASS • PAYMENT CONFIRMATION REQUIRED</span>
          </div>
          <h2 className="text-2xl font-black text-white">{singerName.toUpperCase()} LIVE</h2>
          <p className="text-xs text-slate-400">Present this digital ticket & seat allotment at arena gate</p>
        </div>

        {/* Visual Concert Pass Card (Printable Target) */}
        <div id="printable-ticket" className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border-2 border-amber-500/50 space-y-6 shadow-2xl relative overflow-hidden print:rounded-none print:border-2">
          
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Event Title & Pass Code */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-500/30">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-extrabold flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> CONCERTS MANAGER
              </span>
              <h3 className="text-xl font-black text-white leading-tight mt-1">{singerName} - Live in Concert</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-mono block">TICKET ID</span>
              <span className="font-mono font-black text-xs text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40 block mt-1">
                {passCode}
              </span>
            </div>
          </div>

          {/* Attendee Info & Seat Number Allotment */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" /> Attendee Name
              </p>
              <p className="font-extrabold text-white mt-1 text-sm">{userName || 'VIP Concert Fan'}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Armchair className="w-3 h-3 text-emerald-400" /> Allotted Seat
              </p>
              <p className="font-mono font-black text-emerald-400 mt-1 text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 inline-block">
                {seatNumber}
              </p>
            </div>
          </div>

          {/* Event Details & Fee Status */}
          <div className="space-y-2.5 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-white">{formattedDate}</span>
              <span className="text-slate-500">•</span>
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{event.event_time || '06:30 PM IST'}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{event.location || 'DY Patil Stadium & Main Arena, IST'}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">TICKET FEE STATUS:</span>
              <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                {amountPaid} (PAID)
              </span>
            </div>
          </div>

          {/* QR Code & Scannable Barcode */}
          <div className="pt-4 border-t border-dashed border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg">
                {/* SVG QR Pattern */}
                <div className="w-full h-full bg-slate-950 rounded-lg grid grid-cols-3 gap-0.5 p-1">
                  <div className="bg-amber-400 rounded-xs" />
                  <div className="bg-slate-950" />
                  <div className="bg-amber-400 rounded-xs" />
                  <div className="bg-slate-950" />
                  <div className="bg-amber-400" />
                  <div className="bg-slate-950" />
                  <div className="bg-amber-400 rounded-xs" />
                  <div className="bg-slate-950" />
                  <div className="bg-amber-400 rounded-xs" />
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                <p className="font-bold text-white">Scan at Arena Gate</p>
                <p>Mobile ticket link generated at checkout</p>
                <p className="font-mono text-amber-400 text-[9px]">BARCODE: {passCode}</p>
              </div>
            </div>

            <Ticket className="w-8 h-8 text-amber-400/50" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD CONCERT PASS</span>
          </button>
          <button onClick={handlePrint} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"><Printer className="w-4 h-4" />Print / Save PDF</button>
        </div>
      </div>
    </div>
  );
}
