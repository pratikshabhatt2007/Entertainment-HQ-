import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasSupabaseConfig, supabase } from '../supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Finalizing Google Authentication...');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setError('Google sign-in is unavailable because Supabase environment variables are missing.');
      return undefined;
    }
    let isSubscribed = true;

    const processSession = async (session) => {
      if (!session || !session.user) return;

      try {
        const authUser = session.user;
        const userId = authUser.id;
        const userEmail = authUser.email;
        const userName =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.user_metadata?.name ||
          userEmail.split('@')[0];

        if (isSubscribed) setStatusMessage('Syncing user profile...');

        // Save session token in localStorage
        localStorage.setItem('entertainmenthq_token', session.access_token);

        // Keep a lightweight profile row for the existing ticket backend. Auth
        // itself is already complete even if restrictive RLS blocks this row.
        await supabase.from('users').upsert(
          [
            {
              id: userId,
              name: userName,
              email: userEmail,
              role: 'attendee',
              password_hash: '[GOOGLE_OAUTH]',
            },
          ],
          { onConflict: 'id' }
        );

        localStorage.setItem('concerts_manager_current_user', JSON.stringify({ id: userId, name: userName, email: userEmail, role: 'attendee' }));

        // Redirect to homepage
        window.location.href = '/';
      } catch (err) {
        console.error('Profile sync error during Google Auth:', err);
        // Even if table sync fails, token is saved, redirect to home
        window.location.href = '/';
      }
    };

    // 1. Listen for Supabase auth state changes (OAuth hash parsing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        await processSession(session);
      }
    });

    // 2. Check current session immediately if already parsed
    supabase.auth.getSession().then(({ data: { session }, error: getSessionError }) => {
      if (getSessionError) {
        console.error('getSession error:', getSessionError);
        if (isSubscribed) setError(getSessionError.message);
      } else if (session) {
        processSession(session);
      } else {
        // Check URL for hash parameters or error code
        const hash = window.location.hash;
        const search = window.location.search;
        if (hash.includes('error') || search.includes('error')) {
          const params = new URLSearchParams(hash.replace('#', '?') || search);
          const errDesc = params.get('error_description') || params.get('error') || 'Google Login failed.';
          if (isSubscribed) setError(errDesc);
        }
      }
    });

    // A callback URL opened directly (or an old bookmarked callback) has no
    // OAuth code/session to exchange. Explain that clearly instead of implying
    // that a completed Google login has failed.
    const timeout = setTimeout(() => {
      if (isSubscribed && !localStorage.getItem('entertainmenthq_token')) {
        setError('No Google sign-in response was received. Please return to Sign in and use “Continue with Google” to begin the secure Google flow.');
      }
    }, 5000);

    return () => {
      isSubscribed = false;
      subscription?.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[60vh]">
      {error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-md space-y-3 shadow-2xl">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-400 w-fit mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">Google Authentication Note</h3>
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Return to Login Page
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <h2 className="text-xl font-bold text-white">{statusMessage}</h2>
          <p className="text-xs text-slate-400">Completing sign in via Google...</p>
        </div>
      )}
    </div>
  );
}
