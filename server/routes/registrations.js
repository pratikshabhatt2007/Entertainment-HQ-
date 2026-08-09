import express from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getMyRegistrationHistory,
} from '../controllers/registrations.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected Routes (All require authentication)
router.use(protect);

// POST /api/registrations - Register for an event
router.post('/', registerForEvent);

// PUT /api/registrations/:id/cancel - Cancel registration
router.put('/:id/cancel', cancelRegistration);

// GET /api/registrations/my - Get user's active/all registrations
router.get('/my', getMyRegistrations);

// GET /api/registrations/my/history - Get user's past registrations
router.get('/my/history', getMyRegistrationHistory);

export default router;
