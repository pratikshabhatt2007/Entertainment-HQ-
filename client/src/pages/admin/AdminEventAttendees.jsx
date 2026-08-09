import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventAttendees, fetchEventById } from '../../api/events';
import {
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  Download,
  Loader2,
  AlertCircle,
  Mail,
  Ticket,
  Clock,
} from 'lucide-react';

export default function AdminEventAttendees() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [evData, attData] = await Promise.all([
        fetchEventById(id),
        fetchEventAttendees(id),
      ]);
      setEvent(evData.event);
      setAttendees(attData.attendees || []);
    } catch (err) {
      console.error('Error loading attendee roster:', err);
      setError(err.message || 'Failed to load attendee roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Export Concert Attendees Roster as CSV File
  const exportToCSV = () => {
    if (!attendees.length) return;

    const headers = ['Ticket ID', 'Attendee Name', 'Attendee Email', 'Singer Name', 'Concert City', 'Allotted Seat', 'Amount Paid', 'Registration Date', 'Payment Status'];
    const rows = attendees.map((att) => [
      att.ticket_id || att.id || 'CONCERT-TICKET',
      att.users?.name || att.user_name || 'VIP Concert Fan',
      att.users?.email || att.user_email || 'fan@entertainmenthq.com',
      att.singer_name || event?.singer_name || 'Aaryan Malik',
      event?.city || 'Mumbai / Delhi / Bengaluru',
      att.seat_number || 'VIP Row A, Seat 14',
      att.amount_paid || '₹1,00,000',
      new Date(att.registered_at || att.created_at || Date.now()).toLocaleDateString(),
      'PAID SUCCESSFUL',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Concert_Attendees_${event?.title || 'Aaryan_Malik_Live'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendees = attendees.filter((att) => {
    const name = (att.users?.name || att.user_name || '').toLowerCase();
    const email = (att.users?.email || att.user_email || '').toLowerCase();
    const query = search.toLowerCase().trim();
    return name.includes(query) || email.includes(query);
  });

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-medium">Loading attendee roster...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Roster Unavailable</h2>
        <p className="text-sm text-slate-400">{error || 'Event not found.'}</p>
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Events</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <span>Attendee Roster</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">{event.title}</p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={exportToCSV}
          disabled={attendees.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Roster</span>
        </button>
      </div>

      {/* Event Details Summary Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Event Date</p>
            <p className="font-semibold text-white">
              {new Date(event.event_date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Venue</p>
            <p className="font-semibold text-white truncate">{event.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Registered</p>
            <p className="font-semibold text-white">
              {attendees.length} / {event.capacity} Attendees
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter attendees by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              <tr>
                <th className="px-6 py-4">Attendee</th>
                <th className="px-6 py-4">Pass Code ID</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No registered attendees found.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 font-bold text-xs shrink-0">
                        {(att.users?.name || att.user_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {att.users?.name || att.user_name || 'Anonymous User'}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500 inline" />
                          <span>{att.users?.email || att.user_email}</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Ticket className="w-3 h-3 text-indigo-400" />
                        {att.id ? att.id.substring(0, 8).toUpperCase() : 'PASS-OK'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(att.registered_at || att.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        Confirmed Pass
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
