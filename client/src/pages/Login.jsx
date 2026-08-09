import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import { Mail, LogIn, AlertCircle, Ticket, ShieldCheck, Music2, Mic2, Star } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { instantLogin } = useAuth();
  const navigate = useNavigate();

  const handleInstantSignIn = async (userEmail) => {
    setError('');
    setIsSubmitting(true);
    const targetEmail = userEmail ? userEmail.trim().toLowerCase() : '';
    if (!targetEmail) {
      setError('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }
    try {
      const data = await instantLogin(targetEmail);
      const userRole = data.user?.role || 'attendee';
      navigate(userRole === 'admin' ? '/admin/activity' : '/my-registrations');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInstantSignIn(email);
  };

  return (
    <div className="flex-1 flex items-stretch overflow-hidden min-h-screen">

      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden
        bg-gradient-to-br from-stone-900 via-[#12101A] to-[#1A1730]
        dark:from-[#08070D] dark:via-[#12101A] dark:to-[#1A1730]">

        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <Music2 className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-red-400 bg-clip-text text-transparent">
              EntertainmentHQ
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Cinema · concerts · comedy</p>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1.5 w-fit rounded-full bg-red-500/20 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Events Happening Now</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Your ticket to<br />
              <span className="gold-shimmer-text">unforgettable</span><br />
              live music.
            </h1>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Blockbusters, beats, and belly laughs—all in one place. Book your next seat in seconds.
            </p>
          </div>

          {/* Feature chips */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Ticket, text: 'Instant e-Tickets' },
              { icon: Star, text: 'VIP Upgrades' },
              { icon: Mic2, text: 'Artist Meet & Greet' },
              { icon: ShieldCheck, text: 'Secure Booking' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Icon className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs font-semibold text-stone-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-xs text-stone-600 italic">
            "From screen to stage, your seat is waiting."
          </p>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12
        bg-[#FAF7F2] dark:bg-[#0D0B15]">

        <div className="w-full max-w-md space-y-6">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Music2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-yellow-600 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text text-transparent">EntertainmentHQ</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">Sign in to access your cinema, concert and comedy tickets.</p>
          </div>

          {/* Quick Login Buttons */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#100E1A] border border-stone-200 dark:border-yellow-900/30 shadow-sm space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
              <span className="text-yellow-500">⚡</span> Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantSignIn('attendee.demo@entertainmenthq.com')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl btn-gold text-stone-900 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <Ticket className="w-4 h-4" />
                <span>Fan Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleInstantSignIn('admin.demo@entertainmenthq.com')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl btn-crimson text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Backstage Admin</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#100E1A] border border-stone-200 dark:border-yellow-900/30 shadow-sm space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                      bg-stone-50 dark:bg-[#0D0B15]
                      border border-stone-200 dark:border-stone-800
                      text-stone-900 dark:text-white
                      placeholder-stone-400 dark:placeholder-stone-600
                      focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-500
                      focus:ring-2 focus:ring-yellow-500/20
                      transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl btn-gold text-stone-900 font-black shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Access My Inventory</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              <span className="absolute px-3 bg-white dark:bg-[#100E1A] text-xs text-stone-400 uppercase tracking-wider font-semibold">or</span>
            </div>

            {/* Google */}
            <GoogleButton label="Continue with Google" />
          </div>

          <p className="text-center text-xs text-stone-400 dark:text-stone-500">
            ⚡ Instant Access Enabled — Select a role above to sign in immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
