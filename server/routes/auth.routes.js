import express from 'express';
import { register, login, instantLogin, getMe, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/instant-login (Passwordless Instant Login)
router.post('/instant-login', instantLogin);

// GET /api/auth/me (Protected)
router.get('/me', protect, getMe);

// PUT /api/auth/profile (Protected)
router.put('/profile', protect, updateProfile);

export default router;
