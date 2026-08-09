import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchEvents } from '../api/events';
import { formatISTDate, formatISTTime } from '../utils/dateUtils';
import ParallaxConcertGallery from '../components/ParallaxConcertGallery';
import ArtistImage from '../components/ArtistImage';
import { useNotifications } from '../context/NotificationContext';
import {
  ArrowRight,
  Bell,
  BellPlus,
  Calendar,
  CheckCircle2,
  Clock,
  Disc3,
  Flame,
  Loader2,
  MapPin,
  Mic2,
  PlayCircle,
  Search,
  Share2,
  Sparkles,
  Star,
  Ticket,
  Users,
} from 'lucide-react';

const TRACK_RECORD = [
  {
    year: '2011',
    title: 'Discover by artist or city',
    detail: 'Search a pan-India calendar by the singer you love, the city you are travelling to, or the genre you want to hear.',
  },
  {
    year: '2016',
    title: 'Compare ticket categories',
    detail: 'See transparent Fan Pit, Gold and Platinum tiers before choosing the view and price that suit you.',
  },
  {
    year: '2024',
    title: 'Select your seat',
    detail: 'Reserve a numbered seat in the demo checkout, then keep the event, category and seat details together.',
  },
  {
    year: '2026',
    title: 'Keep a mobile pass',
    detail: 'A ticket QR opens a mobile confirmation popup with the booked artist, seat and ticket category.',
  },
];

const safeDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isUpcomingShow = (event) => {
  const date = safeDate(event.event_date);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

const getSearchMatch = (event, query) => {
  if (!query) return true;
  const haystack = [
    event.title,
    event.singer_name,
    event.description,
    event.city,
    event.location,
    event.category,
    ...(event.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

function ShowCard({ event, onShare, onRemind, badge }) {
  const formattedDate = formatISTDate(event.event_date);
  const formattedTime = formatISTTime(event.event_time);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10, rotateX: 2, rotateY: -2 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ transformPerspective: 1000 }}>
      <Link
        to={`/events/${event.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0f0d15]/95 shadow-2xl shadow-black/25 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/40 hover:shadow-yellow-500/10"
      >
        <div className="relative h-56 overflow-hidden bg-slate-950">
          <ArtistImage artist={event.singer_name} alt={`${event.singer_name || 'Artist'} — ${event.title}`} fallback={event.image_url} className="h-full w-full object-contain bg-[#101016] transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-black/65 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {event.category}
            </span>
            {badge && (
              <span className="rounded-full border border-yellow-400/40 bg-yellow-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-200 backdrop-blur-md">
                {badge}
              </span>
            )}
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={(e) => onRemind(e, event)}
              className="rounded-full border border-white/10 bg-black/70 p-2 text-yellow-300 transition-colors hover:bg-yellow-500 hover:text-slate-950"
              title="Set reminder"
            >
              <BellPlus className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => onShare(e, event.id, event.title)}
              className="rounded-full border border-white/10 bg-black/70 p-2 text-white transition-colors hover:bg-white hover:text-slate-950"
              title="Copy show link"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
            <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 font-semibold backdrop-blur-md">
              {event.city}
            </span>
            <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 font-semibold backdrop-blur-md">
              {event.price}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5 p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-black tracking-tight text-white transition-colors group-hover:text-yellow-300">
              {event.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-stone-400">
              {event.description}
            </p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-400" />
              <span>{formattedDate}</span>
              <span className="text-stone-700">•</span>
              <Clock className="h-4 w-4 text-yellow-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-xs font-bold uppercase tracking-[0.18em]">
              <span className="text-stone-500">
                {event.seats_remaining > 0 ? `${event.seats_remaining} seats left` : 'Show completed'}
              </span>
              <span className="inline-flex items-center gap-1 text-yellow-300">
                View show <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);
  const [shareToast, setShareToast] = useState(null);

  const { setCustomReminder } = useNotifications();

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents({
        search: search.trim(),
        category: selectedCategory,
      });
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message || 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const categories = useMemo(() => {
    const dynamic = [...new Set(events.map((event) => event.category).filter(Boolean))];
    return ['All', ...dynamic];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => getSearchMatch(event, search) && (selectedCategory === 'All' || event.category === selectedCategory));
  }, [events, search, selectedCategory]);

  const upcomingShows = useMemo(
    () =>
      filteredEvents
        .filter((event) => isUpcomingShow(event))
        .sort((a, b) => safeDate(a.event_date) - safeDate(b.event_date)),
    [filteredEvents]
  );

  const pastShows = useMemo(
    () =>
      filteredEvents
        .filter((event) => !isUpcomingShow(event))
        .sort((a, b) => safeDate(b.event_date) - safeDate(a.event_date)),
    [filteredEvents]
  );

  const nextShow = upcomingShows[0];
  const totalAudience = events.reduce((sum, event) => sum + (event.capacity || 0), 0);
  const cities = new Set(events.map((event) => event.city).filter(Boolean)).size;

  const handleShare = (e, eventId, eventTitle) => {
    e.preventDefault();
    e.stopPropagation();
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(eventUrl);
    setShareToast(`Copied link for "${eventTitle}" to clipboard!`);
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleRemindClick = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomReminder(event, 3);
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#050507]/85 text-stone-100 backdrop-blur-[2px]">
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-300 text-stone-900 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{shareToast}</span>
        </div>
      )}

      <section className="relative overflow-hidden border-b border-yellow-500/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,90,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(196,30,58,0.16),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="relative mx-auto max-w-7xl space-y-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300 shadow-lg shadow-yellow-500/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span>India's live concert discovery hub</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="space-y-5">
                <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
                  <span className="block text-white">CONCERTS</span>
                  <span className="block gold-shimmer-text">For Every Sound</span>
                  <span className="block text-stone-300 text-3xl sm:text-4xl lg:text-5xl mt-3">discover artists, choose a show and reserve your seat in one place.</span>
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-stone-400">
                  Explore upcoming demo listings for India's biggest voices. Search by artist, city or genre, then pick a ticket category and seat.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-wrap gap-3">
                <a href="#tour-moments" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 btn-gold text-sm font-black text-stone-900">
                  <Disc3 className="h-4 w-4" />
                  Tour legacy
                </a>
                <a href="#upcoming-shows" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-stone-100 backdrop-blur-sm transition-colors hover:border-yellow-500/60 hover:text-yellow-300">
                  <Ticket className="h-4 w-4" />
                  Upcoming shows
                </a>
                <a href="#spotlight-show" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-stone-100 backdrop-blur-sm transition-colors hover:border-yellow-500/60 hover:text-yellow-300">
                  <Flame className="h-4 w-4" />
                  Spotlight booking
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: 'Streams', value: '9B+', icon: Disc3 },
                  { label: 'Followers', value: '90M+', icon: Star },
                  { label: 'Cities', value: `${cities || 0}`, icon: MapPin },
                  { label: 'Next stop', value: nextShow?.city || 'TBA', icon: Mic2 },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <div className="mb-3 inline-flex rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-3 text-yellow-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white">{value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.12 }} className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
                <Sparkles className="h-4 w-4" />
                <span>Concert finder</span>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-500 transition-colors group-focus-within:text-yellow-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a singer name, city or genre to find a show..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-10 text-white shadow-sm outline-none transition-all placeholder:text-stone-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-4 text-stone-500 transition-colors hover:text-white">
                    ✕
                  </button>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                        active
                          ? 'btn-gold text-stone-900 shadow-md shadow-yellow-500/20'
                          : 'border border-white/10 bg-white/5 text-stone-300 hover:border-yellow-500/50 hover:text-yellow-300'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  nextShow ? `Next headline stop: ${nextShow.title} in ${nextShow.city}` : 'Tour updates will appear here automatically.',
                  `${upcomingShows.length} upcoming show${upcomingShows.length === 1 ? '' : 's'} and ${pastShows.length} archive moment${pastShows.length === 1 ? '' : 's'} are grouped below.`,
                  `${Math.round(totalAudience / 1000)}K+ audience capacity across the current tour dataset.`,
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-stone-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ParallaxConcertGallery compact />

      <section id="tour-moments" className="border-b border-white/10 bg-[#09090d] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">How it works</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Find a concert, pick a seat, keep your pass</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-stone-400">
              This section gives the website a more official-artist feel with milestones, era framing, and a stronger sense of story before the ticket grid.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {TRACK_RECORD.map((item) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-[28px] border border-white/10 bg-[#111117] p-6 shadow-lg shadow-black/20"
              >
                <div className="mb-4 inline-flex rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                  {item.year}
                </div>
                <h3 className="text-xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="upcoming-shows" className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">Concert board</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Upcoming shows</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-400">
            The cards below now feel closer to a premium concert landing page, with cleaner metadata, darker panels, and more artist-first copy.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            <p className="text-sm font-medium">Loading concert listings...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-rose-300">
            <p>{error}</p>
            <button
              onClick={loadEvents}
              className="mt-4 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/30 cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#111117] p-8 text-center shadow-lg shadow-black/20">
            <div className="inline-block rounded-full bg-white/5 p-4 text-stone-500">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">No shows found</h3>
            <p className="mt-2 text-sm text-stone-400">
              Try a different artist, city, category, or genre.
            </p>
            {(search || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 transition-colors hover:bg-yellow-500/20 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-3 text-yellow-300">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white">Upcoming shows</h3>
                  <p className="text-sm text-stone-400">Live dates, ticket categories and seats still available.</p>
                </div>
              </div>
              {upcomingShows.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111117] p-8 text-sm text-stone-400">
                  No upcoming shows match the current filter.
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingShows.map((event, index) => (
                    <ShowCard
                      key={event.id}
                      event={event}
                      onShare={handleShare}
                      onRemind={handleRemindClick}
                      badge={index === 0 ? 'Next up' : 'Live soon'}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-stone-300">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white">Previous shows</h3>
                  <p className="text-sm text-stone-400">Past concert listings and show highlights.</p>
                </div>
              </div>
              {pastShows.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111117] p-8 text-sm text-stone-400">
                  No previous shows match the current filter.
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {pastShows.map((event) => (
                    <ShowCard key={event.id} event={event} onShare={handleShare} onRemind={handleRemindClick} badge="Archive" />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#111117] p-8 shadow-lg shadow-black/20">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">Artist-first layout</p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight text-white">One home for concerts across India</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
                    The hero, spotlight module, archive, cards, reminders, and footer are all aligned to a concert-brand experience instead of a generic event portal.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Fan rating', value: '4.9★', icon: Star },
                    { label: 'Tour cities', value: `${cities}`, icon: MapPin },
                    { label: 'Archive shows', value: `${pastShows.length}`, icon: PlayCircle },
                    { label: 'Upcoming dates', value: `${upcomingShows.length}`, icon: Bell },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="mb-3 inline-flex rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-3 text-yellow-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-black tracking-tight text-white">{value}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
