import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-400 inline-block border border-yellow-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Instant Sign-In Enabled</h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            Account registration is disabled. You can log in instantly with 1-click demo credentials.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl btn-gold text-stone-950 font-bold text-sm shadow-lg w-full"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
