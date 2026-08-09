import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyCertificates, claimCertificate } from '../api/certificates';
import CertificateModal from '../components/CertificateModal';
import {
  Award,
  Trophy,
  Sparkles,
  Flame,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ExternalLink,
  PlusCircle,
  Loader2,
  Calendar,
  Zap,
} from 'lucide-react';

export default function Certificates() {
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Certificate for Modal
  const [selectedCert, setSelectedCert] = useState(null);
  
  // Claim Certificate Demo state
  const [claiming, setClaiming] = useState(false);
  const [claimToast, setClaimToast] = useState(null);

  const loadCertificatesData = async () => {
    setLoading(true);
    try {
      const data = await fetchMyCertificates(token);
      setUserStats(data.user_stats);
      setBadges(data.badges || []);
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificatesData();
  }, [token]);

  const handleClaimDemoCert = async () => {
    setClaiming(true);
    setClaimToast(null);

    const demoEvents = [
      { event_title: 'React & Next.js Architecture Masterclass', category: 'Workshops', xp: 300 },
      { event_title: 'Cybersecurity & Ethical Hacking Symposium', category: 'Tech Talks', xp: 200 },
      { event_title: 'Web3 & Decentralized App Hackathon', category: 'Hackathons', xp: 450 },
    ];

    const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)];

    try {
      const res = await claimCertificate(randomEvent, token);
      setClaimToast({ type: 'success', message: res.message });
      loadCertificatesData();
    } catch (err) {
      setClaimToast({ type: 'error', message: err.message || 'Failed to claim certificate.' });
    } finally {
      setClaiming(false);
    }
  };

  // Filtered Certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesCategory = categoryFilter === 'All' || cert.category === categoryFilter;
    const matchesSearch =
      cert.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Workshops', 'Hackathons', 'Tech Talks'];

  // Calculate XP percentage progress
  const currentXP = userStats?.total_xp || 0;
  const targetXP = userStats?.next_level_xp || 1000;
  const progressPercent = Math.min(Math.round((currentXP / targetXP) * 100), 100);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-8 border border-indigo-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Gamified Credentials & Achievements</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              My Event Certificates
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Earn verified digital credentials by participating in workshops, hackathons, and tech conferences. Track your level, earn XP, and unlock achievement badges!
            </p>
          </div>

          {/* Quick Claim Certificate Demo Button */}
          <button
            onClick={handleClaimDemoCert}
            disabled={claiming}
            className="self-start md:self-auto flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {claiming ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
            <span>Simulate Claim Certificate (+XP)</span>
          </button>
        </div>
      </div>

      {/* Claim Toast Notice */}
      {claimToast && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm ${
            claimToast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
            <span className="font-semibold">{claimToast.message}</span>
          </div>
          <button onClick={() => setClaimToast(null)} className="text-xs hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Gamification Dashboard Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Loading your credentials & XP progress...</p>
        </div>
      ) : (
        <>
          {/* Level & Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* User Level Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Level</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Zap className="w-5 h-5" />
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">Level {userStats?.level || 1}</span>
                  <span className="text-xs font-bold text-amber-400">({userStats?.rank || 'Contender'})</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>{currentXP} XP</span>
                    <span>{targetXP} XP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Certificates Count */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certificates Earned</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Award className="w-5 h-5" />
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white">{certificates.length}</span>
                <p className="text-xs text-slate-400 mt-1">Verified Credentials Issued</p>
              </div>
            </div>

            {/* Active Streak */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Streak</span>
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Flame className="w-5 h-5 animate-pulse" />
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white">{userStats?.streak_days || 0} Events</span>
                <p className="text-xs text-slate-400 mt-1">Active Participation Streak</p>
              </div>
            </div>

            {/* Total XP Earned */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total XP</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Trophy className="w-5 h-5" />
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white">{currentXP} XP</span>
                <p className="text-xs text-slate-400 mt-1">Accumulated Points</p>
              </div>
            </div>

          </div>

          {/* Achievement Badges Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Achievement Badges</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 transition-all ${
                    badge.unlocked
                      ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl p-2 rounded-2xl bg-slate-800/80 relative">
                    {badge.icon}
                    {!badge.unlocked && (
                      <div className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-8">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Certificates Grid */}
          {filteredCertificates.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No certificates match your filter</h3>
              <p className="text-xs text-slate-400">Try changing your search terms or filter category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {cert.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Event & Certificate Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {cert.event_title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Issued on {cert.issue_date}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500">{cert.certificate_code}</span>
                      <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        +{cert.xp_earned} XP
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </>
      )}

      {/* Certificate Modal Popup */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          userName={user?.name || userStats?.user_name}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
}
