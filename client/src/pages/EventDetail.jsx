import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchEventById, fetchEvents } from '../api/events';
import { fetchMyRegistrations } from '../api/registrations';
import { useAuth } from '../context/AuthContext';
import { formatISTDate, formatISTTime } from '../utils/dateUtils';
import TicketView from '../components/TicketView';
import BookingModal from '../components/BookingModal';
import ArtistImage from '../components/ArtistImage';
import { useNotifications } from '../context/NotificationContext';
import { recordActivity } from '../lib/activityLog';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  ArrowLeft,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

export default function EventDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const { addRegistration } = useNotifications();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration states
  const [userRegistration, setUserRegistration] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [shareToast, setShareToast] = useState(null);

  const loadEventDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventById(id);
      setEvent(data.event);
      setLoading(false);

      const savedRegistrations = JSON.parse(window.localStorage.getItem('entertainmenthq_registrations') || '[]');
      const savedRegistration = savedRegistrations.find((registration) => registration.event_id === id || registration.events?.id === id);
      if (savedRegistration) {
        setUserRegistration(savedRegistration);
        if (searchParams.get('pass') === '1') setShowTicketModal(true);
      }

      // Load related singer shows
      try {
        const allEvs = await fetchEvents({});
        setRelatedEvents((allEvs.events || []).filter((e) => e.id !== id).slice(0, 3));
      } catch (rErr) {
        console.warn('Could not load related events:', rErr);
      }

      // Check user registration status
      if (token) {
        try {
          const myRegs = await fetchMyRegistrations(token);
          const found = (myRegs.registrations || []).find(
            (r) => (r.event_id === id || r.events?.id === id) && r.status === 'registered'
          );
          if (found) {
            setUserRegistration(found);
          }
        } catch (regErr) {
          console.warn('Could not check user registration status:', regErr);
        }
      }
    } catch (err) {
      console.error('Error fetching event detail:', err);
      setError(err.message || 'Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetail();
  }, [id, token, searchParams]);

  const handleBookingComplete = (booking) => {
    const registration = {
      id: `demo-${Date.now()}`,
      ticket_id: `DIL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      event_id: event.id,
      status: 'registered',
      amount_paid: booking.amount ? `₹${Number(booking.amount).toLocaleString('en-IN')}` : event.price,
      seat_number: `${booking.tier || 'General'} · Seat ${booking.seat || 'TBA'}`,
      singer_name: event.singer_name || event.organizer,
      events: event,
    };
    window.localStorage.setItem(`concert-booking-${event.id}`, JSON.stringify(registration));
    addRegistration(registration);
    recordActivity({ name: booking.name || user?.name || 'Concert guest', email: booking.email || user?.email || '', action: 'Ticket booked', show: `${event.title} — ${booking.tier || 'General'} pass` });
    setUserRegistration(registration);
    setShowBookingModal(false);
    setShowTicketModal(true);
    setToast({ type: 'success', message: 'Congratulations! Your concert seat is booked and your digital pass is ready.' });
  };

  const handleShare = () => {
    const eventUrl = window.location.href;
    navigator.clipboard.writeText(eventUrl);
    setShareToast('Event link copied to clipboard!');
    setTimeout(() => setShareToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading singer show details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 inline-block">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Show Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'The show you are looking for does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Singer Shows</span>
        </Link>
      </div>
    );
  }

  const formattedDate = formatISTDate(event.event_date);
  const formattedTime = formatISTTime(event.event_time);

  const isAlreadyRegistered = !!userRegistration;

  return (
    <div className="flex-1 pb-16">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Back button header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Singer Shows</span>
        </Link>
      </div>

      {/* Hero Banner Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl"
        >
          <div className="h-64 sm:h-96 w-full relative overflow-hidden">
            <ArtistImage
              artist={event.singer_name || event.organizer}
              alt={event.title}
              fallback={event.image_url}
              className="w-full h-full object-contain bg-[#101016]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" />
                {event.category || 'General'}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
              title="Share event link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Event Main Content Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Event Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300 pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  {formattedTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{formattedTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Toast Alert */}
              {toast && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
                    toast.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {toast.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <span>{toast.message}</span>
                </div>
              )}

              {/* About Show Description */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xl font-bold text-white">About this Show</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                  {event.description || 'No detailed description provided for this show.'}
                </p>
              </div>

              {/* Show Capacity & Venue */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Venue & Timezone</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm font-semibold text-white">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-purple-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Timezone / Capacity</p>
                      <p className="text-sm font-semibold text-white">IST (UTC+05:30) • {event.capacity} Seats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Registration Action Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Pass Type</span>
                  <div className="text-3xl font-extrabold text-white">{event.price || 'Available on request'}</div>
                  <p className="text-xs text-slate-400">Choose a category and numbered seat before checkout</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  {isAlreadyRegistered ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                            <span>Your pass is confirmed</span>
                      </div>
                      <button
                        onClick={() => setShowTicketModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-indigo-400" />
                        <span>View Ticket Pass</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      <Ticket className="w-5 h-5" />
                      <span>Reserve This Show</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Demo concert listing — verify event details before sale</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Shows Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold text-white">More concerts you may like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/events/${rel.id}`}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
                >
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rel.description}</p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                    <span>View Show</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal Popup */}
      {showTicketModal && userRegistration && (
        <TicketView
          registration={userRegistration}
          userName={user?.name}
          onClose={() => setShowTicketModal(false)}
        />
      )}
      {showBookingModal && event && (
        <BookingModal event={event} onClose={() => setShowBookingModal(false)} onComplete={handleBookingComplete} />
      )}
    </div>
  );
}
