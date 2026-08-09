import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MapPin, Ticket, X } from 'lucide-react';

export default function MobileTicket() {
  const [params] = useSearchParams();
  const artist = params.get('artist') || 'Concerts Manager';
  const show = params.get('show') || `${artist} Live`;
  const seat = params.get('seat') || 'TBA';
  const tier = params.get('tier') || 'General';
  const amount = params.get('amount');
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 text-white backdrop-blur-md"><div className="relative w-full max-w-md rounded-[32px] border border-yellow-400/30 bg-[#111117] p-7 text-center shadow-2xl"><Link to="/" className="absolute right-4 top-4 rounded-lg p-2 text-stone-400 hover:bg-white/10"><X className="h-5 w-5" /></Link><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" /><p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-yellow-300">Congratulations — booking confirmed</p><h1 className="mt-2 text-3xl font-black">{artist}</h1><p className="mt-2 text-stone-300">{show}</p><div className="my-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-left"><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-stone-400">Category</span><b>{tier}</b></div><div className="flex justify-between border-b border-white/10 py-3"><span className="text-stone-400">Your seat</span><b className="text-emerald-300">{seat}</b></div><div className="flex justify-between pt-3"><span className="text-stone-400">Ticket value</span><b>{amount ? `₹${Number(amount).toLocaleString('en-IN')}` : 'TBA'}</b></div></div><p className="flex items-center justify-center gap-2 text-xs text-stone-400"><MapPin className="h-4 w-4 text-yellow-400" />Show this page at the venue gate.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-stone-950"><Ticket className="h-4 w-4" />Explore more concerts</Link></div></div>;
}
