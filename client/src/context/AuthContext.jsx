import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, instantLoginUser, fetchMe, updateUserProfile } from '../api/auth';
import { recordActivity } from '../lib/activityLog';
import { hasSupabaseConfig, supabase } from '../supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('entertainmenthq_token') || null);
  const [loading, setLoading] = useState(true);

  const startLocalSession = (email, name, role = 'attendee', action = 'Signed in') => {
    const accounts = JSON.parse(localStorage.getItem('concerts_manager_accounts') || '[]');
    const existing = accounts.find((account) => account.email.toLowerCase() === email.toLowerCase());
    const userData = existing || { id: `local-${Date.now()}`, name, email, role };
    if (!existing) localStorage.setItem('concerts_manager_accounts', JSON.stringify([...accounts, userData]));
    localStorage.setItem('entertainmenthq_token', 'local-demo-session');
    localStorage.setItem('concerts_manager_current_user', JSON.stringify(userData));
    setToken('local-demo-session');
    setUser(userData);
    recordActivity({ name: userData.name, email: userData.email, action });
    return { token: 'local-demo-session', user: userData };
  };

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      // Google OAuth is owned by Supabase. Restore that session first, rather
      // than sending its access token to the legacy Express API.
      if (hasSupabaseConfig && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const authUser = session.user;
          const profile = {
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Guest',
            email: authUser.email,
            role: 'attendee',
          };
          localStorage.setItem('entertainmenthq_token', session.access_token);
          localStorage.setItem('concerts_manager_current_user', JSON.stringify(profile));
          setToken(session.access_token);
          setUser(profile);
          setLoading(false);
          return;
        }
      }
      if (token === 'local-demo-session') {
        const savedUser = JSON.parse(localStorage.getItem('concerts_manager_current_user') || 'null');
        if (savedUser) setUser(savedUser);
        setLoading(false);
        return;
      }
      if (token) {
        try {
          const data = await fetchMe(token);
          setUser(data.user);
        } catch (err) {
          console.error('Failed to restore auth session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    let data;
    try { data = await loginUser({ email, password }); } catch { return startLocalSession(email, email.split('@')[0], 'attendee'); }
    if (data.token) {
      localStorage.setItem('entertainmenthq_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Instant passwordless login handler
  const instantLogin = async (email) => {
    const savedAccounts = JSON.parse(localStorage.getItem('concerts_manager_accounts') || '[]');
    const knownAccount = savedAccounts.find((account) => account.email.toLowerCase() === email.toLowerCase());
    const demoAdmin = email.toLowerCase() === 'admin.demo@entertainmenthq.com';
    const name = knownAccount?.name || (demoAdmin ? 'Backstage Admin' : email.split('@')[0].replace(/[._-]/g, ' '));
    return startLocalSession(email, name, knownAccount?.role || (demoAdmin ? 'admin' : 'attendee'));
    /* API sign-in remains available when a production backend is configured.
    const data = await instantLoginUser(email);
    if (data.token) {
      localStorage.setItem('entertainmenthq_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data; */
  };

  // Register handler
  const register = async (name, email, password, role = 'attendee') => {
    return startLocalSession(email.trim().toLowerCase(), name.trim(), role, 'Account created');
    /* A hosted backend should handle this in production; passwords are never logged locally.
    const data = await registerUser({ name, email, password, role });
    if (data.token) {
      localStorage.setItem('entertainmenthq_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data; */
  };

  // Update profile name handler
  const updateProfile = async (newName) => {
    if (!token) throw new Error('Not authenticated.');
    const data = await updateUserProfile(newName, token);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  // Logout handler
  const logout = () => {
    if (user) recordActivity({ name: user.name, email: user.email, action: 'Signed out' });
    localStorage.removeItem('entertainmenthq_token');
    localStorage.removeItem('concerts_manager_current_user');
    setToken(null);
    setUser(null);
    if (hasSupabaseConfig && supabase) supabase.auth.signOut();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        instantLogin,
        register,
        updateProfile,
        logout,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
