import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Mic2, Star, Ticket, ArrowRight, Volume2, Radio, Headphones } from 'lucide-react';

const STATS = [
  { value: '50K+', label: 'Tickets Sold', icon: Ticket },
  { value: '120+', label: 'Live Shows', icon: Mic2 },
  { value: '30+', label: 'Indian Cities', icon: Radio },
  { value: '4.9★', label: 'Fan Rating', icon: Star },
];

const MARQUEE_ITEMS = [
  '🎤 DILJIT DOSANJH LIVE',
  '⚡ INDIA TOUR 2026',
  '🎸 VIP EXPERIENCE',
  '🎟️ BOOK NOW',
  '🎵 SOLD OUT SHOWS',
  '🌟 EXCLUSIVE MERCH',
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#EDE8DF]
        dark:from-[#08070D] dark:via-[#12101A] dark:to-[#1A1730]">

        {/* Light mode decorative orbs */}
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-yellow-200/40 dark:bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-red-200/30 dark:bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] dark:bg-yellow-500/3 rounded-full blur-[200px] pointer-events-none" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating music notes (decorative) */}
        <div className="absolute top-16 right-16 text-yellow-300/20 dark:text-yellow-500/10 text-6xl font-black select-none rotate-12 pointer-events-none hidden lg:block">♪</div>
        <div className="absolute bottom-32 left-12 text-red-300/20 dark:text-red-500/10 text-5xl font-black select-none -rotate-12 pointer-events-none hidden lg:block">♫</div>
        <div className="absolute top-1/3 right-8 text-yellow-200/30 dark:text-yellow-600/10 text-3xl font-black select-none rotate-6 pointer-events-none hidden xl:block">♩</div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">

          {/* Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 shadow-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">India Tour 2026 — Tickets Live Now</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              <span className="block text-stone-900 dark:text-white">Feel the</span>
              <span className="block gold-shimmer-text">Stage Energy</span>
              <span className="block text-stone-700 dark:text-stone-300 text-4xl sm:text-5xl lg:text-6xl font-bold mt-2">
                Like Never Before
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Book your front-row seats to India's most electrifying live music experience.
              Exclusive VIP packages, premium seating & unforgettable nights with
              <span className="text-yellow-600 dark:text-yellow-400 font-bold"> Aaryan Malik</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/events/spotlight-concert"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl btn-gold text-stone-900 font-black text-base shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
            >
              <Ticket className="w-5 h-5" />
              <span>Book Your Seat Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/calendar"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-base hover:border-yellow-500/60 dark:hover:border-yellow-500/40 hover:text-yellow-700 dark:hover:text-yellow-400 transition-all duration-300 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
            >
              <Radio className="w-5 h-5" />
              <span>View Tour Dates</span>
            </Link>
          </div>

          {/* Trust Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {['Instant e-Ticket', 'Secure Payment', 'VIP Lounge Access', 'Merch Included'].map((chip) => (
              <span key={chip} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <span className="text-yellow-500">✓</span> {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scrolling Marquee ── */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600 py-3 overflow-hidden relative">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-stone-900 font-black text-sm tracking-[0.15em] px-10">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Stats Section ── */}
      <section className="bg-white dark:bg-[#100E1A] border-y border-stone-100 dark:border-yellow-900/20 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center space-y-2 group">
                <div className="inline-flex p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-3xl font-black gold-text">{value}</div>
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section className="py-16 bg-stone-50 dark:bg-[#0D0B15]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" /> The StageFront Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">Why Fans Choose Us</h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
              From the moment you book to the final encore — we make every beat count.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Headphones,
                title: 'VIP Sound Zones',
                desc: 'Premium reserved seating with state-of-the-art acoustics. Your ears deserve the best.',
                color: 'yellow',
              },
              {
                icon: Ticket,
                title: 'Instant Digital Pass',
                desc: 'Scan-ready e-tickets delivered immediately. No queues, no paper, pure access.',
                color: 'red',
              },
              {
                icon: Volume2,
                title: 'Artist Meet & Greet',
                desc: 'Exclusive backstage access with VIP packages. Create memories you\'ll never forget.',
                color: 'yellow',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="p-6 rounded-2xl bg-white dark:bg-[#100E1A] border border-stone-100 dark:border-yellow-900/20 hover:border-yellow-300/60 dark:hover:border-yellow-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-yellow-500/10 space-y-4"
              >
                <div className={`inline-flex p-3 rounded-xl ${color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20' : 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20'} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-stone-900 to-stone-800 dark:from-[#12101A] dark:to-[#08070D]">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(196,30,58,0.4) 0%, transparent 60%)` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Don't miss <span className="gold-shimmer-text">Aaryan Malik</span> live.<br />
            Seats are filling fast.
          </h2>
          <p className="text-stone-300 text-sm">Over 12,000 tickets sold. Limited VIP slots remaining.</p>
          <Link
            to="/events/spotlight-concert"
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl btn-gold text-stone-900 font-black text-base shadow-xl pulse-glow"
          >
            <Music2 className="w-5 h-5" />
            <span>Reserve Your Spot</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
