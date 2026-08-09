import React, { useRef } from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Printer,
  Calendar,
  Building,
} from 'lucide-react';

export default function CertificateModal({ certificate, userName, onClose }) {
  const printRef = useRef(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion: ${certificate.event_title}`,
        text: `Check out my verified certificate for "${certificate.event_title}" earned on EventSphere!`,
        url: certificate.credential_url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(certificate.credential_url || window.location.href);
      alert('Certificate credential link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Verified Certificate of Completion</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Share Credential"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Container */}
        <div className="p-6 md:p-10 overflow-y-auto flex items-center justify-center bg-slate-950/60">
          {/* Ornamental Printable Certificate Box */}
          <div
            ref={printRef}
            className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border-8 border-amber-500/30 rounded-2xl p-8 md:p-12 relative shadow-2xl overflow-hidden text-center"
          >
            {/* Background Ornamental Graphics */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Inner Border Frame */}
            <div className="border border-amber-400/20 rounded-xl p-6 md:p-8 space-y-6 relative">
              
              {/* Header Seal */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                      <Award className="w-9 h-9 text-amber-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Title & Brand */}
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">Official Credential</p>
                <h1 className="text-2xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 mt-1">
                  CERTIFICATE OF COMPLETION
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-2">This is to officially certify that</p>
              </div>

              {/* Recipient Name */}
              <div className="py-2 border-b-2 border-amber-400/30 max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                  {userName || 'Event Participant'}
                </h2>
              </div>

              {/* Description */}
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  has successfully participated in and completed all requirements for
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-indigo-300">
                  {certificate.event_title}
                </h3>
                <p className="text-slate-400 text-xs">
                  Category: <span className="text-indigo-400 font-medium">{certificate.category}</span> • Earned <span className="text-amber-400 font-bold">+{certificate.xp_earned} XP</span>
                </p>
              </div>

              {/* Skills Tag Cloud */}
              {certificate.skills && certificate.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Signatures & Metadata */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end text-left">
                {/* Issue Date */}
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Issue Date</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{certificate.issue_date}</p>
                </div>

                {/* Issuer Authority */}
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Issued By</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{certificate.issuer || 'EventSphere Academy'}</p>
                </div>

                {/* Verification Code */}
                <div className="space-y-1 text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verification ID</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-amber-300">{certificate.certificate_code}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Verification Link Notice */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified Credential</span>
          </span>
          <a
            href={certificate.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono hover:underline"
          >
            <span>verify.eventsphere.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
