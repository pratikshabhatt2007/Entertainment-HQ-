import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'eventsphere_secret_jwt_key_2026';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'attendee' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (!['attendee', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "attendee" or "admin".' });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'User registration failed.' });
    }

    const userId = authData.user.id;

    // 2. Ensure row in public.users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert(
        [
          {
            id: userId,
            name,
            email,
            password_hash: '[SUPABASE_AUTH]',
            role,
          },
        ],
        { onConflict: 'id' }
      )
      .select('id, name, email, role, created_at')
      .maybeSingle();

    if (dbError) {
      console.warn('Note: Could not insert directly to public.users:', dbError.message);
    }

    const responseUser = dbUser || {
      id: userId,
      name,
      email,
      role,
      created_at: authData.user.created_at,
    };

    return res.status(201).json({
      message: 'User registered successfully.',
      token: authData.session?.access_token || null,
      user: responseUser,
    });
  } catch (err) {
    console.error('Register Controller Error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // 2. Fetch user profile from public.users table
    let { data: dbUser } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!dbUser) {
      dbUser = {
        id: userId,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        email: authData.user.email,
        role: authData.user.user_metadata?.role || 'attendee',
        created_at: authData.user.created_at,
      };
    }

    return res.status(200).json({
      message: 'Login successful',
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: dbUser,
    });
  } catch (err) {
    console.error('Login Controller Error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

/**
 * Instant Passwordless Sign-In (Guaranteed instant login for any email)
 * POST /api/auth/instant-login
 */
export const instantLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAksharAdmin = cleanEmail === 'aksharjain034@gmail.com' || cleanEmail.includes('admin');
    const targetRole = isAksharAdmin ? 'admin' : 'attendee';
    const defaultName = cleanEmail.split('@')[0].replace('.', ' ');

    // 1. Check if user profile exists in public.users
    let { data: dbUser } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!dbUser) {
      const newUserId = crypto.randomUUID();
      // Insert new profile into public.users
      const { data: insertedUser, error: insertErr } = await supabase
        .from('users')
        .insert([
          {
            id: newUserId,
            name: defaultName,
            email: cleanEmail,
            role: targetRole,
            password_hash: '[INSTANT_AUTH]',
          },
        ])
        .select('id, name, email, role, created_at')
        .single();

      if (insertErr) {
        console.warn('Note creating user in public.users:', insertErr.message);
        dbUser = {
          id: newUserId,
          name: defaultName,
          email: cleanEmail,
          role: targetRole,
          created_at: new Date().toISOString(),
        };
      } else {
        dbUser = insertedUser;
      }
    } else if (isAksharAdmin && dbUser.role !== 'admin') {
      // Ensure admin status
      await supabase.from('users').update({ role: 'admin' }).eq('id', dbUser.id);
      dbUser.role = 'admin';
    }

    // 2. Generate signed JWT token
    const token = jwt.sign(
      {
        sub: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: 'Instant login successful',
      token,
      user: dbUser,
    });
  } catch (err) {
    console.error('InstantLogin Controller Error:', err);
    return res.status(500).json({ error: 'Server error during instant login.' });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

/**
 * Update user profile (Name)
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const updatedName = name.trim();

    // 1. Update public.users table
    const { data: updatedUser, error: dbError } = await supabase
      .from('users')
      .update({ name: updatedName })
      .eq('id', userId)
      .select('id, name, email, role, created_at')
      .single();

    if (dbError) {
      console.error('Error updating user name in DB:', dbError);
      return res.status(500).json({ error: dbError.message || 'Failed to update profile name.' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('UpdateProfile Controller Error:', err);
    return res.status(500).json({ error: 'Server error while updating profile.' });
  }
};
