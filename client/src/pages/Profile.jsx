import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Bell,
  Lock,
  Sparkles,
  Ticket,
  KeyRound,
  Sliders,
  Check,
  Smartphone,
  Globe,
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout, isAdmin } = useAuth();
  const { registeredEvents } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'notifications' | 'security'
  const [name, setName] = useState(user?.name || '');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [concertAlerts, setConcertAlerts] = useState(true);

  // Security state (demo)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  const activePassCount = registeredEvents.filter((r) => r.status !== 'cancelled').length;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!name || !name.trim()) {
      setToast({ type: 'error', message: 'Full name cannot be empty.' });
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(name.trim());
      setToast({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      console.error('Update name error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to update name.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setToast(null);
    if (!newPassword || newPassword.length < 6) {
      setToast({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToast({ type: 'success', message: 'Security credentials updated successfully!' });
    }, 600);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-[#13101E] to-stone-950 border border-stone-800 dark:border-yellow-900/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Glowing Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-600 to-red-600 p-0.5 shadow-xl shadow-yellow-500/20">
                <div className="w-full h-full rounded-[14px] bg-stone-950 flex items-center justify-center text-3xl font-black text-yellow-400">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-stone-950 flex items-center justify-center text-[10px] text-white font-bold" title="Verified Session">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">{user?.name || 'Attendee'}</h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-red-500/20 border-red-500/30 text-red-400'
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {isAdmin ? 'Super Admin' : '⭐ VIP Fan'}
                </span>
              </div>
              <p className="text-sm text-stone-400 mt-0.5">{user?.email}</p>
              <p className="text-xs text-stone-500 font-mono mt-1">Member since {memberSince}</p>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-3">
            <Link
              to="/my-registrations"
              className="px-5 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-yellow-500/40 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">My Inventory</p>
                <p className="text-lg font-black text-white">{activePassCount} Passes</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-3.5 rounded-2xl bg-stone-900/80 hover:bg-red-500/10 border border-stone-800 hover:border-red-500/30 text-stone-400 hover:text-red-400 transition-all cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'security', label: 'Security & Sessions', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-yellow-500 text-stone-950 shadow-md shadow-yellow-500/20'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
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
          <button onClick={() => setToast(null)} className="text-xs font-bold uppercase tracking-wider opacity-80 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Personal Info Form */}
      {activeTab === 'personal' && (
        <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-yellow-400" />
              <span>Account Credentials</span>
            </h3>
            <p className="text-xs text-stone-400">Update your public display name and view account metadata.</p>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                Full Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white text-sm placeholder-stone-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Registered Email</p>
                  <p className="text-sm font-semibold text-stone-200">{user?.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Account Authorization</p>
                  <p className="text-sm font-semibold text-stone-200 capitalize">{user?.role || 'Attendee'} Role</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-gold text-stone-950 font-black text-sm shadow-md hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span>Notification & Alert Preferences</span>
            </h3>
            <p className="text-xs text-stone-400">Configure how and when EntertainmentHQ sends show updates.</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              {
                title: 'Concert & Show Reminders',
                desc: 'Get live alert notifications 3 days and 1 day before your booked concert date.',
                state: concertAlerts,
                setter: setConcertAlerts,
                icon: Sparkles,
              },
              {
                title: 'Email Confirmation Passes',
                desc: 'Receive digital pass QR codes directly in your email inbox upon checkout.',
                state: emailNotifs,
                setter: setEmailNotifs,
                icon: Mail,
              },
              {
                title: 'SMS Ticket Alerts',
                desc: 'Receive instant gate entry SMS updates on your mobile phone on concert day.',
                state: smsNotifs,
                setter: setSmsNotifs,
                icon: Smartphone,
              },
            ].map(({ title, desc, state, setter, icon: Icon }) => (
              <div
                key={title}
                onClick={() => setter(!state)}
                className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:border-yellow-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-900 text-yellow-400 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{title}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                  </div>
                </div>

                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                    state ? 'bg-yellow-500' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-stone-950 transform transition-transform duration-200 ease-in-out ${
                      state ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-yellow-400" />
              <span>Security & Passwords</span>
            </h3>
            <p className="text-xs text-stone-400">Update your access key and review active logins.</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white text-sm placeholder-stone-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white text-sm placeholder-stone-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-gold text-stone-950 font-black text-sm shadow-md hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Update Access Password</span>
            </button>
          </form>

          {/* Active Session Info */}
          <div className="pt-6 border-t border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Current Session Info</h4>
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-bold text-white">Active Browser Session</p>
                  <p className="text-stone-500">Web App • IST Timezone</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                Active Now
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
