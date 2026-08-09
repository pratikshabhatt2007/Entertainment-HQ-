import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'eventsphere_secret_jwt_key_2026';

/**
 * Middleware to verify JWT token and attach user profile to req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let userObj = null;

    // 1. Try decoding custom signed JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && (decoded.sub || decoded.email)) {
        userObj = {
          id: decoded.sub || crypto.randomUUID(),
          email: decoded.email,
          name: decoded.name || decoded.email.split('@')[0],
          role: decoded.role || 'attendee',
        };
      }
    } catch (jwtErr) {
      // Not a custom JWT, try Supabase Auth
    }

    // 2. Fallback to Supabase Auth token verification
    if (!userObj) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser(token);
        if (authUser) {
          userObj = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email.split('@')[0],
            role: authUser.user_metadata?.role || 'attendee',
          };
        }
      } catch (sbErr) {
        console.warn('Supabase Auth verification note:', sbErr.message);
      }
    }

    if (!userObj) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }

    // 3. Fetch matching row from public.users table if available
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('email', userObj.email)
      .maybeSingle();

    req.user = dbUser || userObj;
    req.token = token;
    next();
  } catch (err) {
    console.error('Protect Middleware Error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to restrict access to admin users only
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};
