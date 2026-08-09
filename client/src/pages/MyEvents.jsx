import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyRegistrations, fetchMyHistory, cancelRegistration } from '../api/registrations';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import TicketView from '../components/TicketView';
import {
  Package,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
  QrCode,
  Search,
  Sparkles,
  ShieldCheck,
  Boxes,
  ArrowRight,
} from 'lucide-react';

export default function MyEvents() {
  const { token, user } = useAuth();
  const { registeredEvents, cancelRegistration: cancelLocalRegistration } = useNotifications();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'
  const [searchQuery, setSearchQuery] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ticket Modal state
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Cancelling ID state
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      setRegistrations(
        activeTab === 'upcoming'
          ? registeredEvents.filter((registration) => registration.status !== 'cancelled')
          : registeredEvents.filter((registration) => registration.status === 'cancelled')
      );
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err.message || 'Failed to load your inventory passes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [activeTab, token, registeredEvents]);

  const handleCancel = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to release "${eventTitle}" from your inventory?`)) {
      return;
    }

    setCancellingId(id);
    setToast(null);

    try {
      cancelLocalRegistration(id);
      setRegistrations((current) => current.filter((registration) => registration.id !== id));
      setToast({ type: 'success', message: 'Pass released from inventory successfully.' });
    } catch (err) {
      console.error('Failed to cancel registration:', err);
      setToast({ type: 'error', message: err.message || 'Failed to update inventory.' });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const event = reg.events || reg;
    const title = (event.title || '').toLowerCase();
    const location = (event.location || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || location.includes(query);
  });

  const activeCount = registeredEvents.filter((r) => r.status !== 'cancelled').length;
  const cancelledCount = registeredEvents.filter((r) => r.status === 'cancelled').length;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-[#13101E] to-stone-950 border border-stone-800 dark:border-yellow-900/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest">
              <Boxes className="w-3.5 h-3.5" /> Personal Ticket Vault
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>My Inventory</span>
            </h1>
            <p className="text-stone-400 text-sm max-w-xl">
              Your verified pass collection. Inspect, present, or manage active digital tickets for your upcoming events.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Active Passes</p>
                <p className="text-xl font-black text-white">{activeCount}</p>
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-800 text-stone-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Released</p>
                <p className="text-xl font-black text-stone-300">{cancelledCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-yellow-500 text-stone-950 shadow-md shadow-yellow-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Active Inventory ({activeCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-yellow-500 text-stone-950 shadow-md shadow-yellow-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Archive & History ({cancelledCount})</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs font-bold uppercase tracking-wider hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          <p className="text-sm font-medium">Accessing inventory vault...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center max-w-md mx-auto">
          <p>{error}</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-stone-900/40 border border-stone-800/80 rounded-3xl p-8 shadow-xl">
          <div className="p-4 rounded-2xl bg-stone-800/80 text-stone-500 inline-block border border-stone-700/50">
            <Package className="w-10 h-10 text-yellow-500/60" />
          </div>
          <h3 className="text-xl font-bold text-white">No items in {activeTab === 'upcoming' ? 'Active Inventory' : 'Archive'}</h3>
          <p className="text-sm text-stone-400 leading-relaxed">
            {searchQuery
              ? `No inventory items matched "${searchQuery}".`
              : activeTab === 'upcoming'
              ? 'Your inventory vault is empty. Explore upcoming concerts and shows to claim your digital passes.'
              : 'You have no archived or cancelled passes.'}
          </p>
          {activeTab === 'upcoming' && !searchQuery && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-gold text-stone-950 font-bold text-sm shadow-lg shadow-yellow-500/10 hover:scale-105 transition-transform"
            >
              <span>Explore Shows</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredRegistrations.map((reg) => {
            const event = reg.events || reg;
            const isCancelled = reg.status === 'cancelled';
            const formattedDate = (event.event_date || event.date)
              ? new Date(event.event_date || event.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Upcoming';

            return (
              <div
                key={reg.id || reg.ticket_id}
                className="group relative rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-stone-800 hover:border-yellow-500/40 p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:shadow-yellow-500/5 overflow-hidden"
              >
                {/* Background Accent Grid */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors pointer-events-none" />

                {/* Header Tag Bar */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isCancelled
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isCancelled ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isCancelled ? 'Released' : 'Verified Pass'}</span>
                    </span>
                    {event.category && (
                      <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    #{reg.ticket_id || 'CONFIRMED'}
                  </span>
                </div>

                {/* Event Info Block */}
                <div className="space-y-3 relative z-10">
                  <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                    {event.title || 'Concert Pass'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                      <Calendar className="w-4 h-4 text-yellow-400 shrink-0" />
                      <div>
                        <p className="text-[9px] text-stone-500 font-bold uppercase">Date & Time</p>
                        <p className="font-semibold text-stone-200">{formattedDate} {event.event_time ? `• ${event.event_time}` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                      <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-stone-500 font-bold uppercase">Venue</p>
                        <p className="font-semibold text-stone-200 truncate">{event.location || 'Stadium Venue'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3 relative z-10">
                  <button
                    onClick={() => setSelectedTicket(reg)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-gold text-stone-950 text-xs font-black shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Digital Pass</span>
                  </button>

                  {!isCancelled && activeTab === 'upcoming' && (
                    <button
                      onClick={() => handleCancel(reg.id, event.title)}
                      disabled={cancellingId === reg.id}
                      className="px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Release pass from inventory"
                    >
                      {cancellingId === reg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Release</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal Popup */}
      {selectedTicket && (
        <TicketView
          registration={selectedTicket}
          userName={user?.name}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
