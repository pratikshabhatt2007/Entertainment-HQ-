import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Maximize2 } from 'lucide-react';
import { fetchEvents } from '../api/events';
import ArtistImage from './ArtistImage';

export default function ParallaxConcertGallery({ compact = false }) {
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState(0);
  useEffect(() => { fetchEvents().then(({ events: data }) => setEvents(data)).catch(() => setEvents([])); }, []);
  const uniqueArtistEvents = useMemo(() => Array.from(new Map(events.map((event) => [event.singer_name?.toLowerCase(), event])).values()), [events]);
  const photos = compact ? uniqueArtistEvents.slice(0, 6) : uniqueArtistEvents;
  const active = photos[featured] || photos[0];
  return <section className="bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.3em] text-yellow-300">Artist preview</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">PAN-INDIA <span className="gold-shimmer-text">LIVE</span></h2><p className="mt-3 max-w-xl text-sm text-stone-300">Every concert is represented by its own artist image — no repeated Diljit-only gallery.</p></div><Camera className="mb-1 hidden h-12 w-12 text-yellow-300 sm:block" /></div>
    {!compact && active && <motion.div key={active.id} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="concert-frame relative mb-8 h-[52vh] min-h-[360px] overflow-hidden rounded-[32px] bg-[#101016]"><ArtistImage artist={active.singer_name} alt={`${active.singer_name} live`} fallback={active.image_url} className="h-full w-full object-contain" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /><div className="absolute bottom-0 left-0 p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-[.22em] text-yellow-300">Featured artist</p><h3 className="mt-2 text-3xl font-black">{active.singer_name?.toUpperCase()} LIVE</h3><p className="mt-2 flex items-center gap-2 text-sm text-stone-200"><MapPin className="h-4 w-4 text-yellow-300" />{active.city}</p></div></motion.div>}
    <div className={`grid gap-5 ${compact ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'}`}>{photos.map((event, index) => <motion.button key={event.id} onClick={() => setFeatured(index)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8, scale: 1.01 }} viewport={{ once: true }} className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#111] text-left shadow-2xl ${compact ? 'h-72' : index % 5 === 0 ? 'h-[440px] md:col-span-2' : 'h-80'}`}><ArtistImage artist={event.singer_name} alt={`${event.singer_name} live`} fallback={event.image_url} className="h-full w-full object-contain transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5"><span><b className="block text-lg">{event.singer_name}</b><small className="text-yellow-200">{event.city}</small></span><Maximize2 className="h-5 w-5 text-yellow-300 opacity-0 transition group-hover:opacity-100" /></div></motion.button>)}</div>
  </div></section>;
}
