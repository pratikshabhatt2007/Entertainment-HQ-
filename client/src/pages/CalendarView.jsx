import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchEvents } from '../api/events';
import { useNotifications } from '../context/NotificationContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Tag,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const getRandomImage = (id) => {
  const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  ];
  return DEFAULT_IMAGES[(id ? id.charCodeAt(0) : 0) % DEFAULT_IMAGES.length];
};

export default function CalendarView() {
  const { registeredEvents } = useNotifications();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calendar State (Current Date focused)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error loading calendar events:', err);
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Map events to day numbers
  const eventsByDay = {};
  events.forEach((ev) => {
    if (ev.event_date) {
      const d = new Date(ev.event_date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dateNum = d.getDate();
        if (!eventsByDay[dateNum]) eventsByDay[dateNum] = [];
        eventsByDay[dateNum].push(ev);
      }
    }
  });

  const selectedDayEvents = eventsByDay[selectedDay] || [];
  const bookedEventIds = new Set(registeredEvents.map((registration) => registration.event_id || registration.events?.id));

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-indigo-400" />
          <span>Pan-India Concert Calendar</span>
        </h1>
        <p className="text-slate-400 mt-1">Browse upcoming and archived singer shows by date</p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Loading concert calendar...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center max-w-md mx-auto">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Calendar Grid */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Month Nav Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">{monthName}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-slate-950/30" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const hasEvents = !!eventsByDay[dayNum];
                const count = hasEvents ? eventsByDay[dayNum].length : 0;
                const bookedShows = hasEvents ? eventsByDay[dayNum].filter((event) => bookedEventIds.has(event.id)) : [];
                const isSelected = selectedDay === dayNum;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDay(dayNum)}
                    title={bookedShows.length ? `Your booked concert: ${bookedShows.map((event) => event.title).join(', ')}` : hasEvents ? eventsByDay[dayNum].map((event) => event.title).join(', ') : undefined}
                    className={`h-14 sm:h-16 rounded-xl p-2 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer border text-xs font-semibold relative ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-105 z-10'
                        : bookedShows.length
                        ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400 shadow-lg shadow-emerald-500/20 hover:bg-emerald-500/30'
                        : hasEvents
                        ? 'bg-slate-800/80 text-white border-indigo-500/40 hover:border-indigo-400'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasEvents && (
                      <span
                        className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-500/30 text-indigo-300'
                        }`}
                      >
                {count} {count === 1 ? 'show' : 'shows'}
                      </span>
                    )}
                    {bookedShows.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-emerald-400 px-1.5 py-0.5 text-[9px] font-black text-emerald-950">PASS</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Col: Events on Selected Day */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Shows on {currentDate.toLocaleDateString(undefined, { month: 'short' })} {selectedDay}, {year}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'show scheduled' : 'shows scheduled'}
              </p>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-slate-500">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm">No singer shows scheduled for this day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((ev) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/events/${ev.id}`}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 block transition-all hover:scale-[1.02] group space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                          <Tag className="w-3 h-3" />
                          {ev.category || 'General'}
                        </span>
                        {ev.event_time && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {ev.event_time}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
