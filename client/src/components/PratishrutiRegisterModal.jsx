import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Music,
  ShieldCheck,
  User,
  Mail,
  Building,
  Phone,
  Ticket,
  Loader2,
  Zap,
  CreditCard,
  QrCode,
  Landmark,
  PartyPopper,
} from 'lucide-react';

const TICKET_TIERS = [
  {
    id: 'tier-vip',
    title: '🌟 VIP Front-Stage Arena Pass',
    category: 'VIP Front Row',
    desc: 'Exclusive front-row stage pit access, meet & greet lounge entry, signed concert merchandise + 500 XP!',
    badge: 'VIP STAGE',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black',
    price: '₹1,00,000',
    icon: Sparkles,
  },
  {
    id: 'tier-platinum',
    title: '💎 Platinum Executive Lounge Pass',
    category: 'Platinum Zone',
    desc: 'Premium elevated sofa seating with complimentary buffet, acoustic sound zone & VIP valet parking.',
    badge: 'PLATINUM',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    price: '₹1,00,000',
    icon: Music,
  },
  {
    id: 'tier-gold',
    title: '🔥 Golden Fan Pit Standing Pass',
    category: 'Golden Pit',
    desc: 'High-energy main standing arena access right near stage lights, laser show & confetti blast zone.',
    badge: 'GOLDEN PIT',
    badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
    price: '₹1,00,000',
    icon: Zap,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, RuPay & American Express (Instant Approval)',
    icon: CreditCard,
  },
  {
    id: 'upi',
    name: 'UPI Instant Pay / QR',
    desc: 'Google Pay, PhonePe, Paytm, BHIM UPI Code',
    icon: QrCode,
  },
  {
    id: 'netbanking',
    name: 'Net Banking / VIP Portal',
    desc: 'HDFC, ICICI, SBI, Axis Bank Direct Transfer',
    icon: Landmark,
  },
];

export default function PratishrutiRegisterModal({ user, onClose, onComplete }) {
  const [selectedTier, setSelectedTier] = useState('tier-vip');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Mumbai / Nagpur (IST)');
  const [submitting, setSubmitting] = useState(false);
  const [showHoorayPopup, setShowHoorayPopup] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);

  const selectedTierObj = TICKET_TIERS.find((o) => o.id === selectedTier);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const seatNumber = `VIP Row A, Seat ${Math.floor(1 + Math.random() * 40)}`;
      const ticketId = `CONCERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const generatedRegistration = {
        id: `reg-concert-${Date.now()}`,
        ticket_id: ticketId,
        event_id: 'evt-aaryan-malik-live',
        status: 'registered',
        registered_at: new Date().toISOString(),
        seat_number: seatNumber,
        amount_paid: '₹1,00,000',
        singer_name: 'Aaryan Malik',
        payment_method: paymentMethod.toUpperCase(),
        events: {
          id: 'evt-aaryan-malik-live',
          title: `AARYAN MALIK - LIVE IN CONCERT (${selectedTierObj.category})`,
          category: 'Singer Concert',
          event_date: '2026-08-25',
          event_time: '18:30:00',
          location: 'DY Patil Stadium & Main Arena, IST',
          singer_name: 'Aaryan Malik',
          seat_number: seatNumber,
          price: '₹1,00,000',
        },
      };

      setBookedDetails(generatedRegistration);
      setSubmitting(false);
      setShowHoorayPopup(true);
    }, 1200);
  };

  const handleFinishBooking = () => {
    setShowHoorayPopup(false);
    if (bookedDetails) {
      onComplete(bookedDetails);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* CELEBRATION HOORAY POPUP MODAL */}
      {showHoorayPopup ? (
        <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-bounce">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <PartyPopper className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              BOOKING CONFIRMED • PAYMENT SUCCESSFUL
            </span>
            <h2 className="text-3xl font-black text-white">
              HOORAY! TICKET BOOKED! 🎉
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              You have successfully booked a concert ticket for <strong className="text-amber-400 font-extrabold">AARYAN MALIK LIVE IN CONCERT</strong>!
            </p>
          </div>

          {/* Ticket Receipt Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Attendee:</span>
              <span className="font-bold text-white">{user?.name || 'VVIP Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Singer:</span>
              <span className="font-bold text-amber-400">Aaryan Malik</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Allotted Seat:</span>
              <span className="font-bold text-emerald-400 font-mono">{bookedDetails?.seat_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ticket Fee Paid:</span>
              <span className="font-bold text-amber-300 font-mono">₹1,00,000 (INR)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ticket ID:</span>
              <span className="font-mono text-slate-300">{bookedDetails?.ticket_id}</span>
            </div>
          </div>

          <button
            onClick={handleFinishBooking}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            VIEW MY CONCERT TICKET PASS →
          </button>
        </div>
      ) : (
        /* BOOKING FORM MODAL */
        <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Aaryan Malik Concert Ticket Booking</h3>
                <p className="text-xs text-amber-400 font-medium">Ticket Price: ₹1,00,000 (Rupees) • Live World Tour 2026</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            
            {/* Step 1: Select Ticket Tier */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                <span>Step 1: Select Concert Pass Tier (₹1,00,000)</span>
              </label>

              <div className="space-y-3">
                {TICKET_TIERS.map((opt) => {
                  const isSelected = selectedTier === opt.id;
                  const OptIcon = opt.icon;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedTier(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl mt-0.5 ${isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                        <OptIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {opt.title}
                          </h4>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${opt.badgeColor}`}>
                            {opt.price}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{opt.desc}</p>
                      </div>

                      <div className="flex items-center justify-center pt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4 fill-amber-400 text-slate-950" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Payment Method */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>Step 2: Choose Payment Option (₹1,00,000)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((pm) => {
                  const isPmSelected = paymentMethod === pm.id;
                  const PmIcon = pm.icon;

                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isPmSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 text-amber-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <PmIcon className={`w-5 h-5 ${isPmSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span className={`w-3.5 h-3.5 rounded-full border ${isPmSelected ? 'bg-amber-400 border-amber-400' : 'border-slate-700'}`} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{pm.name}</h5>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{pm.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Attendee Details */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Step 3: Attendee Contact Details</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Full Name</span>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      readOnly
                      value={user?.name || 'VIP Concert Fan'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Email Address</span>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      readOnly
                      value={user?.email || 'fan@eventsphere.org'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Concert City</span>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">Contact Number</span>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter contact number"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Seat Allocation & QR Code</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment ₹1,00,000...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>CONFIRM & PAY ₹1,00,000</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}

