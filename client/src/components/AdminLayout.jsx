import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Music2,
  TrendingUp,
  Users,
  Ticket,
  Settings,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Command Center', path: '/admin', icon: LayoutDashboard, desc: 'Overview & metrics' },
    { label: 'Concert Events', path: '/admin/events', icon: Calendar, desc: 'Manage shows' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-['Inter',sans-serif] bg-[#F5F3EE] dark:bg-[#07060C]">

      {/* ── Admin Sidebar ── */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col
        bg-white dark:bg-[#0F0D1A]
        border-b md:border-b-0 md:border-r
        border-stone-200 dark:border-yellow-900/20
        shadow-lg shadow-black/5 dark:shadow-black/40">

        {/* Sidebar Header */}
        <div className="p-6 border-b border-stone-100 dark:border-yellow-900/20">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-red-600/20 border border-yellow-500/30 dark:border-yellow-400/20 group-hover:scale-105 transition-transform">
              <Music2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <span className="text-lg font-black bg-gradient-to-r from-yellow-600 via-yellow-500 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text text-transparent leading-tight block">
                StageFront
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-500" />
                Backstage Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Administrator Access</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-600">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-yellow-500/15 to-red-500/10 border border-yellow-500/20 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-yellow-500/20 border border-yellow-500/20'
                    : 'bg-stone-100 dark:bg-white/5 group-hover:bg-yellow-500/10'
                }`}>
                  <Icon className={`w-4 h-4 ${active ? 'text-yellow-600 dark:text-yellow-400' : 'text-stone-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400'}`} />
                </div>
                <div>
                  <span className={active ? 'text-stone-900 dark:text-white font-bold' : ''}>{item.label}</span>
                  <p className="text-[10px] text-stone-400 dark:text-stone-600 font-normal">{item.desc}</p>
                </div>
                {active && <span className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-yellow-500 to-red-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats Chips */}
        <div className="px-4 py-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100 dark:from-yellow-500/5 dark:to-red-500/5 border border-stone-200 dark:border-yellow-900/20 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-600">Live Stats</p>
          <div className="space-y-2">
            {[
              { icon: Ticket, label: 'Tickets Sold', value: '12.4K', color: 'text-yellow-500' },
              { icon: TrendingUp, label: 'Revenue', value: '₹12.4Cr', color: 'text-green-500' },
              { icon: Users, label: 'Registered Fans', value: '8.2K', color: 'text-blue-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{label}</span>
                </div>
                <span className="text-[11px] font-black text-stone-800 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-yellow-900/20 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Portal</span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-yellow-900/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/20 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-stone-800 dark:text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-red-500 font-mono">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-[#F5F3EE] dark:bg-[#07060C]">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
