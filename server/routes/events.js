import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} from '../controllers/events.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected + Admin Only Routes
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.get('/:id/attendees', protect, adminOnly, getEventAttendees);

export default router;
