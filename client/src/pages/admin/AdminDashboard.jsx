import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchEvents } from '../../api/events';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Ticket,
  Music2,
  DollarSign,
  MapPin,
  Flame,
  Sliders,
  Radio,
  Zap,
  Activity,
  Server,
} from 'lucide-react';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Admin Settings state (demo)
  const [publicBookingEnabled, setPublicBookingEnabled] = useState(true);
  const [autoPassGen, setAutoPassGen] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData.events || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [token]);

  const showSettingToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const today = new Date().toISOString().split('T')[0];
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => (e.event_date || e.date) >= today).length;
  const completedEvents = events.filter((e) => (e.event_date || e.date) < today).length;
  const totalCapacitySum = events.reduce((sum, e) => sum + (e.capacity || 0), 0);

  const metricCards = [
    {
      label: 'Total Concerts',
      value: totalEvents,
      sub: 'Published shows',
      icon: Music2,
      gradient: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/20',
      iconBg: 'bg-yellow-500/15',
      iconColor: 'text-yellow-400',
      valueColor: 'text-yellow-300',
    },
    {
      label: 'Upcoming Dates',
      value: upcomingEvents,
      sub: 'Live on schedule',
      icon: Clock,
      gradient: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-300',
    },
    {
      label: 'Completed Shows',
      value: completedEvents,
      sub: 'Archived concerts',
      icon: CheckCircle2,
      gradient: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/15',
      iconColor: 'text-green-400',
      valueColor: 'text-green-300',
    },
    {
      label: 'Total Capacity',
      value: totalCapacitySum.toLocaleString(),
      sub: 'Configured seats',
      icon: Users,
      gradient: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/15',
      iconColor: 'text-red-400',
      valueColor: 'text-red-300',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 text-stone-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce border border-yellow-300/50">
            <Zap className="w-4 h-4 text-stone-900" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Welcome Header Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-stone-900 via-[#12101A] to-[#1A1730] dark:from-[#0F0D1A] dark:via-[#12101A] dark:to-[#1A1730] border border-yellow-900/20 shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Backstage Command Center
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Server className="w-3 h-3" /> Supabase Connected
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Welcome, <span className="gold-shimmer-text">{user?.name || 'Administrator'}</span>
              </h1>
              <p className="text-stone-400 text-sm max-w-md">
                Monitor live show inventory, configure global booking parameters, and inspect attendee rosters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/events"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-gold text-stone-900 font-black shadow-xl hover:scale-105 transition-transform"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create & Edit Shows</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Portal Settings Bar */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-yellow-400" />
              <h3 className="text-base font-bold text-white">Global Portal & Booking Controls</h3>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Live System State</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Setting 1 */}
            <div
              onClick={() => {
                setPublicBookingEnabled(!publicBookingEnabled);
                showSettingToast(`Public Ticket Sales ${!publicBookingEnabled ? 'Enabled' : 'Paused'}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                publicBookingEnabled
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400'
              }`}
            >
              <div>
                <p className="text-xs font-bold">Public Ticket Sales</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Allow fans to checkout tickets</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${publicBookingEnabled ? 'bg-yellow-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                {publicBookingEnabled ? 'Active' : 'Paused'}
              </span>
            </div>

            {/* Setting 2 */}
            <div
              onClick={() => {
                setAutoPassGen(!autoPassGen);
                showSettingToast(`Instant Pass Auto-Issue ${!autoPassGen ? 'Enabled' : 'Disabled'}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                autoPassGen
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400'
              }`}
            >
              <div>
                <p className="text-xs font-bold">Auto QR Pass Issue</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Instant digital ticket generation</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${autoPassGen ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                {autoPassGen ? 'Auto' : 'Manual'}
              </span>
            </div>

            {/* Setting 3 */}
            <div
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                showSettingToast(`Portal Maintenance Mode ${!maintenanceMode ? 'ENABLED' : 'OFF'}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                maintenanceMode
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                  : 'bg-stone-950 border-stone-800 text-stone-400'
              }`}
            >
              <div>
                <p className="text-xs font-bold">Portal Maintenance</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Restrict access to admins only</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${maintenanceMode ? 'bg-rose-500 text-white' : 'bg-stone-800 text-stone-500'}`}>
                {maintenanceMode ? 'ACTIVE' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            <p className="text-sm font-medium">Loading concert metrics...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {metricCards.map(({ label, value, sub, icon: Icon, gradient, border, iconBg, iconColor, valueColor }) => (
              <div
                key={label}
                className={`p-5 rounded-3xl bg-gradient-to-br ${gradient} border ${border} bg-stone-900 shadow-lg space-y-3 hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">{label}</span>
                  <div className={`p-2 rounded-xl ${iconBg} border ${border}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                </div>
                <div className={`text-3xl font-black ${valueColor}`}>{value}</div>
                <p className="text-[11px] text-stone-400">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Concert Events Roster Overview */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Live Concert Roster</h3>
              <p className="text-xs text-stone-400 mt-0.5">Manage shows and inspect attendee bookings</p>
            </div>
            <Link
              to="/admin/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-gold text-stone-950 text-xs font-black transition-transform hover:scale-105"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-sm text-stone-400 py-12 text-center">No concert events listed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-black tracking-wider bg-stone-950/60">
                    <th className="py-3.5 px-6">Concert Show</th>
                    <th className="py-3.5 px-6">City / Venue</th>
                    <th className="py-3.5 px-6">Event Date</th>
                    <th className="py-3.5 px-6 text-center">Capacity</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {events.slice(0, 6).map((event) => {
                    const eventDate = event.event_date || event.date;
                    const isUpcoming = eventDate >= today;
                    return (
                      <tr key={event.id} className="hover:bg-stone-800/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                              <Music2 className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-sm block">{event.title}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{event.singer_name || event.organizer || 'Featured Artist'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-stone-400">
                            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                            <span>{event.city || event.location || 'India'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-stone-300 font-mono">{eventDate || 'Upcoming'}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-xs font-bold text-stone-200">{(event.capacity || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                              isUpcoming
                                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                : 'bg-stone-800 border-stone-700 text-stone-400'
                            }`}
                          >
                            {isUpcoming ? '● Upcoming' : '✓ Completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
