import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Music2,
  LogOut,
  User,
  ShieldCheck,
  Ticket,
  LayoutDashboard,
  Menu,
  X,
  CalendarDays,
  Sun,
  Moon,
  Bell,
  Clock,
  CheckCheck,
  Trash2,
  MapPin,
  Sparkles,
  Star,
  Mic2,
  Package,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    registeredEvents,
    toastMessage,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('registrations');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setNotifModalOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date();
    const eventDate = new Date(dateStr);
    const diffMs = eventDate - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days;
  };

  const navLinkClass = (path) =>
    `text-sm font-semibold tracking-wide transition-all duration-200 relative group ${
      isActive(path)
        ? 'text-yellow-500 dark:text-yellow-400'
        : 'text-stone-600 dark:text-stone-300 hover:text-yellow-600 dark:hover:text-yellow-400'
    }`;

  return (
    <>
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-stone-900 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce border border-yellow-300/50">
          <Sparkles className="w-4 h-4 text-stone-800" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#08070D]/95 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-yellow-900/5 border-b border-stone-200 dark:border-yellow-900/20'
            : 'bg-white/80 dark:bg-[#08070D]/80 backdrop-blur-md border-b border-stone-100 dark:border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-yellow-400/50 bg-gradient-to-br from-yellow-500/20 to-red-600/20 shadow-lg shadow-yellow-500/10 group-hover:scale-110 transition-transform duration-200">
              <Music2 className="m-2 h-6 w-6 text-yellow-300" aria-label="EntertainmentHQ" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-yellow-600 via-yellow-500 to-red-600 dark:from-yellow-400 dark:via-yellow-300 dark:to-red-400 bg-clip-text text-transparent">
                EntertainmentHQ
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                Cinema · concerts · comedy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass('/')}>
              <span>Explore</span>
              {isActive('/') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" />}
            </Link>

            <Link to="/calendar" className={`${navLinkClass('/calendar')} flex items-center gap-1.5`}>
              <CalendarDays className="w-4 h-4" />
              <span>Concert Calendar</span>
              {isActive('/calendar') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" />}
            </Link>
            <Link to="/comedy" className={`${navLinkClass('/comedy')} flex items-center gap-1.5`}>
              <Mic2 className="w-4 h-4" />
              <span>Stand-up</span>
            </Link>
            <Link to="/movies" className={`${navLinkClass('/movies')} flex items-center gap-1.5`}>
              <Ticket className="w-4 h-4" />
              <span>Movies</span>
            </Link>

            {isAuthenticated && (
              <Link to="/my-registrations" className={`${navLinkClass('/my-registrations')} flex items-center gap-1.5`}>
                <Package className="w-4 h-4" />
                <span>My Inventory</span>
                {isActive('/my-registrations') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" />}
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/profile" className={`${navLinkClass('/profile')} flex items-center gap-1.5`}>
                <Star className="w-4 h-4" />
                <span>Fan Lounge</span>
                {isActive('/profile') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" />}
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-red-600/20 border-red-500/40 text-red-500 dark:text-red-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Backstage</span>
              </Link>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2 pl-4 border-l border-stone-200 dark:border-stone-800">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-yellow-500/50 dark:hover:border-yellow-500/40 transition-all cursor-pointer group shadow-sm"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-stone-600 group-hover:text-yellow-600 transition-colors" />
                    <span className="text-xs font-bold text-stone-600 group-hover:text-yellow-600 uppercase tracking-wider">Stage</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-yellow-400 group-hover:rotate-45 transition-transform" />
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Lights</span>
                  </>
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifModalOpen(!notifModalOpen)}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-yellow-500/50 transition-all cursor-pointer relative shadow-sm"
                  title="Concert reminders"
                >
                  <Bell className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border transition-colors ${
                      isActive('/profile')
                        ? 'border-yellow-500 ring-1 ring-yellow-500/40'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="p-1 rounded-lg bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-stone-900 dark:text-white leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono capitalize flex items-center gap-1">
                        {isAdmin && <ShieldCheck className="w-3 h-3 text-red-500 inline" />}
                        {user?.role}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-3 py-2 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                      to="/login"
                    className="text-sm font-bold text-stone-900 px-4 py-2 rounded-xl btn-gold shadow-md transition-all duration-200"
                  >
                    Get Tickets
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-stone-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button
              onClick={() => setNotifModalOpen(!notifModalOpen)}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer relative"
            >
              <Bell className="w-5 h-5 text-yellow-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#08070D] border-b border-stone-200 dark:border-yellow-900/20 p-4 space-y-2">
            <Link to="/" onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900">🎤 Tour Home</Link>
            <Link to="/calendar" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900">
              <CalendarDays className="w-4 h-4 text-yellow-500" /><span>Tour Calendar</span>
            </Link>
            <Link to="/comedy" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"><Mic2 className="w-4 h-4 text-yellow-500" /><span>SUCM Stand-up</span></Link>
            <Link to="/movies" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"><Ticket className="w-4 h-4 text-yellow-500" /><span>Movies Manager</span></Link>
            {isAuthenticated && (
              <Link to="/my-registrations" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900">
                <Package className="w-4 h-4 text-yellow-500" /><span>My Inventory</span>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900">
                <Star className="w-4 h-4 text-yellow-500" /><span>Fan Lounge</span>
              </Link>
            )}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-xs text-stone-500 dark:text-stone-400">
                    Signed in as <span className="font-bold text-stone-900 dark:text-white">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold border border-red-200 dark:border-red-500/20 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /><span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={closeMobileMenu} className="text-center py-3 rounded-xl bg-stone-100 dark:bg-stone-900 text-sm font-semibold text-stone-700 dark:text-stone-200">Sign In</Link>
                  <Link to="/register" onClick={closeMobileMenu} className="text-center py-3 rounded-xl btn-gold text-sm font-bold text-stone-900">Get Passes</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notification Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setNotifModalOpen(false); }}>
          <div className="w-full max-w-md bg-white dark:bg-[#100E1A] border border-stone-200 dark:border-yellow-900/30 rounded-3xl shadow-2xl overflow-hidden mt-14 flex flex-col max-h-[85vh]">

            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-red-600/10 border-b border-stone-200 dark:border-yellow-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                  <Bell className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">Concert Alerts</h3>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">Show reminders and your passes</p>
                </div>
              </div>
              <button
                onClick={() => setNotifModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-1 gap-1">
              <button
                onClick={() => setNotifTab('registrations')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  notifTab === 'registrations'
                    ? 'bg-white dark:bg-stone-800 text-yellow-600 dark:text-yellow-400 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Bookings ({registeredEvents.length})</span>
              </button>
              <button
                onClick={() => setNotifTab('alerts')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  notifTab === 'alerts'
                    ? 'bg-white dark:bg-stone-800 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Alerts ({notifications.length})</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-3" />
                )}
              </button>
            </div>

            {/* Tab: Registrations */}
            {notifTab === 'registrations' && (
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {registeredEvents.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <Ticket className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
                    <p className="text-xs text-stone-500 dark:text-stone-400">No concert passes yet.</p>
                    <Link to="/" onClick={() => setNotifModalOpen(false)} className="inline-block text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline">
                      Browse tour dates →
                    </Link>
                  </div>
                ) : (
                  registeredEvents.map((reg) => {
                    const ev = reg.events || reg;
                    const daysUntil = getDaysUntil(ev.event_date || ev.date);
                    return (
                      <div key={reg.id || reg.ticket_id} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2 hover:border-yellow-500/40 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-mono font-bold border border-yellow-500/20">
                              #{reg.ticket_id || 'CONFIRMED'}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 dark:text-white mt-1">{ev.title || 'Concert Booking'}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-[10px] font-bold whitespace-nowrap">Booked ✓</span>
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 pt-1 border-t border-stone-200 dark:border-stone-800">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3 text-yellow-500" />
                            <span>{ev.event_date || ev.date || 'Upcoming'}</span>
                          </div>
                          {ev.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-yellow-500" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-pulse" />
                            {daysUntil !== null
                              ? daysUntil === 0 ? '⚡ Tonight!'
                              : daysUntil > 0 ? `${daysUntil} day${daysUntil > 1 ? 's' : ''} away`
                              : 'Show completed'
                              : 'Upcoming'}
                          </span>
                          <Link to={`/events/${ev.id || reg.event_id}?pass=1`} onClick={() => setNotifModalOpen(false)} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 hover:underline">
                            View Pass →
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab: Alerts */}
            {notifTab === 'alerts' && (
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800 text-[11px]">
                  <button onClick={markAllAsRead} className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                    <CheckCheck className="w-3.5 h-3.5" /><span>Mark all read</span>
                  </button>
                  <button onClick={clearNotifications} className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /><span>Clear all</span>
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <Bell className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
                    <p className="text-xs text-stone-500 dark:text-stone-400">No alerts right now.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 opacity-70'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700/40 ring-1 ring-yellow-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[9px] text-stone-400 dark:text-stone-500 font-mono mt-1.5 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 text-center">
              <p className="text-[10px] text-stone-400 dark:text-stone-500">
                🎵 EntertainmentHQ reminder engine • IST timezone
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
