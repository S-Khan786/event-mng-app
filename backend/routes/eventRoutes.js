import express from 'express';
import { createEvent, getEvents, updateEvent, deleteEvent, joinEvent, leaveEvent } from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require JWT authentication)
router.post('/', authMiddleware, createEvent); // Only authenticated users can create events
router.put('/:id', authMiddleware, updateEvent); // Only authenticated users can update events
router.delete('/:id', authMiddleware, deleteEvent); // Only authenticated users can delete events

// Attendee routes
router.post('/:id/join', authMiddleware, joinEvent); // Join an event
router.post('/:id/leave', authMiddleware, leaveEvent); // Leave an event


// Public route (no authentication required)
router.get('/', getEvents); // Anyone can view events

export default router;
