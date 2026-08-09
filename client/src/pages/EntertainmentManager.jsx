import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, Ticket, ArrowRight, Mic2, Clapperboard, ShieldCheck, Smartphone } from 'lucide-react';
import { CURATED_COMEDY, CURATED_MOVIES } from '../api/events';
import { formatISTDate, formatISTTime } from '../utils/dateUtils';

export default function EntertainmentManager({ kind = 'comedy' }) {
  const isComedy = kind === 'comedy';
  const entries = isComedy ? CURATED_COMEDY : CURATED_MOVIES;
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All India');
  const cities = ['All India', ...new Set(entries.map((item) => item.city))];
  const results = useMemo(() => entries.filter((item) => {
    const matchingText = `${item.singer_name} ${item.title} ${item.city} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    return matchingText && (city === 'All India' || item.city === city);
  }), [entries, query, city]);
  const Icon = isComedy ? Mic2 : Clapperboard;
  const title = isComedy ? 'SUCM Stand Up Comedy Manager' : 'Movies Manager';
  const eyebrow = isComedy ? "India's live comedy discovery hub" : "India's cinema discovery hub";
  const heading = isComedy ? ['LAUGHS', 'For Every Mood'] : ['MOVIES', 'For Every Fan'];
  const description = isComedy
    ? 'Find a favourite comedian, compare upcoming demo listings in Indian cities, and reserve your seat in a few taps.'
    : 'Search a favourite actor or actress, discover upcoming demo movie listings and reserve your cinema ticket in a few taps.';

  return <div className="flex-1 overflow-hidden bg-[#050507]/85 text-stone-100">
    <section className="relative overflow-hidden border-b border-yellow-500/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,90,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(196,30,58,0.16),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[.25em] text-yellow-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />{eyebrow}</div>
          <div><p className="mb-3 text-sm font-black uppercase tracking-[.2em] text-yellow-300">{title}</p><h1 className="text-5xl font-black leading-[.95] tracking-tight sm:text-6xl lg:text-8xl"><span className="block text-white">{heading[0]}</span><span className="block gold-shimmer-text">{heading[1]}</span><span className="mt-3 block text-3xl text-stone-300 sm:text-4xl">search, choose and reserve in one place.</span></h1></div>
          <p className="max-w-3xl text-lg leading-relaxed text-stone-400">{description}</p>
          <div className="flex flex-wrap gap-3"><a href="#lineup" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 btn-gold text-sm font-black text-stone-900"><Ticket className="h-4 w-4" />View lineup</a><span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-stone-100"><Smartphone className="h-4 w-4 text-yellow-300" />Instant e-ticket</span></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-yellow-300"><Icon className="h-4 w-4" />{isComedy ? 'Artist finder' : 'Cast finder'}</div>
          <label className="relative block"><Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-stone-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isComedy ? 'Search Zakir, Bassi, city…' : 'Search an actor, actress or city…'} className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20" /></label>
          <div className="mt-4 flex flex-wrap gap-2">{cities.map((item) => <button key={item} onClick={() => setCity(item)} className={`rounded-full px-3 py-2 text-xs font-bold ${city === item ? 'btn-gold text-stone-900' : 'border border-white/10 bg-white/5 text-stone-300'}`}>{item}</button>)}</div>
          <div className="mt-6 space-y-3 text-sm text-stone-300"><p className="rounded-2xl border border-white/10 bg-black/30 p-3">{results.length} listing{results.length === 1 ? '' : 's'} match your search.</p><p className="flex gap-2 rounded-2xl border border-white/10 bg-black/30 p-3"><ShieldCheck className="h-5 w-5 shrink-0 text-yellow-300" />QR/UPI, card and net-banking checkout included.</p></div>
        </motion.div>
      </div>
    </section>
    <section id="lineup" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-yellow-300">Upcoming demo schedule</p><h2 className="mt-2 text-3xl font-black text-white">{isComedy ? 'Who is making India laugh next' : 'What is coming to a screen near you'}</h2></div><p className="max-w-md text-sm text-stone-400">Every card leads to the same secure booking flow and mobile-friendly ticket pass.</p></div>
      {results.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{results.map((event, index) => <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} viewport={{ once: true }} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111117] shadow-xl shadow-black/20"><div className="flex h-64 items-center justify-center overflow-hidden bg-black"><img src={event.image_url} alt={`${event.singer_name} promotional photograph`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=85'; }} className="h-full w-full object-contain object-center" /></div><div className="space-y-4 p-6"><div><span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-yellow-300">{event.category}</span><h3 className="mt-4 text-xl font-black text-white">{event.title}</h3><p className="mt-2 text-sm text-stone-400">Featuring {event.singer_name}</p></div><div className="space-y-2 border-t border-white/10 pt-4 text-sm text-stone-400"><p className="flex gap-2"><Calendar className="h-4 w-4 text-yellow-300" />{formatISTDate(event.event_date)} · {formatISTTime(event.event_time)}</p><p className="flex gap-2"><MapPin className="h-4 w-4 text-yellow-300" />{event.location}</p></div><Link to={`/events/${event.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 btn-gold font-black text-stone-900">Book tickets · {event.price}<ArrowRight className="h-4 w-4" /></Link></div></motion.div>)}</div> : <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-stone-400">No listing matches that search. Try another artist or city.</div>}</section>
  </div>;
}
