import Event from '../models/Event.js';
import { format } from 'date-fns';  // Import date-fns for formatting the date
import User from '../models/User.js';  // Add .js extension

// Create Event
export const createEvent = async (req, res) => {
  const { name, description, date, time, location } = req.body;
  try {
    // Check if the user is an admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can create events' });
    }

    const event = new Event({ name, description, date, time, location, createdBy: req.userId });
    await event.save();
    
    // Format the date before sending the response
    event.date = format(new Date(event.date), 'yyyy-MM-dd');
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    
    // Format dates for each event before sending the response
    const formattedEvents = events.map(event => {
      event.date = format(new Date(event.date), 'yyyy-MM-dd');  // Format the date to 'yyyy-MM-dd'
      return event;
    });

    res.json(formattedEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  const { name, description, date, time, location } = req.body;
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    if (event.createdBy.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    event = await Event.findByIdAndUpdate(req.params.id, { name, description, date, time, location }, { new: true });
    
    // Format the updated date before sending the response
    event.date = format(new Date(event.date), 'yyyy-MM-dd');  // Format the date to 'yyyy-MM-dd'
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    if (event.createdBy.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Join Event
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'username');
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if the user is already attending
    if (event.attendees.some(attendee => attendee._id.toString() === req.userId)) {
      return res.status(400).json({ msg: 'You are already attending this event' });
    }

    // Add the user to the attendees list
    event.attendees.push(req.userId);
    await event.save();

    console.log('Emitting attendeeUpdate for event:', event._id); // Debugging log

    // Emit a real-time update via WebSocket
    req.io.emit('attendeeUpdate', { eventId: event._id, attendees: event.attendees });

    res.json({ msg: 'You have joined the event', event });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Leave Event
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'username');
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if the user is attending
    if (!event.attendees.some(attendee => attendee._id.toString() === req.userId)) {
      return res.status(400).json({ msg: 'You are not attending this event' });
    }

    // Remove the user from the attendees list
    event.attendees = event.attendees.filter((attendee) => attendee._id.toString() !== req.userId);
    await event.save();

    console.log('Emitting attendeeUpdate for event:', event._id); // Debugging lo

    // Emit a real-time update via WebSocket
    req.io.emit('attendeeUpdate', { eventId: event._id, attendees: event.attendees });

    res.json({ msg: 'You have left the event', event });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


